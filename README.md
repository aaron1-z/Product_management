# Product Management Web App

## 🚀 Overview

This is a full-stack web application designed for managing a product catalog. It allows users to register, log in, and perform CRUD (Create, Read, Update, Delete) operations on products. Key features include user authentication using JWT and product filtering, searching, sorting, and basic pagination on the frontend.

This project was built as part of a full-stack developer assignment.

## ✨ Features

*   **User Authentication:**
    *   User Signup (Email/Password)
    *   User Login (JWT-based)
    *   Logout Functionality
    *   Protected Routes for Product Management
*   **Product Management (CRUD):**
    *   Create new products (Name, Description, Category, Price, Rating)
    *   View all products in a sortable, filterable, searchable list
    *   Update existing products
    *   Delete products
*   **Product Listing Enhancements:**
    *   Filter products by Category
    *   Filter products by Price Range
    *   Filter products by Rating Range
    *   Search products by Name or Description (case-insensitive)
    *   Sort products by Name, Category, Price, Rating, or Creation Date
    *   Basic client-side pagination

## 🛠️ Tech Stack

*   **Backend:**
    *   Language: **TypeScript**
    *   Framework: **Node.js (NestJS)**
    *   Database: **MongoDB** (using MongoDB Atlas for cloud hosting / or specify local)
    *   ORM: **Mongoose**
    *   Authentication: **Passport.js** (JWT Strategy), **bcrypt** (Password Hashing)
    *   Validation: **class-validator**, **class-transformer**
*   **Frontend:**
    *   Library: **React.js** (using Functional Components and Hooks)
    *   State Management: **React Context API** (`AuthContext`)
    *   Routing: **React Router DOM** (`v6`)
    *   API Calls: **Axios** (with interceptors for JWT)
    *   Styling: **Inline Styles / Basic CSS** *(Bootstrap)*
    *   Build Tool: **Vite** *(or Create React App)*
*   **Database:**
    *   **MongoDB**

##  Prerequisites

Before you begin, ensure you have the following installed:

*   [Node.js](https://nodejs.org/) (LTS version recommended, e.g., v18 or v20)
*   [npm](https://www.npmjs.com/) (usually comes with Node.js) or [yarn](https://yarnpkg.com/)
*   [MongoDB](https://www.mongodb.com/try/download/community) instance running (either locally or a cloud instance like MongoDB Atlas)
*   [Git](https://git-scm.com/) (optional, for cloning)

## ⚙️ Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone <https://github.com/aaron1-z/Product_management>
    cd product-management-app
    ```
    

2.  **Backend Setup:**
    *   Navigate to the backend directory:
        ```bash
        cd backend
        ```
    *   Install dependencies:
        ```bash
        npm install
        # or: yarn install
        ```
    *   Create a `.env` file in the `backend` directory. Copy the contents of `.env.example` (if provided) or add the following variables, replacing the placeholder values:
        ```dotenv
        # backend/.env
        PORT=3001
        DATABASE_URL=<your_mongodb_connection_string> # e.g., mongodb+srv://user:pass@cluster.../db_name?retryWrites=true...
        JWT_SECRET=<your_strong_random_jwt_secret>
        JWT_EXPIRATION_TIME=3600s # e.g., 1 hour
        ```
        *(**Important:** Ensure your MongoDB connection string includes the database name and the correct credentials. Make sure your IP is whitelisted if using Atlas.)*

3.  **Frontend Setup:**
    *   Navigate to the frontend directory:
        ```bash
        cd ../frontend
        # or from root: cd frontend
        ```
    *   Install dependencies:
        ```bash
        npm install
        # or: yarn install
        ```
    *   Create a `.env` file in the `frontend` directory. Add the following variable, ensuring the port matches your running backend:
        ```dotenv
        # frontend/.env
        VITE_API_BASE_URL=http://localhost:3001
        ```
        *(Note the `VITE_` prefix required by Vite)*

## ▶️ Running the Application

1.  **Start the Backend Server:**
    *   Open a terminal in the `backend` directory.
    *   Run:
        ```bash
        npm run start:dev
        ```
    *   The backend server should start, typically on port 3001 (or as configured in `backend/.env`).

2.  **Start the Frontend Development Server:**
    *   Open a **separate** terminal in the `frontend` directory.
    *   Run:
        ```bash
        npm run dev
        ```
    *   The frontend development server should start, typically on port 5173.

3.  **Access the Application:**
    *   Open your web browser and navigate to `http://localhost:5173` (or the port specified by the frontend server).

**On my local system**

![WhatsApp Image 2025-04-09 at 05 46 34_81937662](https://github.com/user-attachments/assets/67c6bf5d-7f01-4641-911f-31d4e35c5d2f)

![WhatsApp Image 2025-04-09 at 06 12 50_ef24de2b](https://github.com/user-attachments/assets/933c980a-ce28-47ea-bfa6-1c0c0a6819d6)

![WhatsApp Image 2025-04-09 at 06 12 26_b1ee394c](https://github.com/user-attachments/assets/e1a799b5-93fb-4a6c-8e2f-c2738793d1a8)

![WhatsApp Image 2025-04-09 at 06 13 19_d400596e](https://github.com/user-attachments/assets/7370c878-7336-4841-b2ea-c784f0f9faca)

![WhatsApp Image 2025-04-09 at 06 14 46_9574b173](https://github.com/user-attachments/assets/6d1f1c7b-41cd-4c5b-880e-6cdae1908251)

![WhatsApp Image 2025-04-09 at 06 14 20_9c10431e](https://github.com/user-attachments/assets/639db402-153c-416e-b40d-3f54d2c77d4f)

![WhatsApp Image 2025-04-09 at 06 14 01_f1f3c613](https://github.com/user-attachments/assets/ea0502db-9cd0-45be-be24-df763adda6f4)










