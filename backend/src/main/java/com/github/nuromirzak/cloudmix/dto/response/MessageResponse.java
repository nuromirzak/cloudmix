package com.github.nuromirzak.cloudmix.dto.response;

import com.github.nuromirzak.cloudmix.model.Message;

public record MessageResponse(String id, String content, Long sentAt, String senderId) {
    public MessageResponse(Message message) {
        this(message.getId().toString(), message.getContent(), message.getSentAt().toEpochMilli(), message.getSender().getId().toString());
    }
}
