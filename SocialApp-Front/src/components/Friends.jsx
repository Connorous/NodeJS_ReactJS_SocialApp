import FriendPlaceHolder from "./FriendPlaceHolder";
import uuid from "react-uuid";

function Friends({
  user,
  token,
  setProfileUser,
  friends,
  refreshFriends,
  refreshBlockedContacts,
}) {
  function uuidFromUuidV4() {
    const newUuid = uuid();
    return newUuid;
  }

  return (
    <>
      {friends !== null ? (
        <>
          {friends.length > 0 ? (
            <div className="friends">
              <h4>Friends ({friends.length})</h4>
              {friends.map((friend) => (
                <div key={uuidFromUuidV4()}>
                  {friend.user1.id !== user.id ? (
                    <>
                      <FriendPlaceHolder
                        user={user}
                        token={token}
                        friend={friend.user1}
                        setProfileUser={setProfileUser}
                        refreshFriends={refreshFriends}
                        refreshBlockedContacts={refreshBlockedContacts}
                      ></FriendPlaceHolder>
                      <br></br>
                      <br></br>
                    </>
                  ) : (
                    <></>
                  )}
                  {friend.user2.id !== user.id ? (
                    <>
                      <FriendPlaceHolder
                        user={user}
                        token={token}
                        friend={friend.user2}
                        setProfileUser={setProfileUser}
                        refreshFriends={refreshFriends}
                        refreshBlockedContacts={refreshBlockedContacts}
                      ></FriendPlaceHolder>
                      <br></br>
                      <br></br>
                    </>
                  ) : (
                    <></>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="friends">
              <h4>No Friends Found</h4>
            </div>
          )}
        </>
      ) : (
        <div className="friends">
          <h4>No Friends Found</h4>
        </div>
      )}
      <br></br>
      <br></br>
      <br></br>
    </>
  );
}

export default Friends;
