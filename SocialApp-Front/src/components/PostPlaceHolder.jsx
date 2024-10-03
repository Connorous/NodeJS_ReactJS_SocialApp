import { useState, useEffect } from "react";
import uuid from "react-uuid";
import NewCommmentInput from "./NewCommentInput";
import CommentPlaceHolder from "./CommentPlaceHolder";
import PostLikesView from "./PostLikesView";

function PostPlaceHolder({
  post,
  user,
  token,
  refreshPosts,
  canPostOrComment,
}) {
  const [comments, setComments] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(post.title);
  const [editedContent, setEditedContent] = useState(post.content);

  const [showLikes, setShowLikes] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [likes, setLikes] = useState(null);
  const [userHasliked, setUserHasliked] = useState(false);

  var [error, setError] = useState(null);

  var edTitle = editedTitle;
  var edCont = editedContent;

  var [error, setError] = useState(null);

  var dateCreated = new Date(post.dateCreated);
  var dateString = dateCreated.toString();

  if (likes && showLikes) {
    if (likes.length === 0) {
      setShowLikes(false);
    }
  }

  function disardEdits() {
    setEditing(false);
    setEditedTitle(post.title);
    setEditedContent(post.content);
  }

  async function updatePost() {
    const settings = {
      method: "Put",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: editedTitle,
        content: editedContent,
      }),
    };
    try {
      const url = "http://localhost:3063/post/" + post.id;
      const updatedPost = await fetch(url, settings);
      var data = await updatedPost.json();
      if (data.success === true) {
        refreshPosts();
        setEditing(false);
      } else {
        setError(data.msg);
      }
    } catch (e) {
      return console.log(e);
    }
  }

  async function deletePost() {
    const settings = {
      method: "Delete",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    };
    try {
      const url = "http://localhost:3063/post/" + post.id;
      const deletedPost = await fetch(url, settings);
      var data = await deletedPost.json();
      if (data.success === true) {
        refreshPosts();
      } else {
        setError(data.msg);
      }
    } catch (e) {
      return console.log(e);
    }
  }

  function uuidFromUuidV4() {
    const newUuid = uuid();
    return newUuid;
  }

  async function loadComments() {
    const settings = {
      method: "GET",
      headers: { Authorization: token },
    };
    try {
      const url = "http://localhost:3063/comments/" + post.id;
      const fetchComments = await fetch(url, settings);
      const data = await fetchComments.json();

      if (data.success === true) {
        setComments(data.comments);
      } else {
        setError(data.msg);
      }
    } catch (e) {
      return e;
    }
  }

  function refreshComments() {
    loadComments();
  }

  async function loadLikes() {
    const settings = {
      method: "GET",
      headers: { Authorization: token },
    };
    try {
      const url = "http://localhost:3063/post/likes/" + post.id;
      const fetchLikes = await fetch(url, settings);
      const data = await fetchLikes.json();

      if (data.success === true) {
        setLikes(data.likes);
      } else {
        setError(data.msg);
      }
    } catch (e) {
      return e;
    }
  }

  function refreshLikes() {
    loadLikes();
  }

  if (likes === null) {
    refreshLikes();
  }

  async function likePost() {
    const settings = {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        likerId: user.id,
        postId: post.id,
      }),
    };
    try {
      const url = "http://localhost:3063/post/like";
      const likePost = await fetch(url, settings);
      var data = await likePost.json();
      if (data.success === true) {
        refreshLikes();
      } else {
        setError(data.msg);
      }
    } catch (e) {
      return console.log(e);
    }
  }

  async function unlikePost() {
    const settings = {
      method: "DELETE",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        likerId: user.id,
        postId: post.id,
      }),
    };
    try {
      const url = "http://localhost:3063/post/like/" + post.id;
      const unlikePost = await fetch(url, settings);
      var data = await unlikePost.json();
      if (data.success === true) {
        refreshLikes();
      } else {
        setError(data.msg);
      }
    } catch (e) {
      return console.log(e);
    }
  }

  function findIfUserLikedPost() {
    var result = false;
    if (likes !== null) {
      for (var i = 0; i < likes.length; i++) {
        if (likes[i].likerId === user.id) {
          result = true;
          break;
        }
      }
    }
    setUserHasliked(result);
  }

  useEffect(() => {
    findIfUserLikedPost();
  }, [likes]);

  if (post !== null && comments === null) {
    loadComments();
  }

  return (
    <>
      <p>{error}</p>
      {editing === true ? (
        <>
          {post.ownerId === user.id ? (
            <div className="edit-post">
              <br></br>
              <h4>Title</h4>
              <input
                type="text"
                name="title"
                value={edTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
              ></input>
              <h4>Content</h4>
              <textarea
                type="text"
                name="contnet"
                value={edCont}
                onChange={(e) => setEditedContent(e.target.value)}
              ></textarea>

              <h6 className="date">You posted this on {dateString}</h6>

              <div className="flex-container-btns">
                <button
                  onClick={() => updatePost()}
                  className="edit"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => disardEdits()}
                  className="edit"
                >
                  Discard Edits
                </button>
              </div>
            </div>
          ) : (
            <>
              <button
                onClick={() => setEditing(false)}
                className="medium"
              >
                Redisplay
              </button>
            </>
          )}
        </>
      ) : (
        <div className="post-holder">
          {post.ownerId === user.id ? (
            <>
              <br></br>
              <h4>{post.title}</h4>
              <p>{post.content}</p>

              <h6 className="date">Posted by you on {dateString}</h6>

              <div className="flex-container-btns">
                <button
                  onClick={() => setEditing(true)}
                  className="edit"
                >
                  Edit
                  <img
                    className="button-icon"
                    src="../edit-content-svgrepo-com.svg"
                  ></img>
                </button>
                <button
                  onClick={() => deletePost()}
                  className="delete"
                >
                  Delete
                  <img
                    className="button-icon"
                    src="../trash-bin-trash-svgrepo-com.svg"
                  ></img>
                </button>
              </div>
            </>
          ) : (
            <>
              <br></br>
              <h4>{post.title}</h4>
              <p>{post.content}</p>

              <h6 className="date">
                Posted by {post.owner.username} on {dateString}
              </h6>
            </>
          )}

          <br></br>
          <div className="flex-container-btns">
            {canPostOrComment === true ? (
              <>
                {userHasliked === false ? (
                  <div>
                    <button
                      onClick={() => likePost()}
                      className="like"
                    >
                      Like
                      <img
                        className="button-icon"
                        src="../dislike-svgrepo-com.svg"
                      ></img>
                    </button>
                  </div>
                ) : (
                  <div>
                    <button
                      onClick={() => unlikePost()}
                      className="unlike"
                    >
                      Unlike
                      <img
                        className="button-icon"
                        src="../like-svgrepo-com.svg"
                      ></img>
                    </button>
                  </div>
                )}
              </>
            ) : (
              <></>
            )}
          </div>
          {showLikes === true ? (
            <div>
              {likes.length > 0 ? (
                <>
                  <button
                    onClick={() => setShowLikes(false)}
                    className="medium"
                  >
                    <img
                      className="button-icon"
                      src="../like-svgrepo-com.svg"
                    ></img>
                    Hide Likes ({likes.length})
                  </button>
                  <p>Likes:</p>
                  <div>
                    {likes.map((like) => (
                      <div key={uuidFromUuidV4()}>
                        <PostLikesView
                          id={likes.id}
                          key={uuidFromUuidV4()}
                          user={user}
                          like={like}
                          token={token}
                        ></PostLikesView>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <></>
              )}
            </div>
          ) : (
            <div>
              {likes !== null ? (
                <>
                  {likes.length > 0 ? (
                    <button
                      onClick={() => setShowLikes(true)}
                      className="medium"
                    >
                      <img
                        className="button-icon"
                        src="../like-svgrepo-com.svg"
                      ></img>
                      Show Likes ({likes.length})
                    </button>
                  ) : (
                    <></>
                  )}
                </>
              ) : (
                <></>
              )}
            </div>
          )}

          {canPostOrComment === true ? (
            <>
              <br></br>
              <NewCommmentInput
                key={uuidFromUuidV4()}
                postId={post.id}
                userId={user.id}
                token={token}
                refreshComments={refreshComments}
                setShowComments={setShowComments}
              ></NewCommmentInput>
            </>
          ) : (
            <></>
          )}

          <div>
            <br></br>
            {showComments === true ? (
              <>
                {comments !== null ? (
                  <>
                    {comments.length > 0 ? (
                      <>
                        <button
                          onClick={() => setShowComments(false)}
                          className="medium"
                        >
                          Hide Comments ({comments.length})
                        </button>
                        <br></br>
                        <h5>Comments</h5>
                        {comments.map((comment) => (
                          <div key={uuidFromUuidV4()}>
                            <div>
                              <CommentPlaceHolder
                                id={comment.id}
                                key={uuidFromUuidV4()}
                                comment={comment}
                                token={token}
                                user={user}
                                refreshComments={refreshComments}
                                canPostOrComment={canPostOrComment}
                              ></CommentPlaceHolder>
                            </div>
                            <br></br>
                          </div>
                        ))}
                      </>
                    ) : (
                      <></>
                    )}
                  </>
                ) : (
                  <></>
                )}
              </>
            ) : (
              <>
                {comments !== null ? (
                  <>
                    {comments.length > 0 ? (
                      <>
                        <button
                          onClick={() => setShowComments(true)}
                          className="medium"
                        >
                          Show Comments ({comments.length})
                        </button>
                      </>
                    ) : (
                      <></>
                    )}
                  </>
                ) : (
                  <></>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default PostPlaceHolder;
