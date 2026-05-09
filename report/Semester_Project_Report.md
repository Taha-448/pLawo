# Semester Project Report: pLawo – AI-Driven Legal Connection Platform

**Course:** CS 343: Web Technologies (2+1)  
**Semester:** Spring 2026  
**Institution:** National University of Sciences & Technology (NUST)  
**School:** School of Electrical Engineering and Computer Science (SEECS)  
**Instructor:** Dr. Naima Iltaf  
**Student Name:** [Your Name]  
**Date:** June 10, 2026  

---

## 1. Introduction and Motivation

### 1.1 Rationale
The legal system in Pakistan is often perceived as complex and inaccessible by the general public. Citizens frequently struggle to find specialized legal counsel, often relying on word-of-mouth or unverified sources. This "information asymmetry" leads to wasted time, high costs, and sometimes even legal mismanagement. 

**pLawo** was developed to solve this problem by leveraging modern web technologies and Artificial Intelligence. The motivation behind pLawo is to democratize legal access. By providing a centralized, verified, and AI-enhanced marketplace, we enable users to find the right lawyer for their specific needs—whether it's family law, corporate disputes, or criminal defense—with just a few clicks.

### 1.2 Core Vision
Our vision is to build a "Legal Ecosystem" where:
-   **Transparency** is paramount: All lawyer credentials and reviews are verified.
-   **Accessibility** is simplified: Users can describe their problems in natural language, and AI handles the classification.
-   **Efficiency** is guaranteed: Real-time appointment booking and digital dashboards reduce administrative overhead for both clients and lawyers.

---

## 2. GitHub Repository Link

The project is hosted on GitHub, maintaining a transparent and clean version control history.

**Link:** [https://github.com/Taha-448/pLawo.git](https://github.com/Taha-448/pLawo.git)

---

## 3. Description of the Website

### 3.1 Overall Architecture
pLawo is a full-stack web application built on the **MERN (MongoDB, Express, React, Node.js)** stack. It follows a Single Page Application (SPA) architecture on the frontend (using React Router for navigation) and a RESTful API architecture on the backend.

### 3.2 Website Organization
The content is organized into logical modules based on user roles and core functionality:

#### A. Public Information & Search
-   **Home/Landing Section**: Introduces the platform and hosts the AI Search bar.
-   **Legal Discovery**: Dynamic search results showing lawyers filtered by AI-classified categories and geographic locations.
-   **Educational Resources**: A repository of legal documents and FAQs.

#### B. User Portals (Secured by JWT)
-   **Client Workspace**: Where users manage their legal journey, view appointments, and track AI search history.
-   **Lawyer Workspace**: A professional suite for managing availability, client interactions, and revenue.
-   **Admin Command Center**: A high-level view of the entire system, focusing on verification and platform health.

---

## 4. Description of the Website Layout

### 4.1 Structural Foundation
The website utilizes a **div-based layout** which is standard for modern responsive design. We avoided legacy table-based layouts to ensure maximum flexibility. 

### 4.2 Responsiveness with Bootstrap 5
In accordance with project requirements, we implemented **Bootstrap 5** as our primary framework for responsiveness. 
-   **Container System**: We used `.container` and `.container-fluid` to manage page widths across different screen sizes.
-   **Grid Layout**: The 12-column grid system (`.row`, `.col-md-*`, `.col-sm-*`) allows the layout to stack vertically on mobile devices while expanding horizontally on large screens.
-   **Navigation**: A responsive Bootstrap navbar that collapses into a "hamburger menu" on smaller viewports.
-   **Utility Classes**: Extensive use of spacing (`mt-3`, `px-4`), typography, and display utilities to refine the UI without writing excessive custom CSS.

### 4.3 Styling Strategy
While Bootstrap provides the responsive foundation, we used **External CSS** files for custom branding and advanced animations. This ensures a "Separation of Concerns," keeping the HTML structure clean and the styling logic centralized.

---

## 5. Detailed Page Descriptions (11 Dynamic Pages)

### 5.1 Landing Page
The "face" of pLawo. It features a hero section with a large search input where users can type their legal issues in plain text. The AI (OpenAI GPT-4o-mini) immediately analyzes the text to categorize the legal problem.

### 5.2 Search Results Page
A dynamic list of lawyers. The data is fetched from the MongoDB database based on the classification generated on the landing page. It includes filters for city, rating, and fee range.

### 5.3 Lawyer Profile Page
A deep-dive into a specific professional's career. It shows their bio, specialties, verified bar license status, and a dynamic calendar for booking 1-hour slots.

### 5.4 Sign In Page
A secure portal using JWT-based authentication. It handles login for all three roles with appropriate redirects.

### 5.5 Sign Up Page
A multi-step registration form. For lawyers, it includes a file upload section (handled via Multer and Cloudinary) for their professional credentials.

### 5.6 Client Dashboard
The client's central hub. It displays "Upcoming Appointments" with countdowns and "Past History" where users can leave reviews and ratings for their lawyers.

### 5.7 Lawyer Dashboard
Includes a "Revenue Overview" chart and a "Slot Manager" where lawyers can open or close time slots for the week. It also displays a list of pending client appointments.

### 5.8 Admin Panel
The "God-mode" of the platform. Admins can view a list of all unverified lawyers, view their uploaded licenses, and either "Approve" or "Reject" them.

### 5.9 Legal Resources
A dynamic page that pulls legal acts and informational content from the database. It allows users to read about their rights before booking a lawyer.

### 5.10 Contact Us
A dynamic form that sends user inquiries to the backend, storing them for admin review. It also displays local office locations using a map-like layout.

### 5.11 Not Found (404)
A custom-designed error page that provides helpful navigation links to get the user back on track.

---

## 6. Functional and Non-Functional Requirements

### 6.1 Functional Requirements (FR)
1.  **FR-AUTH**: Users must be able to create accounts and log in securely.
2.  **FR-AI**: The system must use AI to classify legal queries into categories (e.g., Civil, Criminal).
3.  **FR-SEARCH**: Users must be able to search for lawyers by city and specialty.
4.  **FR-BOOK**: Clients must be able to book available time slots with lawyers.
5.  **FR-VERIFY**: Admins must be able to verify lawyer credentials via document viewing.
6.  **FR-REVIEW**: Clients must be able to rate and review lawyers after an appointment.

### 6.2 Non-Functional Requirements (NFR)
1.  **NFR-RESP**: The website must be fully responsive and functional on mobile devices (Bootstrap).
2.  **NFR-SEC**: All passwords must be hashed (Bcrypt), and API routes must be protected (JWT).
3.  **NFR-PERF**: API responses should be under 500ms for a smooth user experience.
4.  **NFR-CLEAN**: Code must follow the MVC architectural pattern and use proper naming conventions.

---

## 7. Technical Implementation Details

The development of pLawo involved several advanced technical implementations to ensure a professional and secure user experience.

### 7.1 MVC Architecture
We strictly adhered to the **Model-View-Controller (MVC)** architectural pattern to ensure code maintainability:
-   **Model**: Mongoose schemas (e.g., `User.js`, `LawyerProfile.js`) define the data structure and validation rules.
-   **View**: The frontend is built using React components, ensuring a modular and reusable UI.
-   **Controller**: Express controllers process incoming requests, execute business logic, and communicate with the MongoDB database.

### 7.2 Security & Authentication
Security is a core pillar of pLawo:
-   **Password Hashing**: We use `bcryptjs` to salt and hash passwords before they are stored in the database, ensuring that even in the event of a data breach, user credentials remain secure.
-   **JWT Authorization**: Upon login, a JSON Web Token (JWT) is generated and sent to the client. This token is required for all sensitive API requests and is validated using custom middleware on the backend.
-   **Role-Based Access Control (RBAC)**: We implemented a `ProtectedRoute` component on the frontend and authorization middleware on the backend to restrict access to the Admin Panel, Lawyer Dashboard, and Client Dashboard based on the user's role.

### 7.3 AI Integration (GPT-4o-mini)
The "AI Smart Search" is powered by OpenAI's `gpt-4o-mini` model. 
-   **Analysis Logic**: When a user describes their legal issue, a request is sent to our `aiService`. 
-   **Prompt Engineering**: We use structured prompts to force the AI to return data in a strict JSON format, including a legal category, a brief analysis, and relevant Pakistani laws.
-   **Fallbacks**: The system includes robust error handling to provide a professional fallback experience if the AI service is unreachable.

### 7.4 Media & Storage
For lawyer verification, we integrated **Multer** and **Cloudinary**:
-   **Multer**: Handles multipart/form-data for file uploads (e.g., bar licenses and profile photos).
-   **Cloudinary**: Acts as our cloud-based media repository, ensuring fast and reliable image serving via a Global CDN.

### 7.5 Frontend State & Navigation
-   **React Router 7**: Used for handling the Single Page Application (SPA) navigation.
-   **Local Storage**: Used to persist user session data (JWT and role) locally, allowing for a seamless experience across page refreshes.
-   **Component Library**: We utilized **Shadcn/UI** and **Lucide React** for consistent, high-quality iconography and UI elements.

---

## 8. Database Schema (Mongoose Models)

The backend uses **MongoDB Atlas** as a cloud database service, with **Mongoose ODM** for schema definition and data validation. Below are the primary schemas used in the system:

### 8.1 User Schema
Stores core authentication and profile data for all users (Clients, Lawyers, and Admins).
-   `email` (String, Required, Unique): Primary identifier for login.
-   `name` (String, Required): User's full name.
-   `password` (String, Required): Bcrypt-hashed password.
-   `role` (Enum): ['CLIENT', 'LAWYER', 'ADMIN'].
-   `timestamps`: Tracks account creation and last update.

### 8.2 Lawyer Profile Schema
Extends the User model for those with the 'LAWYER' role, storing professional details.
-   `user_id` (ObjectId, Ref: User): Link to the core user account.
-   `specialization` (String): Legal area of expertise.
-   `city` (String): Operational location.
-   `fees` (Number): Consultation fee in PKR.
-   `is_verified` (Boolean): Verification status managed by Admin.
-   `bar_license_number` (String): Professional identifier.
-   `rating` (Number): Calculated average rating from client reviews.

### 8.3 Appointment Schema
Manages the scheduling logic between clients and lawyers.
-   `client_id` (ObjectId, Ref: User): The user booking the session.
-   `lawyer_id` (ObjectId, Ref: User): The professional being booked.
-   `date` (Date): The scheduled day.
-   `time` (String): 1-hour time slot (e.g., "14:00").
-   `status` (Enum): ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].
-   `legal_issue` (String): Brief description of the client's problem.

---

## 9. Conclusion

The pLawo project is a comprehensive implementation of the MERN stack, addressing a real-world problem with modern solutions. By combining the flexibility of MongoDB, the speed of Node.js/Express, and the dynamic nature of React, we created a professional-grade platform. The integration of AI and a robust verification system makes pLawo a unique and valuable tool for the legal industry in Pakistan. The project meets all academic requirements, including responsiveness, MVC standards, and dynamic content delivery.

---
