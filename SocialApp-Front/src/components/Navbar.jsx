import "../styles/app-styles.css";
import { Link, useNavigate } from "react-router-dom";

function NavBar({ token, user, setProfileUser }) {
  const navigate = useNavigate();

  function seeYourPage() {
    setProfileUser(user);
    navigate("/");
  }
  if (token) {
    if (user.username !== "Guest") {
      return (
        <section className="top-section">
          <h1 className="top">SocialBook</h1>
          {user !== null ? (
            <>
              <p className="loggedinas">
                Logged In As <span className="username">{user.username}</span>
              </p>
            </>
          ) : (
            <></>
          )}
          <div className="top-bar">
            <div className="top-bar-left">
              <a
                onClick={() => seeYourPage()}
                className="top"
              >
                <h3 className="nav">Your Profile</h3>
              </a>
              <Link
                to="/conversations"
                className="top"
              >
                <h3 className="nav">Conversations</h3>
              </Link>
              <Link
                to="/contacts"
                className="top"
              >
                <h3 className="nav">Contacts</h3>
              </Link>
            </div>
            <div className="top-bar-right">
              <Link
                to="/logout"
                className="top"
              >
                <h3 className="nav">Logout</h3>
              </Link>
            </div>
          </div>
        </section>
      );
    } else {
      return (
        <section className="top-section">
          <h1 className="top">SocialBook</h1>
          {user !== null ? (
            <>
              <p className="loggedinas">
                Logged In As <span className="username">{user.username}</span>
              </p>
            </>
          ) : (
            <></>
          )}
          <div className="top-bar">
            <div className="top-bar-left">
              <Link
                to="/contacts"
                className="top"
              >
                <h3 className="nav">People</h3>
              </Link>
            </div>
            <div className="top-bar-right">
              <Link
                to="/logout"
                className="top"
              >
                <h3 className="nav">Logout</h3>
              </Link>
            </div>
          </div>
        </section>
      );
    }
  } else {
    return (
      <section className="top-section">
        <h1 className="top">SocialBook</h1>
        <div className="top-bar">
          <div className="top-bar-left">
            <br></br>
          </div>
          <div className="top-bar-right">
            <br></br>
          </div>
        </div>
      </section>
    );
  }
}

export default NavBar;
