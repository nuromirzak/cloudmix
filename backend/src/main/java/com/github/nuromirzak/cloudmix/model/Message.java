package com.github.nuromirzak.cloudmix.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.Instant;

@Entity
@Table
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column
    private Long id;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(nullable = false)
    private Instant sentAt = Instant.now();

    @ManyToOne
    @JoinColumn(nullable = false)
    @ToString.Exclude
    private Chat chat;

    @ManyToOne
    @JoinColumn(nullable = false)
    private User sender;

    public Message(String content, Chat chat, User sender) {
        this.content = content;
        this.chat = chat;
        this.sender = sender;
    }
}
