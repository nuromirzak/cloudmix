package com.github.nuromirzak.cloudmix.dto.response;

import java.util.List;

public record ChatResponse(String id, List<UserResponse> participants, List<MessageResponse> messages) {
}
