package com.github.nuromirzak.cloudmix.service;

import com.github.nuromirzak.cloudmix.dto.request.RegistrationRequest;
import com.github.nuromirzak.cloudmix.model.Chat;
import com.github.nuromirzak.cloudmix.model.Message;
import com.github.nuromirzak.cloudmix.model.User;
import com.github.nuromirzak.cloudmix.repository.ChatRepository;
import com.github.nuromirzak.cloudmix.repository.MessageRepository;
import com.github.nuromirzak.cloudmix.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.function.Predicate;

@Component
@Log4j2
@RequiredArgsConstructor
public class DataInitializationRunner {
    private static final String NURMA_USERNAME = "nurma";
    private static final String DEFAULT_PASSWORD = "password";

    private final UserRepository userRepository;
    private final UserService userService;
    private final MessageRepository messageRepository;
    private final ChatRepository chatRepository;

    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void onApplicationReadyEvent() {
        log.info("Initializing data...");

        if (isDataAlreadyInitialized()) {
            log.info("Data already initialized");
            return;
        }

        initializeUsers();
        initializeChats();
        initializeBotUser();

        log.info("Data initialization complete");
    }

    private boolean isDataAlreadyInitialized() {
        return userRepository.count() != 0;
    }

    private void initializeUsers() {
        List<String> usernames = List.of("nurma", "aslan", "moana", "dragon_love", "chatgpt");
        usernames.forEach(username -> userService.createUser(new RegistrationRequest(username, DEFAULT_PASSWORD)));
    }

    private void initializeChats() {
        List<Chat> chats = chatRepository.findAllChatsByUserId(1L);
        User nurma = userRepository.findByUsername(NURMA_USERNAME).orElseThrow();

        initializeChatWithUser(chats, "aslan", nurma, this::createAslanMessages);
        initializeChatWithUser(chats, "moana", nurma, this::createMoanaMessages);
        initializeChatWithUser(chats, "dragon_love", nurma, this::createDragonLoveMessages);
    }

    private void initializeChatWithUser(List<Chat> chats, String username, User nurma, MessageCreator messageCreator) {
        Chat chat = findChatByParticipant(chats, username);
        User user = userRepository.findByUsername(username).orElseThrow();
        List<Message> messages = messageCreator.createMessages(chat, user, nurma);
        messageRepository.saveAll(messages);
    }

    private Chat findChatByParticipant(List<Chat> chats, String username) {
        return chats.stream()
                .filter(hasParticipant(username))
                .findFirst()
                .orElseThrow();
    }

    private static Predicate<Chat> hasParticipant(String username) {
        return chat -> chat.getParticipants().stream()
                .anyMatch(user -> user.getUsername().equals(username));
    }

    private List<Message> createAslanMessages(Chat chat, User aslan, User nurma) {
        return List.of(
                new Message("Hi, how is going now?", chat, aslan),
                new Message("Hey Aslan! I'm doing well, thanks. How about you?", chat, nurma),
                new Message("I'm good too. Any plans for the weekend?", chat, aslan),
                new Message("Thinking of hitting the new cafe downtown. Wanna join?", chat, nurma),
                new Message("Sounds great! Count me in.", chat, aslan)
        );
    }

    private List<Message> createMoanaMessages(Chat chat, User moana, User nurma) {
        return List.of(
                new Message("Yo bro I got some info for you", chat, moana),
                new Message("What's up? I'm all ears!", chat, nurma),
                new Message("Remember that concert we talked about?", chat, moana),
                new Message("Yeah, what about it?", chat, nurma),
                new Message("I got us tickets! We're going next month!", chat, moana)
        );
    }

    private List<Message> createDragonLoveMessages(Chat chat, User dragonLove, User nurma) {
        return List.of(
                new Message("Send nuds", chat, dragonLove),
                new Message("I think you mean 'send nudes', and no, I won't be doing that.", chat, nurma),
                new Message("Oh, my bad. Typo! I meant 'send news'!", chat, dragonLove),
                new Message("Ah, got it. Any specific news you're interested in?", chat, nurma),
                new Message("Just general updates about your life would be great!", chat, dragonLove)
        );
    }

    private void initializeBotUser() {
        User chatGpt = userRepository.findByUsername("chatgpt").orElseThrow();
        chatGpt.setRole(User.Role.BOT);
        userRepository.save(chatGpt);
    }

    @FunctionalInterface
    private interface MessageCreator {
        List<Message> createMessages(Chat chat, User user, User nurma);
    }
}
