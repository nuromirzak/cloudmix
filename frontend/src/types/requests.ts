import {z} from "zod";

export const LoginRequestSchema = z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
});
export type LoginRequest = z.infer<typeof LoginRequestSchema>;

export const RegistrationRequestSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters long"),
    password: z.string()
        // .regex(/[A-Za-z]/, "Password must contain at least one letter")
        // .regex(/[0-9]/, "Password must contain at least one digit")
        .min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string(),
}).refine((data) => {
    return data.password === data.confirmPassword;
}, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});
export type RegistrationRequest = z.infer<typeof RegistrationRequestSchema>;
