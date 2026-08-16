package za.ac.cput.communitystore.service;

import za.ac.cput.communitystore.domain.User;

public interface IUserService extends IService<User, Integer> {

    User findByEmail(String email);
}
