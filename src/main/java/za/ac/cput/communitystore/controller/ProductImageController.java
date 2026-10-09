package za.ac.cput.communitystore.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
        import org.springframework.web.server.ResponseStatusException;
import za.ac.cput.communitystore.domain.ProductImage;
import za.ac.cput.communitystore.factory.ProductImageFactory;
import za.ac.cput.communitystore.service.IProductImageService;

import java.util.List;

@RestController
@RequestMapping("/api/productimages")
public class ProductImageController {

    private final IProductImageService productImageService;

    @Autowired
    public ProductImageController(IProductImageService productImageService) {
        this.productImageService = productImageService;
    }

    @PostMapping("/create")
    public ProductImage create(@RequestBody ProductImage productImage) {
        try {
            ProductImage valid = ProductImageFactory.createProductImage(
                    productImage.getProduct(),
                    productImage.getImageURL(),
                    productImage.isPrimary());

            return productImageService.create(valid);

        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    e.getMessage());
        }
    }

    @GetMapping("/read/{id}")
    public ProductImage read(@PathVariable int id) {

        ProductImage image = productImageService.read(id);

        if (image == null) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Product image not found: " + id);
        }

        return image;
    }

    @PutMapping("/update")
    public ProductImage update(@RequestBody ProductImage productImage) {

        try {
            ProductImage valid = ProductImageFactory.withDetails(
                    productImage,
                    productImage.getProduct(),
                    productImage.getImageURL(),
                    productImage.isPrimary());

            ProductImage updated = productImageService.update(valid);

            if (updated == null) {
                throw new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Product image not found: " +
                                productImage.getImageId());
            }

            return updated;

        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    e.getMessage());
        }
    }

    @DeleteMapping("/delete/{id}")
    public void delete(@PathVariable int id) {
        productImageService.delete(id);
    }

    @GetMapping("/getAll")
    public List<ProductImage> getAll() {
        return productImageService.getAll();
    }

    @GetMapping("/findByProductId/{productID}")
    public List<ProductImage> findByProductId(
            @PathVariable int productID) {

        return productImageService.findByProductId(productID);
    }
}