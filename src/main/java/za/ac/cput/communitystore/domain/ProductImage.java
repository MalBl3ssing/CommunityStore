package za.ac.cput.communitystore.domain;

import jakarta.persistence.*;

        import java.util.Objects;

@Entity
@Table(name = "ProductImages")
public class ProductImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "imageId")
    private int imageId;

    @ManyToOne
    @JoinColumn(name = "productID", nullable = false)
    private Product product;

    @Column(name = "imageURL", nullable = false)
    private String imageURL;

    @Column(name = "isPrimary", nullable = false)
    private boolean isPrimary;

    protected ProductImage() {

    }

    private ProductImage(Builder builder) {
        this.imageId = builder.imageId;
        this.product = builder.product;
        this.imageURL = builder.imageURL;
        this.isPrimary = builder.isPrimary;
    }

    public int getImageId() {
        return imageId;
    }

    public Product getProduct() {
        return product;
    }

    public String getImageURL() {
        return imageURL;
    }

    public boolean isPrimary() {
        return isPrimary;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ProductImage)) return false;
        ProductImage that = (ProductImage) o;
        return imageId == that.imageId;
    }

    @Override
    public int hashCode() {
        return Objects.hash(imageId);
    }

    @Override
    public String toString() {
        return "ProductImage{" +
                "imageId=" + imageId +
                ", product=" + product +
                ", imageURL='" + imageURL + '\'' +
                ", isPrimary=" + isPrimary +
                '}';
    }

    public static class Builder {

        private int imageId;
        private Product product;
        private String imageURL;
        private boolean isPrimary;

        public Builder setImageId(int imageId) {
            this.imageId = imageId;
            return this;
        }

        public Builder setProduct(Product product) {
            this.product = product;
            return this;
        }

        public Builder setImageURL(String imageURL) {
            this.imageURL = imageURL;
            return this;
        }

        public Builder setPrimary(boolean primary) {
            isPrimary = primary;
            return this;
        }

        public Builder copy(ProductImage image) {
            this.imageId = image.imageId;
            this.product = image.product;
            this.imageURL = image.imageURL;
            this.isPrimary = image.isPrimary;
            return this;
        }

        public ProductImage build() {
            return new ProductImage(this);
        }
    }
}