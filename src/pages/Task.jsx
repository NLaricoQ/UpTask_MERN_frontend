import { formatDate } from "../helpers/formatDate";
import useAdmin from "../hooks/useAdmin";
import useProjects from "../hooks/useProjects";

const Task = ({ task }) => {
  const { handleModalEditTask, handleModalDeleteTask, completeTask } =
    useProjects();
  const { description, name, priority, deadline, state, _id } = task;
  const admin = useAdmin();
  return (
    <div className="border-b p-5 flex justify-between items-center">
      <div className="flex flex-col items-start">
        <p className="mb-1 text-xl uppercase">{name}</p>
        <p className="mb-1 text-sm text-gray-500 ">{description}</p>
        <p className="mb-1 text-sm">{formatDate(deadline)}</p>
        <p className="mb-1 text-xl text-gray-600">Priority: {priority}</p>
        {state && (
          <p className="text-xs bg-green-600 uppercase p-1 rounded-lg text-white">
            Completed by: {task.completed.name}
          </p>
        )}
      </div>
      <div className="flex gap-2 flex-col lg:flex-row">
        {admin && (
          <button
            onClick={() => handleModalEditTask(task)}
            className="bg-indigo-600 px-4 py-3 font-bold rounded-lg text-sm uppercase"
          >
            Edit
          </button>
        )}

        <button
          onClick={() => completeTask(_id)}
          className={`${
            state ? "bg-sky-600" : "bg-gray-600"
          } px-4 py-3 font-bold rounded-lg text-sm uppercase text-white`}
        >
          {state ? "Complete" : "Incomplete"}
        </button>

        {admin && (
          <button
            onClick={() => handleModalDeleteTask(task)}
            className="bg-red-600 px-4 py-3 font-bold rounded-lg text-sm uppercase"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default Task;
