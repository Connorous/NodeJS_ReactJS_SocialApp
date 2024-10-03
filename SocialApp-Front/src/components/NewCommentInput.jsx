import { useState } from "react";

function NewCommmentInput({
  postId,
  userId,
  token,
  refreshComments,
  setShowComments,
}) {
  const [showInput, setShowInput] = useState(false);
  const [commentContent, setCommenContent] = useState("");

  var [error, setError] = useState(null);

  var content = commentContent;

  async function postComment() {
    const settings = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({
        content: commentContent,
        postId: postId,
        ownerId: userId,
      }),
    };
    try {
      const url = "http://localhost:3063/comment";
      const postComment = await fetch(url, settings);
      var data = await postComment.json();
      if (data.success === true) {
        refreshComments();
        setShowComments(true);
      } else {
        setError(data.msg);
      }
    } catch (e) {
      return console.log(e);
    }
  }

  function displayInput(show) {
    setShowInput(show);
    console.log(show);
    if (show === true) {
      setShowComments(false);
    }
  }

  return (
    <>
      {showInput === true ? (
        <div className="new-comment">
          <div>
            <p>{error}</p>
            <p>Write a comment:</p>

            <textarea
              type="text"
              name="comment"
              value={content}
              onChange={(e) => setCommenContent(e.target.value)}
            ></textarea>
            <br></br>
            <br></br>
            <div>
              <button
                onClick={() => postComment()}
                className="medium"
              >
                Post Comment
              </button>
            </div>
          </div>

          <button
            onClick={() => setShowInput(false)}
            className="medium"
          >
            ×
          </button>
        </div>
      ) : (
        <div>
          <br></br>
          <button
            onClick={() => setShowInput(true)}
            className="medium"
          >
            Write a Comment
          </button>
          <br></br>
        </div>
      )}
    </>
  );
}

export default NewCommmentInput;
