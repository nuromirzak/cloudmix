import React from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useSnackbar} from "notistack";
import {useLogin} from "../api/reactQueryHooks";
import {useAuthStore} from "../store/authStore";
import {processError} from "../utils/utils.ts";
import {LoginRequest, LoginRequestSchema} from "../types";
import {AuthFormContainer, AuthHeader, AuthLink, AuthSubmitButton} from "../components/SharedAuthComponents";
import {Input} from "../components/Input.tsx";
import {useNavigate} from "react-router-dom";

export const LoginPage: React.FC = () => {
    const setUser = useAuthStore((state) => {
        return state.setUser;
    });
    const {enqueueSnackbar} = useSnackbar();
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<LoginRequest>({
        resolver: zodResolver(LoginRequestSchema),
        mode: "all",
    });
    const navigate = useNavigate();
    const login = useLogin();

    const onSubmit = async (data: LoginRequest) => {
        try {
            const response = await login.mutateAsync(data);
            enqueueSnackbar("Login successful", {variant: "success"});
            setUser({...response, password: data.password});
            navigate("/");
        } catch (error) {
            const processedError = processError(error);
            enqueueSnackbar(processedError.detail, {variant: "error"});
        }
    };

    return (
        <AuthFormContainer onSubmit={handleSubmit(onSubmit)}>
            <AuthHeader title="Sign in to your account"/>
            <Input
                id="username"
                type="text"
                placeholder="Username"
                {...register("username")}
                error={errors.username?.message}
            />
            <Input
                id="password"
                type="password"
                placeholder="Password"
                {...register("password")}
                error={errors.password?.message}
                isPassword={true}
            />
            <AuthSubmitButton label="Sign in"/>
            <AuthLink
                text="Don't have an account yet?"
                linkText="Sign up"
                to="/register"
            />
        </AuthFormContainer>
    );
};
