package za.ac.cput.communitystore.util;

import java.util.regex.Pattern;

public class Helper {

    private static final Pattern EMAIL_PATTERN =
            Pattern.compile("^[\\w.+-]+@[\\w-]+\\.[a-zA-Z]{2,}$");

    private Helper() {
        // static utility class, no instances
    }

    public static boolean isNullOrEmpty(String value) {
        return value == null || value.trim().isEmpty();
    }

    public static boolean isValidEmail(String email) {
        if (isNullOrEmpty(email)) {
            return false;
        }
        return EMAIL_PATTERN.matcher(email).matches();
    }

    public static boolean isValidPhoneNumber(String phoneNumber) {
        if (isNullOrEmpty(phoneNumber)) {
            return false;
        }
        String digitsOnly = phoneNumber.replaceAll("[\\s-]", "");
        return digitsOnly.matches("^\\+?\\d{9,15}$");
    }

    public static boolean isPositive(int value) {
        return value > 0;
    }
}

