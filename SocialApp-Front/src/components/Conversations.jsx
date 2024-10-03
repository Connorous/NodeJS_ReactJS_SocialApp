import { useState, useEffect } from "react";
import Messages from "./Messages";
import { useNavigate } from "react-router-dom";
import uuid from "react-uuid";

function Conversations({ user, token }) {
  var [error, setError] = useState(null);
  var [contactUser, SetContactUser] = useState(null);
  var [contacts, setContacts] = useState(null);

  const navigate = useNavigate();
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, []);

  const [messages, setMessages] = useState([]);

  if (contacts === null) {
    getContacts();
  }

  function uuidFromUuidV4() {
    const newUuid = uuid();
    return newUuid;
  }

  async function getContacts() {
    const settings = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    };
    try {
      const url = "http://localhost:3063/friends/" + user.id;
      const fetchContacts = await fetch(url, settings);
      const data = await fetchContacts.json();

      if (data.success === true) {
        setContacts(data.friends);
      } else {
        setError(data.msg);
      }
    } catch (e) {
      return e;
    }
  }

  async function loadMessages() {
    const settings = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({
        userId: user.id,
        contactId: contactUser.id,
      }),
    };
    try {
      const url = "http://localhost:3063/messages";
      const fetchMessages = await fetch(url, settings);
      const data = await fetchMessages.json();
      if (data.success === true) {
        setMessages(data.messages);
      } else {
        setError(data.msg);
      }
    } catch (e) {
      return e;
    }
  }

  useEffect(() => {
    if (contactUser != null) {
      loadMessages();
    }
  }, [contactUser]);

  function refreshMessages() {
    loadMessages();
  }

  return (
    <div>
      <p>{error}</p>
      <br></br>
      <div className="message-flex-container">
        <div>
          <>
            {contacts === null ? (
              <h4>You have no contacts</h4>
            ) : (
              <>
                {contacts.length > 0 ? (
                  <>
                    {contacts.map((contact) => (
                      <div key={uuidFromUuidV4()}>
                        {contact.user1.id !== user.id ? (
                          <>
                            <button
                              onClick={() => SetContactUser(contact.user1)}
                            >
                              {contact.user1.username}
                            </button>
                          </>
                        ) : (
                          <></>
                        )}
                        {contact.user2.id !== user.id ? (
                          <>
                            <button
                              onClick={() => SetContactUser(contact.user2)}
                            >
                              {contact.user2.username}
                            </button>
                          </>
                        ) : (
                          <></>
                        )}
                        <br></br>
                        <br></br>
                      </div>
                    ))}
                  </>
                ) : (
                  <h4>You have no contacts</h4>
                )}
              </>
            )}
          </>
        </div>
        <div>
          {contacts !== null ? (
            <>
              {contacts.length > 0 ? (
                <>
                  {contactUser === null ? (
                    <p>Select a contact to see messages.</p>
                  ) : (
                    <Messages
                      user={user}
                      token={token}
                      contactUser={contactUser}
                      messages={messages}
                      refreshMessages={refreshMessages}
                    ></Messages>
                  )}
                </>
              ) : (
                <></>
              )}
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
}

export default Conversations;
