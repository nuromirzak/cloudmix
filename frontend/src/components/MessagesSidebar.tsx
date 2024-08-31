import {format, isToday} from "date-fns";
import {SubBar} from "./SubBar.tsx";
import {useChatStore} from "../store/chatStore.ts";
import {useAuthStore} from "../store/authStore.ts";
import {clsx} from "clsx";

const formatMessageTime = (date: Date) => {
    if (isToday(date)) {
        return format(date, "HH:mm");
    }
    return format(date, "MMM d");
};

interface MessagesSidebarProps {
    onChatSelect: () => void;
}

export function MessagesSidebar({onChatSelect}: MessagesSidebarProps) {
    const {user} = useAuthStore();
    const {
        chats,
        activeChatId,
        setActiveChatId,
    } = useChatStore();

    const handleChatClick = (chatId: string) => {
        if (activeChatId === chatId) {
            setActiveChatId(null);
        } else {
            setActiveChatId(chatId);
            onChatSelect();
        }
    };

    return (
        <div className="w-full bg-gray-50 flex flex-col h-full">
            <SubBar>
                <h2 className="text-xl font-semibold">Messages</h2>
            </SubBar>
            <div className="flex-1 overflow-y-auto">
                {[...chats].sort((a, b) => {
                    const latestMessageA = a.messages.at(-1);
                    const latestMessageB = b.messages.at(-1);
                    if (!latestMessageA) {
                        return 1;
                    }
                    if (!latestMessageB) {
                        return -1;
                    }
                    return latestMessageB.sentAt - latestMessageA.sentAt;
                }).map((chat) => {
                    const chatId = chat.id;
                    const sender = chat.participants.find((participant) => {
                        return participant.id !== user?.id;
                    })?.username;
                    const latestMessage = chat.messages.at(-1);
                    const isActive = activeChatId === chatId;
                    return (

                        <div
                            key={chatId}
                            className={clsx(
                                "p-4 border-b border-purple-200 cursor-pointer transition-colors duration-150",
                                isActive ? "bg-purple-200 hover:bg-purple-300" : "hover:bg-purple-100",
                            )}
                            onClick={() => {
                                return handleChatClick(chatId);
                            }}>
                            <div className="grid grid-cols-[1fr,auto] grid-rows-[auto,auto] gap-1">
                                <span className={clsx(
                                    "font-bold",
                                    isActive ? "text-purple-900" : "text-purple-800",
                                )}>
                                    {sender}
                                </span>
                                {!latestMessage ? (
                                    <span
                                        className="bg-purple-600 text-white text-xs font-bold rounded-full px-2 py-1 justify-self-end">
                                        New
                                    </span>
                                ) : (
                                    <span className="text-xs text-purple-700 font-medium justify-self-end">
                                        {formatMessageTime(new Date(latestMessage.sentAt))}
                                    </span>
                                )}
                                <p className={clsx(
                                    "text-sm truncate col-span-2",
                                    isActive ? "text-purple-900" : "text-purple-700",
                                )}>
                                    {latestMessage?.content || "Start a new conversation"}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
