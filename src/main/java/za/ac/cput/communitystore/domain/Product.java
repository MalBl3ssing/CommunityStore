package za.ac.cput.communitystore.domain;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "Products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "productID")
    private int productID;

    @ManyToOne
    @JoinColumn(name = "sellerId", nullable = false)
    private User seller;

    @ManyToOne
    @JoinColumn(name = "categoryID", nullable = false)
    private Category category;

    @Column(name = "productName", nullable = false)
    private String productName;

    @Column(name = "description")
    private String description;

    @Column(name = "price", nullable = false)
    private BigDecimal price;

    @Column(name = "quantity", nullable = false)
    private int quantity;

    @Column(name = "condition", nullable = false)
    private String condition;

    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "datePosted", nullable = false)
    private LocalDateTime datePosted;

    protected Product() {

    }

    private Product(Builder builder) {
        this.productID = builder.productID;
        this.seller = builder.seller;
        this.category = builder.category;
        this.productName = builder.productName;
        this.description = builder.description;
        this.price = builder.price;
        this.quantity = builder.quantity;
        this.condition = builder.condition;
        this.status = builder.status;
        this.datePosted = builder.datePosted;
    }

    public int getProductID() {
        return productID;
    }

    public User getSeller() {
        return seller;
    }

    public Category getCategory() {
        return category;
    }

    public String getProductName() {
        return productName;
    }

    public String getDescription() {
        return description;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public int getQuantity() {
        return quantity;
    }

    public String getCondition() {
        return condition;
    }

    public String getStatus() {
        return status;
    }

    public LocalDateTime getDatePosted() {
        return datePosted;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Product)) return false;
        Product product = (Product) o;
        return productID == product.productID;
    }

    @Override
    public int hashCode() {
        return Objects.hash(productID);
    }

    @Override
    public String toString() {
        return "Product{" +
                "productID=" + productID +
                ", seller=" + seller +
                ", category=" + category +
                ", productName='" + productName + '\'' +
                ", description='" + description + '\'' +
                ", price=" + price +
                ", quantity=" + quantity +
                ", condition='" + condition + '\'' +
                ", status='" + status + '\'' +
                ", datePosted=" + datePosted +
                '}';
    }

    public static class Builder {

        private int productID;
        private User seller;
        private Category category;
        private String productName;
        private String description;
        private BigDecimal price;
        private int quantity;
        private String condition;
        private String status;
        private LocalDateTime datePosted;

        public Builder setProductID(int productID) {
            this.productID = productID;
            return this;
        }

        public Builder setSeller(User seller) {
            this.seller = seller;
            return this;
        }

        public Builder setCategory(Category category) {
            this.category = category;
            return this;
        }

        public Builder setProductName(String productName) {
            this.productName = productName;
            return this;
        }

        public Builder setDescription(String description) {
            this.description = description;
            return this;
        }

        public Builder setPrice(BigDecimal price) {
            this.price = price;
            return this;
        }

        public Builder setQuantity(int quantity) {
            this.quantity = quantity;
            return this;
        }

        public Builder setCondition(String condition) {
            this.condition = condition;
            return this;
        }

        public Builder setStatus(String status) {
            this.status = status;
            return this;
        }

        public Builder setDatePosted(LocalDateTime datePosted) {
            this.datePosted = datePosted;
            return this;
        }

        public Builder copy(Product product) {
            this.productID = product.productID;
            this.seller = product.seller;
            this.category = product.category;
            this.productName = product.productName;
            this.description = product.description;
            this.price = product.price;
            this.quantity = product.quantity;
            this.condition = product.condition;
            this.status = product.status;
            this.datePosted = product.datePosted;
            return this;
        }

        public Product build() {
            return new Product(this);
        }
    }
}