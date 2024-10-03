import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import uuid from "react-uuid";
import PostPlaceHolder from "./PostPlaceHolder";
import NewPostInput from "./NewPostInput";

function Profile({ token, user, setUser, profileUser, setProfileUser }) {
  const navigate = useNavigate();
  useEffect(() => {
    if (!token || !profileUser) {
      navigate("/login");
    }
  }, []);

  var [error, setError] = useState(null);

  const [posts, setPosts] = useState(null);
  const [canPostOrComment, setCanPostOrComment] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [noRelation, setNoRelation] = useState(false);

  async function saveProfileChanges() {
    const settings = {
      method: "PUT",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        profileInfo: editedProfileContent,
        userId: user.id,
      }),
    };
    try {
      const url = "http://localhost:3063/user/saveprofile";
      const fetchSaveUserProfile = await fetch(url, settings);
      const data = await fetchSaveUserProfile.json();
      if (data.success === true) {
        const updatedUser = data.updatedUser;
        setUser(updatedUser);
        setProfileUser(updatedUser);
        setEditedProfileContent(updatedUser.profileInfo);
        setEditingProfile(false);
      }
    } catch (e) {
      console.log(e);
      return e;
    }
  }

  function discardProfileInfoChanges() {
    setEditedProfileContent(profileUser.profileInfo);
    setEditingProfile(false);
  }

  if (profileUser) {
    if (user.id === profileUser.id && canPostOrComment === false) {
      setCanPostOrComment(true);
      refreshPosts();
    } else if (user.id !== profileUser.id && !noRelation) {
      getRelationshipToProfileUser();
    }
  }

  async function getRelationshipToProfileUser() {
    const settings = {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        profileUser: profileUser,
        user: user,
      }),
    };
    try {
      const url = "http://localhost:3063/relationship";
      const fetchRelationship = await fetch(url, settings);
      const data = await fetchRelationship.json();
      if (data.success === true) {
        var relationship = data.relationship;
        if (
          relationship.blockeduser1 === true ||
          relationship.blockeduser2 === true
        ) {
          setIsBlocked(true);
        } else if (
          relationship.pending === false &&
          relationship.accepted === true
        ) {
          setCanPostOrComment(true);
        } else {
          setNoRelation(true);
        }
      }
    } catch (e) {
      return e;
    }
  }

  function uuidFromUuidV4() {
    const newUuid = uuid();
    return newUuid;
  }

  if (posts === null) {
    loadPosts();
  }

  async function loadPosts() {
    const settings = {
      method: "GET",
      headers: { Authorization: token },
    };
    try {
      const url = "http://localhost:3063/posts/" + profileUser.id;
      const fetchPosts = await fetch(url, settings);
      const data = await fetchPosts.json();
      if (data.success === true) {
        setPosts(data.posts);
      } else {
        setError(data.msg);
      }
    } catch (e) {
      return e;
    }
  }

  function refreshPosts() {
    loadPosts();
  }

  if (isBlocked) {
    return (
      <>
        <p>You are blocked from this user's page.</p>
      </>
    );
  } else {
    if (profileUser) {
      var [editedProfileContent, setEditedProfileContent] = useState(
        profileUser.profileInfo
      );
      var [editingProfile, setEditingProfile] = useState(false);

      if (posts) {
        if (posts.length > 0) {
          if (posts[0].pageOwnerId !== profileUser.id) {
            refreshPosts();
          }
        }
      }

      var [reloadedInfo, setReloadedInfo] = useState(false);

      if (editedProfileContent) {
        if (editedProfileContent !== profileUser.profileInfo) {
          if (!reloadedInfo) {
            setEditedProfileContent(profileUser.profileInfo);
            setReloadedInfo(true);
          }
        }
      }

      var prflInfo = editedProfileContent;

      if (posts) {
        if (user) {
          return (
            <>
              {profileUser.id === user.id ? (
                <div>
                  <h1>Your Profile</h1>
                  {editingProfile === false ? (
                    <div className="profile">
                      {profileUser.profileInfo !== "" ? (
                        <div>
                          <p>{profileUser.profileInfo}</p>
                          <br></br>
                          <button
                            onClick={() => setEditingProfile(true)}
                            className="edit-profile"
                          >
                            Edit Profile
                          </button>
                        </div>
                      ) : (
                        <div>
                          <br></br>
                          <button onClick={() => setEditingProfile(true)}>
                            Write something on your profile
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="edit-profile">
                      <textarea
                        type="text"
                        name="profile info"
                        value={prflInfo}
                        onChange={(e) =>
                          setEditedProfileContent(e.target.value)
                        }
                      ></textarea>
                      <br></br>
                      <br></br>
                      <div className="flex-container-btns">
                        <button onClick={() => saveProfileChanges()}>
                          Save Changes
                        </button>
                        <button onClick={() => discardProfileInfoChanges()}>
                          Discard Changes
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <h1>{profileUser.username}'s Profile</h1>
                  {profileUser.profileInfo !== "" ? (
                    <div className="profile">
                      <div>
                        <p>{profileUser.profileInfo}</p>
                      </div>
                    </div>
                  ) : (
                    <div></div>
                  )}
                </div>
              )}

              <p>{error}</p>
              <div className="profile-posts">
                <div>
                  {posts !== null ? (
                    <>
                      {posts.length > 0 ? (
                        <>
                          <h1 className="post-title">Posts</h1>
                        </>
                      ) : (
                        <>
                          <h1 className="post-title">No Posts Yet</h1>
                        </>
                      )}
                    </>
                  ) : (
                    <></>
                  )}

                  <br></br>
                  <br></br>
                  {canPostOrComment === true ? (
                    <NewPostInput
                      userId={user.id}
                      pageOwnerId={profileUser.id}
                      token={token}
                      refreshPosts={refreshPosts}
                    ></NewPostInput>
                  ) : (
                    <></>
                  )}
                  <br></br>
                  <br></br>

                  {posts.map((post) => (
                    <div
                      key={uuidFromUuidV4()}
                      id={post.id}
                    >
                      <div className="post">
                        <div>
                          <PostPlaceHolder
                            post={post}
                            user={user}
                            token={token}
                            refreshPosts={refreshPosts}
                            canPostOrComment={canPostOrComment}
                          ></PostPlaceHolder>
                        </div>
                        <br></br>
                      </div>
                      <br></br>
                      <br></br>
                    </div>
                  ))}
                </div>
                <br></br>
                <br></br>
                <br></br>
              </div>
              <br></br>
              <br></br>
            </>
          );
        }
      }
    }
  }
}

export default Profile;
