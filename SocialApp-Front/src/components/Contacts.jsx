import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Friends from "./Friends";
import FriendRequests from "./FriendRequests";
import BlockedContacts from "./BlockedContacts";
import SearchUsers from "./SearchUsers";

import SentFriendRequests from "./SentFriendRequests";

function Contacts({ user, token, setProfileUser }) {
  var [friends, setFriends] = useState(null);
  var [friendRequests, setFriendRequests] = useState(null);
  var [sentfriendRequests, setSentfriendRequests] = useState(null);
  var [blockedContacts, setBlockedContacts] = useState(null);
  var [error, setError] = useState(null);

  const navigate = useNavigate();
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, []);

  if (friends === null) {
    getFriends();
  }

  if (friendRequests === null) {
    getFriendRequests();
  }

  if (sentfriendRequests === null) {
    getSentFriendRequests();
  }

  if (blockedContacts === null) {
    getBlockedContacts();
  }

  async function getFriendRequests() {
    const settings = {
      method: "GET",
      headers: { Authorization: token },
    };
    try {
      const url = "http://localhost:3063/friends/requests/" + user.id;
      const fetchFriendRequests = await fetch(url, settings);
      const data = await fetchFriendRequests.json();

      if (data.success === true) {
        setFriendRequests(data.friendrequests);
      } else {
        setError(data.msg);
      }
    } catch (e) {
      return e;
    }
  }

  function refreshFriendRequests() {
    getFriendRequests();
  }

  async function getSentFriendRequests() {
    const settings = {
      method: "GET",
      headers: { Authorization: token },
    };
    try {
      const url = "http://localhost:3063/friends/sent-requests/" + user.id;
      const fetchSentFriendRequests = await fetch(url, settings);
      const data = await fetchSentFriendRequests.json();

      if (data.success === true) {
        setSentfriendRequests(data.friendrequests);
      } else {
        setError(data.msg);
      }
    } catch (e) {
      return e;
    }
  }

  function refreshSentFriendRequests() {
    getSentFriendRequests();
  }

  async function getFriends() {
    const settings = {
      method: "GET",
      headers: { Authorization: token },
    };
    try {
      const url = "http://localhost:3063/friends/" + user.id;
      const fetchFriends = await fetch(url, settings);
      const data = await fetchFriends.json();

      if (data.success === true) {
        setFriends(data.friends);
      } else {
        setError(data.msg);
      }
    } catch (e) {
      return e;
    }
  }

  function refreshFriends() {
    getFriends();
  }

  async function getBlockedContacts() {
    const settings = {
      method: "GET",
      headers: { Authorization: token },
    };
    try {
      const url = "http://localhost:3063/friends/blocked/" + user.id;
      const fetchBlocked = await fetch(url, settings);
      const data = await fetchBlocked.json();
      if (data.success === true) {
        setBlockedContacts(data.blockedList);
      } else {
        setError(data.msg);
      }
    } catch (e) {
      return e;
    }
  }

  function refreshBlockedContacts() {
    getBlockedContacts();
    getFriends();
  }

  return (
    <>
      <p>{error}</p>

      <div className="contacts-flex-container">
        <div>
          <FriendRequests
            user={user}
            token={token}
            friendRequests={friendRequests}
            refreshFriends={refreshFriends}
            refreshFriendRequests={refreshFriendRequests}
            setProfileUser={setProfileUser}
          ></FriendRequests>
          <SentFriendRequests
            user={user}
            token={token}
            sentfriendRequests={sentfriendRequests}
            refreshSentFriendRequests={refreshSentFriendRequests}
            setProfileUser={setProfileUser}
          ></SentFriendRequests>
        </div>

        <div>
          <Friends
            user={user}
            token={token}
            setProfileUser={setProfileUser}
            friends={friends}
            refreshFriends={refreshFriends}
            refreshBlockedContacts={refreshBlockedContacts}
          ></Friends>
          <BlockedContacts
            user={user}
            token={token}
            blockedContacts={blockedContacts}
            refreshFriends={refreshFriends}
            refreshBlockedContacts={refreshBlockedContacts}
          ></BlockedContacts>
        </div>
      </div>

      <div>
        <SearchUsers
          user={user}
          token={token}
          setProfileUser={setProfileUser}
          refreshSentFriendRequests={refreshSentFriendRequests}
        ></SearchUsers>
      </div>
    </>
  );
}

export default Contacts;
