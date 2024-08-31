import {z} from "zod";

export const AuthMessageSchema = z.object({
    type: z.literal("AUTH"),
    basicAuth: z.string(),
});
export type AuthMessage = z.infer<typeof AuthMessageSchema>;

export const SendMessageMessageSchema = z.object({
    type: z.literal("SEND_MESSAGE"),
    chatId: z.string(),
    content: z.string(),
});
export type SendMessageMessage = z.infer<typeof SendMessageMessageSchema>;

export const TypingStatusMessageSchema = z.object({
    type: z.literal("TYPING_STATUS"),
    chatId: z.string().nullable(),
});
export type TypingStatusMessage = z.infer<typeof TypingStatusMessageSchema>;

export const ClientMessageSchema = z.union([
    AuthMessageSchema, TypingStatusMessageSchema, SendMessageMessageSchema,
]);
export type ClientMessage = z.infer<typeof ClientMessageSchema>;
