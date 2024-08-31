import {z} from "zod";

export const UserSchema = z.object({
    id: z.string(),
    username: z.string(),
    password: z.string(),
});
export type User = z.infer<typeof UserSchema>;

export interface IAlertInfo {
    error: boolean;
    title: string;
    detail: string;
}
