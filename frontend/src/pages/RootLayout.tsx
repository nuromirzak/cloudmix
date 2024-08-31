import {Outlet} from "react-router-dom";
import {useAuthStore} from "../store/authStore.ts";

export function RootLayout() {
    const user = useAuthStore((state) => {
        return state.user;
    });

    if (user === null) {
        throw new Error(
            "User is unavailable. RootLayout requires an authenticated user.",
        );
    }

    return (
        <Outlet/>
    );
}
