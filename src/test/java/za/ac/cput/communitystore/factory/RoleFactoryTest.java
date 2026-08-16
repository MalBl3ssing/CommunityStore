package za.ac.cput.communitystore.factory;

import org.junit.jupiter.api.Test;
import za.ac.cput.communitystore.domain.Role;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

class RoleFactoryTest {

    @Test
    void createRole_validInput_returnsRole() {
        Role role = RoleFactory.createRole("Vendor", "Can list and sell products");

        assertNotNull(role);
        assertEquals("Vendor", role.getRoleName());
        assertEquals("Can list and sell products", role.getDescription());
    }

    @Test
    void createRole_nullRoleName_throwsException() {
        assertThrows(IllegalArgumentException.class,
                () -> RoleFactory.createRole(null, "Can list and sell products"));
    }

    @Test
    void createRole_emptyDescription_throwsException() {
        assertThrows(IllegalArgumentException.class,
                () -> RoleFactory.createRole("Vendor", ""));
    }
}

