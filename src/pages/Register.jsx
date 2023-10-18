import { useState } from "react";
import { Link } from "react-router-dom";
import Alert from "../components/Alert";
import axiosClient from "../config/axiosClient";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [alert, setAlert] = useState("");

  const handlesubmit = async (e) => {
    e.preventDefault();
    if ([name, email, password, repeatPassword].includes("")) {
      setAlert({
        msg: "All fields are required",
        error: true,
      });
      return;
    }
    if (password !== repeatPassword) {
      setAlert({
        msg: "Passwords are not the same",
        error: true,
      });
    }
    if (password.length < 6) {
      setAlert({
        msg: "Password is too short, must be at least 6 letters",
        error: true,
      });
    }
    setAlert({});
    //* Creating user
    try {
      const { data } = await axiosClient.post(`/users`, {
        name,
        password,
        email,
      });
      setAlert({
        msg: data.msg,
        error: false,
      });
      setName("");
      setEmail("");
      setPassword("");
      setRepeatPassword("");
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
      <h1 className="text-sky-600 font-black text-5xl capitalize text-center">
        Register and Manage your{" "}
        <span className="text-slate-700">projects</span>
      </h1>
      {msg && <Alert alert={alert} />}

      <form
        onSubmit={handlesubmit}
        className="my-10 bg-white shadow rounded-lg p-10"
      >
        <div className="my-5">
          <label
            className="uppercase text-gray-600 block text-xl font-bold"
            htmlFor="name"
          >
            Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            id="name"
            type="text"
            placeholder="Your name"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
          />
        </div>
        <div className="my-5">
          <label
            className="uppercase text-gray-600 block text-xl font-bold"
            htmlFor="email"
          >
            Email
          </label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            id="email"
            type="email"
            placeholder="Register email"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
          />
        </div>
        <div className="my-5">
          <label
            className="uppercase text-gray-600 block text-xl font-bold"
            htmlFor="password"
          >
            password
          </label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            id="password"
            type="password"
            placeholder="Register password"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
          />
        </div>
        <div className="my-5">
          <label
            className="uppercase text-gray-600 block text-xl font-bold"
            htmlFor="password2"
          >
            Repeat password
          </label>
          <input
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
            id="password2"
            type="password"
            placeholder="Repeat password"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
          />
        </div>
        <input
          type="submit"
          value="Register"
          className="bg-sky-700 mb-5 w-full py-3 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors"
        />
      </form>

      <nav className="lg:flex lg:justify-between">
        <Link
          to="/"
          className="block text-center my-5 text-slate-500 uppercase text-sm"
        >
          ¿Already have an account? Login{" "}
        </Link>
        <Link
          to="/forgot-password"
          className="block text-center my-5 text-slate-500 uppercase text-sm"
        >
          Forgot my password{" "}
        </Link>
      </nav>
    </>
  );
};

export default Register;
