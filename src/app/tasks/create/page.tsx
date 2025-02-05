"use client";

import React from "react";
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
} from "@mui/material";
import { keyframes } from "@mui/system";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { TaskType } from "@/types";
import { useRouter } from "next/navigation";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const taskSchema = yup.object().shape({
  title: yup
    .string()
    .required("Title is required")
    .max(50, "Title cannot exceed 50 characters"),
  description: yup
    .string()
    .max(200, "Description cannot exceed 200 characters"),
  priority: yup.string().required("Priority is required"),
  dueDate: yup.date().required().typeError("Invalid date"),
});

const CreateTask = () => {
  const { user } = useAuth();
  const router = useRouter();

  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<TaskType>({
    resolver: yupResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "",
      dueDate: new Date(),
    },
  });

  const onSubmit = async (data: TaskType) => {
    try {
      console.log(data);
      const response = await axios.post("/api/tasks/create", {
        ...data,
        userId: user?.id,
      });

      console.log("Task Created:", response.data);
      reset();
    } catch (err) {
      console.error("Error creating task:", err);
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
        padding: 0,
      }}
    >
      <Typography
        variant="h3"
        sx={{
          fontWeight: "700",
          mb: 3,
          background: "linear-gradient(45deg, #ffffff, #e0e0e0)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Task Manager
      </Typography>
      <Box
        sx={{
          width: "90%",
          maxWidth: "800px",
          p: 4,
          borderRadius: "16px",
          background: "linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
          animation: `${fadeIn} 0.6s ease-out`,
        }}
      >
        
        <Grid container alignItems="center" justifyContent="space-between" sx={{mb:2}}>
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
              Create New Task
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
                  background: "linear-gradient(45deg, #434343 30%, #000000 90%)",
                },
                "&:active": {
                  transform: "scale(0.98)",
                },
              }}
              onClick={()=> router.push('/tasks/view')}
            >
              View Tasks
            </Button>
          </Grid>
        </Grid>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            {/* Title Field */}
            <Grid item xs={12}>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Task Title"
                    variant="outlined"
                    fullWidth
                    error={!!errors.title}
                    helperText={errors.title?.message}
                    inputProps={{ maxLength: 50 }}
                  />
                )}
              />
            </Grid>

            {/* Description Field */}
            <Grid item xs={12}>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Description"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                    inputProps={{ maxLength: 200 }}
                  />
                )}
              />
            </Grid>

            {/* Priority Field */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.priority}>
                <InputLabel>Priority</InputLabel>
                <Controller
                  name="priority"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} label="Priority">
                      <MenuItem value="low">Low</MenuItem>
                      <MenuItem value="medium">Medium</MenuItem>
                      <MenuItem value="high">High</MenuItem>
                    </Select>
                  )}
                />
                <Typography variant="caption" color="error">
                  {errors.priority?.message}
                </Typography>
              </FormControl>
            </Grid>

            {/* Due Date Field */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="dueDate"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Due Date"
                    type="date"
                    variant="outlined"
                    fullWidth
                    error={!!errors.dueDate}
                    helperText={errors.dueDate?.message}
                    InputLabelProps={{ shrink: true }}
                  />
                )}
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
                Create Task
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Box>
  );
};

export default CreateTask;
