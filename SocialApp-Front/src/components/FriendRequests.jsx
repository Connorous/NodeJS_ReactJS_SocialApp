import FriendRequestPlaceHolder from "./FriendRequestPlaceHolder";
import uuid from "react-uuid";

function FriendRequests({
  user,
  token,
  setProfileUser,
  friendRequests,
  refreshFriends,
  refreshFriendRequests,
}) {
  function uuidFromUuidV4() {
    const newUuid = uuid();
    return newUuid;
  }

  return (
    <>
      {friendRequests !== null ? (
        <>
          {friendRequests.length > 0 ? (
            <div className="friendrequests">
              <h4>Friend Requests ({friendRequests.length})</h4>
              {friendRequests.map((requestingUser) => (
                <div key={uuidFromUuidV4()}>
                  {requestingUser.user1.id !== user.id ? (
                    <>
                      <FriendRequestPlaceHolder
                        user={user}
                        token={token}
                        requestingUser={requestingUser.user1}
                        setProfileUser={setProfileUser}
                        refreshFriends={refreshFriends}
                        refreshFriendRequests={refreshFriendRequests}
                      ></FriendRequestPlaceHolder>
                      <br></br>
                      <br></br>
                    </>
                  ) : (
                    <></>
                  )}
                  {requestingUser.user2.id !== user.id ? (
                    <>
                      <FriendRequestPlaceHolder
                        user={user}
                        token={token}
                        requestingUser={requestingUser.user2}
                        setProfileUser={setProfileUser}
                        refreshFriends={refreshFriends}
                        refreshFriendRequests={refreshFriendRequests}
                      ></FriendRequestPlaceHolder>
                      <br></br>
                      <br></br>
                    </>
                  ) : (
                    <></>
                  )}
                  <br></br>
                </div>
              ))}
            </div>
          ) : (
            <div className="friendrequests">
              <h4>No Recent Friend Requests</h4>
            </div>
          )}
        </>
      ) : (
        <div className="friendrequests">
          <h4>No Recent Friend Requests</h4>
        </div>
      )}
      <br></br>
      <br></br>
      <br></br>
    </>
  );
}

export default FriendRequests;
