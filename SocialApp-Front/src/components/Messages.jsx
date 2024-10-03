import MessagePlaceHolder from "./MessagePlaceHolder";
import NewMessageInput from "./NewMesssageInput";
import uuid from "react-uuid";

function Messages({ user, contactUser, token, messages, refreshMessages }) {
  function uuidFromUuidV4() {
    const newUuid = uuid();
    return newUuid;
  }

  if (messages) {
    if (contactUser) {
      if (user) {
        return (
          <>
            <div className="messages">
              <h1>{contactUser.username}</h1>
              <div>
                <div>
                  {messages.map((message) => (
                    <div
                      key={uuidFromUuidV4()}
                      id={message.id}
                    >
                      <div>
                        {message.senderId === user.id ? (
                          <div className="sent-message">
                            <MessagePlaceHolder
                              message={message}
                              token={token}
                              user={user}
                              contactUser={contactUser}
                              refreshMessages={refreshMessages}
                            ></MessagePlaceHolder>
                          </div>
                        ) : (
                          <div className="received-message">
                            <MessagePlaceHolder
                              message={message}
                              token={token}
                              user={user}
                              contactUser={contactUser}
                              refreshMessages={refreshMessages}
                            ></MessagePlaceHolder>
                          </div>
                        )}
                      </div>
                      <br></br>
                    </div>
                  ))}
                </div>
                <NewMessageInput
                  userId={user.id}
                  contactUserId={contactUser.id}
                  token={token}
                  refreshMessages={refreshMessages}
                ></NewMessageInput>
              </div>
            </div>
            <br></br>
            <br></br>
            <br></br>
          </>
        );
      }
    }
  }
}

export default Messages;
