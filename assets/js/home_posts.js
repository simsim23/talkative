class PostComments {
    // constructor is used to initialize the instance of the class whenever a new instance is created
    constructor(postId) {
        this.postId = postId;
        this.postContainer = $(`#post-${postId}`);
        this.newCommentForm = $(`#post-${postId}-comments-form`);
        console.log('rere', this.newCommentForm)
        this.createComment(postId);

        let self = this;
        // call for all the existing comments
        $(' .delete-comment-button', this.postContainer).each(function () {
            self.deleteComment($(this));
        });
    }


    createComment(postId) {
        
        let pSelf = this;
        this.newCommentForm.submit(function(e) {
            e.preventDefault();
            
            let self = this;
            console.log('ewewew',self)
            $.ajax({
                type: 'POST',
                url: '/comments/create',
                data: $(self).serialize(),
                success: function (data) {
                    console.log('4545', data)
                    let newComment = pSelf.newCommentDom(data.data.comment);
                    $(`#post-comments-${postId}`).prepend(newComment);
                    pSelf.deleteComment($(' .delete-comment-button', newComment));

                    // Enable the functionality of the toggle like button on the new comment
                    new ToggleLike($(' .toggle-like-button',newComment));

                    new Noty({
                        theme: 'relax',
                        text: "Comment published!",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500

                    }).show();

                }, error: function (error) {
                    console.log(error.responseText);
                }
            });


        });
    }


    newCommentDom(comment) {
        // I've added a class 'delete-comment-button' to the delete comment link and also id to the comment's li
        return  $(`
        <p id="comment-${comment._id}">
            <small>
                <a class="delete-comment-button" href="/comments/destroy/${comment._id}">
                    <small>Delete Comment</small>
                </a>
            </small>
            ${comment.content}
        <br>
        <small>
            ${comment.user.name}
        </small>
        <br>
        <small>
            <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${comment._id}&type=Comment">
                0 Likes
            </a>
        </small>
    </p>
        `)
    }


    deleteComment(deleteLink) {
        $(deleteLink).click(function (e) {
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function (data) {
                    $(`#comment-${data.data.comment_id}`).remove();

                    new Noty({
                        theme: 'relax',
                        text: "Comment Deleted",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500

                    }).show();
                }, error: function (error) {
                    console.log(error.responseText);
                }
            });

        });
    }
}


{
    let createPost = function () {
        let newPostForm = $('#new-post-form');

        newPostForm.submit(function (e) {
            e.preventDefault();

            $.ajax({
                type: 'post',
                url: '/posts/create',
                data: newPostForm.serialize(),
                success: function (data) {
                    let newPost = newPostDom(data.data.post);
                    $('#posts-list-container>ul').prepend(newPost);
                    deletePost($(' .delete-post-button', newPost));

                    // call the create comment class
                    new PostComments(data.data.post._id);

                    // enable the functionality of the toggle like button on the new post
                    new ToggleLike($(' .toggle-like-button',newPost));

                    new Noty({
                        theme: 'relax',
                        text: "Post published!",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500

                    }).show();

                }, error: function (error) {
                    console.log(error.responseText);
                }
            });
        });
    }

    // Method to create post in DOM

    let newPostDom = function (post) {
        return $(`<p id="each-post">
            <li id="post-${post._id}">
                    ${post.content} <br>
                    <small>
                        ${post.user.name}
                    </small>
                    <br>
                    <small>
                        <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${post._id}&type=Post">
                            0 Likes
                        </a>
                    </small>
                        <small>
                            <a class="delete-post-button" href="/posts/destroy/${post._id}">
                                <button>
                                    Delete Post
                                </button>
                            </a>
                        </small>
                        <div class="post-comments">
                        <form id="post-${post._id}-comments-form" action="/comments/create" method="POST">
                            <input type="text" name="content" placeholder="Type here to add a comment..." required size="30">
                            <input type="hidden" name="post" value="${post._id}">
                            <input type="submit" value="Add Comment">
                        </form>
                    <div class="post-comments-list">
                        <small><b>Comments : </b></small> <br>
                        <ul id="post-comments-${post._id}">
                        </ul>
                    </div>
                </div>    
                </li>
                </p>
                `);
    }

    // Method to delete a post in DOM
    let deletePost = function (deleteLink) {
        $(deleteLink).click(function (e) {
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function (data) {
                    $(`#post-${data.data.post_id}`).remove();
                    document.getElementById("each-post").remove();
                    new Noty({
                        theme: 'relax',
                        text: "Post Deleted",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500

                    }).show();
                }, error: function (error) {
                    console.log(error.responseText);
                }
            });

        });
    }

    // loop over all the existing posts on the page (when the window loads for the first time) and call the delete post method on delete link of each, also add AJAX (using the class we've created) to the delete button of each
    let convertPostsToAjax = function () {
        $('#posts-list-container>ul>li').each(function () {
            let deleteButton = $(' .delete-post-button', $(this));
            deletePost(deleteButton);

            // get the post's id by splitting the id attribute
            let postId = $(this).prop('id').split("-")[1]
            new PostComments(postId);
        });
    }

    createPost();
    convertPostsToAjax();
}