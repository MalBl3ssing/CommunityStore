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
import za.ac.cput.communitystore.domain.Role;
import za.ac.cput.communitystore.service.RoleService;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
public class RoleController {

    private final RoleService roleService;

    @Autowired
    public RoleController(RoleService roleService) {
        this.roleService = roleService;
    }

    @PostMapping("/create")
    public Role create(@RequestBody Role role) {
        return roleService.create(role);
    }

    @GetMapping("/read/{id}")
    public Role read(@PathVariable int id) {
        return roleService.read(id);
    }

    @PutMapping("/update")
    public Role update(@RequestBody Role role) {
        return roleService.update(role);
    }

    @DeleteMapping("/delete/{id}")
    public void delete(@PathVariable int id) {
        roleService.delete(id);
    }

    @GetMapping("/getAll")
    public List<Role> getAll() {
        return roleService.getAll();
    }
}

