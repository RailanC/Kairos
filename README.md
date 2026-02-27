# Kairos - Artisanal Food E-commerce

Kairos is an e-commerce platform developed for an artisanal company that sells homemade food products such as cupcakes, pies, brigadeiros, cakes, and savory snacks. The project aims to digitalize and expand the company's online business, providing a complete experience for visitors, customers, and administrators.

## Features

- **Visitors**:
  - Browse and view products.
  - Add products to a cart stored locally.
  - Place orders without an account.
  - Create an account to become a customer.
  - View product reviews.

- **Customers (Registered Users)**:
  - Manage a cart linked to their account.
  - Place orders and track their status.
  - Write and view product reviews.
  - Edit and delete their account.

- **Administrator**:
  - Manage products (add, edit, delete).
  - Manage product categories.
  - Manage reviews and user accounts.
  - Manage orders (view, accept, reject, modify).
  - Configure company settings (working hours, order limits, delivery methods, etc.).

## Technologies Used

- Backend: PHP with Symfony
- Frontend: Twig, JavaScript, Bootstrap, HTML5, CSS3
- Database: PostgreSQL
- Others: LocalStorage for visitor carts, REST APIs for frontend-backend communication

## Installation

1. Clone the repository:
```bash
git clone https://github.com/RailanC/Kairos.git
cd Kairos
```
2. Install Symfony dependencies:
```bash
composer install
```
3. Configure the database in the .env file:
   - 3.1 Database
     ```text
     DB_USER= nameofadmin
     DB_PASSWORD= passwordofadmin
     DB_NAME= nameofdatabase
     DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@127.0.0.1:5432/${DB_NAME}?serverVersion=16&charset=utf8"
     ```
   - 3.2 Setup an account in Stripe and use the public and secrect keys in the STRIPE_PUBLIC_KEY and STRIPE_SECRET_KEY variables like this
     ```text
     STRIPE_SECRET_KEY = TheSecretKeyofStripe
     STRIPE_PUBLIC_KEY = ThePublicKeyofStripe
     ```
   - 3.3 configurate the mail using a mailer.

4. Create the database and run migrations:
   ```bash
   php bin/console doctrine:database:create
   php bin/console doctrine:migrations:migrate
   ```
5. Start the local server:
   ```bash
   symfony server:start
   ```
6. Access the application at http://localhost:8000


   
