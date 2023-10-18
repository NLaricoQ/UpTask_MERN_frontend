import { useState, useEffect, createContext } from "react";
import axiosClient from "../config/axiosClient";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import useAuth from "../hooks/useAuth";

let socket;
const ProjectsContext = createContext();

const ProjectsProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [alert, setAlert] = useState({});
  const [project, setProject] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [modalFormTask, setModalFormTask] = useState(false);
  const [task, setTask] = useState({});
  const [modalDeleteTask, setModalDeleteTask] = useState(false);
  const [collaborator, setCollaborator] = useState({});
  const [modalDeleteCollaborator, setmodalDeleteCollaborator] = useState(false);
  const [searcher, setSearcher] = useState(false);
  const navigate = useNavigate();
  const { auth } = useAuth();
  useEffect(() => {
    const getProjects = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
        const { data } = await axiosClient("/projects", config);
        setProjects(data);
      } catch (error) {
        console.log(error);
      }
    };
    getProjects();
  }, [auth]);
  useEffect(() => {
    socket = io(import.meta.env.VITE_BACKEND_URL);
  }, []);
  const showAlert = (alert) => {
    setAlert(alert);
    setTimeout(() => {
      setAlert("");
    }, 5000);
  };
  const submitProject = async (project) => {
    if (project.id) {
      await editProject(project);
    } else {
      await newProject(project);
    }
    return;
  };
  const editProject = async (project) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axiosClient.put(
        `/projects/${project.id}`,
        project,
        config
      );
      //SYNC STATUS
      const updatedProjects = projects.map((projectState) =>
        projectState._id === data._id ? data : projectState
      );
      setProjects(updatedProjects);
      setAlert({
        msg: "Project Updated Successfully",
        error: false,
      });
      setTimeout(() => {
        setAlert({});
        navigate("/projects");
      }, 3000);
    } catch (error) {
      console.log(error);
    }
  };
  const newProject = async (project) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axiosClient.post("/projects", project, config);
      setProjects([...projects, data]);
      setAlert({
        msg: "Project created successfully",
        error: false,
      });
      setTimeout(() => {
        setAlert({});
        navigate("/projects");
      }, 3000);
    } catch (error) {
      console.log(error);
    }
  };
  const getProject = async (id) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axiosClient(`/projects/${id}`, config);
      setProject(data);
      setAlert({});
    } catch (error) {
      navigate("/projects");
      setAlert({
        msg: error.response.data.msg,
        error: true,
      });
      setTimeout(() => {
        setAlert({});
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };
  const deleteProject = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axiosClient.delete(`/projects/${id}`, config);
      setAlert({
        msg: data.msg,
        error: false,
      });

      //SYNC STATE
      const updatedProjects = projects.filter(
        (projectState) => projectState._id !== id
      );
      setProjects(updatedProjects);
      setTimeout(() => {
        setAlert({});
        navigate("/projects");
      }, 3000);
    } catch (error) {
      console.log(error);
    }
  };
  const handleModalTask = () => {
    setModalFormTask(!modalFormTask);
    setTask({});
  };
  const submitTask = async (task) => {
    if (task?.id) {
      await editTask(task);
    } else {
      delete task.id;
      await createTask(task);
    }
  };
  const createTask = async (task) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axiosClient.post("/tasks", task, config);
      //* ADD TASK TO STATE

      setAlert({});
      setModalFormTask(false);

      //SOCKET IO
      socket.emit("New Task", data);
    } catch (error) {
      console.log(error);
    }
  };

  const editTask = async (task) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axiosClient.put(`/tasks/${task.id}`, task, config);

      setAlert({});
      setModalFormTask(false);

      //SOCKET
      socket.emit("Edit Task", data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleModalEditTask = (task) => {
    setTask(task);
    setModalFormTask(true);
  };

  const handleModalDeleteTask = (task) => {
    setTask(task);
    setModalDeleteTask(!modalDeleteTask);
  };
  const deleteTask = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axiosClient.delete(`/tasks/${task._id}`, config);
      setAlert({
        msg: data.msg,
        error: false,
      });

      setModalDeleteTask(false);

      //SOCKET
      socket.emit("Delete Task", task);
      setTask({});
      setTimeout(() => {
        setAlert({});
      }, 3000);
    } catch (error) {
      console.log(error);
    }
  };

  const submitCollaborator = async (email) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axiosClient.post(
        "/projects/collaborators",
        { email },
        config
      );
      setCollaborator(data);
      setAlert({});
    } catch (error) {
      setAlert({
        msg: error.response.data.msg,
        error: true,
      });
    } finally {
      setIsLoading(false);
    }
  };
  const addCollaborator = async (email) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axiosClient.post(
        `/projects/collaborators/${project._id}`,
        email,
        config
      );
      setAlert({
        msg: data.msg,
        error: false,
      });
      setCollaborator({});
      setTimeout(() => {
        setAlert({});
      }, 3000);
    } catch (error) {
      setAlert({
        msg: error.response.data.msg,
        error: true,
      });
    }
  };
  const handleModalDeleteCollaborator = (collaborator) => {
    setmodalDeleteCollaborator(!modalDeleteCollaborator);
    setCollaborator(collaborator);
  };
  const deleteCollaborator = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axiosClient.post(
        `/projects/delete-collaborator/${project._id}`,
        { id: collaborator._id },
        config
      );
      const updatedProject = { ...project };
      updatedProject.collaborators = updatedProject.collaborators.filter(
        (colaboratorState) => colaboratorState._id !== collaborator._id
      );
      setProject(updatedProject);
      setAlert({
        msg: data.msg,
        error: false,
      });
      setCollaborator({});
      setmodalDeleteCollaborator(false);
      setTimeout(() => {
        setAlert({});
      }, 3000);
    } catch (error) {
      console.log(error.response);
    }
  };
  const completeTask = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axiosClient.post(`/tasks/state/${id}`, {}, config);

      // SOCKET
      socket.emit("Change State", data);
      setTask({});
      setAlert({});
    } catch (error) {
      console.log(error.response);
    }
  };
  const handleSearch = () => {
    setSearcher(!searcher);
  };
  //SOCKET IO
  const submitTaskProject = (task) => {
    const updatedProject = { ...project };
    updatedProject.tasks = [...updatedProject.tasks, task];
    setProject(updatedProject);
  };
  const deleteTaskProject = (task) => {
    const projectUpdated = { ...project };
    projectUpdated.tasks = projectUpdated.tasks.filter(
      (taskState) => taskState._id !== task._id
    );
    setProject(projectUpdated);
  };
  const updateTaskProject = (task) => {
    const projectUpdated = { ...project };
    projectUpdated.tasks = projectUpdated.tasks.map((taskState) =>
      taskState._id === task._id ? task : taskState
    );
    setProject(projectUpdated);
  };
  const changeStateTask = (task) => {
    const updatedProject = { ...project };
    updatedProject.tasks = updatedProject.tasks.map((taskState) =>
      taskState._id === task._id ? task : taskState
    );
    setProject(updatedProject);
  };
  const logoutProjects = () => {
    setProjects([]);
    setProject({});
    setAlert({});
  };
  return (
    <ProjectsContext.Provider
      value={{
        projects,
        showAlert,
        alert,
        submitProject,
        getProject,
        project,
        isLoading,
        deleteProject,
        handleModalTask,
        modalFormTask,
        submitTask,
        handleModalEditTask,
        task,
        modalDeleteTask,
        handleModalDeleteTask,
        deleteTask,
        submitCollaborator,
        collaborator,
        addCollaborator,
        handleModalDeleteCollaborator,
        modalDeleteCollaborator,
        deleteCollaborator,
        completeTask,
        searcher,
        handleSearch,
        submitTaskProject,
        deleteTaskProject,
        updateTaskProject,
        changeStateTask,
        logoutProjects,
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
};
export { ProjectsProvider };
export default ProjectsContext;
