import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SentFriendRequestPlaceHolder({
  user,
  token,
  requestUser,
  refreshSentFriendRequests,
  setProfileUser,
}) {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  function seePage() {
    setProfileUser(requestUser);
    navigate("/");
  }

  async function removeRequest() {
    const settings = {
      method: "DELETE",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: user,
        friend: requestUser,
      }),
    };
    try {
      const url = "http://localhost:3063/friend/unfriend";
      const removeFriendRequest = await fetch(url, settings);
      var data = await removeFriendRequest.json();
      if (data.success) {
        refreshSentFriendRequests();
      } else {
        setError(data.msg);
      }
    } catch (e) {
      return console.log(e);
    }
  }

  return (
    <div className="sentfriendrequest">
      <p>{error}</p>
      <a onClick={() => seePage()}>{requestUser.username}</a>
      <br></br>
      <br></br>
      <div className="flex-container">
        <button onClick={() => removeRequest()}>Unsend</button>
      </div>
      <br></br>
    </div>
  );
}

export default SentFriendRequestPlaceHolder;
