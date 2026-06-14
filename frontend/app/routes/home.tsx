import { useAuth } from "~/auth/AuthProvider";
import type { Route } from "./+types/home";
import { UsersTable } from "~/users/UsersTable";
import { useNavigate } from "react-router"
import { useEffect } from "react";
import { Header } from "~/users/Header";
import { Loader, Stack } from '@mantine/core';
export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Task 4" },
    { name: "description", content: "A simple web app for Task 4 under Itransition Internship." },
  ];
}

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return <Stack align="center" justify="center" style={{ height: "100vh" }}>
      <Loader size="md" variant="dots" />
    </Stack>;
  }

  if (!isAuthenticated) return null;
  return <>
    <Header />
    <UsersTable />
  </>;;
}
