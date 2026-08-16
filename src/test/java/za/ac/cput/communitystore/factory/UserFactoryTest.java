package za.ac.cput.communitystore.factory;

import org.junit.jupiter.api.Test;
import za.ac.cput.communitystore.domain.Role;
import za.ac.cput.communitystore.domain.User;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

class UserFactoryTest {

    private final Role role = RoleFactory.createRole("Student", "Regular student buyer/seller");

    @Test
    void createUser_validInput_returnsUser() {
        User user = UserFactory.createUser(
                role,
                "Thandiwe",
                "Mokoena",
                "thandiwe.mokoena@mycput.ac.za",
                "hashedPassword123",
                "+27821234567",
                "221012345",
                "ACTIVE"
        );

        assertNotNull(user);
        assertEquals("Thandiwe", user.getFirstName());
        assertEquals("Mokoena", user.getLastName());
        assertEquals(role, user.getRole());
    }

    @Test
    void createUser_invalidEmail_throwsException() {
        assertThrows(IllegalArgumentException.class, () -> UserFactory.createUser(
                role,
                "Thandiwe",
                "Mokoena",
                "not-an-email",
                "hashedPassword123",
                "+27821234567",
                "221012345",
                "ACTIVE"
        ));
    }

    @Test
    void createUser_nullRole_throwsException() {
        assertThrows(IllegalArgumentException.class, () -> UserFactory.createUser(
                null,
                "Thandiwe",
                "Mokoena",
                "thandiwe.mokoena@mycput.ac.za",
                "hashedPassword123",
                "+27821234567",
                "221012345",
                "ACTIVE"
        ));
    }

    @Test
    void createUser_invalidPhoneNumber_throwsException() {
        assertThrows(IllegalArgumentException.class, () -> UserFactory.createUser(
                role,
                "Thandiwe",
                "Mokoena",
                "thandiwe.mokoena@mycput.ac.za",
                "hashedPassword123",
                "not-a-number",
                "221012345",
                "ACTIVE"
        ));
    }
}

