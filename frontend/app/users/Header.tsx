import { useState } from 'react';
import {
    IconChevronDown,
    IconHeart,
    IconLogout,
    IconMessage,
    IconPlayerPause,
    IconSettings,
    IconStar,
    IconSwitchHorizontal,
    IconTrash,
} from '@tabler/icons-react';
import cx from 'clsx';
import {
    Avatar,
    Burger,
    Button,
    Container,
    Divider,
    Drawer,
    Group,
    Menu,
    ScrollArea,
    Stack,
    Tabs,
    Text,
    UnstyledButton,
    useMantineTheme,
} from '@mantine/core';
import classes from './Header.module.css';
import { useAuth } from '~/auth/AuthProvider';


export function Header() {
    const { user, logout } = useAuth();
    return (
        <div className={classes.header}>
            <Container className={classes.mainSection} size="xl" w="100%">
                <Group justify="space-between" w="100%">
                    <Stack>
                        <Text size="xl" fw={700} className={classes.logo}>
                            {user?.name}
                        </Text>
                    </Stack>
                    {logout && <Button variant="light" color="red" onClick={logout}>
                        Logout
                    </Button>}
                </Group>
            </Container>

        </div>
    );
}