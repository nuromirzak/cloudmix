import React from "react";
import {CloudIcon} from "@heroicons/react/24/solid";
import {useAuthStore} from "../store/authStore.ts";
import {useSnackbar} from "notistack";

export const Navbar: React.FC = () => {
    const {user, logout} = useAuthStore();
    const {enqueueSnackbar} = useSnackbar();

    const handleLogout = () => {
        logout();
        enqueueSnackbar("Logged out successfully.", {variant: "success"});
    };

    return (
        <nav className="bg-white border-b border-gray-200 px-4 py-2 flex justify-between items-center"
             data-testid="navbar">
            <div className="flex items-center">
                <CloudIcon className="h-8 w-8 text-purple-500"/>
                <span className="ml-2 text-xl font-semibold">CloudMix</span>
            </div>
            <div className="flex flex-col gap-1 items-end">
                <span className="font-semibold">{user?.username}</span>
                <button className="text-sm text-gray-500 hover:text-gray-700" onClick={handleLogout}>Logout</button>
            </div>
        </nav>
    );
};
