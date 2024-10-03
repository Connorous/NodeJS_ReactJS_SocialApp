import { useNavigate } from "react-router-dom";
import { useState } from "react";

function SearchUserResultPlaceHolder({
  searchedUser,
  user,
  token,
  setProfileUser,
  refreshSentFriendRequests,
  refreshSearch,
}) {
  var [error, setError] = useState(null);
  const navigate = useNavigate();

  function seePage() {
    setProfileUser(searchedUser);
    navigate("/");
  }

  async function addFriend() {
    const settings = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({
        user: user,
        contact: searchedUser,
      }),
    };
    try {
      const url = "http://localhost:3063/friend/request";
      const postRequest = await fetch(url, settings);
      var data = await postRequest.json();
      console.log(data);
      if (data.success === true) {
        refreshSentFriendRequests();
        refreshSearch();
      } else {
        setError(data.msg);
      }
    } catch (e) {
      return console.log(e);
    }
  }

  return (
    <div>
      <p>{error}</p>
      <div className="user-searchresult">
        <a onClick={() => seePage()}>{searchedUser.username}</a>

        <div className="medium">
          <button onClick={() => addFriend()}>Send Friend Request</button>
        </div>
      </div>
    </div>
  );
}

export default SearchUserResultPlaceHolder;
