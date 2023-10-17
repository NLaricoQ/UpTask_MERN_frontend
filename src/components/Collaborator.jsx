import useProjects from "../hooks/useProjects";

const Collaborator = ({ collaborator }) => {
  const { name, email } = collaborator;
  const { handleModalDeleteCollaborator } = useProjects();
  return (
    <div className="border-b p-5 flex justify-between items-center">
      <div>
        <p>{name}</p>
        <p className="text-gray-700">{email}</p>
      </div>
      <div>
        <button
          onClick={() => {
            handleModalDeleteCollaborator(collaborator);
          }}
          type="button"
          className="bg-red-600 px-4 py-4 text-white uppercase font-bold text-sm rounded-lg"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default Collaborator;
