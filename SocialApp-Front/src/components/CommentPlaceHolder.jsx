import { useState, useEffect } from "react";
import CommentLikesView from "./CommentLikesView";
import uuid from "react-uuid";

function CommentPlaceHolder({
  comment,
  user,
  token,
  refreshComments,
  canPostOrComment,
}) {
  const [editing, setEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);

  const [showLikes, setShowLikes] = useState(false);
  const [likes, setLikes] = useState(null);
  const [userHasliked, setUserHasliked] = useState(null);

  var [error, setError] = useState(null);

  var edCont = editedContent;

  var dateCreated = new Date(comment.dateCreated);
  var dateString = dateCreated.toString();

  if (likes && showLikes) {
    if (likes.length === 0) {
      setShowLikes(false);
    }
  }

  function disardEdits() {
    setEditing(false);
    setEditedContent(comment.content);
  }

  function uuidFromUuidV4() {
    const newUuid = uuid();
    return newUuid;
  }

  async function updateComment() {
    const settings = {
      method: "PUT",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: editedContent,
      }),
    };
    try {
      const url = "http://localhost:3063/comment/" + comment.id;
      const updatedComment = await fetch(url, settings);
      var data = await updatedComment.json();
      if (data.success === true) {
        refreshComments();
      } else {
        setError(data.msg);
      }
    } catch (e) {
      return console.log(e);
    }
  }

  async function deleteComment() {
    const settings = {
      method: "DELETE",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    };
    try {
      const url = "http://localhost:3063/comment/" + comment.id;
      const deleteComment = await fetch(url, settings);
      var data = await deleteComment.json();
      if (data.success === true) {
        refreshComments();
      } else {
        setError(data.msg);
      }
    } catch (e) {
      return console.log(e);
    }
  }

  async function loadLikes() {
    const settings = {
      method: "GET",
      headers: { Authorization: token },
    };
    try {
      const url = "http://localhost:3063/comment/likes/" + comment.id;
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

  async function likeComment() {
    const settings = {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        likerId: user.id,
        commentId: comment.id,
      }),
    };
    try {
      const url = "http://localhost:3063/comment/like";
      const likeComment = await fetch(url, settings);
      var data = await likeComment.json();
      if (data.success === true) {
        refreshLikes();
      } else {
        setError(data.msg);
      }
    } catch (e) {
      return console.log(e);
    }
  }

  async function unlikeComment() {
    const settings = {
      method: "DELETE",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        likerId: user.id,
        commentId: comment.id,
      }),
    };
    try {
      const url = "http://localhost:3063/comment/likes/" + comment.id;
      const unlikeComment = await fetch(url, settings);
      var data = await unlikeComment.json();
      if (data.success === true) {
        refreshLikes();
      } else {
        setError(data.msg);
      }
    } catch (e) {
      return console.log(e);
    }
  }

  function findIfUserLikedComment() {
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
    findIfUserLikedComment();
  }, [likes]);

  if (!editing) {
    return (
      <div className="comment">
        <div>
          <p>{error}</p>
          <p>{comment.content}</p>
          {comment.ownerId === user.id ? (
            <div>
              <h6 className="date">You posted this on {dateString}</h6>
              <div className="flex-container-btns">
                <button
                  onClick={() => setEditing(true)}
                  className="edit"
                >
                  Edit
                  <img
                    className="button-icon-small"
                    src="../edit-content-svgrepo-com.svg"
                  ></img>
                </button>
                <button
                  onClick={() => deleteComment()}
                  className="delete"
                >
                  Delete
                  <img
                    className="button-icon-small"
                    src="../trash-bin-trash-svgrepo-com.svg"
                  ></img>
                </button>
              </div>
            </div>
          ) : (
            <h6 className="date">
              Posted by {comment.owner.username} at {dateString}
            </h6>
          )}
        </div>
        <br></br>
        {canPostOrComment === true ? (
          <>
            {userHasliked === false ? (
              <div>
                <button
                  onClick={() => likeComment()}
                  className="like"
                >
                  Like
                  <img
                    className="button-icon-small"
                    src="../dislike-svgrepo-com.svg"
                  ></img>
                </button>
              </div>
            ) : (
              <div>
                <button
                  onClick={() => unlikeComment()}
                  className="unlike"
                >
                  Unlike
                  <img
                    className="button-icon-small"
                    src="../like-svgrepo-com.svg"
                  ></img>
                </button>
              </div>
            )}
            <br></br>
            {showLikes === true ? (
              <>
                <button
                  onClick={() => setShowLikes(false)}
                  className="medium"
                >
                  <img
                    className="button-icon-small"
                    src="../like-svgrepo-com.svg"
                  ></img>
                  Hide Likes ({likes.length})
                </button>
                <p>Likes:</p>
                {likes.map((like) => (
                  <div key={uuidFromUuidV4()}>
                    <div className="comment-like">
                      <CommentLikesView
                        id={likes.id}
                        key={uuidFromUuidV4()}
                        user={user}
                        like={like}
                        token={token}
                      ></CommentLikesView>
                    </div>
                  </div>
                ))}
              </>
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
                          className="button-icon-small"
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
          </>
        ) : (
          <></>
        )}
      </div>
    );
  } else {
    return (
      <div className="edit-comment">
        <p>{error}</p>
        {comment.ownerId === user.id ? (
          <div>
            <p>Content</p>
            <textarea
              className="editarea"
              name="edited comment"
              value={edCont}
              onChange={(e) => setEditedContent(e.target.value)}
            >
              {comment.content}
            </textarea>
            <h6 className="date">You posted this on {dateString}</h6>
            <div className="flex-container-btns">
              <button
                onClick={() => updateComment()}
                className="medium"
              >
                Save Changes
              </button>
              <button
                onClick={() => disardEdits()}
                className="medium"
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
      </div>
    );
  }
}

export default CommentPlaceHolder;
