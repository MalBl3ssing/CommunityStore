package za.ac.cput.communitystore.factory;

import za.ac.cput.communitystore.domain.Role;
import za.ac.cput.communitystore.domain.User;
import za.ac.cput.communitystore.util.Helper;

import java.time.LocalDateTime;

public class UserFactory {

    private UserFactory() {
        // static factory class, no instances
    }

    public static User createUser(Role role,
                                  String firstName,
                                  String lastName,
                                  String email,
                                  String passwordHash,
                                  String phoneNumber,
                                  String studentNumber,
                                  String status) {
        if (role == null) {
            throw new IllegalArgumentException("role cannot be null");
        }
        if (Helper.isNullOrEmpty(firstName)) {
            throw new IllegalArgumentException("firstName cannot be null or empty");
        }
        if (Helper.isNullOrEmpty(lastName)) {
            throw new IllegalArgumentException("lastName cannot be null or empty");
        }
        if (!Helper.isValidEmail(email)) {
            throw new IllegalArgumentException("email is not valid: " + email);
        }
        if (Helper.isNullOrEmpty(passwordHash)) {
            throw new IllegalArgumentException("passwordHash cannot be null or empty");
        }
        if (!Helper.isValidPhoneNumber(phoneNumber)) {
            throw new IllegalArgumentException("phoneNumber is not valid: " + phoneNumber);
        }
        if (Helper.isNullOrEmpty(status)) {
            throw new IllegalArgumentException("status cannot be null or empty");
        }

        return new User.Builder()
                .setRole(role)
                .setFirstName(firstName)
                .setLastName(lastName)
                .setEmail(email)
                .setPasswordHash(passwordHash)
                .setPhoneNumber(phoneNumber)
                .setStudentNumber(studentNumber)
                .setDateCreated(LocalDateTime.now())
                .setStatus(status)
                .build();
    }
}
