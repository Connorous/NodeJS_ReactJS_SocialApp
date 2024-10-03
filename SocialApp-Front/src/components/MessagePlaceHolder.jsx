import { useState, useEffect } from "react";
import MessageLikesView from "./MessageLikesView";
import uuid from "react-uuid";

function MessagePlaceHolder({
  message,
  user,
  contactUser,
  token,
  refreshMessages,
}) {
  const [editing, setEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(message.content);

  const [showLikes, setShowLikes] = useState(false);
  const [likes, setLikes] = useState(null);
  const [userHasliked, setUserHasliked] = useState(false);

  var [error, setError] = useState(null);

  var edCont = editedContent;

  var dateCreated = new Date(message.dateCreated);
  var dateString = dateCreated.toString();

  if (likes && showLikes) {
    if (likes.length === 0) {
      setShowLikes(false);
    }
  }

  function disardEdits() {
    setEditing(false);
    setEditedContent(message.content);
  }

  function uuidFromUuidV4() {
    const newUuid = uuid();
    return newUuid;
  }

  async function updateMessage() {
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
      const url = "http://localhost:3063/message/" + message.id;
      const updatedMessage = await fetch(url, settings);
      var data = await updatedMessage.json();
      if (data.success === true) {
        refreshMessages();
      } else {
        setError(data.msg);
      }
    } catch (e) {
      return console.log(e);
    }
  }

  async function deleteMessage() {
    const settings = {
      method: "DELETE",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    };
    try {
      const url = "http://localhost:3063/message/" + message.id;
      const deletedMessage = await fetch(url, settings);
      var data = await deletedMessage.json();
      if (data.success === true) {
        refreshMessages();
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
      headers: {
        Authorization: token,
      },
    };
    try {
      const url = "http://localhost:3063/message/likes/" + message.id;
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
    loadLikes();
  }

  useEffect(() => {
    findIfUserLikedMessage();
  }, [likes]);

  async function likeMessage() {
    const settings = {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        likerId: user.id,
        messageId: message.id,
      }),
    };
    try {
      const url = "http://localhost:3063/message/like";
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

  async function unlikeMessage() {
    const settings = {
      method: "DELETE",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        likerId: user.id,
        messageId: message.id,
      }),
    };
    try {
      const url = "http://localhost:3063/message/like/" + message.id;
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

  async function findIfUserLikedMessage() {
    var result = false;
    if (likes !== null) {
      for (var i = 0; i < likes.length; i++) {
        if (likes[i].likerId === user.id) {
          result = true;
          break;
        }
      }
      setUserHasliked(result);
    }
  }

  if (!editing) {
    return (
      <div>
        {error}
        {message.senderId === user.id ? (
          <div>
            <p className="message-text">{message.content}</p>
            <h6 className="date">Sent by you on {dateString}</h6>
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
                onClick={() => deleteMessage()}
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
          <div>
            <p className="message-text">{message.content}</p>
            <h6 className="date">
              Sent by {contactUser.username} on {dateString}
            </h6>
          </div>
        )}
        <br></br>
        <div className="flex-container">
          {userHasliked === false ? (
            <div>
              <button
                onClick={() => likeMessage()}
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
                onClick={() => unlikeMessage()}
                className="unlike"
              >
                UnLike
                <img
                  className="button-icon-small"
                  src="../like-svgrepo-com.svg"
                ></img>
              </button>
            </div>
          )}
        </div>
        {showLikes === true ? (
          <>
            {likes.length > 0 ? (
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

                {likes.map((like) => (
                  <div key={uuidFromUuidV4()}>
                    <div className="message-like">
                      <MessageLikesView
                        id={like.id}
                        user={user}
                        like={like}
                        token={token}
                      ></MessageLikesView>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <></>
            )}
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
      </div>
    );
  } else {
    return (
      <>
        {error}
        {message.senderId === user.id ? (
          <div className="edit-message">
            <textarea
              className="editarea"
              name="edited comment"
              value={edCont}
              onChange={(e) => setEditedContent(e.target.value)}
            >
              {message.content}
            </textarea>
            <h6 className="date">Sent by you on {dateString}</h6>
            <br></br>
            <div className="flex-container-btns">
              <button
                onClick={() => updateMessage()}
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
              className="edit"
            >
              Redisplay
            </button>
          </>
        )}
      </>
    );
  }
}

export default MessagePlaceHolder;
