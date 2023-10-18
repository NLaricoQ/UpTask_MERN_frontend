import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Alert from "../components/Alert";
import axiosClient from "../config/axiosClient";
const ConfirmAccount = () => {
  const [alert, setAlert] = useState("");
  const [confirmedAccount, setConfirmedAccount] = useState(false);
  const params = useParams();
  const { id } = params;
  useEffect(() => {
    const confirmAcc = async () => {
      try {
        const url = `/users/confirm/${id}`;
        const { data } = await axiosClient(url);
        setAlert({
          msg: data.msg,
          error: false,
        });
        setConfirmedAccount(true);
      } catch (error) {
        setAlert({
          msg: error.response.data.msg,
          error: true,
        });
      }
    };
    confirmAcc();
  }, []);
  const { msg } = alert;
  return (
    <>
      <h1 className="text-sky-600 font-black text-6xl capitalize">
        Confirm your account and start create your{" "}
        <span className="text-slate-700">projects</span>
      </h1>
      <div className="mt-20 md:mt-10 shadow-lg px-5 py-10 rounded-xl bg-white">
        {msg && <Alert alert={alert} />}
        {confirmedAccount && (
          <Link
            to="/"
            className="block text-center my-5 text-slate-500 uppercase text-sm"
          >
            Login{" "}
          </Link>
        )}
      </div>
    </>
  );
};

export default ConfirmAccount;
