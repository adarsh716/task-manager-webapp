"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import axios from "axios";
import { TaskType } from "@/types";

interface TaskContextType {
  tasks: TaskType[];
  fetchTasks: (id:string) => void;
  updateTask: (id: string, updatedData: Partial<TaskType>) => void;
  deleteTask: (id: string) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<TaskType[]>([]);

  const fetchTasks = async (id:string) => {
    if (!id) {
      console.error("User ID is missing");
      return;
    }
  
    try {
      const response = await axios.post("/api/tasks/fetch", { userId: id });
      console.log(response);
      if (response.status === 200) {
        setTasks(response.data.tasks); 
        console.log("Fetched tasks:", response.data.tasks);
      } else {
        console.error("Failed to fetch tasks:", response.data);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };
  

  const updateTask = async (id: string, updatedData: Partial<TaskType>) => {
    try {
      await axios.put(`/api/tasks/update/${id}`, updatedData);
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === id ? { ...task, ...updatedData } : task
        )
      );
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await axios.delete(`/api/tasks/delete/${id}`);
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <TaskContext.Provider value={{ tasks, fetchTasks, updateTask, deleteTask }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error("useTasks must be used within a TaskProvider");
  return context;
};
