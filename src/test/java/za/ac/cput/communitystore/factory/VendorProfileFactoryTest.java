package za.ac.cput.communitystore.factory;

import org.junit.jupiter.api.Test;
import za.ac.cput.communitystore.domain.Role;
import za.ac.cput.communitystore.domain.User;
import za.ac.cput.communitystore.domain.VendorProfile;
import za.ac.cput.communitystore.domain.VerificationStatus;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

class VendorProfileFactoryTest {

    private final Role role = RoleFactory.createRole("Vendor", "Can list and sell products");

    private final User user = UserFactory.createUser(
            role,
            "Sipho",
            "Dlamini",
            "sipho.dlamini@example.com",
            "hashedPassword123",
            "+27821234567",
            null,
            "ACTIVE"
    );

    @Test
    void createVendorProfile_validInput_returnsVendorProfilePendingVerification() {
        VendorProfile vendorProfile = VendorProfileFactory.createVendorProfile(
                user,
                "Sipho's Second-Hand Books",
                "K2026123456",
                "https://storage.example.com/docs/reg123.pdf"
        );

        assertNotNull(vendorProfile);
        assertEquals(user, vendorProfile.getUser());
        assertEquals("Sipho's Second-Hand Books", vendorProfile.getBusinessName());
        assertEquals(VerificationStatus.PENDING, vendorProfile.getVerificationStatus());
        assertNotNull(vendorProfile.getSubmittedDate());
    }

    @Test
    void createVendorProfile_nullUser_throwsException() {
        assertThrows(IllegalArgumentException.class, () -> VendorProfileFactory.createVendorProfile(
                null,
                "Sipho's Second-Hand Books",
                "K2026123456",
                "https://storage.example.com/docs/reg123.pdf"
        ));
    }

    @Test
    void createVendorProfile_emptyBusinessRegistrationNumber_throwsException() {
        assertThrows(IllegalArgumentException.class, () -> VendorProfileFactory.createVendorProfile(
                user,
                "Sipho's Second-Hand Books",
                "",
                "https://storage.example.com/docs/reg123.pdf"
        ));
    }
}
