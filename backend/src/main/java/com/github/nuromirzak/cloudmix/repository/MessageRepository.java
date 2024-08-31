package com.github.nuromirzak.cloudmix.repository;

import com.github.nuromirzak.cloudmix.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MessageRepository extends JpaRepository<Message, Long> {
}
