package com.github.nuromirzak.cloudmix.repository;

import com.github.nuromirzak.cloudmix.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
}
