import SentFriendRequestPlaceHolder from "./SentFriendRequestPlaceHolder";
import uuid from "react-uuid";

function SentFriendRequests({
  user,
  token,
  setProfileUser,
  sentfriendRequests,
  refreshSentFriendRequests,
}) {
  function uuidFromUuidV4() {
    const newUuid = uuid();
    return newUuid;
  }

  return (
    <>
      {sentfriendRequests !== null ? (
        <>
          {sentfriendRequests.length > 0 ? (
            <div className="sentfriendrequests">
              <h4>Sent Friend Requests ({sentfriendRequests.length})</h4>
              {sentfriendRequests.map((request) => (
                <div key={uuidFromUuidV4()}>
                  {request.user1.id !== user.id ? (
                    <>
                      <SentFriendRequestPlaceHolder
                        user={user}
                        token={token}
                        requestUser={request.user1}
                        setProfileUser={setProfileUser}
                        refreshSentFriendRequests={refreshSentFriendRequests}
                      ></SentFriendRequestPlaceHolder>
                      <br></br>
                      <br></br>
                    </>
                  ) : (
                    <></>
                  )}
                  {request.user2.id !== user.id ? (
                    <>
                      <SentFriendRequestPlaceHolder
                        user={user}
                        token={token}
                        requestUser={request.user2}
                        setProfileUser={setProfileUser}
                        refreshSentFriendRequests={refreshSentFriendRequests}
                      ></SentFriendRequestPlaceHolder>
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
            <div className="sentfriendrequests">
              <h4>No Recent Sent Friend Requests</h4>
            </div>
          )}
        </>
      ) : (
        <div className="sentfriendrequests">
          <h4>No Recent Sent Friend Requests</h4>
        </div>
      )}
      <br></br>
      <br></br>
      <br></br>
    </>
  );
}

export default SentFriendRequests;
