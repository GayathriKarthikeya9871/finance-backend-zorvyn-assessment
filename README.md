# Finance Data Processing and Access Control Backend

## Overview
This is a secure, role-based backend API for a finance dashboard system. It provides user access control, financial record management, and dashboard analytics capabilities. 

The architecture follows a strict Model-View-Controller (MVC) pattern to ensure separation of concerns, scalability, and clean code organization.

## Tech Stack
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** SQLite3 (In-file relational database)
* **Development Tools:** Nodemon, CORS

## Project Architecture
The project is structured professionally for maintainability:
- `/src/config` - Database connection and schema initialization
- `/src/controllers` - Core business logic and data processing
- `/src/middlewares` - Access control and request validation
- `/src/routes` - API endpoint definitions
- `/src/server.js` - Main application entry point

## Setup and Installation

1. **Install Dependencies**
   Run the following command to install required packages:
   npm install

2. **Start the Development Server**
   Run the application using nodemon:
   npm run dev

   The server will start on `http://localhost:3000`. The SQLite database file (`database.sqlite`) will automatically generate in the root directory upon starting.

## Access Control & Roles
The system features middleware-based access control. Authentication is handled via the `x-user-id` header for demonstration purposes.

* **Admin:** Can create, update, delete records, and view all data/summaries.
* **Analyst:** Can view all records, apply filters, and access summaries, but cannot modify data.
* **Viewer:** Read-only access to basic non-sensitive data (blocked from core financial routes in this implementation).

**Default Test Users (Pass as `x-user-id` header):**
* `admin_user`
* `analyst_user`
* `viewer_user`

## API Endpoints

### 1. Create a Financial Record
* **URL:** `/api/records`
* **Method:** `POST`
* **Access:** Admin only
* **Body:**
  {
    "amount": 1500.50,
    "type": "income",
    "category": "Salary",
    "date": "2026-04-03",
    "notes": "April paycheck"
  }

### 2. Get All Records & Filtering
* **URL:** `/api/records`
* **Method:** `GET`
* **Access:** Admin, Analyst
* **Query Parameters (Optional):** `?type=income`, `?category=Salary`, `?date=2026-04-03`
* **Example:** `/api/records?type=expense`

### 3. Update a Record
* **URL:** `/api/records/:id`
* **Method:** `PUT`
* **Access:** Admin only
* **Body:** Requires the full updated record object (amount, type, category, date, notes).

### 4. Delete a Record
* **URL:** `/api/records/:id`
* **Method:** `DELETE`
* **Access:** Admin only

### 5. Get Dashboard Summary
* **URL:** `/api/records/summary`
* **Method:** `GET`
* **Access:** Admin, Analyst
* **Returns:** Total income, total expenses, and net balance aggregated at the database level.

## Key Design Decisions & Assumptions
1. **SQLite over In-Memory:** Chosen to demonstrate actual relational database modeling, foreign key constraints (linking records to the users who created them), and SQL aggregation functions.
2. **Simplified Auth:** To maintain focus on API structure without forcing the evaluator to handle JWT token generation, authentication is simplified to a custom header check linked to a persistent database user.
3. **Summary Aggregation:** The dashboard summary performs math via SQL (`SUM` and `GROUP BY`) rather than in JavaScript, ensuring high performance as the dataset scales.
4. **MVC Architecture:** Routes are strictly separated from business logic, making the codebase ready for scalable production environments.
