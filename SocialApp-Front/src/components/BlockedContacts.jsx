import BlockedContactPlaceHolder from "./BlockedContactPlaceHolder";
import uuid from "react-uuid";

function BlockedContacts({
  user,
  token,
  blockedContacts,
  refreshFriends,
  refreshBlockedContacts,
}) {
  function uuidFromUuidV4() {
    const newUuid = uuid();
    return newUuid;
  }

  return (
    <>
      {blockedContacts !== null ? (
        <>
          {blockedContacts.length > 0 ? (
            <div className="blockedcontacts">
              <h4>Blocked Contacts ({blockedContacts.length})</h4>
              {blockedContacts.map((blockedUser) => (
                <div key={uuidFromUuidV4()}>
                  {blockedUser.user1.id !== user.id ? (
                    <>
                      <BlockedContactPlaceHolder
                        user={user}
                        token={token}
                        blockedUser={blockedUser.user1}
                        refreshFriends={refreshFriends}
                        refreshBlockedContacts={refreshBlockedContacts}
                      ></BlockedContactPlaceHolder>
                      <br></br>
                      <br></br>
                    </>
                  ) : (
                    <></>
                  )}
                  {blockedUser.user2.id !== user.id ? (
                    <>
                      <BlockedContactPlaceHolder
                        user={user}
                        token={token}
                        blockedUser={blockedUser.user2}
                        refreshFriends={refreshFriends}
                        refreshBlockedContacts={refreshBlockedContacts}
                      ></BlockedContactPlaceHolder>
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
            <div className="blockedcontacts">
              <h4>No Blocked Contacts</h4>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="blockedcontacts">
            <h4>No Blocked Contacts</h4>
          </div>
        </>
      )}
      <br></br>
      <br></br>
      <br></br>
    </>
  );
}

export default BlockedContacts;
