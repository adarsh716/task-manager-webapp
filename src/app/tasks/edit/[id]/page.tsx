"use client";
// const taskId = window.location.pathname.split('/').pop();
import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  TextField,
  Grid,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Typography,
  Box,
  SelectChangeEvent,
} from "@mui/material";
import { keyframes } from "@mui/system";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

interface TaskData {
  title: string;
  description: string;
  priority: string;
  dueDate: string;
}

const EditTask = () => {
  const router = useRouter();
  const [taskData, setTaskData] = useState<TaskData>({
    title: "",
    description: "",
    priority: "",
    dueDate: "",
  });
  console.log(taskData);
  const pathname = usePathname();
  const taskId = pathname?.split("/").pop();

  console.log("Current taskId:", taskId);

  useEffect(() => {
    if (!taskId) {
      console.log("No taskId available");
      return;
    }

    const fetchTask = async () => {
      console.log("Starting fetch for taskId:", taskId);
      const response = await fetch(`/api/tasks/update/task?id=${taskId}`);
      const data = await response.json();
      console.log("Response data:", data);
    };

    fetchTask();
  }, [taskId]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!taskId) return;
    const fetchTask = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/tasks/update/task?id=${taskId}`);
        if (!response.ok) throw new Error("Failed to fetch task data");
        const data = await response.json();
        console.log(data);
        setTaskData({
          ...data.task,
          dueDate: data.task.dueDate ? data.task.dueDate.split("T")[0] : "",
        });
      } catch (error) {
        setError("Error loading task data");
        console.error("Error fetching task:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [taskId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>|React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>|SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setTaskData((prev) => ({ ...prev, [name]: value }));
  };
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskId) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/tasks/update/task?id=${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      });
      if (!response.ok) throw new Error("Failed to update task");
      const updatedTask = await response.json();
      console.log("Task Updated:", updatedTask);
      router.push("/tasks/view");
    } catch (error) {
      setError("Error updating task");
      console.error("Error updating task:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(45deg, #1a1a1a 30%, #2d2d2d 90%)",
      }}
    >
      <Typography
        variant="h3"
        sx={{
          textAlign: "start",
          fontWeight: "700",
          mb: 3,
          background: "linear-gradient(45deg, #ffffff, #e0e0e0)", // White gradient
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Task Manager
      </Typography>

      <Box
        sx={{
          mt: 4,
          width: "100%",
          maxWidth: "800px",
          p: 4,
          borderRadius: "16px",
          background: "linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
          animation: `${fadeIn} 0.6s ease-out`,
        }}
      >
        <Grid
          container
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 2 }}
        >
          <Grid item>
            <Typography
              variant="h4"
              gutterBottom
              sx={{
                fontWeight: "700",
                background: "linear-gradient(45deg, #000000, #434343)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Edit Task
            </Typography>
          </Grid>

          <Grid item>
            <Button
              variant="contained"
              sx={{
                py: 1.5,
                px: 4,
                borderRadius: "8px",
                background: "linear-gradient(45deg, #000000 30%, #434343 90%)",
                color: "white",
                transition: "0.3s",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 16px rgba(0, 0, 0, 0.2)",
                  background:
                    "linear-gradient(45deg, #434343 30%, #000000 90%)",
                },
                "&:active": {
                  transform: "scale(0.98)",
                },
              }}
              onClick={() => router.push("/tasks/view")}
            >
              View Tasks
            </Button>
          </Grid>
        </Grid>

        {loading ? (
          <Typography variant="body1" align="center">
            Loading task data...
          </Typography>
        ) : error ? (
          <Typography variant="body1" color="error" align="center">
            {error}
          </Typography>
        ) : (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="Task Title"
                  variant="outlined"
                  fullWidth
                  name="title"
                  value={taskData.title}
                  onChange={handleInputChange}
                  required
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      "& fieldset": { borderColor: "#ddd" },
                      "&:hover fieldset": { borderColor: "#000" },
                      "&.Mui-focused fieldset": { borderColor: "#000" },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={4}
                  name="description"
                  value={taskData.description}
                  onChange={handleInputChange}
                  required
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      "& textarea": { color: "#333" },
                      "& fieldset": { borderColor: "#ddd" },
                      "&:hover fieldset": { borderColor: "#000" },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl
                  fullWidth
                  sx={{
                    "& .MuiInputLabel-root": { color: "#666" },
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      "& fieldset": { borderColor: "#ddd" },
                      "&:hover fieldset": { borderColor: "#000" },
                    },
                  }}
                >
                  <InputLabel>Priority</InputLabel>
                  <Select
                    label="Priority"
                    name="priority"
                    value={taskData.priority}
                    onChange={handleInputChange}
                    required
                  >
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Due Date"
                  type="date"
                  variant="outlined"
                  fullWidth
                  name="dueDate"
                  value={taskData.dueDate}
                  onChange={handleInputChange}
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      "& fieldset": { borderColor: "#ddd" },
                      "&:hover fieldset": { borderColor: "#000" },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{
                    py: 2,
                    borderRadius: "8px",
                    background:
                      "linear-gradient(45deg, #000000 30%, #434343 90%)",
                    color: "white",
                    transition: "0.3s",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 6px 16px rgba(0, 0, 0, 0.2)",
                      background:
                        "linear-gradient(45deg, #434343 30%, #000000 90%)",
                    },
                    "&:active": {
                      transform: "scale(0.98)",
                    },
                  }}
                >
                  Save Changes
                </Button>
              </Grid>
            </Grid>
          </form>
        )}
      </Box>
    </Box>
  );
};

export default EditTask;
