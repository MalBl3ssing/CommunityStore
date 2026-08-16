package za.ac.cput.communitystore.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import za.ac.cput.communitystore.domain.VendorProfile;
import za.ac.cput.communitystore.repository.VendorProfileRepository;

import java.util.List;

@Service
public class VendorProfileService implements IVendorProfileService {

    private final VendorProfileRepository vendorProfileRepository;

    @Autowired
    public VendorProfileService(VendorProfileRepository vendorProfileRepository) {
        this.vendorProfileRepository = vendorProfileRepository;
    }

    @Override
    public VendorProfile create(VendorProfile vendorProfile) {
        return vendorProfileRepository.save(vendorProfile);
    }

    @Override
    public VendorProfile read(Integer id) {
        return vendorProfileRepository.findById(id).orElse(null);
    }

    @Override
    public VendorProfile update(VendorProfile vendorProfile) {
        if (!vendorProfileRepository.existsById(vendorProfile.getVendorProfileID())) {
            return null;
        }
        return vendorProfileRepository.save(vendorProfile);
    }

    @Override
    public void delete(Integer id) {
        vendorProfileRepository.deleteById(id);
    }

    @Override
    public List<VendorProfile> getAll() {
        return vendorProfileRepository.findAll();
    }

    @Override
    public VendorProfile findByUserID(int userID) {
        return vendorProfileRepository.findByUser_UserID(userID).orElse(null);
    }
}

