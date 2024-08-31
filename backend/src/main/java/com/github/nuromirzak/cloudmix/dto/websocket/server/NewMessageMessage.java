package com.github.nuromirzak.cloudmix.dto.websocket.server;

import com.github.nuromirzak.cloudmix.dto.response.MessageResponse;
import lombok.EqualsAndHashCode;
import lombok.Value;

@Value
@EqualsAndHashCode(callSuper = true)
public class NewMessageMessage extends ServerMessage {
    String chatId;
    MessageResponse message;

    public NewMessageMessage(String chatId, MessageResponse message) {
        super(ServerMessageType.NEW_MESSAGE);
        this.chatId = chatId;
        this.message = message;
    }
}
