package com.github.nuromirzak.cloudmix.repository;

import com.github.nuromirzak.cloudmix.model.Chat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ChatRepository extends JpaRepository<Chat, Long> {
    @Query("SELECT c FROM Chat c JOIN c.participants p WHERE p.id = :userId")
    List<Chat> findAllChatsByUserId(Long userId);
}
