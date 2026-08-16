package za.ac.cput.communitystore.util;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class HelperTest {

    @Test
    void isNullOrEmpty_blankString_returnsTrue() {
        assertTrue(Helper.isNullOrEmpty("   "));
        assertTrue(Helper.isNullOrEmpty(null));
    }

    @Test
    void isValidEmail_validEmail_returnsTrue() {
        assertTrue(Helper.isValidEmail("student@mycput.ac.za"));
    }

    @Test
    void isValidEmail_invalidEmail_returnsFalse() {
        assertFalse(Helper.isValidEmail("not-an-email"));
    }

    @Test
    void isValidPhoneNumber_validNumber_returnsTrue() {
        assertTrue(Helper.isValidPhoneNumber("+27821234567"));
    }

    @Test
    void isValidPhoneNumber_invalidNumber_returnsFalse() {
        assertFalse(Helper.isValidPhoneNumber("abc123"));
    }
}

