package za.ac.cput.communitystore.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "VendorProfiles")
public class VendorProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int vendorProfileID;

    @OneToOne
    @JoinColumn(name = "userID", unique = true)
    private User user;

    private String businessName;
    private String businessRegistrationNumber;

    @Enumerated(EnumType.STRING)
    private VerificationStatus verificationStatus;

    private String verificationDocumentURL;
    private LocalDateTime submittedDate;
    private LocalDateTime verifiedDate;

    protected VendorProfile() {
        // required by JPA
    }

    private VendorProfile(Builder builder) {
        this.vendorProfileID = builder.vendorProfileID;
        this.user = builder.user;
        this.businessName = builder.businessName;
        this.businessRegistrationNumber = builder.businessRegistrationNumber;
        this.verificationStatus = builder.verificationStatus;
        this.verificationDocumentURL = builder.verificationDocumentURL;
        this.submittedDate = builder.submittedDate;
        this.verifiedDate = builder.verifiedDate;
    }

    public int getVendorProfileID() {
        return vendorProfileID;
    }

    public User getUser() {
        return user;
    }

    public String getBusinessName() {
        return businessName;
    }

    public String getBusinessRegistrationNumber() {
        return businessRegistrationNumber;
    }

    public VerificationStatus getVerificationStatus() {
        return verificationStatus;
    }

    public String getVerificationDocumentURL() {
        return verificationDocumentURL;
    }

    public LocalDateTime getSubmittedDate() {
        return submittedDate;
    }

    public LocalDateTime getVerifiedDate() {
        return verifiedDate;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof VendorProfile)) return false;
        VendorProfile that = (VendorProfile) o;
        return vendorProfileID == that.vendorProfileID;
    }

    @Override
    public int hashCode() {
        return Objects.hash(vendorProfileID);
    }

    @Override
    public String toString() {
        return "VendorProfile{" +
                "vendorProfileID=" + vendorProfileID +
                ", user=" + user +
                ", businessName='" + businessName + '\'' +
                ", businessRegistrationNumber='" + businessRegistrationNumber + '\'' +
                ", verificationStatus=" + verificationStatus +
                ", verificationDocumentURL='" + verificationDocumentURL + '\'' +
                ", submittedDate=" + submittedDate +
                ", verifiedDate=" + verifiedDate +
                '}';
    }

    public static class Builder {
        private int vendorProfileID;
        private User user;
        private String businessName;
        private String businessRegistrationNumber;
        private VerificationStatus verificationStatus;
        private String verificationDocumentURL;
        private LocalDateTime submittedDate;
        private LocalDateTime verifiedDate;

        public Builder setVendorProfileID(int vendorProfileID) {
            this.vendorProfileID = vendorProfileID;
            return this;
        }

        public Builder setUser(User user) {
            this.user = user;
            return this;
        }

        public Builder setBusinessName(String businessName) {
            this.businessName = businessName;
            return this;
        }

        public Builder setBusinessRegistrationNumber(String businessRegistrationNumber) {
            this.businessRegistrationNumber = businessRegistrationNumber;
            return this;
        }

        public Builder setVerificationStatus(VerificationStatus verificationStatus) {
            this.verificationStatus = verificationStatus;
            return this;
        }

        public Builder setVerificationDocumentURL(String verificationDocumentURL) {
            this.verificationDocumentURL = verificationDocumentURL;
            return this;
        }

        public Builder setSubmittedDate(LocalDateTime submittedDate) {
            this.submittedDate = submittedDate;
            return this;
        }

        public Builder setVerifiedDate(LocalDateTime verifiedDate) {
            this.verifiedDate = verifiedDate;
            return this;
        }

        public Builder copy(VendorProfile vendorProfile) {
            this.vendorProfileID = vendorProfile.vendorProfileID;
            this.user = vendorProfile.user;
            this.businessName = vendorProfile.businessName;
            this.businessRegistrationNumber = vendorProfile.businessRegistrationNumber;
            this.verificationStatus = vendorProfile.verificationStatus;
            this.verificationDocumentURL = vendorProfile.verificationDocumentURL;
            this.submittedDate = vendorProfile.submittedDate;
            this.verifiedDate = vendorProfile.verifiedDate;
            return this;
        }

        public VendorProfile build() {
            return new VendorProfile(this);
        }
    }
}

