import { useState } from "react";
import { useNavigate } from "react-router-dom";

function FriendPlaceHolder({
  user,
  token,
  friend,
  setProfileUser,
  refreshFriends,
  refreshBlockedContacts,
}) {
  const navigate = useNavigate();

  const [error, setError] = useState(null);

  function seePage() {
    setProfileUser(friend);
    navigate("/");
  }

  async function unFriend() {
    const settings = {
      method: "DELETE",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: user,
        friend: friend,
      }),
    };
    try {
      const url = "http://localhost:3063/friend/unfriend";
      const removeFriend = await fetch(url, settings);
      var data = await removeFriend.json();
      if (data.success === true) {
        refreshFriends();
      } else {
        setError(data.msg);
      }
    } catch (e) {
      return console.log(e);
    }
  }

  async function blockFriend() {
    const settings = {
      method: "PUT",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: user,
        friend: friend,
      }),
    };
    try {
      const url = "http://localhost:3063/friend/block";
      const blockFriend = await fetch(url, settings);
      var data = await blockFriend.json();
      if (data.success === true) {
        refreshBlockedContacts();
      } else {
        setError(data.msg);
      }
    } catch (e) {
      return console.log(e);
    }
  }

  return (
    <>
      <div className="friend">
        <p>{error}</p>
        <a onClick={() => seePage()}>{friend.username}</a>
        <br></br>
        <br></br>
        <div className="flex-container">
          <button onClick={() => unFriend()}>Unfriend</button>
          <button onClick={() => blockFriend()}>Block</button>
        </div>
        <br></br>
      </div>
    </>
  );
}

export default FriendPlaceHolder;
