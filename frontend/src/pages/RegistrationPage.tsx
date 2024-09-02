import React from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useSnackbar} from "notistack";
import {useRegister} from "../api/reactQueryHooks";
import {processError} from "../utils/utils.ts";
import {RegistrationRequest, RegistrationRequestSchema} from "../types";
import {AuthFormContainer, AuthHeader, AuthLink, AuthSubmitButton} from "../components/SharedAuthComponents";
import {Input} from "../components/Input.tsx";
import {useNavigate} from "react-router-dom";

export const RegistrationPage: React.FC = () => {
    const {enqueueSnackbar} = useSnackbar();
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<RegistrationRequest>({
        resolver: zodResolver(RegistrationRequestSchema),
        mode: "all",
    });
    const navigate = useNavigate();
    const registerMutation = useRegister();

    const onSubmit = async (data: RegistrationRequest) => {
        try {
            await registerMutation.mutateAsync({
                password: data.password,
                username: data.username,
            });
            enqueueSnackbar("Registration successful", {variant: "success"});
            navigate("/login");
        } catch (error) {
            const processedError = processError(error);
            enqueueSnackbar(processedError.detail, {variant: "error"});
        }
    };

    return (
        <AuthFormContainer onSubmit={handleSubmit(onSubmit)}>
            <AuthHeader title="Create a new account"/>
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
                isPassword
            />
            <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                {...register("confirmPassword")}
                error={errors.confirmPassword?.message}
                isPassword
            />
            <AuthSubmitButton label="Sign up"/>
            <AuthLink
                text="Already have an account?"
                linkText="Sign in"
                to="/login"
            />
        </AuthFormContainer>
    );
};
