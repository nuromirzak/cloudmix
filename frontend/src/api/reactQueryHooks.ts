import {authService} from "./authService.ts";
import {useMutation} from "@tanstack/react-query";

export const useLogin = () => {
    return useMutation({
        mutationFn: authService.login,
    });
};

export const useRegister = () => {
    return useMutation({
        mutationFn: authService.register,
    });
};
