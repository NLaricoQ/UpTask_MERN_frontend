import Alert from "../components/Alert";
import useProjects from "../hooks/useProjects";
import PreviewProject from "./PreviewProject";

const Projects = () => {
  const { projects, alert } = useProjects();

  const { msg } = alert;
  return (
    <>
      <h1 className="text-4xl font-black"> Projects</h1>
      {msg && <Alert alert={alert} />}
      <div className="bg-white shadow mt-10 rounded-lg">
        {projects.length ? (
          projects.map((project) => (
            <PreviewProject key={project._id} project={project} />
          ))
        ) : (
          <p className="text-gray-600 uppercase text-center p-5">
            There are not projects yet
          </p>
        )}
      </div>
    </>
  );
};

export default Projects;
