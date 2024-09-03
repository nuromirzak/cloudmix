import {CpuChipIcon, PaperAirplaneIcon} from "@heroicons/react/24/solid";
import {format, isToday, isYesterday} from "date-fns";
import {SubBar} from "./SubBar.tsx";
import {useForm} from "react-hook-form";
import {useChatStore} from "../store/chatStore.ts";
import {useAuthStore} from "../store/authStore.ts";
import {WebSocketHook} from "../hooks/useWebSocket.tsx";
import {clsx} from "clsx";
import {useEffect, useMemo, useRef} from "react";
import {ArrowLeftIcon} from "@heroicons/react/16/solid";
import {UserAvatar} from "./UserAvatar.tsx";

const formatMessageDate = (date: Date) => {
    if (isToday(date)) {
        return "Today";
    }
    if (isYesterday(date)) {
        return "Yesterday";
    }
    return format(date, "MMMM d");
};

interface FormInputs {
    message: string | undefined;
}

interface ChatComponentProps {
    sendMessage: WebSocketHook["sendMessage"];
    onBackClick: () => void;
}

export function ChatComponent({sendMessage, onBackClick}: ChatComponentProps) {
    const {
        user,
    } = useAuthStore((state) => {
        return {
            user: state.user,
        };
    });
    const {
        chats,
        statuses,
        activeChatId,
    } = useChatStore((state) => {
        return {
            chats: state.chats,
            statuses: state.statuses,
            activeChatId: state.activeChatId,
        };
    });
    const {register, handleSubmit, reset} = useForm<FormInputs>();

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const currentChat = useMemo(() => {
        return activeChatId ? chats.find((chat) => {
            return chat.id === activeChatId;
        }) : null;
    }, [activeChatId, chats]);
    const currentMessages = useMemo(() => {
        return currentChat ? currentChat.messages : [];
    }, [currentChat]);
    const sender = useMemo(() => {
        return currentChat ? currentChat.participants.find((participant) => {
            return participant.id !== user?.id;
        }) : null;
    }, [currentChat, user]);
    const currentStatus = sender ? statuses[sender.id] : null;

    useEffect(() => {
            messagesEndRef.current?.scrollIntoView({behavior: "instant"});
    }, [currentMessages]);

    const groupedMessages = currentMessages.reduce((groups, message) => {
        const date = formatMessageDate(new Date(message.sentAt));
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(message);
        return groups;
    }, {} as Record<string, typeof currentMessages>);

    const onSubmit = (data: FormInputs) => {
        console.log(data);
        if (!activeChatId || !data.message) {
            return;
        }
        sendMessage({
            type: "SEND_MESSAGE",
            chatId: activeChatId,
            content: data.message,
        });
        reset();
    };

    const handleFocus = () => {
        if (!activeChatId) {
            return;
        }
        sendMessage({
            type: "TYPING_STATUS",
            chatId: activeChatId,
        });
    };

    const handleBlur = () => {
        if (!activeChatId) {
            return;
        }
        sendMessage({
            type: "TYPING_STATUS",
            chatId: null,
        });
    };

    return (
        <div className="flex flex-col h-full bg-gray-100">
            <SubBar>
                <div className="flex items-center space-x-3">
                    <button
                        onClick={onBackClick}
                        className="md:hidden text-purple-600 hover:text-purple-800 transition-colors duration-200"
                        aria-label="Back"
                    >
                        <ArrowLeftIcon className="h-6 w-6"/>
                    </button>
                    {sender && <UserAvatar user={sender}/>}
                    <div>
                        <h2 className="text-lg font-semibold">
                            {sender ? sender.username : "Select a chat"}
                        </h2>
                        <div className={clsx(
                            "text-sm",
                            currentStatus?.chatId ? "text-green-500" : currentStatus ? "text-blue-500" : "text-gray-500",
                        )}>
                            {sender?.role === "BOT" && (
                                <div
                                    className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
                                    <CpuChipIcon className="w-3 h-3 mr-1"/>
                                    Bot
                                </div>
                            )}
                            {sender?.role !== "BOT" && currentChat ? (currentStatus ? (currentStatus.chatId ? "Typing..." : "Online") : "Offline") : ""}
                        </div>
                    </div>
                </div>
            </SubBar>
            <div
                ref={scrollContainerRef}
                className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-2 sm:space-y-4 scrollbar-hide"
            >
                {Object.entries(groupedMessages).map(([date, messages]) => {
                    return (
                        <div key={date}>
                            <div className="flex items-center my-4">
                                <div className="flex-grow border-t border-gray-300"></div>
                                <span className="flex-shrink mx-4 text-sm text-gray-500">{date}</span>
                                <div className="flex-grow border-t border-gray-300"></div>
                            </div>
                            {messages.map((message) => {
                                const isSelf = message.senderId === user?.id;
                                return (
                                    <div key={message.id}
                                         className={clsx("flex mb-2", isSelf ? "justify-end" : "justify-start")}>
                                        <div className={clsx(
                                            "max-w-[80%] rounded-lg p-3 shadow-md break-all",
                                            isSelf ? "bg-purple-500 text-white" : "bg-white",
                                        )}>
                                            <div className="flex flex-col">
                                                <p className="select-text text-base mb-1 whitespace-pre-wrap break-words">{message.content}</p>
                                                <span className={clsx(
                                                    "text-xs self-end",
                                                    isSelf ? "text-purple-200" : "text-gray-400",
                                                )}>
                                                {format(new Date(message.sentAt), "HH:mm")}
                                            </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
                <div ref={messagesEndRef}/>
            </div>
            <div className="p-4 bg-white border-t border-gray-200">
                <form onSubmit={handleSubmit(onSubmit)} className="flex items-center">
                    <input
                        {...register("message")}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        type="text"
                        disabled={!activeChatId}
                        placeholder={activeChatId ? "Write a message ..." : "Select a chat to send a message"}
                        className="flex-1 border border-gray-300 rounded-l-full py-2 px-4 text-base focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button
                        type="submit"
                        disabled={!activeChatId}
                        className="bg-purple-500 text-white rounded-r-full p-2 hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300 ease-in-out"
                        aria-label="Send message"
                    >
                        <PaperAirplaneIcon className="h-6 w-6"/>
                    </button>
                </form>
            </div>
        </div>
    );
}
