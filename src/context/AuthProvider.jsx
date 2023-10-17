import { useState, useEffect, createContext } from "react";
import axiosClient from "../config/AxiosClient";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const authUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }
      const config = {
        headers: {
          "Content-Type": "aplication/json",
          Authorization: `Bearer ${token}`,
        },
      };
      try {
        const { data } = await axiosClient("/users/profile", config);
        setAuth(data);
      } catch (error) {
        setAuth({});
      }
      setLoading(false);
    };
    authUser();
  }, []);
  const logoutAuth = () => {
    setAuth({});
  };

  return (
    <AuthContext.Provider
      value={{
        setAuth,
        auth,
        loading,
        logoutAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider };

export default AuthContext;
