import { useState } from "react";

function NewPostInput({ userId, pageOwnerId, token, refreshPosts }) {
  const [showInput, setShowInput] = useState(false);
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");

  var [error, setError] = useState(null);

  var title = postTitle;
  var cont = postContent;

  async function postPost() {
    const settings = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({
        title: postTitle,
        content: postContent,
        ownerId: userId,
        pageOwnerId: pageOwnerId,
      }),
    };

    try {
      const url = "http://localhost:3063/post";
      const postPost = await fetch(url, settings);
      var data = await postPost.json();
      if (data.success === true) {
        refreshPosts();
        setShowInput(false);
      } else {
        setError(data.msg);
      }
    } catch (e) {
      return console.log(e);
    }
  }

  return (
    <>
      {showInput === true ? (
        <div className="new-post">
          <div>
            <p>{error}</p>
            <p>Write a new post:</p>
            <h4>Title</h4>
            <input
              type="text"
              name="title"
              value={title}
              onChange={(e) => setPostTitle(e.target.value)}
            ></input>
            <h4>Content</h4>
            <textarea
              type="text"
              name="comment"
              value={cont}
              onChange={(e) => setPostContent(e.target.value)}
            ></textarea>
            <br></br>
            <br></br>
            <button onClick={() => postPost()}>Post</button>
          </div>

          <div>
            <button onClick={() => setShowInput(false)}>×</button>
          </div>
        </div>
      ) : (
        <div>
          <button
            onClick={() => setShowInput(true)}
            className="post"
          >
            New Post
          </button>
        </div>
      )}
    </>
  );
}

export default NewPostInput;
