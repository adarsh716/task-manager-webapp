"use client";
import React, { useState, useEffect } from "react";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Typography,
  Box,
  IconButton,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import Link from "next/link";
import { useTasks } from "@/context/TaskContext";
import { useAuth } from "@/context/AuthContext";

const TaskList = () => {
  const { tasks, fetchTasks } = useTasks();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { user} = useAuth();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    if(user?.id){
      fetchTasks(user?.id);
    }
  }, [user]);

  const handleChangePage = (e: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };
  

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteClick = (taskId: string) => {
    setSelectedTaskId(taskId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedTaskId) {
      try {
        const response = await fetch(
          `/api/tasks/delete/task?id=${selectedTaskId}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          setDeleteDialogOpen(false);
          if(user?.id){
            fetchTasks(user?.id);
          }
        } else {
          console.error("Failed to delete task");
        }
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks/complete/task?id=${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isComplete: true }),
      });

      if (response.ok) {
        if(user?.id){
          fetchTasks(user?.id);
        }
      }
    } catch (error) {
      console.error("Error completing task:", error);
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
      <Box sx={{
        display:"flex",
        justifyContent:"center",
        width:"70%"
      }}>
        <Typography
          variant="h3"
          sx={{
            textAlign: "center",
            fontWeight: "700",
            mb: 3,
            background: "linear-gradient(45deg, #ffffff, #e0e0e0)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Task Manager
        </Typography>
        {/* <Typography
          variant="h3"
          onClick={()=>logout()}
          sx={{
            textAlign: "center",
            fontWeight: "700",
            cursor:"pointer",
            mb: 3,
            background: "linear-gradient(45deg, #ffffff, #e0e0e0)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Logout
        </Typography> */}
      </Box>

      <Container maxWidth="lg">
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h5" fontWeight="bold">
              All Tasks
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              component={Link}
              href="/tasks/create"
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
            >
              Add Task
            </Button>
          </Box>

          {tasks.length === 0 ? (
            <Typography
              variant="h6"
              color="textSecondary"
              sx={{ mt: 3, textAlign: "center" }}
            >
              No tasks present.
            </Typography>
          ) : (
            <>
              <TableContainer component={Paper} sx={{ mt: 3 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Title</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Due Date</TableCell>
                      <TableCell>Priority</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tasks
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((task,index:number) => (
                        <TableRow key={index}>
                          <TableCell>{task.title}</TableCell>
                          <TableCell>{task.description}</TableCell>
                          <TableCell>{task.dueDate.toLocaleDateString()}</TableCell>
                          <TableCell>{task.priority}</TableCell>
                          <TableCell>
                            {task.isComplete ? "Completed" : "Pending"}
                          </TableCell>
                          <TableCell align="center">
                            <Link href={`/tasks/edit/${task._id}`} passHref>
                              <IconButton
                                aria-label="edit"
                                sx={{
                                  background:
                                    "linear-gradient(45deg, #000000 30%, #434343 90%)",
                                  color: "white",
                                  "&:hover": {
                                    background:
                                      "linear-gradient(45deg, #434343 30%, #000000 90%)",
                                  },
                                  mr: 1,
                                }}
                              >
                                <EditIcon />
                              </IconButton>
                            </Link>
                            <IconButton
                              aria-label="complete"
                              onClick={() => handleCompleteTask(task._id!)}
                              disabled={task.isComplete}
                              sx={{
                                background: task.isComplete
                                  ? "#ccc"
                                  : "linear-gradient(45deg, #4CAF50 30%, #45a049 90%)",
                                color: "white",
                                "&:hover": {
                                  background: task.isComplete
                                    ? "#ccc"
                                    : "linear-gradient(45deg, #45a049 30%, #4CAF50 90%)",
                                },
                                mr: 1,
                              }}
                            >
                              <CheckCircleIcon />
                            </IconButton>
                            <IconButton
                              aria-label="delete"
                              onClick={() => handleDeleteClick(task._id!)}
                              sx={{
                                background:
                                  "linear-gradient(45deg, #ff0000 30%, #cc0000 90%)",
                                color: "white",
                                "&:hover": {
                                  background:
                                    "linear-gradient(45deg, #cc0000 30%, #ff0000 90%)",
                                },
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={tasks.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </>
          )}
        </Paper>
      </Container>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Task</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this task?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TaskList;
