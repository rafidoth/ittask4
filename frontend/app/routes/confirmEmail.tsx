import { Anchor, Center, Divider, Paper, Stack, Text, ThemeIcon, Title } from "@mantine/core";
import classes from "./background.module.css"
import { useViewportSize } from "@mantine/hooks";
import { IconMailCheck } from "@tabler/icons-react";

export default function ConfirmEmail() {
    const { height, width } = useViewportSize();
    return <Center w={width} h={height} className={classes.background}>
        <Paper p="xl" radius="lg" shadow="xl" maw={480} w="100%">
            <Stack align="center" gap="md">
                <ThemeIcon size="xl" radius="xl" color="green">
                    <IconMailCheck size={32} />
                </ThemeIcon>
                <Title order={2} ta="center">Check your inbox</Title>
                <Text c="dimmed" ta="center" size="md">
                    We've sent a verification link to your email address.
                    <br />
                    Click the link to activate your account.
                </Text>
                <Divider />
                <Text size="sm" c="dimmed" ta="center">
                    Didn't receive the email? Check your spam folder.
                </Text>
                <Text size="xl"><Anchor href={"/login"}>Login</Anchor></Text>
            </Stack>
        </Paper>
    </Center>
}