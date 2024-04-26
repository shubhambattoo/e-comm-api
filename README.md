# Ecommerce Store API

> This project provides a set of RESTful APIs for managing a simple ecommerce store. It supports operations such as adding items to a cart, checking out, generating discount codes, and retrieving purchase statistics.

## Getting Started

### Prerequisites

- Node.js (version 18 or later recommended)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/shubhambattoo/e-comm-api.git
```

1. Navigate to the project directory:

```bash
cd e-comm-api
```

1. Install dependencies:

```bash
npm install
```

1. Configure environment variables:

- Copy the .env.example file to .env and fill in the necessary details (e.g., database connection, ports).

1. Start the server:

```bash
npm run dev
```

This will start a dev server using ts-node

## API Endpoints

### Product Management

- Add Item to Cart

  - POST /api/cart/add
  - Body: { "item_id": "12345", "quantity": 2 }

- Checkout
  - POST /api/cart/checkout
  - Body: { "cart_id": "abc123", "discount_code": "DISCOUNT10" }

### Admin Operations

- Generate Discount Code

  - POST /api/discount/generate

- List Purchase Statistics
  - GET api/admin/stats
