package za.ac.cput.communitystore.factory;

import za.ac.cput.communitystore.domain.Role;
import za.ac.cput.communitystore.util.Helper;

public class RoleFactory {

    private RoleFactory() {
        // static factory class, no instances
    }

    public static Role createRole(String roleName, String description) {
        if (Helper.isNullOrEmpty(roleName)) {
            throw new IllegalArgumentException("roleName cannot be null or empty");
        }
        if (Helper.isNullOrEmpty(description)) {
            throw new IllegalArgumentException("description cannot be null or empty");
        }

        return new Role.Builder()
                .setRoleName(roleName)
                .setDescription(description)
                .build();
    }
}