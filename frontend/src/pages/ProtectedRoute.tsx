import {ReactNode} from "react";
import {Navigate, useLocation} from "react-router-dom";
import {useAuthStore} from "../store/authStore.ts";

interface ProtectedRouteProps {
    children: ReactNode;
}

export function ProtectedRoute({children}: ProtectedRouteProps) {
    const user = useAuthStore((state) => {
        return state.user;
    });
    const location = useLocation();
    const from = location.pathname;

    if (!user) {
        return <Navigate to="/login" state={{from}} replace/>;
    }

    return children;
}
