import {useAuthStore} from "../store/authStore.ts";
import {ChatComponent} from "../components/ChatComponent.tsx";
import {MessagesSidebar} from "../components/MessagesSidebar.tsx";
import {Navbar} from "../components/Navbar.tsx";
import {useWebSocket} from "../hooks/useWebSocket.tsx";
import {useEffect, useState} from "react";
import {useChatStore} from "../store/chatStore.ts";

export function MainPage() {
    const {user} = useAuthStore();
    const {isConnected, sendMessage} = useWebSocket();
    const {activeChatId, setActiveChatId} = useChatStore();
    const [screen, setScreen] = useState<"sidebar" | "chat">("sidebar");

    useEffect(() => {
        if (!user) {
            console.error("User is not available");
            return;
        }
        if (!isConnected) {
            return;
        }
        const username = user.username;
        const password = user.password;
        sendMessage({
            type: "AUTH",
            basicAuth: `Basic ${btoa(`${username}:${password}`)}`,
        });
    }, [isConnected, sendMessage, user]);

    useEffect(() => {
        if (activeChatId) {
            setScreen("chat");
        }
    }, [activeChatId]);

    if (user === null) {
        throw new Error(
            "User is unavailable. MainPage requires an authenticated user.",
        );
    }

    const handleBackToSidebar = () => {
        setScreen("sidebar");
        setActiveChatId(null);
    };

    return (
        <div className="h-dvh flex flex-col select-none">
            <Navbar/>
            <div className="flex-1 flex overflow-hidden">
                <div className={`w-full md:w-1/4 ${screen === "sidebar" ? "block" : "hidden md:block"}`}
                     data-testid="messages-sidebar-container">
                    <MessagesSidebar onChatSelect={() => {
                        return setScreen("chat");
                    }}/>
                </div>
                <div className={`flex-1 border-l border-gray-200 ${screen === "chat" ? "block" : "hidden md:block"}`}
                     data-testid="chat-component-container">
                    <ChatComponent sendMessage={sendMessage} onBackClick={handleBackToSidebar}/>
                </div>
            </div>
        </div>
    );
}
