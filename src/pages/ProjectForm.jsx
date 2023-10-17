import { useState, useEffect } from "react";
import useProjects from "../hooks/useProjects";
import Alert from "../components/Alert";
import { useParams } from "react-router-dom";

const ProjectForm = () => {
  const [id, setId] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [customer, setCustomer] = useState("");

  const params = useParams();
  const { showAlert, alert, submitProject, project } = useProjects();
  useEffect(() => {
    if (params.id) {
      setId(project._id);
      setName(project.name);
      setDeadline(project.deadline?.split("T")[0]);
      setDescription(project.description);
      setCustomer(project.customer);
    }
  }, [params]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if ([name, deadline, description, customer].includes("")) {
      showAlert({
        msg: "All fields required",
        error: true,
      });
      return;
    }
    // Send data to provider
    await submitProject({ id, name, deadline, description, customer });
    setId(null);
    setCustomer("");
    setDeadline("");
    setName("");
    setDescription("");
  };
  const { msg } = alert;

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white py-10 px-5 md:w-1/2 rounded-lg shadow"
    >
      {msg && <Alert alert={alert} />}
      <div className="mb-5">
        <label
          className="text-gray-700 uppercase font-bold text-sm"
          htmlFor="name"
        >
          Name Project
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          id="name"
          type="text"
          className="border w-full p-2 mt-2 placeholder-gray-400 rounder-md"
          placeholder="Name of Project"
        />
      </div>
      <div className="mb-5">
        <label
          className="text-gray-700 uppercase font-bold text-sm"
          htmlFor="description"
        >
          Desctiption
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          id="description"
          className="border w-full p-2 mt-2 placeholder-gray-400 rounder-md"
          placeholder="Description of Project"
        />
      </div>
      <div className="mb-5">
        <label
          className="text-gray-700 uppercase font-bold text-sm"
          htmlFor="deadline"
        >
          Deadline
        </label>
        <input
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          id="deadline"
          type="date"
          className="border w-full p-2 mt-2 placeholder-gray-400 rounder-md"
        />
      </div>
      <div className="mb-5">
        <label
          className="text-gray-700 uppercase font-bold text-sm"
          htmlFor="customer"
        >
          Customer
        </label>
        <input
          value={customer}
          onChange={(e) => setCustomer(e.target.value)}
          id="customer"
          type="text"
          className="border w-full p-2 mt-2 placeholder-gray-400 rounder-md"
          placeholder="Name of the customer"
        />
      </div>
      <input
        type="submit"
        value={id ? "Update Project" : "Create Project"}
        className="bg-sky-600 w-full p-3 uppercase text-white font-bold rounded cursor-pointer hover:bg-sky-700 transition-colors"
      />
    </form>
  );
};

export default ProjectForm;
