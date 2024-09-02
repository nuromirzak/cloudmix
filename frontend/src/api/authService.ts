import {LoginRequest, RegistrationRequest, UserResponse, UserResponseSchema} from "../types";
import {api} from "./apiConfig";

type RegistrationRequestWithoutConfirmPassword = Omit<RegistrationRequest, "confirmPassword">;

export interface AuthServiceInterface {
    login: (loginRequest: LoginRequest) => Promise<UserResponse>;
    register: (registerRequest: RegistrationRequestWithoutConfirmPassword) => Promise<unknown>;
}

export const authService: AuthServiceInterface = {
    login: async (loginRequest: LoginRequest) => {
        const response = await api.post("/auth/login", loginRequest);
        return UserResponseSchema.parse(response.data);
    },
    register: async (registerRequest: RegistrationRequestWithoutConfirmPassword) => {
        await api.post("/auth/register", registerRequest);
    },
};
