import { useState } from "react";
import { useNavigate } from "react-router-dom";

function FriendRequestPlaceHolder({
  user,
  token,
  requestingUser,
  refreshFriends,
  refreshFriendRequests,
  setProfileUser,
}) {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  function seePage() {
    setProfileUser(requestingUser);
    navigate("/");
  }

  async function unAcceptRequest() {
    const settings = {
      method: "DELETE",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: user,
        friend: requestingUser,
      }),
    };
    try {
      const url = "http://localhost:3063/friend/unfriend";
      const removeFriendRequest = await fetch(url, settings);
      var data = await removeFriendRequest.json();
      if (data.success) {
        refreshFriendRequests();
      } else {
        setError(data.msg);
      }
    } catch (e) {
      return console.log(e);
    }
  }

  async function acceptRequest() {
    const settings = {
      method: "PUT",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: user,
        friend: requestingUser,
      }),
    };
    try {
      const url = "http://localhost:3063/friend/acceptrequest";
      const acceptRequest = await fetch(url, settings);
      var data = await acceptRequest.json();
      if (data.success === true) {
        refreshFriends();
        refreshFriendRequests();
      } else {
        setError(data.msg);
      }
    } catch (e) {
      return console.log(e);
    }
  }

  return (
    <div className="friendrequest">
      <p>{error}</p>
      <a onClick={() => seePage()}>{requestingUser.username}</a>
      <br></br>
      <br></br>
      <div className="flex-container">
        <button onClick={() => acceptRequest()}>Accept</button>
        <button onClick={() => unAcceptRequest()}>Decline</button>
      </div>
      <br></br>
    </div>
  );
}

export default FriendRequestPlaceHolder;
