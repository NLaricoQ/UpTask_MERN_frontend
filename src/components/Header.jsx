import { Link } from "react-router-dom";
import useProjects from "../hooks/useProjects";
import Search from "./Search";
import useAuth from "../hooks/useAuth";

const Header = () => {
  const { handleSearch, logoutProjects } = useProjects();
  const { logoutAuth } = useAuth();

  const handleLogout = () => {
    logoutAuth(), logoutProjects();
    localStorage.removeItem("token");
  };

  return (
    <header className="px-4 py-5 bg-white border-b">
      <div className="md:flex md:justify-between">
        <Link
          to="/projects"
          className="text-4xl text-sky-600 font-black text-center mb-5 md:mb-0"
        >
          UpTask
        </Link>

        <div className="flex flex-col md:flex-row items-center gap-4">
          <button
            type="button"
            className="font-bold uppercase"
            onClick={handleSearch}
          >
            Search Project
          </button>
          <Link to="/projects" className="font-bold uppercase">
            Projects
          </Link>
          <button
            onClick={handleLogout}
            type="button"
            className="text-white text-sm bg-sky-600 p-3 rounded-md uppercase font-bold"
          >
            Logout
          </button>
          <Search />
        </div>
      </div>
    </header>
  );
};

export default Header;
