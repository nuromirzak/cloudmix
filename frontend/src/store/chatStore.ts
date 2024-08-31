import {ChatResponseSchema, ServerMessageWithoutErrorSchema, StatusSchema} from "../types";
import {z} from "zod";
import {create} from "zustand";
import {persist} from "zustand/middleware";
import {immer} from "zustand/middleware/immer";

const ChatStateSchema = z.object({
    chats: z.array(ChatResponseSchema),
    statuses: z.record(z.string(), StatusSchema),
    activeChatId: z.string().nullable(),
});
type ChatState = z.infer<typeof ChatStateSchema>;

type ChatActions = {
    setActiveChatId: (chatId: string | null) => void;
    handleServerMessage: (message: z.infer<typeof ServerMessageWithoutErrorSchema>) => void;
}

export const useChatStore = create<ChatState & ChatActions>()(
    persist(
        immer((set) => {
            return {
                chats: [],
                statuses: {},
                activeChatId: null,
                setActiveChatId: (chatId) => {
                    set((state) => {
                        state.activeChatId = chatId;
                    });
                },
                handleServerMessage: (message) => {
                    set((state) => {
                        if (message.type === "ALL_CHATS") {
                            state.chats = message.chats;
                        } else if (message.type === "ALL_STATUSES") {
                            state.statuses = message.statuses;
                        } else if (message.type === "NEW_MESSAGE") {
                            const newMessage = message.message;
                            const chat = state.chats.find((chat) => {
                                return chat.id === message.chatId;
                            });
                            if (chat) {
                                chat.messages.push(newMessage);
                            }
                        } else {
                            console.error("Invalid message received", message);
                        }
                    });
                },
            };
        }),
        {
            name: "chat",
        },
    ),
);
