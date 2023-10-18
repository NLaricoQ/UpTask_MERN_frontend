import { useParams, Link } from "react-router-dom";
import useProjects from "../hooks/useProjects";
import { useEffect } from "react";
import ModalFormTask from "../components/ModalFormTask";
import Task from "./Task";
import ModalDeleteTask from "../components/ModalDeleteTask";

import Collaborator from "../components/Collaborator";
import ModalDeleteCollaborator from "../components/ModalDeleteColalborator";
import useAdmin from "../hooks/useAdmin";
import io from "socket.io-client";

let socket;

const Project = () => {
  const {
    getProject,
    project,
    isLoading,
    handleModalTask,
    submitTaskProject,
    deleteTaskProject,
    updateTaskProject,
    changeStateTask,
  } = useProjects();
  const params = useParams();
  const admin = useAdmin();

  useEffect(() => {
    getProject(params.id);
  }, []);
  useEffect(() => {
    socket = io(import.meta.env.VITE_BACKEND_URL);
    socket.emit("Open Project", params.id);
  }, []);
  useEffect(() => {
    socket.on("Added Task", (newTask) => {
      if (newTask.project === project._id) {
        submitTaskProject(newTask);
      }
    });
    socket.on("Deleted Task", (deletedTask) => {
      if (deletedTask.project === project._id) {
        deleteTaskProject(deletedTask);
      }
    });
    socket.on("Updated Task", (updatedTask) => {
      if (updatedTask.project._id === project._id) {
        updateTaskProject(updatedTask);
      }
    });
    socket.on("New State", (newStateTask) => {
      if (newStateTask.project._id === project._id) {
        changeStateTask(newStateTask);
      }
    });
  });

  const { name } = project;

  if (isLoading) return "...";

  return (
    <>
      <div className="flex justify-between">
        <h1 className="font-black text-4xl">{name}</h1>
        {admin && (
          <div className="text-gray-400 hover:text-black">
            <Link
              to={`/projects/edit/${params.id}`}
              className="uppercasse font-bold"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                />
              </svg>
            </Link>
          </div>
        )}
      </div>
      {admin && (
        <button
          onClick={handleModalTask}
          type="button"
          className="flex gap-2 justify-center items-center text-sm px-5 py-3 w-fulll md:w-auto rounded-lg uppercase font-bold bg-sky-400 text-white text-center mt-5"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path
              fillRule="evenodd"
              d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z"
              clipRule="evenodd"
            />
          </svg>
          New Task
        </button>
      )}
      <p className="font-bold text-xl mt-10 uppercase">Tasks of this Project</p>

      <div className="bg-white shadow mt-10 rounded-lg">
        {project.tasks?.length ? (
          project.tasks?.map((task) => <Task key={task._id} task={task} />)
        ) : (
          <p className="text-center my-5 p-10 ">No Tasks in this project</p>
        )}
      </div>
      {admin && (
        <>
          <div className="flex items-center justify-between mt-10">
            <p className="font-bold text-xl uppercase">Collaborators</p>
            <Link
              className="text-gray-400 font-bold hover:text-black"
              to={`/projects/new-collaborator/${project._id}`}
            >
              Add
            </Link>
          </div>
          <div className="bg-white shadow mt-10 rounded-lg">
            {project.collaborators?.length ? (
              project.collaborators?.map((collaborator) => (
                <Collaborator
                  key={collaborator._id}
                  collaborator={collaborator}
                />
              ))
            ) : (
              <p className="text-center my-5 p-10 ">
                No collaborators in this project
              </p>
            )}
          </div>
        </>
      )}

      <ModalFormTask />
      <ModalDeleteTask />
      <ModalDeleteCollaborator />
    </>
  );
};

export default Project;
