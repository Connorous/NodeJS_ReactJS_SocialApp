import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function Logout({ setToken, setUser }) {
  const navigate = useNavigate();
  useEffect(() => {
    setToken(null);
    setUser(null);
    navigate("/login");
  }, []);
}

export default Logout;
