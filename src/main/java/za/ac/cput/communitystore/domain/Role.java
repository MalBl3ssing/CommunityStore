package za.ac.cput.communitystore.domain;

import java.util.Objects;



    import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
    @Table(name = "roles")
    public class Role {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private int roleID;

        private String roleName;
        private String description;

        protected Role() {
            // required by JPA
        }

        private Role(Builder builder) {
            this.roleID = builder.roleID;
            this.roleName = builder.roleName;
            this.description = builder.description;
        }

        public int getRoleID() {
            return roleID;
        }

        public String getRoleName() {
            return roleName;
        }

        public String getDescription() {
            return description;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (!(o instanceof Role)) return false;
            Role role = (Role) o;
            return roleID == role.roleID;
        }

        @Override
        public int hashCode() {
            return Objects.hash(roleID);
        }

        @Override
        public String toString() {
            return "Role{" +
                    "roleID=" + roleID +
                    ", roleName='" + roleName + '\'' +
                    ", description='" + description + '\'' +
                    '}';
        }

        public static class Builder {
            private int roleID;
            private String roleName;
            private String description;

            public Builder setRoleID(int roleID) {
                this.roleID = roleID;
                return this;
            }

            public Builder setRoleName(String roleName) {
                this.roleName = roleName;
                return this;
            }

            public Builder setDescription(String description) {
                this.description = description;
                return this;
            }

            public Builder copy(Role role) {
                this.roleID = role.roleID;
                this.roleName = role.roleName;
                this.description = role.description;
                return this;
            }

            public Role build() {
                return new Role(this);
            }
        }
    }


