package com.github.nuromirzak.cloudmix.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.nuromirzak.cloudmix.dto.response.ChatResponse;
import com.github.nuromirzak.cloudmix.dto.response.MessageResponse;
import com.github.nuromirzak.cloudmix.dto.response.Status;
import com.github.nuromirzak.cloudmix.dto.response.UserResponse;
import com.github.nuromirzak.cloudmix.dto.websocket.client.AuthMessage;
import com.github.nuromirzak.cloudmix.dto.websocket.client.ClientMessage;
import com.github.nuromirzak.cloudmix.dto.websocket.client.SendMessageMessage;
import com.github.nuromirzak.cloudmix.dto.websocket.client.TypingStatusMessage;
import com.github.nuromirzak.cloudmix.dto.websocket.server.AllChatsMessage;
import com.github.nuromirzak.cloudmix.dto.websocket.server.AllStatusesMessage;
import com.github.nuromirzak.cloudmix.dto.websocket.server.ErrorMessage;
import com.github.nuromirzak.cloudmix.dto.websocket.server.NewMessageMessage;
import com.github.nuromirzak.cloudmix.dto.websocket.server.ServerMessage;
import com.github.nuromirzak.cloudmix.model.Chat;
import com.github.nuromirzak.cloudmix.model.Message;
import com.github.nuromirzak.cloudmix.model.User;
import com.github.nuromirzak.cloudmix.repository.ChatRepository;
import com.github.nuromirzak.cloudmix.repository.MessageRepository;
import com.github.nuromirzak.cloudmix.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.messages.AssistantMessage;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.openai.OpenAiChatModel;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@Service
public class ChatWebSocketHandler extends TextWebSocketHandler {
    private final ObjectMapper objectMapper;
    private final MessageRepository messageRepository;
    private final ChatRepository chatRepository;
    private final UserRepository userRepository;
    private final AuthenticationProvider authenticationProvider;
    private final OpenAiChatModel openAiChatModel;

    private final Map<WebSocketSession, User> sessionToUser = new ConcurrentHashMap<>();
    private final Map<User, WebSocketSession> userToSession = new ConcurrentHashMap<>();
    private final Map<User, Status> userStatuses = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        log.info("WebSocket connection established: {}", session.getId());
    }

    @Override
    protected void handleTextMessage(@NonNull WebSocketSession session, @NonNull TextMessage message) {
        try {
            ClientMessage clientMessage = objectMapper.readValue(message.getPayload(), ClientMessage.class);
            switch (clientMessage.getType()) {
                case AUTH:
                    handleAuth(session, (AuthMessage) clientMessage);
                    break;
                case SEND_MESSAGE:
                    handleSendMessage(session, (SendMessageMessage) clientMessage);
                    break;
                case TYPING_STATUS:
                    handleTypingStatus(session, (TypingStatusMessage) clientMessage);
                    break;
                default:
                    sendError(session, "Unknown message type");
            }
        } catch (Exception e) {
            log.error("Error handling message", e);
            sendError(session, "Internal server error");
        }
    }

    @Override
    public void afterConnectionClosed(@NonNull WebSocketSession session, @NonNull CloseStatus status) {
        User user = sessionToUser.remove(session);
        if (user != null) {
            try (WebSocketSession userSession = userToSession.remove(user)) {
                if (userSession != null && userSession.isOpen()) {
                    userSession.close(CloseStatus.POLICY_VIOLATION.withReason("Another session opened"));
                }
            } catch (IOException e) {
                log.error("Error closing user session", e);
            }
            userStatuses.remove(user);
            broadcastStatusUpdate();
        }
        log.info("WebSocket connection closed: {}", session.getId());
    }

    private void handleAuth(WebSocketSession session, AuthMessage message) throws IOException {
        try {
            Authentication auth = authenticationProvider.authenticate(
                    new UsernamePasswordAuthenticationToken(message.getUsername(), message.getPassword())
            );

            if (auth.isAuthenticated()) {
                User user = userRepository.findByUsername(message.getUsername())
                        .orElseThrow(() -> new UsernameNotFoundException("User not found"));

                handleExistingSession(user);

                sessionToUser.put(session, user);
                userToSession.put(user, session);

                userStatuses.put(user, new Status(true, null));
                broadcastStatusUpdate();
                sendAllChats(session);
            } else {
                sendError(session, "Authentication failed");
            }
        } catch (AuthenticationException e) {
            sendError(session, "Authentication failed: " + e.getMessage());
        }
    }

    private void handleExistingSession(User user) throws IOException {
        WebSocketSession existingSession = userToSession.get(user);
        if (existingSession != null && existingSession.isOpen()) {
            sendError(existingSession, "You have been disconnected due to a new login");
            existingSession.close(CloseStatus.POLICY_VIOLATION.withReason("Another session opened"));
        }
    }

    private void handleSendMessage(WebSocketSession session, SendMessageMessage message) {
        User sender = getAuthenticatedUser(session);
        if (sender == null) {
            return;
        }

        try {
            Long chatId = Long.parseLong(message.getChatId());
            Chat chat = chatRepository.findById(chatId)
                    .orElseThrow(() -> new IllegalArgumentException("Chat not found"));

            Message messageToSend = new Message(message.getContent(), chat, sender);
            messageToSend = messageRepository.save(messageToSend);

            broadcastMessage(chat, messageToSend);

            User otherParticipant = chat.getParticipants().stream()
                    .filter(user -> !user.equals(sender))
                    .findFirst()
                    .orElseThrow(() -> new IllegalArgumentException("Other participant not found"));

            if (otherParticipant.getRole().equals(User.Role.BOT)) {
                String response = getResponseFromOpenAi(chatId);

                Message aiMessage = new Message(response, chat, otherParticipant);
                aiMessage = messageRepository.save(aiMessage);

                broadcastMessage(chat, aiMessage);
            }
        } catch (Exception e) {
            log.error("Error sending message", e);
            sendError(session, "Failed to send message");
        }
    }

    private String getResponseFromOpenAi(Long chatId) {
        List<Message> latest10Messages = messageRepository.findAllByChatId(chatId)
                .stream()
                .sorted(Comparator.comparing(Message::getId).reversed())
                .limit(10)
                .sorted(Comparator.comparing(Message::getId))
                .toList();
        List<org.springframework.ai.chat.messages.Message> messages = new ArrayList<>();
        for (Message m : latest10Messages) {
            User author = m.getSender();
            org.springframework.ai.chat.messages.Message message1;
            if (author.getRole().equals(User.Role.BOT)) {
                message1 = new AssistantMessage(m.getContent());
            } else {
                message1 = new UserMessage(m.getContent());
            }
            messages.add(message1);
        }
        org.springframework.ai.chat.model.ChatResponse responses = openAiChatModel.call(new Prompt(messages));
        return responses.getResults().getLast().getOutput().getContent();
    }

    private void sendAllChats(WebSocketSession session) {
        User user = getAuthenticatedUser(session);
        if (user == null) {
            return;
        }
        List<ChatResponse> chatResponses = new ArrayList<>();
        List<Chat> chats = chatRepository.findAllChatsByUserId(user.getId());
        for (Chat chat : chats) {
            List<UserResponse> participants = chat.getParticipants().stream()
                    .map(UserResponse::new)
                    .toList();
            List<MessageResponse> messages = chat.getMessages().stream()
                    .map(MessageResponse::new)
                    .toList();
            chatResponses.add(new ChatResponse(chat.getId().toString(), participants, messages));
        }
        AllChatsMessage allChatsMessage = new AllChatsMessage(chatResponses);
        sendToSession(session, allChatsMessage);
    }

    private void handleTypingStatus(WebSocketSession session, TypingStatusMessage message) {
        User user = getAuthenticatedUser(session);
        if (user == null) {
            return;
        }

        Status newStatus = new Status(true, message.getChatId());
        userStatuses.put(user, newStatus);
        broadcastStatusUpdate();
    }

    private void sendError(WebSocketSession session, String message) {
        ErrorMessage errorMessage = new ErrorMessage(message);
        sendToSession(session, errorMessage);
    }

    private void broadcastMessage(Chat chat, Message message) {
        MessageResponse messageResponse = new MessageResponse(message);
        NewMessageMessage newMessageMessage = new NewMessageMessage(chat.getId().toString(), messageResponse);
        chat.getParticipants().forEach(participant -> {
            WebSocketSession participantSession = userToSession.get(participant);
            if (participantSession != null && participantSession.isOpen()) {
                sendToSession(participantSession, newMessageMessage);
            }
        });
    }

    private void broadcastStatusUpdate() {
        Map<String, Status> statusUpdate = userStatuses.entrySet().stream()
                .collect(Collectors.toMap(e -> e.getKey().getId().toString(), Map.Entry::getValue));
        AllStatusesMessage allStatusesMessage = new AllStatusesMessage(statusUpdate);
        userToSession.values().forEach(session -> sendToSession(session, allStatusesMessage));
    }

    private void sendToSession(WebSocketSession session, ServerMessage message) {
        try {
            if (session.isOpen()) {
                String serializedMessage = objectMapper.writeValueAsString(message);
                session.sendMessage(new TextMessage(serializedMessage));
            }
        } catch (IOException e) {
            log.error("Error sending message to session", e);
        }
    }

    private User getAuthenticatedUser(WebSocketSession session) {
        User user = sessionToUser.get(session);
        if (user == null) {
            sendError(session, "Not authenticated");
        }
        return user;
    }
}
