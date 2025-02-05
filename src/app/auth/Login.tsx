"use client";

import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Link,
  IconButton,
  InputAdornment, 
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { LoginFormInputs } from "@/types"; 


const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});


const Login = () => {
  const { setUser } = useAuth();

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({
    resolver: yupResolver(loginSchema),
  });

  const router = useRouter();

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const response = await axios.post("/api/login", data);
      const { user, token } = response.data;
      setUser(user, token);

      console.log("Login Data:", response.data);

      router.push("/tasks/view");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Login Error:", error.response?.data || error.message);
      } else {
        console.error("Unexpected Error:", error);
      }
    }
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #000000, #333333)",
        padding: { xs: 2, sm: 3 },
      }}
    >
      <Card
        sx={{
          width: { xs: "90%", sm: 450 },
          padding: { xs: 2, sm: 3 },
          borderRadius: "16px",
          backgroundColor: "#ffffff",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
        }}
      >
        <CardContent>
          <Typography
            variant="h3"
            gutterBottom
            align="center"
            sx={{
              fontWeight: "bold",
              fontSize: { xs: "1.8rem", sm: "2.5rem" },
              background: "linear-gradient(45deg, #000000, #434343)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Task Manager
          </Typography>

          <Typography
            variant="body1"
            align="center"
            gutterBottom
            sx={{
              color: "#333",
              mb: { xs: 3, sm: 4 },
              fontSize: { xs: "1rem", sm: "1.2rem" },
            }}
          >
            Login to track or report lost items!
          </Typography>

          {/* Form */}
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{
              "& .MuiTextField-root": { marginBottom: 2 },
              display: "flex",
              flexDirection: "column",
            }}
          >
            <TextField
              label="Email Address"
              type="email"
              variant="outlined"
              fullWidth
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
              sx={{
                borderRadius: "8px",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  backgroundColor: "#f0f0f0",
                },
                "& .MuiInputLabel-root": {
                  color: "#555",
                },
                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                  {
                    borderColor: "#000",
                  },
              }}
            />

            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              fullWidth
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
              sx={{
                borderRadius: "8px",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  backgroundColor: "#f0f0f0",
                },
                "& .MuiInputLabel-root": {
                  color: "#555",
                },
                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                  {
                    borderColor: "#000",
                  },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowPassword}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Submit Button */}
            <Button
              variant="contained"
              size="large"
              fullWidth
              type="submit"
              disabled={isSubmitting}
              sx={{
                mt: 3,
                padding: "10px 0",
                fontSize: { xs: "14px", sm: "16px" },
                backgroundColor: "#000",
                color: "#fff",
                borderRadius: "30px",
                "&:hover": {
                  backgroundColor: "#333",
                },
              }}
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>
          </Box>

          {/* Register Link */}
          <Box mt={4} textAlign="center">
            <Typography
              variant="body2"
              sx={{ color: "#555", fontSize: { xs: "0.9rem", sm: "1rem" } }}
            >
              New to Lost & Found?{" "}
              <Link
                href="/register"
                underline="none"
                sx={{ color: "#000", fontWeight: "bold" }}
              >
                Register
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default Login;
