
package za.ac.cput.communitystore.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import za.ac.cput.communitystore.domain.Role;
import za.ac.cput.communitystore.domain.User;
import za.ac.cput.communitystore.repository.RoleRepository;
import za.ac.cput.communitystore.repository.UserRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

    @RestController
    @RequestMapping("/api/auth")
    public class AuthController {

        private final UserRepository users;
        private final RoleRepository roles;
        private final PasswordEncoder encoder;

        public AuthController(UserRepository users,
                              RoleRepository roles,
                              PasswordEncoder encoder) {
            this.users = users;
            this.roles = roles;
            this.encoder = encoder;
        }

        public record RegisterRequest(
                String fullName,
                String email,
                String password,
                String userType
        ) {}

        public record LoginRequest(
                String email,
                String password
        ) {}

        @PostMapping("/register")
        public ResponseEntity<?> register(
                @RequestBody RegisterRequest request) {

            if (request.fullName() == null ||
                    request.fullName().isBlank() ||
                    request.email() == null ||
                    request.email().isBlank() ||
                    request.password() == null ||
                    request.password().length() < 8) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message",
                                "Valid name, email and password of at least 8 characters required"));
            }

            String email = request.email().trim().toLowerCase();

            if (users.findByEmail(email).isPresent()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Email already registered"));
            }

            // Only existing, supported public roles may be selected.
            String type = request.userType() == null
                    ? "" : request.userType().toLowerCase();

            String roleName;
            if (type.equals("vendor")) {
                roleName = "Vendor";
            } else if (type.equals("student")) {
                roleName = "Student";
            } else {
                return ResponseEntity.badRequest()
                        .body(Map.of("message",
                                "Please select Student or Vendor"));
            }

            Optional<Role> role = roles.findByRoleName(roleName);

            if (role.isEmpty()) {
                return ResponseEntity.internalServerError()
                        .body(Map.of("message",
                                "Required role missing from database"));
            }

            String[] names = request.fullName().trim().split("\\s+", 2);

            User user = new User.Builder()
                    .setFirstName(names[0])
                    .setLastName(names.length > 1 ? names[1] : "")
                    .setEmail(email)
                    .setPasswordHash(encoder.encode(request.password()))
                    .setRole(role.get())
                    .setStatus("Active")
                    .setDateCreated(LocalDateTime.now())
                    .build();

            users.save(user);

            return ResponseEntity.ok(
                    Map.of("message", "Registration successful"));
        }

        @PostMapping("/login")
        public ResponseEntity<?> login(
                @RequestBody LoginRequest request) {

            if (request.email() == null ||
                    request.password() == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Email and password required"));
            }

            Optional<User> found = users.findByEmail(
                    request.email().trim().toLowerCase());

            if (found.isEmpty() ||
                    !encoder.matches(
                            request.password(),
                            found.get().getPasswordHash()) ||
                    !"Active".equalsIgnoreCase(
                            found.get().getStatus())) {

                return ResponseEntity.status(401)
                        .body(Map.of("message",
                                "Invalid email or password"));
            }

            User user = found.get();

            return ResponseEntity.ok(Map.of(
                    "message", "Login successful",
                    "userId", user.getUserID(),
                    "name", user.getFirstName(),
                    "role", user.getRole().getRoleName()
            ));
        }
    }


