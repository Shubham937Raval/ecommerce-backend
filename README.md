# E-Commerce Backend

This is an E-Commerce backend developed using Node.js, Express, and PostgreSQL. The application supports user signup, login, adding products to a cart, placing orders, and viewing order details. The JWT (JSON Web Token) is used for authentication and authorization.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [API Endpoints](#api-endpoints)
- [Testing the APIs](#testing-the-apis)
- [Queries](#queries)
- [Dumping Database](#dumping-database)

## Features

- User Signup and Login
- JWT-based Authentication
- CRUD operations for Products
- Add to Cart functionality
- Place Orders
- View Orders
- User-wise order summaries

## Prerequisites

- Node.js and npm
- PostgreSQL

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/ecommerce-backend.git
    cd ecommerce-backend
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Create a `.env` file in the root directory and add the following environment variables:
    ```env
    DB_USER=postgres
    DB_HOST=localhost
    DB_NAME=your_db_name(in my dump file name is ecommerce)
    DB_PASSWORD=your_db_password(in my dump file password is root)
    DB_PORT=5432
    JWT_SECRET=your_jwt_secret
    PORT=5000

    ```

4. Start the server:
    ```sh
    npm start
    ```

## Database Setup

1. Connect to PostgreSQL and create the necessary tables:
    ```sql
    CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        token TEXT
    );

    CREATE TABLE products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price NUMERIC(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        total NUMERIC(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id),
        product_id INTEGER REFERENCES products(id),
        quantity INTEGER NOT NULL,
        price NUMERIC(10, 2) NOT NULL
    );

    CREATE TABLE cart (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        product_id INTEGER REFERENCES products(id),
        quantity INTEGER NOT NULL
    );
    ```

2. (Optional) Restore the database from the provided dump file (Here I have provided dump file ):
    ```sh
    psql -U username -d ecommerce -f dump.sql
    ```

## API Endpoints

### User Routes

- **Signup**: `POST /api/users/signup`
- **Login**: `POST /api/users/login`
- **Logout**: `POST /api/users/logout`

### Product Routes

- **Add Product**: `POST /api/products`
- **Get All Products**: `GET /api/products`

### Cart Routes

- **Add to Cart**: `POST /api/cart/add-to-cart`
- **Get Cart Items**: `GET /api/cart`

### Order Routes

- **Place Order**: `POST /api/orders/place-order`
- **Get Orders**: `GET /api/orders`
### Query Routes

- **Get Second Highest Order Value**: `GET /api/queries/second-highest-order`
- **Get Monthly Orders Analysis**: `GET /api/queries/monthly-orders-analysis`
- **Get User Ordering Summary**: `GET /api/queries/user-ordering-summary`

## Testing the APIs

You can test the APIs using tools like [Thunder Client](https://www.thunderclient.com/) or [Postman](https://www.postman.com/).

1. **Signup Users**:
    - URL: `POST /api/users/signup`
    - Body:
      ```json
      {
          "username": "user1",
          "email": "user1@gmail.com",
          "password": "password123"
      }
      ```

2. **Login Users**:
    - URL: `POST /api/users/login`
    - Body:
      ```json
      {
          "email": "user1@gmail.com",
          "password": "password123"
      }
      ```
    - Copy the token from the response.

3. **Add Products**:
    - URL: `POST /api/products`
    - Headers: `Authorization: Bearer your_jwt_token`
    - Body:
      ```json
      {
          "name": "Product 1",
          "description": "Description for product 1",
          "price": 10.00
      }
      ```

4. **Add to Cart**:
    - URL: `POST /api/cart/add-to-cart`
    - Headers: `Authorization: Bearer your_jwt_token`
    - Body:
      ```json
      {
          "productId": 1,
          "quantity": 2
      }
      ```

5. **Place Order**:
    - URL: `POST /api/orders/place-order`
    - Headers: `Authorization: Bearer your_jwt_token`
    - Body:
      ```json
      {
          "totalAmount": 20.00,
          "paymentMethod": "Credit Card"
      }
      ```

## Queries

You can use the following endpoints to get query results:

1. **Get Second Highest Order Value**:
    - URL: `GET /api/queries/second-highest-order`
    - Headers: `Authorization: Bearer your_jwt_token`

2. **Get Monthly Orders Analysis**:
    - URL: `GET /api/queries/monthly-orders-analysis`
    - Headers: `Authorization: Bearer your_jwt_token`

3. **Get User Ordering Summary**:
    - URL: `GET /api/queries/user-ordering-summary`
    - Headers: `Authorization: Bearer your_jwt_token`

## Dumping Database

You can find the database dump file in this repository. Use the following command to restore it:
username:"postgres"
```sh
psql -U username -d ecommerce -f dump.sql
