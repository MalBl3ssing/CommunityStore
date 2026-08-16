-- COMMUNITY STORE DATABASE 

DROP DATABASE IF EXISTS CommunityStoreDB;
CREATE DATABASE CommunityStoreDB;
USE CommunityStoreDB;

CREATE TABLE Roles (
    roleId INT AUTO_INCREMENT PRIMARY KEY,
    roleName VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255)
);

CREATE TABLE Users (
    userId INT AUTO_INCREMENT PRIMARY KEY,
    roleId INT NOT NULL,
    firstName VARCHAR(50) NOT NULL,
    lastName VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    passwordHash VARCHAR(255) NOT NULL,
    phoneNumber VARCHAR(20),
    studentNumber VARCHAR(20) UNIQUE,
    dateCreated DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) NOT NULL DEFAULT 'Active',
    CONSTRAINT fk_users_roles FOREIGN KEY (roleId) REFERENCES Roles(roleId)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT ck_users_status CHECK (status IN ('Active','Inactive','Suspended'))
);

CREATE TABLE VendorProfiles (
    vendorProfileId INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL UNIQUE,
    businessName VARCHAR(150) NOT NULL,
    businessRegistrationNumber VARCHAR(100) NOT NULL UNIQUE,
    verificationStatus VARCHAR(20) NOT NULL DEFAULT 'Pending',
    verificationDocumentUrl VARCHAR(255) NOT NULL,
    submittedDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    verifiedDate DATETIME,
    CONSTRAINT fk_vendorProfiles_user FOREIGN KEY (userId) REFERENCES Users(userId)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT ck_vendorProfiles_status CHECK (verificationStatus IN ('Pending','Verified','Rejected'))
);

CREATE TABLE Categories (
    categoryId INT AUTO_INCREMENT PRIMARY KEY,
    categoryName VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(255)
);

CREATE TABLE Products (
    productId INT AUTO_INCREMENT PRIMARY KEY,
    sellerId INT NOT NULL,
    categoryId INT NOT NULL,
    productName VARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    `condition` VARCHAR(50) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'Available',
    datePosted DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_products_seller FOREIGN KEY (sellerId) REFERENCES Users(userId)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_products_category FOREIGN KEY (categoryId) REFERENCES Categories(categoryId)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT ck_products_price CHECK (price >= 0),
    CONSTRAINT ck_products_quantity CHECK (quantity >= 0),
    CONSTRAINT ck_products_status CHECK (status IN ('Available','Sold','Inactive','Pending')),
    CONSTRAINT ck_products_condition CHECK (`condition` IN ('New','Like New','Good','Fair','Poor'))
);

CREATE TABLE ProductImages (
    imageId INT AUTO_INCREMENT PRIMARY KEY,
    productId INT NOT NULL,
    imageUrl VARCHAR(255) NOT NULL,
    isPrimary BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_productImages_product FOREIGN KEY (productId) REFERENCES Products(productId)
        ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE ShoppingCart (
    cartId INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL UNIQUE,
    createdDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_shoppingCart_user FOREIGN KEY (userId) REFERENCES Users(userId)
        ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE CartItems (
    cartItemId INT AUTO_INCREMENT PRIMARY KEY,
    cartId INT NOT NULL,
    productId INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    CONSTRAINT fk_cartItems_cart FOREIGN KEY (cartId) REFERENCES ShoppingCart(cartId)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_cartItems_product FOREIGN KEY (productId) REFERENCES Products(productId)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT uq_cart_product UNIQUE (cartId, productId),
    CONSTRAINT ck_cartItems_quantity CHECK (quantity > 0)
);

CREATE TABLE Orders (
    orderId INT AUTO_INCREMENT PRIMARY KEY,
    buyerId INT NOT NULL,
    orderDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    orderStatus VARCHAR(30) NOT NULL DEFAULT 'Pending',
    totalAmount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    shippingAddress VARCHAR(255) NOT NULL,
    CONSTRAINT fk_orders_buyer FOREIGN KEY (buyerId) REFERENCES Users(userId)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT ck_orders_total CHECK (totalAmount >= 0),
    CONSTRAINT ck_orders_status CHECK (orderStatus IN
        ('Pending','Paid','Processing','Shipped','Completed','Cancelled'))
);

CREATE TABLE OrderItems (
    orderItemId INT AUTO_INCREMENT PRIMARY KEY,
    orderId INT NOT NULL,
    productId INT NOT NULL,
    quantity INT NOT NULL,
    unitPrice DECIMAL(10,2) NOT NULL,
    CONSTRAINT fk_orderItems_order FOREIGN KEY (orderId) REFERENCES Orders(orderId)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_orderItems_product FOREIGN KEY (productId) REFERENCES Products(productId)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT ck_orderItems_quantity CHECK (quantity > 0),
    CONSTRAINT ck_orderItems_unitPrice CHECK (unitPrice >= 0)
);

CREATE TABLE Payments (
    paymentId INT AUTO_INCREMENT PRIMARY KEY,
    orderId INT NOT NULL UNIQUE,
    amount DECIMAL(10,2) NOT NULL,
    paymentMethod VARCHAR(50) NOT NULL,
    paymentStatus VARCHAR(30) NOT NULL DEFAULT 'Pending',
    paymentDate DATETIME,
    transactionReference VARCHAR(100) UNIQUE,
    CONSTRAINT fk_payments_order FOREIGN KEY (orderId) REFERENCES Orders(orderId)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT ck_payments_amount CHECK (amount >= 0),
    CONSTRAINT ck_payments_status CHECK
        (paymentStatus IN ('Pending','Successful','Failed','Refunded'))
);

CREATE TABLE Reviews (
    reviewId INT AUTO_INCREMENT PRIMARY KEY,
    productId INT NOT NULL,
    reviewerId INT NOT NULL,
    rating INT NOT NULL,
    comment TEXT,
    reviewDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_reviews_product FOREIGN KEY (productId) REFERENCES Products(productId)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_reviews_reviewer FOREIGN KEY (reviewerId) REFERENCES Users(userId)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT uq_review_user_product UNIQUE (productId, reviewerId),
    CONSTRAINT ck_reviews_rating CHECK (rating BETWEEN 1 AND 5)
);

CREATE TABLE CommunityPosts (
    postId INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    content TEXT NOT NULL,
    postDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_communityPosts_user FOREIGN KEY (userId) REFERENCES Users(userId)
        ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE Notifications (
    notificationId INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    message TEXT NOT NULL,
    isRead BOOLEAN NOT NULL DEFAULT FALSE,
    createdDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notifications_user FOREIGN KEY (userId) REFERENCES Users(userId)
        ON UPDATE CASCADE ON DELETE CASCADE
);

-- targetType + targetId together point at whichever table was flagged
-- (Products, Reviews, CommunityPosts, or Users). This is a polymorphic
-- reference, so it cannot be enforced with a real foreign key -- that
-- integrity check has to happen in the application/service layer.
CREATE TABLE Reports (
    reportId INT AUTO_INCREMENT PRIMARY KEY,
    reporterId INT NOT NULL,
    reviewedBy INT,
    targetType VARCHAR(30) NOT NULL,
    targetId INT NOT NULL,
    reason VARCHAR(100) NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'Pending',
    createdDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    resolvedDate DATETIME,
    CONSTRAINT fk_reports_reporter FOREIGN KEY (reporterId) REFERENCES Users(userId)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_reports_reviewedBy FOREIGN KEY (reviewedBy) REFERENCES Users(userId)
        ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT ck_reports_targetType CHECK (targetType IN ('Product','Review','CommunityPost','User')),
    CONSTRAINT ck_reports_status CHECK (status IN ('Pending','Reviewed','ActionTaken','Dismissed'))
);

CREATE INDEX idx_users_roleId ON Users(roleId);
CREATE INDEX idx_products_sellerId ON Products(sellerId);
CREATE INDEX idx_products_categoryId ON Products(categoryId);
CREATE INDEX idx_products_name ON Products(productName);
CREATE INDEX idx_products_status ON Products(status);
CREATE INDEX idx_products_datePosted ON Products(datePosted);
CREATE INDEX idx_cartItems_productId ON CartItems(productId);
CREATE INDEX idx_orders_buyerId ON Orders(buyerId);
CREATE INDEX idx_orders_status ON Orders(orderStatus);
CREATE INDEX idx_orders_date ON Orders(orderDate);
CREATE INDEX idx_orderItems_productId ON OrderItems(productId);
CREATE INDEX idx_reviews_productId ON Reviews(productId);
CREATE INDEX idx_communityPosts_date ON CommunityPosts(postDate);
CREATE INDEX idx_notifications_user_read ON Notifications(userId, isRead);
CREATE INDEX idx_vendorProfiles_status ON VendorProfiles(verificationStatus);
CREATE INDEX idx_reports_reporterId ON Reports(reporterId);
CREATE INDEX idx_reports_status ON Reports(status);
CREATE INDEX idx_reports_target ON Reports(targetType, targetId);

INSERT INTO Roles (roleName, description) VALUES
('Student','Student who can buy and participate in the community'),
('Vendor','User who can create and manage product listings'),
('Admin','Administrator who manages the platform');

INSERT INTO Users
(roleId, firstName, lastName, email, passwordHash, phoneNumber, studentNumber)
VALUES
(1,'John','Mokoena','john@example.com','$2a$10$examplehashstudent','0712345678','STU001'),
(2,'Sarah','Naidoo','sarah@example.com','$2a$10$examplehashvendor','0723456789',NULL),
(3,'Admin','User','admin@example.com','$2a$10$examplehashadmin','0734567890',NULL);

INSERT INTO VendorProfiles
(userId, businessName, businessRegistrationNumber, verificationStatus, verificationDocumentUrl, verifiedDate)
VALUES
(2,'Sarah Books','K2024001234','Verified','docs/sarah-books-registration.pdf',CURRENT_TIMESTAMP);

INSERT INTO Categories (categoryName, description) VALUES
('Books','New and second-hand academic and general books'),
('Electronics','Electronic devices and accessories'),
('Clothing','Second-hand clothing and fashion items'),
('Furniture','Furniture and household items'),
('Stationery','Stationery and academic supplies');

INSERT INTO Products
(sellerId, categoryId, productName, description, price, quantity, `condition`, status)
VALUES
(2,1,'Database Systems Textbook','Second-hand database textbook in good condition.',350.00,1,'Good','Available'),
(2,1,'Java Programming Book','Java programming textbook suitable for university students.',280.00,2,'Good','Available'),
(2,2,'Wireless Keyboard','Wireless keyboard with USB receiver.',250.00,1,'Like New','Available');

INSERT INTO ProductImages (productId, imageUrl, isPrimary) VALUES
(1,'images/database-book.jpg',TRUE),
(2,'images/java-book.jpg',TRUE),
(3,'images/keyboard.jpg',TRUE);

INSERT INTO ShoppingCart (userId) VALUES (1),(2);

INSERT INTO CartItems (cartId, productId, quantity) VALUES
(1,1,1),(1,2,1);

INSERT INTO CommunityPosts (userId, title, content) VALUES
(1,'Looking for a Database Textbook','Does anyone have a second-hand database textbook available?'),
(2,'New Books Available','I have added several second-hand textbooks to the store.');

INSERT INTO Notifications (userId, message) VALUES
(1,'Welcome to the Community Store!'),
(2,'Your product listings are now available.');

INSERT INTO Reports (reporterId, targetType, targetId, reason, description) VALUES
(1,'Product',3,'Misleading description','The product description does not match the images provided.');

CREATE VIEW AvailableProducts AS
SELECT p.productId,p.productName,p.description,p.price,p.quantity,p.`condition`,p.datePosted,
       CONCAT(u.firstName,' ',u.lastName) AS sellerName,c.categoryName
FROM Products p
JOIN Users u ON p.sellerId=u.userId
JOIN Categories c ON p.categoryId=c.categoryId
WHERE p.status='Available' AND p.quantity>0;

CREATE VIEW OrderSummary AS
SELECT o.orderId,CONCAT(u.firstName,' ',u.lastName) AS buyerName,
       o.orderDate,o.orderStatus,o.totalAmount,COUNT(oi.orderItemId) AS numberOfItems
FROM Orders o
JOIN Users u ON o.buyerId=u.userId
LEFT JOIN OrderItems oi ON o.orderId=oi.orderId
GROUP BY o.orderId,u.firstName,u.lastName,o.orderDate,o.orderStatus,o.totalAmount;

CREATE VIEW ProductRatings AS
SELECT p.productId,p.productName,COUNT(r.reviewId) AS numberOfReviews,
       COALESCE(AVG(r.rating),0) AS averageRating
FROM Products p
LEFT JOIN Reviews r ON p.productId=r.productId
GROUP BY p.productId,p.productName;

DELIMITER $$

CREATE TRIGGER trg_productQuantityUpdate
AFTER UPDATE ON Products
FOR EACH ROW
BEGIN
    IF NEW.quantity=0 THEN
        UPDATE Products SET status='Sold' WHERE productId=NEW.productId;
    ELSEIF NEW.quantity>0 AND OLD.quantity=0 THEN
        UPDATE Products SET status='Available' WHERE productId=NEW.productId;
    END IF;
END$$

CREATE TRIGGER trg_orderCreatedNotification
AFTER INSERT ON Orders
FOR EACH ROW
BEGIN
    INSERT INTO Notifications (userId,message)
    VALUES (NEW.buyerId,CONCAT('Your order #',NEW.orderId,' has been created successfully.'));
END$$

CREATE PROCEDURE AddToCart(
    IN p_userId INT, IN p_productId INT, IN p_quantity INT
)
BEGIN
    DECLARE v_cartId INT;
    SELECT cartId INTO v_cartId FROM ShoppingCart WHERE userId=p_userId;

    IF v_cartId IS NULL THEN
        INSERT INTO ShoppingCart (userId) VALUES (p_userId);
        SET v_cartId=LAST_INSERT_ID();
    END IF;

    INSERT INTO CartItems (cartId,productId,quantity)
    VALUES (v_cartId,p_productId,p_quantity)
    ON DUPLICATE KEY UPDATE quantity=quantity+p_quantity;
END$$

CREATE PROCEDURE RemoveFromCart(
    IN p_userId INT, IN p_productId INT
)
BEGIN
    DELETE ci FROM CartItems ci
    JOIN ShoppingCart sc ON ci.cartId=sc.cartId
    WHERE sc.userId=p_userId AND ci.productId=p_productId;
END$$

CREATE PROCEDURE PlaceOrder(
    IN p_userId INT, IN p_shippingAddress VARCHAR(255)
)
BEGIN
    DECLARE v_cartId INT;
    DECLARE v_orderId INT;
    DECLARE v_total DECIMAL(10,2);

    START TRANSACTION;

    SELECT cartId INTO v_cartId FROM ShoppingCart WHERE userId=p_userId;

    IF v_cartId IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='Shopping cart does not exist.';
    END IF;

    SELECT COALESCE(SUM(ci.quantity*p.price),0)
    INTO v_total
    FROM CartItems ci JOIN Products p ON ci.productId=p.productId
    WHERE ci.cartId=v_cartId;

    IF v_total=0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='Shopping cart is empty.';
    END IF;

    IF EXISTS (
        SELECT 1 FROM CartItems ci
        JOIN Products p ON ci.productId=p.productId
        WHERE ci.cartId=v_cartId AND ci.quantity>p.quantity
    ) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='Insufficient product stock.';
    END IF;

    INSERT INTO Orders (buyerId,shippingAddress,totalAmount)
    VALUES (p_userId,p_shippingAddress,v_total);

    SET v_orderId=LAST_INSERT_ID();

    INSERT INTO OrderItems (orderId,productId,quantity,unitPrice)
    SELECT v_orderId,ci.productId,ci.quantity,p.price
    FROM CartItems ci JOIN Products p ON ci.productId=p.productId
    WHERE ci.cartId=v_cartId;

    UPDATE Products p
    JOIN CartItems ci ON p.productId=ci.productId
    SET p.quantity=p.quantity-ci.quantity
    WHERE ci.cartId=v_cartId;

    DELETE FROM CartItems WHERE cartId=v_cartId;

    COMMIT;
END$$

CREATE PROCEDURE AddPayment(
    IN p_orderId INT, IN p_amount DECIMAL(10,2),
    IN p_paymentMethod VARCHAR(50), IN p_transactionReference VARCHAR(100)
)
BEGIN
    INSERT INTO Payments
    (orderId,amount,paymentMethod,paymentStatus,paymentDate,transactionReference)
    VALUES
    (p_orderId,p_amount,p_paymentMethod,'Successful',CURRENT_TIMESTAMP,p_transactionReference);

    UPDATE Orders SET orderStatus='Paid' WHERE orderId=p_orderId;
END$$

CREATE PROCEDURE AddReview(
    IN p_productId INT, IN p_reviewerId INT,
    IN p_rating INT, IN p_comment TEXT
)
BEGIN
    INSERT INTO Reviews (productId,reviewerId,rating,comment)
    VALUES (p_productId,p_reviewerId,p_rating,p_comment);
END$$

DELIMITER ;

-- ============================================================
-- VERIFICATION
-- ============================================================

SHOW TABLES;

SELECT * FROM Roles;
SELECT * FROM Users;
SELECT * FROM VendorProfiles;
SELECT * FROM Categories;
SELECT * FROM Products;
SELECT * FROM ProductImages;
SELECT * FROM ShoppingCart;
SELECT * FROM CartItems;
SELECT * FROM Orders;
SELECT * FROM OrderItems;
SELECT * FROM Payments;
SELECT * FROM Reviews;
SELECT * FROM CommunityPosts;
SELECT * FROM Notifications;
SELECT * FROM Reports;

SELECT * FROM AvailableProducts;
SELECT * FROM OrderSummary;
SELECT * FROM ProductRatings;