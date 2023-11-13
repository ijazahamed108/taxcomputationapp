
# Tax Computation App - MERN Stack

This MERN (MongoDB, Express.js, React, Node.js) stack application facilitates tax computation with role-based access for users, including tax payers, tax accountants, and administrators. The project employs React for the client-side UI components, Axios for API calls, and JWT authentication for secure communication between the client and server.

## Client

1. **Home Page:**
   - Features a login and sign-up button for user authentication.

2. **User Authentication:**
   - Upon login, a JWT token is generated and stored in the local storage.
   - All client APIs are JWT-verified on the server for enhanced security.

3. **Logout Functionality:**
   - After logout, views are inaccessible, and users are redirected to the home page.

4. **Role-Based Dashboard Access:**
   - **Tax Payer Role:**
     - Can check details, submit proofs for deductions, view net payable tax, submission history, and pay tax.

   - **Tax Accountant and Admin Roles:**
     - Can view all users and audit records.
     - Admins can edit user details and audit details.
     - Tax accountants can edit only audit details.

5. **React-Bootstrap Components:**
   - Utilizes React-Bootstrap for UI components, including tables, collapsibles, and tabs.

6. **Axios for API Calls:**
   - Axios is used to handle API calls for seamless communication with the server.

## Server

1. **APIs:**
   - Provides APIs for fetching, storing, and updating data.

2. **JWT Verification:**
   - Implements JWT verification for secure communication and authentication.

3. **Role-Based Authentication:**
   - Ensures role-based authentication for different levels of access.

4. **Data Models:**
   - Utilizes MongoDB data models for storing user information and data history records.

## Steps to Start Application

### Client

1. Navigate to the client directory: `cd client`
2. Install dependencies: `npm i`
3. Start the application: `npm start`

### Server

1. Navigate to the server directory: `cd server`
2. Install dependencies: `npm i`
3. Start the server: `npm start`

### Run in Docker

#### Client

1. Navigate to the client directory: `cd client`
2. Build the Docker image: `docker build -t react-app .`

#### Server

1. Navigate to the server directory: `cd server`
2. Build the Docker image: `docker build -t express-app .`

#### Configure envs
`docker run -d -e MONGODB_URI =my_value -e JWT_SECRET =another_value <image-name>`

#### Run Docker Containers

1. Client: `docker run -d -p 3000:3000 react-app`
2. Server: `docker run -d -p 5000:5000 express-app`

Visit [http://localhost:3000](http://localhost:3000) to access the MERN application.

Feel free to reach out for any questions or issues @ijazahamed108@outlook.com
