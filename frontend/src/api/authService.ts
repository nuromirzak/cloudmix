import {LoginRequest, RegistrationRequest, UserResponse, UserResponseSchema} from "../types";
import {api} from "./apiConfig";

export interface AuthServiceInterface {
    login: (loginRequest: LoginRequest) => Promise<UserResponse>;
    register: (registerRequest: RegistrationRequest) => Promise<unknown>;
}

export const authService: AuthServiceInterface = {
    login: async (loginRequest: LoginRequest) => {
        const response = await api.post("/auth/login", loginRequest);
        return UserResponseSchema.parse(response.data);
    },
    register: async (registerRequest: RegistrationRequest) => {
        await api.post("/auth/register", registerRequest);
    },
};
