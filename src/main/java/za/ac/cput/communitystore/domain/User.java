package za.ac.cput.communitystore.domain;

import java.time.LocalDateTime;
import java.util.Objects;


    import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
    @Table(name = "users")
    public class User {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private int userID;

        @ManyToOne
        @JoinColumn(name = "roleID")
        private Role role;

        private String firstName;
        private String lastName;
        private String email;
        private String passwordHash;
        private String phoneNumber;
        private String studentNumber;
        private LocalDateTime dateCreated;
        private String status;

        protected User() {
            // required by JPA
        }

        private User(Builder builder) {
            this.userID = builder.userID;
            this.role = builder.role;
            this.firstName = builder.firstName;
            this.lastName = builder.lastName;
            this.email = builder.email;
            this.passwordHash = builder.passwordHash;
            this.phoneNumber = builder.phoneNumber;
            this.studentNumber = builder.studentNumber;
            this.dateCreated = builder.dateCreated;
            this.status = builder.status;
        }

        public int getUserID() {
            return userID;
        }

        public Role getRole() {
            return role;
        }

        public String getFirstName() {
            return firstName;
        }

        public String getLastName() {
            return lastName;
        }

        public String getEmail() {
            return email;
        }

        public String getPasswordHash() {
            return passwordHash;
        }

        public String getPhoneNumber() {
            return phoneNumber;
        }

        public String getStudentNumber() {
            return studentNumber;
        }

        public LocalDateTime getDateCreated() {
            return dateCreated;
        }

        public String getStatus() {
            return status;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (!(o instanceof User)) return false;
            User user = (User) o;
            return userID == user.userID;
        }

        @Override
        public int hashCode() {
            return Objects.hash(userID);
        }

        @Override
        public String toString() {
            return "User{" +
                    "userID=" + userID +
                    ", role=" + role +
                    ", firstName='" + firstName + '\'' +
                    ", lastName='" + lastName + '\'' +
                    ", email='" + email + '\'' +
                    ", phoneNumber='" + phoneNumber + '\'' +
                    ", studentNumber='" + studentNumber + '\'' +
                    ", dateCreated=" + dateCreated +
                    ", status='" + status + '\'' +
                    '}';
        }

        public static class Builder {
            private int userID;
            private Role role;
            private String firstName;
            private String lastName;
            private String email;
            private String passwordHash;
            private String phoneNumber;
            private String studentNumber;
            private LocalDateTime dateCreated;
            private String status;

            public Builder setUserID(int userID) {
                this.userID = userID;
                return this;
            }

            public Builder setRole(Role role) {
                this.role = role;
                return this;
            }

            public Builder setFirstName(String firstName) {
                this.firstName = firstName;
                return this;
            }

            public Builder setLastName(String lastName) {
                this.lastName = lastName;
                return this;
            }

            public Builder setEmail(String email) {
                this.email = email;
                return this;
            }

            public Builder setPasswordHash(String passwordHash) {
                this.passwordHash = passwordHash;
                return this;
            }

            public Builder setPhoneNumber(String phoneNumber) {
                this.phoneNumber = phoneNumber;
                return this;
            }

            public Builder setStudentNumber(String studentNumber) {
                this.studentNumber = studentNumber;
                return this;
            }

            public Builder setDateCreated(LocalDateTime dateCreated) {
                this.dateCreated = dateCreated;
                return this;
            }

            public Builder setStatus(String status) {
                this.status = status;
                return this;
            }

            public Builder copy(User user) {
                this.userID = user.userID;
                this.role = user.role;
                this.firstName = user.firstName;
                this.lastName = user.lastName;
                this.email = user.email;
                this.passwordHash = user.passwordHash;
                this.phoneNumber = user.phoneNumber;
                this.studentNumber = user.studentNumber;
                this.dateCreated = user.dateCreated;
                this.status = user.status;
                return this;
            }

            public User build() {
                return new User(this);
            }
        }
    }


