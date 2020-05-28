CREATE TABLE Restaurant (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200),
    description VARCHAR(200),
    address VARCHAR(200)
);

CREATE TABLE Category (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200)
);

CREATE TABLE RestaurantCategories (
    restaurant INT NOT NULL,
    category INT NOT NULL,
    FOREIGN KEY (restaurant) REFERENCES Restaurant(id),
    FOREIGN KEY (category) REFERENCES Category(id)
);

CREATE TABLE User (
    id SERIAL PRIMARY KEY,
    username VARCHAR(200)    
);

CREATE TABLE Ordering (
    id SERIAL PRIMARY KEY,
    restaurant INT NOT NULL,
    place INT, 
    status VARCHAR(20) DEFAULT 'active',
    user INT,   
    FOREIGN KEY (restaurant) REFERENCES Restaurant(id),
    FOREIGN KEY (user) REFERENCES User(id)
);

CREATE TABLE Dish (
    id SERIAL PRIMARY KEY,
    restaurant INT,
    name VARCHAR(200), 
    price INT,
    description VARCHAR(200),
    FOREIGN KEY (restaurant) REFERENCES Restaurant(id)
);

CREATE TABLE OrderedDish (
    id SERIAL PRIMARY KEY,
    dish INT NOT NULL,
    ordering INT NOT NULL,
    FOREIGN KEY (ordering) REFERENCES Ordering(id),
    FOREIGN KEY (dish) REFERENCES Dish(id)
);


