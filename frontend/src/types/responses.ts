import {z} from "zod";

export const CustomErrorResponseSchema = z.object({
    title: z.string(),
    detail: z.string(),
});
export type CustomErrorResponse = z.infer<typeof CustomErrorResponseSchema>;

export const RoleSchema = z.enum(["USER", "BOT"]);
export type Role = z.infer<typeof RoleSchema>;

export const UserResponseSchema = z.object({
    id: z.string(),
    username: z.string(),
    role: RoleSchema,
});
export type UserResponse = z.infer<typeof UserResponseSchema>;

export const StatusSchema = z.object({
    online: z.boolean(),
    chatId: z.string().nullable(),
});
export type Status = z.infer<typeof StatusSchema>;

export const MessageResponseSchema = z.object({
    id: z.string(),
    content: z.string(),
    sentAt: z.number(),
    senderId: z.string(),
});
export type MessageResponse = z.infer<typeof MessageResponseSchema>;

export const ChatResponseSchema = z.object({
    id: z.string(),
    participants: z.array(UserResponseSchema),
    messages: z.array(MessageResponseSchema),
});
export type ChatResponse = z.infer<typeof ChatResponseSchema>;
