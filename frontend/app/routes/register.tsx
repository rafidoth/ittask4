import {
  Anchor,
  Box,
  Button,
  Center,
  Container,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import { Link, useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { AxiosError, isAxiosError } from "axios";
import { useState } from "react";
import classes from "./background.module.css";
import { register as registerRequest } from "~/api";
import { useAuth } from "~/auth/AuthProvider";
import type { UserRegisterResponse } from "~/types";
import { notifications } from "@mantine/notifications";

export default function Register() {
  const { height, width } = useViewportSize();
  const navigate = useNavigate();
  const { login: setAuthUser } = useAuth();

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [organization, setOrganization] = useState<string>("");

  const registerMutation = useMutation({
    mutationFn: registerRequest,
    onSuccess: (response) => {
      const res = response.data as UserRegisterResponse;
      if (res.success) {
        notifications.show({
          title: "Success",
          message: "Welcome, your registration is successful. Please confirm your email. Thank you!",
          color: "green",
        });
      }

      navigate("/confirm");
    },
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      return;
    }

    registerMutation.mutate({
      name: name.trim(),
      email: email.trim(),
      password,
      confirmPassword,
      organization_Affiliation: organization.trim() || undefined,
    });
  };

  const registerErrorMessage =
    registerMutation.error instanceof AxiosError
      ? typeof registerMutation.error.response?.data === "string"
        ? registerMutation.error.response.data
        : registerMutation.error.message
      : "";

  const passwordMismatch: boolean = !!password && !!confirmPassword && password !== confirmPassword;

  const isSubmitDisabled =
    registerMutation.isPending ||
    name.trim().length === 0 ||
    email.trim().length === 0 ||
    password.length === 0 ||
    confirmPassword.length === 0 ||
    passwordMismatch;

  return (
    <Center w={width} h={height} className={classes.background}>
      <Container size={420} my={40}>
        <Title ta="center" className={classes.title}>
          Create your account
        </Title>

        <Text ta="center" className={classes.subtitle}>
          Already have an account?{" "}
          <Box component="span" c="blue.6" fw={500}>
            <Link to="/login">Sign in</Link>
          </Box>
        </Text>

        <Paper
          component="form"
          p={22}
          mt={30}
          radius="md"
          bg={"none"}
          onSubmit={handleSubmit}
        >
          <TextInput
            variant={"filled"}
            label="Full Name"
            placeholder="John Doe"
            required
            radius="md"
            value={name}
            onChange={(event) => setName(event.currentTarget.value)}
          />
          <TextInput
            variant={"filled"}
            label="Email"
            placeholder="you@mail.com"
            required
            mt="md"
            radius="md"
            value={email}
            onChange={(event) => setEmail(event.currentTarget.value)}
          />
          <PasswordInput
            variant={"filled"}
            label="Password"
            placeholder="Your password"
            required
            mt="md"
            radius="md"
            value={password}
            onChange={(event) => setPassword(event.currentTarget.value)}
          />
          <PasswordInput
            variant={"filled"}
            label="Confirm Password"
            placeholder="Confirm your password"
            required
            mt="md"
            radius="md"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.currentTarget.value)}
            error={passwordMismatch ? "Passwords do not match" : false}
          />
          <TextInput
            variant={"filled"}
            label="Organizational Affiliation"
            placeholder="Your organization"
            mt="md"
            radius="md"
            value={organization}
            onChange={(event) => setOrganization(event.currentTarget.value)}
          />
          {registerErrorMessage && (
            <Text mt="md" c="red" size="sm">
              {registerErrorMessage}
            </Text>
          )}
          <Button
            fullWidth
            mt="xl"
            radius="md"
            type="submit"
            disabled={isSubmitDisabled}
            loading={registerMutation.isPending}
          >
            Register
          </Button>
        </Paper>
      </Container>
    </Center>
  );
}
