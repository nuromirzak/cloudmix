import {z} from "zod";
import {ChatResponseSchema, MessageResponseSchema, StatusSchema} from "./responses.ts";

export const ErrorMessageSchema = z.object({
    type: z.literal("ERROR"),
    error: z.string(),
});
export type ErrorMessage = z.infer<typeof ErrorMessageSchema>;

export const AllStatusesMessageSchema = z.object({
    type: z.literal("ALL_STATUSES"),
    statuses: z.record(z.string(), StatusSchema),
});
export type AllStatusesMessage = z.infer<typeof AllStatusesMessageSchema>;

export const NewMessageMessageSchema = z.object({
    type: z.literal("NEW_MESSAGE"),
    chatId: z.string(),
    message: MessageResponseSchema,
});
export type NewMessageMessage = z.infer<typeof NewMessageMessageSchema>;

export const AllChatsMessageSchema = z.object({
    type: z.literal("ALL_CHATS"),
    chats: z.array(ChatResponseSchema),
});
export type AllChatsMessage = z.infer<typeof AllChatsMessageSchema>;

export const ServerMessageWithoutErrorSchema = z.union([
    AllStatusesMessageSchema, NewMessageMessageSchema, AllChatsMessageSchema,
]);
export type ServerMessageWithoutError = z.infer<typeof ServerMessageWithoutErrorSchema>;

export const ServerMessageSchema = z.union([
    ServerMessageWithoutErrorSchema, ErrorMessageSchema,
]);
export type ServerMessage = z.infer<typeof ServerMessageSchema>;
