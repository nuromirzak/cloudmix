import {useCallback, useEffect, useRef, useState} from "react";
import {ClientMessage, ServerMessageSchema} from "../types";
import {useSnackbar} from "notistack";
import {useChatStore} from "../store/chatStore.ts";

export interface WebSocketHook {
    isConnected: boolean;
    sendMessage: (message: ClientMessage) => void;
}

export function useWebSocket(): WebSocketHook {
    const socket = useRef<WebSocket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const {enqueueSnackbar} = useSnackbar();
    const {handleServerMessage} = useChatStore((state) => {
        return {
            handleServerMessage: state.handleServerMessage,
        };
    });

    const sendMessage = useCallback((message: ClientMessage) => {
        console.log("Sending message", message);
        if (socket.current?.readyState === WebSocket.OPEN) {
            socket.current.send(JSON.stringify(message));
        }
    }, []);

    useEffect(() => {
        const url = import.meta.env.VITE_WS_URL;

        if (!url) {
            throw new Error("VITE_WS_URL is not defined in the environment");
        }

        socket.current = new WebSocket(url);

        socket.current.onopen = () => {
            setIsConnected(true);
        };

        socket.current.onmessage = (event) => {
            const message = JSON.parse(event.data);
            console.log("Received message", message);
            const parseResult = ServerMessageSchema.safeParse(message);
            if (!parseResult.success) {
                console.error("Invalid message received", message);
                return;
            }
            const serverMessage = parseResult.data;
            if (serverMessage.type === "ERROR") {
                enqueueSnackbar(serverMessage.error, {variant: "error"});
                return;
            } else {
                handleServerMessage(serverMessage);
            }
        };

        socket.current.onclose = () => {
            setIsConnected(false);
        };

        return () => {
            if (socket.current) {
                socket.current.close();
            }
        };
    }, [enqueueSnackbar, handleServerMessage]);

    return {isConnected, sendMessage};
}
