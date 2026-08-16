package za.ac.cput.communitystore.service;

import za.ac.cput.communitystore.domain.VendorProfile;

public interface IVendorProfileService extends IService<VendorProfile, Integer> {

    VendorProfile findByUserID(int userID);
}