package za.ac.cput.communitystore.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import za.ac.cput.communitystore.domain.VendorProfile;
import za.ac.cput.communitystore.service.VendorProfileService;

import java.util.List;

@RestController
@RequestMapping("/api/vendor-profiles")
public class VendorProfileController {

    private final VendorProfileService vendorProfileService;

    @Autowired
    public VendorProfileController(VendorProfileService vendorProfileService) {
        this.vendorProfileService = vendorProfileService;
    }

    @PostMapping("/create")
    public VendorProfile create(@RequestBody VendorProfile vendorProfile) {
        return vendorProfileService.create(vendorProfile);
    }

    @GetMapping("/read/{id}")
    public VendorProfile read(@PathVariable int id) {
        return vendorProfileService.read(id);
    }

    @PutMapping("/update")
    public VendorProfile update(@RequestBody VendorProfile vendorProfile) {
        return vendorProfileService.update(vendorProfile);
    }

    @DeleteMapping("/delete/{id}")
    public void delete(@PathVariable int id) {
        vendorProfileService.delete(id);
    }

    @GetMapping("/getAll")
    public List<VendorProfile> getAll() {
        return vendorProfileService.getAll();
    }

    @GetMapping("/findByUser/{userID}")
    public VendorProfile findByUserID(@PathVariable int userID) {
        return vendorProfileService.findByUserID(userID);
    }
}

