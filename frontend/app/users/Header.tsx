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
    Tabs,
    Text,
    UnstyledButton,
    useMantineTheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import classes from './Header.module.css';
import { useAuth } from '~/auth/AuthProvider';


export function Header() {
    const { user, logout } = useAuth();
    const theme = useMantineTheme();
    const [opened, { toggle, close }] = useDisclosure(false);
    const [userMenuOpened, setUserMenuOpened] = useState(false);
    return (
        <div className={classes.header}>
            <Container className={classes.mainSection} size="xl" w="100%">
                <Group justify="space-between" w="100%">
                    <Text size="xl" fw={700} className={classes.logo}>
                        UMS
                    </Text>

                    <Burger
                        opened={opened}
                        onClick={toggle}
                        hiddenFrom="xs"
                        size="sm"
                        aria-label="Toggle navigation"
                    />
                    {logout && <Button variant="light" color="red" onClick={logout}>
                        Logout
                    </Button>}

                </Group>
            </Container>

        </div>
    );
}