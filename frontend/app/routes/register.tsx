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
import classes from "./login.module.css";
import { useViewportSize } from "@mantine/hooks";
import { Link } from "react-router";

export default function Register() {
  const { height, width } = useViewportSize();

  return (
    <Center w={width} h={height}>
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
          withBorder
          shadow="sm"
          p={22}
          mt={30}
          radius="md"
        >
          <TextInput
            label="Full Name"
            placeholder="John Doe"
            required
            radius="md"
          />
          <TextInput
            label="Email"
            placeholder="you@mail.com"
            required
            mt="md"
            radius="md"
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            mt="md"
            radius="md"
          />
          <PasswordInput
            label="Confirm Password"
            placeholder="Confirm your password"
            required
            mt="md"
            radius="md"
          />
          <TextInput
            label="Organizational Affiliation"
            placeholder="Your organization"
            mt="md"
            radius="md"
          />
          <Button fullWidth mt="xl" radius="md">
            Register
          </Button>
        </Paper>
      </Container>
    </Center>
  );
}
