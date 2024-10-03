import "../styles/app-styles.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function LoginForm({ token, setToken, user, setUser, setProfileUser }) {
  const [switchRegLog, setSwitchRegLog] = useState(false);

  var [email, setEmail] = useState("");
  var [username, setUsername] = useState("");
  var [password, setPasssword] = useState("");
  var [confirmpassword, setConfirmpassword] = useState("");
  var [error, setError] = useState(null);

  var em = email;
  var us = username;
  var ps = password;
  var cnps = confirmpassword;

  //console.log(token);
  //console.log(user);

  function changeRegLog() {
    if (switchRegLog) {
      setSwitchRegLog(false);
    } else {
      setSwitchRegLog(true);
    }
    setEmail("");
    setUsername("");
    setPasssword("");
    setConfirmpassword("");
    setError("");
  }

  function submit() {
    if (!switchRegLog) {
      login();
    } else {
      register();
    }
  }

  async function login() {
    const settings = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    };

    try {
      const fetchLogin = await fetch(`http://localhost:3063/login`, settings);
      const data = await fetchLogin.json();

      if (data.success === true) {
        setToken(data.token);
        setUser(data.user);
      } else {
        setError(data.msg);
      }
    } catch (e) {
      console.log(e);
      return e;
    }
  }

  async function register() {
    const settings = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        username: username,
        password: password,
        confirmpassword: confirmpassword,
      }),
    };
    try {
      const fetchLogin = await fetch(`http://localhost:3063/user`, settings);
      const data = await fetchLogin.json();
      if (data.success === true) {
        changeRegLog();
        setError("Now that you have registered, login!");
        set;
      } else {
        setError(data.msg);
      }
    } catch (e) {
      return e;
    }
  }

  const navigate = useNavigate();
  useEffect(() => {
    if (token) {
      navigate("/");
      setProfileUser(user);
    }
  }, [token]);

  if (!token) {
    if (!switchRegLog) {
      return (
        <>
          <h1>Log In</h1>
          <p>You must login before using any of the app's features.</p>

          <div>
            <div className="signin-grid ">
              <label>Email </label>
              <input
                type="text"
                placeholder="me@mail.com"
                name="email"
                required
                value={em}
                onChange={(e) => setEmail(e.target.value)}
              ></input>
            </div>
            <br></br>
            <div className="signin-grid">
              <label>Password </label>
              <input
                type="text"
                placeholder="password"
                name="password"
                required
                value={ps}
                onChange={(e) => setPasssword(e.target.value)}
              ></input>
            </div>
          </div>
          <br></br>
          <button onClick={() => submit()}>Login</button>

          <br></br>
          <br></br>
          <p>Don't have an account?</p>
          <br></br>
          <button onClick={() => changeRegLog()}>Register</button>
          <p>{error}</p>
          <br></br>
          <br></br>
        </>
      );
    } else {
      return (
        <>
          <h1>Register</h1>

          <div>
            <div className="signin-grid">
              <label>Email </label>
              <input
                type="text"
                placeholder="me@mail.com"
                name="email"
                required
                value={em}
                onChange={(e) => setEmail(e.target.value)}
              ></input>
            </div>
            <br></br>
            <div className="signin-grid">
              <label>Username</label>
              <input
                type="text"
                placeholder="JohnSmithy1"
                name="username"
                required
                value={us}
                onChange={(e) => setUsername(e.target.value)}
              ></input>
            </div>
            <br></br>
            <div className="signin-grid">
              <label>Password </label>
              <input
                type="text"
                placeholder="password"
                name="password"
                required
                value={ps}
                onChange={(e) => setPasssword(e.target.value)}
              ></input>
            </div>
            <br></br>
            <div className="signin-grid">
              <label>Confirm Password </label>
              <input
                type="text"
                placeholder="password"
                name="password"
                required
                value={cnps}
                onChange={(e) => setConfirmpassword(e.target.value)}
              ></input>
            </div>
          </div>
          <br></br>
          <button onClick={() => submit()}>Register</button>

          <br></br>
          <br></br>
          <p>Already have an account?</p>
          <br></br>
          <button onClick={() => changeRegLog()}>Log in</button>
          <p>{error}</p>
        </>
      );
    }
  } else {
    return (
      <>
        <p>You are already logged in as</p>
        <p>{user.email}</p>
      </>
    );
  }
}

export default LoginForm;
