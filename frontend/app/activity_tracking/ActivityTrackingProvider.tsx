import { useMutation, useQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { pushActive } from "~/api";
import { useAuth } from "~/auth/AuthProvider";

export default function ActivityTrackingProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    useQuery({
        queryKey: ['periodicActivePush', user?.id],
        queryFn: () => pushActive(user?.id),
        enabled: !!user?.id,
        refetchInterval: 1 * 60 * 1000,
        refetchIntervalInBackground: false,
        refetchOnWindowFocus: false,
        retry: false,
    });
    return <>{children}</>
}