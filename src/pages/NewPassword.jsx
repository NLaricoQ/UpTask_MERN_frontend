import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Alert from "../components/Alert";
import axiosClient from "../config/axiosClient";

const NewPassword = () => {
  const [isvalidToken, setIsValidToken] = useState(false);
  const [alert, setAlert] = useState("");
  const [password, setPassword] = useState("");
  const [isChangedPassword, setIsChangedPassword] = useState(false);
  const params = useParams();
  const { token } = params;
  useEffect(() => {
    const checkToken = async () => {
      try {
        await axiosClient(`/users/forgot-password/${token}`);
        setIsValidToken(true);
      } catch (error) {
        setAlert({
          msg: error.response.data.msg,
          error: true,
        });
      }
    };
    checkToken();
  }, []);
  const handlesubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setAlert({
        msg: "Password must be at least 6 characters",
        error: true,
      });
      return;
    }
    try {
      const url = `/users/forgot-password/${token}`;
      const { data } = await axiosClient.post(url, { password });
      setAlert({
        msg: data.msg,
        error: false,
      });
      setIsChangedPassword(true);
      setPassword("");
    } catch (error) {
      setAlert({
        msg: error.response.data.msg,
        error: true,
      });
    }
  };
  const { msg } = alert;

  return (
    <>
      <h1 className="text-sky-600 font-black text-6xl capitalize">
        Reset yor password and dont lose access to your{" "}
        <span className="text-slate-700">projects</span>
      </h1>
      {msg && <Alert alert={alert} />}
      {isvalidToken && (
        <form
          className="my-10 bg-white shadow rounded-lg p-10"
          onSubmit={handlesubmit}
        >
          <div className="my-5">
            <label
              className="uppercase text-gray-600 block text-xl font-bold"
              htmlFor="password"
            >
              new password
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              id="password"
              type="password"
              placeholder="Write here your new password"
              className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
            />
          </div>

          <input
            type="submit"
            value="Save New Password"
            className="bg-sky-700 mb-5 w-full py-3 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors"
          />
        </form>
      )}
      {isChangedPassword && (
        <Link
          to="/"
          className="block text-center my-5 text-slate-500 uppercase text-sm"
        >
          Login{" "}
        </Link>
      )}
    </>
  );
};

export default NewPassword;
