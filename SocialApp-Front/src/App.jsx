import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/Navbar";
import Profile from "./components/Profile";
import LoginForm from "./components/LoginForm";
import Logout from "./components/Logout";
import Conversations from "./components/Conversations";
import Contacts from "./components/Contacts";
import "./App.css";
import "./styles/app-styles.css";
import { useEffect } from "react";
import { useState } from "react";
import "./App.css";

function App() {
  const [jwtToken, setJwtToken] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem("jwtToken"));
    } catch {
      return null;
    }
  });

  useEffect(() => {
    sessionStorage.setItem("jwtToken", JSON.stringify(jwtToken));
  }, [jwtToken]);

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem("user"));
    } catch {
      return null;
    }
  });

  useEffect(() => {
    sessionStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  const [profileUser, setProfileUser] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem("profileUser"));
    } catch {
      return null;
    }
  });

  useEffect(() => {
    sessionStorage.setItem("profileUser", JSON.stringify(profileUser));
  }, [profileUser]);

  useEffect(() => {
    if (user !== null && profileUser === null) {
      setProfileUser(user);
    }
  }, [user]);

  return (
    <>
      <Router>
        <NavBar
          token={jwtToken}
          user={user}
          setProfileUser={setProfileUser}
        />
        <Routes>
          <Route
            path="/"
            element={
              <Profile
                token={jwtToken}
                user={user}
                setUser={setUser}
                profileUser={profileUser}
                setProfileUser={setProfileUser}
              />
            }
          ></Route>
          <Route
            path="/conversations"
            element={
              <Conversations
                token={jwtToken}
                user={user}
              />
            }
          ></Route>
          <Route
            path="/contacts"
            element={
              <Contacts
                token={jwtToken}
                user={user}
                setProfileUser={setProfileUser}
              />
            }
          ></Route>
          <Route
            path="/login"
            element={
              <LoginForm
                token={jwtToken}
                setToken={setJwtToken}
                user={user}
                setUser={setUser}
                setProfileUser={setProfileUser}
              />
            }
          ></Route>
          <Route
            path="/logout"
            element={
              <Logout
                setToken={setJwtToken}
                setUser={setUser}
              ></Logout>
            }
          ></Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
