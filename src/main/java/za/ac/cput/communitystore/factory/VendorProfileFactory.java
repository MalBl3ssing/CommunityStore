package za.ac.cput.communitystore.factory;

import za.ac.cput.communitystore.domain.User;
import za.ac.cput.communitystore.domain.VendorProfile;
import za.ac.cput.communitystore.domain.VerificationStatus;
import za.ac.cput.communitystore.util.Helper;

import java.time.LocalDateTime;

public class VendorProfileFactory {

    private VendorProfileFactory() {
        // static factory class, no instances
    }

    public static VendorProfile createVendorProfile(User user,
                                                    String businessName,
                                                    String businessRegistrationNumber,
                                                    String verificationDocumentURL) {
        if (user == null) {
            throw new IllegalArgumentException("user cannot be null");
        }
        if (Helper.isNullOrEmpty(businessName)) {
            throw new IllegalArgumentException("businessName cannot be null or empty");
        }
        if (Helper.isNullOrEmpty(businessRegistrationNumber)) {
            throw new IllegalArgumentException("businessRegistrationNumber cannot be null or empty");
        }
        if (Helper.isNullOrEmpty(verificationDocumentURL)) {
            throw new IllegalArgumentException("verificationDocumentURL cannot be null or empty");
        }

        return new VendorProfile.Builder()
                .setUser(user)
                .setBusinessName(businessName)
                .setBusinessRegistrationNumber(businessRegistrationNumber)
                .setVerificationDocumentURL(verificationDocumentURL)
                .setVerificationStatus(VerificationStatus.PENDING)
                .setSubmittedDate(LocalDateTime.now())
                .build();
    }
}

