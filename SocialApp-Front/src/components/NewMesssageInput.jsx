import { useState } from "react";

function NewMessageInput({ userId, contactUserId, token, refreshMessages }) {
  const [messageContent, setMessageContent] = useState("");

  var [error, setError] = useState(null);

  var content = messageContent;

  async function sendMessage() {
    const settings = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({
        content: messageContent,
        senderId: userId,
        receiverId: contactUserId,
      }),
    };
    try {
      const url = "http://localhost:3063/message";
      const postMessage = await fetch(url, settings);
      var data = await postMessage.json();
      if (data.success === true) {
        refreshMessages();
        setMessageContent("");
      } else {
        setError(data.msg);
      }
    } catch (e) {
      return console.log(e);
    }
  }

  function clearInput() {
    setMessageContent("");
  }

  return (
    <>
      <p>{error}</p>
      <div className="message-input">
        <div className="message-input-inner">
          <textarea
            type="text"
            name="comment"
            value={content}
            onChange={(e) => setMessageContent(e.target.value)}
            placeholder="Write Something"
          ></textarea>
          <br></br>
          <button
            onClick={() => sendMessage()}
            className="medium"
          >
            Send
          </button>
        </div>
        <button
          onClick={() => clearInput()}
          className="medium"
        >
          ×
        </button>
      </div>
    </>
  );
}

export default NewMessageInput;
