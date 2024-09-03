import {fireEvent, render, screen} from "@testing-library/react";
import {beforeEach, describe, expect, test, vi} from "vitest";
import "@testing-library/jest-dom";
import {MessagesSidebar} from "./MessagesSidebar";
import {useChatStore} from "../store/chatStore";
import {useAuthStore} from "../store/authStore";

vi.mock("../store/chatStore");
vi.mock("../store/authStore");

vi.mock("date-fns", () => {
    return {
        format: vi.fn(() => {
            return "12:34";
        }),
        isToday: vi.fn(() => {
            return true;
        }),
    };
});

describe("MessagesSidebar", () => {
    const mockOnChatSelect = vi.fn();
    const mockSetActiveChatId = vi.fn();

    beforeEach(() => {
        vi.resetAllMocks();

        (useChatStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
            chats: [
                {
                    id: "1",
                    participants: [{id: "2", username: "Alice"}],
                    messages: [{content: "Hello", sentAt: new Date().getTime()}],
                },
                {
                    id: "2",
                    participants: [{id: "3", username: "Bob"}],
                    messages: [],
                },
            ],
            activeChatId: null,
            setActiveChatId: mockSetActiveChatId,
        });

        (useAuthStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
            user: {id: "1", username: "TestUser"},
        });
    });

    test("renders messages sidebar with chats", () => {
        render(<MessagesSidebar onChatSelect={mockOnChatSelect}/>);

        expect(screen.getByText("Messages")).toBeInTheDocument();
        expect(screen.getByText("Alice")).toBeInTheDocument();
        expect(screen.getByText("Bob")).toBeInTheDocument();
        expect(screen.getByText("Hello")).toBeInTheDocument();
        expect(screen.getByText("Start a new conversation")).toBeInTheDocument();
    });

    test("handles chat selection", () => {
        render(<MessagesSidebar onChatSelect={mockOnChatSelect}/>);

        fireEvent.click(screen.getByText("Alice"));

        expect(mockSetActiveChatId).toHaveBeenCalledWith("1");
        expect(mockOnChatSelect).toHaveBeenCalled();
    });

    test("deselects active chat when clicked again", () => {
        (useChatStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
            ...useChatStore(),
            activeChatId: "1",
        });

        render(<MessagesSidebar onChatSelect={mockOnChatSelect}/>);

        fireEvent.click(screen.getByText("Alice"));

        expect(mockSetActiveChatId).toHaveBeenCalledWith(null);
        expect(mockOnChatSelect).not.toHaveBeenCalled();
    });

    test("displays \"New\" badge for chats without messages", () => {
        render(<MessagesSidebar onChatSelect={mockOnChatSelect}/>);

        expect(screen.getByText("New")).toBeInTheDocument();
    });
});
