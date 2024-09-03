import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import {afterEach, beforeEach, describe, expect, test, vi} from "vitest";
import "@testing-library/jest-dom";
import {MainPage} from "./MainPage";
import {useAuthStore} from "../store/authStore";
import {useChatStore} from "../store/chatStore";
import {useWebSocket} from "../hooks/useWebSocket";
import {SnackbarProvider} from "notistack";

// Mock the stores and hooks
vi.mock("../store/authStore");
vi.mock("../store/chatStore");
vi.mock("../hooks/useWebSocket");

// Mock child components
vi.mock("../components/Navbar", () => {
    return {
        Navbar: () => {
            return <div data-testid="navbar">Navbar</div>;
        },
    };
});
vi.mock("../components/MessagesSidebar", () => {
    return {
        MessagesSidebar: ({onChatSelect}: { onChatSelect: () => void }) => {
            return (
                <div data-testid="messages-sidebar">
                    MessagesSidebar
                    <button onClick={onChatSelect}>Select Chat</button>
                </div>
            );
        },
    };
});
vi.mock("../components/ChatComponent", () => {
    return {
        ChatComponent: ({onBackClick}: { onBackClick: () => void }) => {
            return (
                <div data-testid="chat-component">
                    ChatComponent
                    <button onClick={onBackClick}>Back</button>
                </div>
            );
        },
    };
});

describe("MainPage", () => {
    const mockUser = {id: "1", username: "TestUser", password: "password"};
    const mockSendMessage = vi.fn();
    const mockSetActiveChatId = vi.fn();

    beforeEach(() => {
        vi.resetAllMocks();

        (useAuthStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
            user: mockUser,
        });

        (useChatStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
            activeChatId: null,
            setActiveChatId: mockSetActiveChatId,
        });

        (useWebSocket as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
            isConnected: true,
            sendMessage: mockSendMessage,
        });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    test("renders main page components", () => {
        render(
            <SnackbarProvider>
                <MainPage/>
            </SnackbarProvider>,
        );

        expect(screen.getByTestId("navbar")).toBeInTheDocument();
        expect(screen.getByTestId("messages-sidebar")).toBeInTheDocument();
        expect(screen.getByTestId("chat-component")).toBeInTheDocument();
    });

    test("sends AUTH message on connection", async () => {
        render(
            <SnackbarProvider>
                <MainPage/>
            </SnackbarProvider>,
        );

        await waitFor(() => {
            expect(mockSendMessage).toHaveBeenCalledWith({
                type: "AUTH",
                basicAuth: `Basic ${btoa(`${mockUser.username}:${mockUser.password}`)}`,
            });
        });
    });

    test("switches back to sidebar when back button is clicked", async () => {
        (useChatStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
            activeChatId: "1",
            setActiveChatId: mockSetActiveChatId,
        });

        render(
            <SnackbarProvider>
                <MainPage/>
            </SnackbarProvider>,
        );

        const backButton = screen.getByText("Back");
        fireEvent.click(backButton);

        await waitFor(() => {
            expect(screen.getByTestId("messages-sidebar-container")).not.toHaveClass("hidden");
            expect(screen.getByTestId("chat-component-container")).toHaveClass("hidden md:block");
            expect(mockSetActiveChatId).toHaveBeenCalledWith(null);
        });
    });

    test("throws error when user is null", () => {
        (useAuthStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
            user: null,
        });

        expect(() => {
            return render(
                <SnackbarProvider>
                    <MainPage/>
                </SnackbarProvider>,
            );
        }).toThrow("User is unavailable. MainPage requires an authenticated user.");
    });
});
