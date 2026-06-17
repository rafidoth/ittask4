import {
  Anchor,
  Box,
  Button,
  Center,
  Checkbox,
  Container,
  Group,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useMutation } from "@tanstack/react-query";
import { AxiosError, isAxiosError } from "axios";
import { useState } from "react";
import classes from "./login.module.css";
import bg from "./background.module.css";
import { useViewportSize } from "@mantine/hooks";
import { Link, useNavigate } from "react-router";
import { login as loginRequest } from "~/api";
import { useAuth } from "~/auth/AuthProvider";
import type { UserLoginResponse } from "~/types";

export default function Login() {
  const { height, width } = useViewportSize();
  const navigate = useNavigate();
  const { login: setAuthUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = useMutation({
    mutationFn: loginRequest,
    onSuccess: (response) => {
      const userData = response.data as UserLoginResponse;
      const organizationAffiliation =
        userData.organization_Affiliation ?? userData.organization_Affiliation;

      setAuthUser({
        id: userData.userId,
        name: userData.name,
        email: userData.email,
        organization_Affiliation: organizationAffiliation ?? "",
      });

      navigate("/");
    },
  });

  const handleSubmit = (event: any) => {
    event.preventDefault();
    loginMutation.mutate({
      email: email.trim(),
      password,
    });
  };

  const loginErrorMessage =
    loginMutation.error instanceof AxiosError
      ? typeof loginMutation.error.response?.data === "string"
        ? loginMutation.error.response.data
        : loginMutation.error.message
      : "";

  const isSubmitDisabled =
    loginMutation.isPending ||
    email.trim().length === 0 ||
    password.length === 0;

  return (
    <Center w={width} h={height} className={bg.background}>
      <Container size={420} my={40}>
        <Title ta="center" className={classes.title}>
          Welcome back!
        </Title>

        <Text className={classes.subtitle}>
          Do not have an account yet?{" "}
          <Box component="span" c="blue.6" fw={500}>
            <Link to="/register">Create account</Link>
          </Box>
        </Text>

        <Paper
          component="form"

          p={22}
          mt={30}
          radius="md"
          onSubmit={handleSubmit}
          bg={"none"}
        >
          <TextInput
            variant={"filled"}
            label="Email"
            placeholder="you@mail.com"
            required
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
          <Group justify="space-between" mt="lg">
          </Group>
          {loginErrorMessage && (
            <Text mt="md" c="red" size="sm">
              {loginErrorMessage}
            </Text>
          )}
          <Button
            fullWidth
            mt="xl"
            radius="md"
            type="submit"
            disabled={isSubmitDisabled}
            loading={loginMutation.isPending}
          >
            Sign in
          </Button>
        </Paper>
      </Container>
    </Center>
  );
}
