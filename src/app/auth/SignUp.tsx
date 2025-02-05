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
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { SignUpFormInputs } from "@/types";

const schema = yup.object().shape({
  fullName: yup.string().required("Full Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormInputs>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: SignUpFormInputs) => {
    try {
      const response = await axios.post("/api/register", data);

      console.log("Registered Data:", response.data);

      router.push("/login");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Login Error:", error.response?.data || error.message);
      } else {
        console.error("Unexpected Error:", error);
      }
    }
  };

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
          width: { xs: "90%", sm: 500 },
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
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ display: "flex", flexDirection: "column" }}
          >
            <TextField
              label="Full Name"
              {...register("fullName")}
              error={!!errors.fullName}
              helperText={errors.fullName?.message}
              fullWidth
              required
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <TextField
              label="Email Address"
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
              fullWidth
              required
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
              fullWidth
              required
              variant="outlined"
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              sx={{
                mt: 3,
                padding: "10px 0",
                fontSize: { xs: "14px", sm: "16px" },
                backgroundColor: "#000",
                color: "#fff",
                borderRadius: "30px",
                "&:hover": { backgroundColor: "#333" },
              }}
            >
              Register
            </Button>
          </Box>

          <Box mt={4} textAlign="center">
            <Typography
              variant="body2"
              sx={{ color: "#555", fontSize: { xs: "0.9rem", sm: "1rem" } }}
            >
              Already have an account?{" "}
              <Link
                href="/login"
                underline="none"
                sx={{ color: "#000", fontWeight: "bold" }}
              >
                Login
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default Register;
