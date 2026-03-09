package com.labflow.config;

import com.labflow.model.User;
import com.labflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (!userRepository.existsByEmail("admin@labflow.com")) {
            User admin = User.builder()
                    .name("Admin")
                    .email("admin@labflow.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(User.Role.ADMIN)
                    .build();
            userRepository.save(admin);
            log.info("Default admin created: admin@labflow.com / admin123");
        }
    }
}
