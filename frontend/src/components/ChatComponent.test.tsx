import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import {afterEach, beforeEach, describe, expect, test, vi} from "vitest";
import "@testing-library/jest-dom";
import {ChatComponent} from "./ChatComponent";
import {useChatStore} from "../store/chatStore";
import {useAuthStore} from "../store/authStore";

vi.mock("../store/chatStore");
vi.mock("../store/authStore");

vi.mock("date-fns", async () => {
    const actual = await vi.importActual("date-fns");
    return {
        ...actual,
        isToday: vi.fn(() => {
            return true;
        }),
        isYesterday: vi.fn(() => {
            return false;
        }),
        format: vi.fn(() => {
            return "12:34";
        }),
    };
});

const mockScrollIntoView = vi.fn();
window.HTMLElement.prototype.scrollIntoView = mockScrollIntoView;

describe("ChatComponent", () => {
    const mockSendMessage = vi.fn();
    const mockOnBackClick = vi.fn();

    const mockUser = {id: "1", username: "TestUser"};
    const mockChat = {
        id: "1",
        participants: [
            {id: "1", username: "TestUser"},
            {id: "2", username: "Alice"},
        ],
        messages: [
            {id: "1", content: "Hello", senderId: "2", sentAt: new Date().getTime()},
            {id: "2", content: "Hi there", senderId: "1", sentAt: new Date().getTime()},
        ],
    };

    beforeEach(() => {
        vi.resetAllMocks();

        (useAuthStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
            user: mockUser,
        });

        (useChatStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
            chats: [mockChat],
            statuses: {"2": {chatId: null}},
            activeChatId: "1",
        });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    test("renders chat component with messages", () => {
        render(<ChatComponent sendMessage={mockSendMessage} onBackClick={mockOnBackClick}/>);

        expect(screen.getByText("Alice")).toBeInTheDocument();
        expect(screen.getByText("Hello")).toBeInTheDocument();
        expect(screen.getByText("Hi there")).toBeInTheDocument();
    });

    test("sends a message when form is submitted", async () => {
        render(<ChatComponent sendMessage={mockSendMessage} onBackClick={mockOnBackClick}/>);

        const input = screen.getByPlaceholderText("Write a message ...");
        const submitButton = screen.getByLabelText("Send message");

        fireEvent.change(input, {target: {value: "New message"}});
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockSendMessage).toHaveBeenCalledWith({
                type: "SEND_MESSAGE",
                chatId: "1",
                content: "New message",
            });
        });
    });

    test("displays typing status when other user is typing", () => {
        (useChatStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
            ...useChatStore(),
            statuses: {"2": {chatId: "1"}},
        });

        render(<ChatComponent sendMessage={mockSendMessage} onBackClick={mockOnBackClick}/>);

        expect(screen.getByText("Typing...")).toBeInTheDocument();
    });

    test("calls onBackClick when back button is clicked", () => {
        render(<ChatComponent sendMessage={mockSendMessage} onBackClick={mockOnBackClick}/>);

        const backButton = screen.getByLabelText("Back");
        fireEvent.click(backButton);

        expect(mockOnBackClick).toHaveBeenCalled();
    });

    test("disables input when no active chat is selected", () => {
        (useChatStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
            ...useChatStore(),
            activeChatId: null,
        });

        render(<ChatComponent sendMessage={mockSendMessage} onBackClick={mockOnBackClick}/>);

        const input = screen.getByPlaceholderText("Select a chat to send a message");
        expect(input).toBeDisabled();
    });

    test("sends typing status when input is focused", () => {
        render(<ChatComponent sendMessage={mockSendMessage} onBackClick={mockOnBackClick}/>);

        const input = screen.getByPlaceholderText("Write a message ...");
        fireEvent.focus(input);

        expect(mockSendMessage).toHaveBeenCalledWith({
            type: "TYPING_STATUS",
            chatId: "1",
        });
    });

    test("sends stop typing status when input is blurred", () => {
        render(<ChatComponent sendMessage={mockSendMessage} onBackClick={mockOnBackClick}/>);

        const input = screen.getByPlaceholderText("Write a message ...");
        fireEvent.blur(input);

        expect(mockSendMessage).toHaveBeenCalledWith({
            type: "TYPING_STATUS",
            chatId: null,
        });
    });
});
