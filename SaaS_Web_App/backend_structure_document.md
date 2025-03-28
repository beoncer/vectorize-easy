# Backend Structure Document for tovector.ai

This document outlines the backend architecture, database management, API design, hosting solutions, and other infrastructure components for tovector.ai. The following sections explain how the backend is structured in everyday language, so even non-technical readers can follow along.

## 1. Backend Architecture

The backend follows a modern and scalable design using industry-standard patterns and frameworks. Key characteristics include:

- **Modular Design:** The backend is organized into independent components such as user authentication, image processing, credit management, and reporting. These components interact via clearly defined APIs.
- **Scalability:** Using cloud-based services like Supabase ensures that the system can handle increased loads. This supports high numbers of users and image uploads without delays.
- **Maintainability:** The architecture uses simple, clean coding practices and modular services, making it easy to update, debug, and add new features.
- **Performance:** The use of Supabase (with PostgreSQL for relational data and integrated storage), along with caching and optimized API endpoints, guarantees fast responses for image uploads, credit deductions, and reporting.
- **Design Patterns and Frameworks:**
  - *Backend & Storage:* Supabase with PostgreSQL and Storage
  - *Authentication:* Clerk Auth
  - *Payments:* Stripe (Stripe Checkout)
  - *Future AI Integration:* Open AI for advanced features

## 2. Database Management

For data storage and management, the project leverages Supabase and PostgreSQL with the following practices:

- **Database Type:** SQL (using PostgreSQL)
- **Data Storage:**
  - User profiles, authentication details, and credit balances
  - Information on image uploads and temporary storage for vectorization
  - Transaction records for credit purchases and usage
  - Sales and usage analytics data for reporting
- **Data Access:**
  - RESTful endpoints and direct database triggers are used to perform secure data transactions
  - Automated backups and deletion of outdated records ensure efficient data management
- **Data Management Practices:**
  - Retention policies to automatically remove images, activity logs, and temporary transactions after set time periods (e.g., images kept for 24 hours, activity logs for 1 year)
  - Encrypted storage for sensitive information and Regularization Layer Security (RLS) to control data access

## 3. Database Schema

### Human Readable Overview

- **Users Table:** Stores user authentication details, profile data, and credit balances
- **Images Table:** Contains metadata for uploaded images, including file type, size, and upload timestamp. Temporary storage links to the image file in Supabase Storage.
- **Transactions Table:** Logs credit usage (for previews and vectorizations) and credit purchases, along with timestamps and relevant details. This includes VAT data for EU transactions.
- **Analytics Table:** Captures usage data such as activity logs, conversion rates, and download preferences for reporting purposes

### SQL Schema (PostgreSQL)

Below is a simplified SQL representation:

/* Users Table */
CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  credit_balance NUMERIC DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

/* Images Table */
CREATE TABLE images (
  image_id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(user_id),
  file_url TEXT NOT NULL,
  file_type VARCHAR(10) NOT NULL,
  file_size INTEGER NOT NULL,
  upload_timestamp TIMESTAMP DEFAULT NOW(),
  expiry_timestamp TIMESTAMP
);

/* Transactions Table */
CREATE TABLE transactions (
  transaction_id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(user_id),
  transaction_type VARCHAR(50), -- 'preview', 'vectorize', or 'purchase'
  credits_deducted NUMERIC DEFAULT 0,
  amount NUMERIC, -- applicable for purchase transactions
  vat_info JSONB,
  transaction_timestamp TIMESTAMP DEFAULT NOW()
);

/* Analytics Table */
CREATE TABLE analytics (
  analytics_id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(user_id),
  action_type VARCHAR(50),  -- e.g., 'upload', 'preview', 'vectorize'
  action_timestamp TIMESTAMP DEFAULT NOW(),
  additional_data JSONB
);

## 4. API Design and Endpoints

The backend provides RESTful API endpoints to connect the frontend with the backend services. Key endpoints include:

- **User Authentication & Profiles:**
  - Endpoint to sign up, log in, and manage account details. Uses Clerk Auth for secure authentication.

- **Image Upload Endpoint:**
  - Processes file uploads (PNG/JPG), validates file size and dimensions, and resizes images if needed.

- **Edit Popup Endpoints:**
  - Serves content based on user authentication status, including endpoints for previewing and vectorizing images.
  - Deducts credits accordingly (0.2 credits for preview, 1 credit for vectorization) with sufficient balance checks.

- **Credit Purchase Endpoint:**
  - Integrates with Stripe Checkout, managing one-time purchases of credit packages.
  - Handles optional VAT data and pre-checkout information.

- **Analytics and Reporting Endpoints:**
  - Provides data for the sales analytics dashboard and reporting tools in formats like CSV, JSON, PDF, and XLSX.

## 5. Hosting Solutions

The backend is hosted on a cloud platform with the following considerations:

- **Supabase:**
  - Provides both the PostgreSQL database and Storage for images. This offers a managed environment with auto-scaling, reliability, and daily backups.
  - Includes built-in security features and compliance standards (essential for GDPR compliance).

- **Benefits:**
  - High reliability and performance with minimal downtime
  - Scalable for growing numbers of users and image uploads
  - Cost-effective due to the pay-as-you-go model and serverless functions

## 6. Infrastructure Components

The infrastructure is built with several key components working together to ensure smooth operation:

- **Load Balancers:**
  - Distribute incoming requests evenly across backend services to prevent overload.

- **Caching Mechanisms:**
  - Utilized to store frequently accessed data, such as image metadata and user session information, improving response times.

- **Content Delivery Network (CDN):**
  - Delivers static content like images quickly to users worldwide.

- **Backup Solutions:**
  - Automated daily backups for the database and weekly manual exports, along with specialized backups for Supabase Storage.

## 7. Security Measures

To protect user data and ensure regulatory compliance, the backend implements robust security measures:

- **Authentication & Authorization:**
  - Clerk Auth handles user sign up, login, and session management, ensuring only authorized users access sensitive data.

- **Data Encryption:**
  - All sensitive data is stored securely with encryption in transit (HTTPS) and at rest within the Supabase database.

- **Regularization Layer Security (RLS):**
  - Ensures that database records are only accessible to users with the appropriate permissions.

- **Payment Security:**
  - Stripe integration is used for secure transactions, with VAT and sensitive billing information handled in accordance with compliance regulations.

- **Compliance:**
  - Data handling practices meet GDPR requirements through data minimization, clear consent procedures, and secure deletion protocols.

## 8. Monitoring and Maintenance

To keep the backend running smoothly, the following practices and tools are in place:

- **Performance Monitoring:**
  - Tools to monitor server performance, API response times, and error logging provide real-time insights into system health.

- **Automated Backups and Updates:**
  - Daily database backups and scheduled system updates to keep data safe and the technology stack current.

- **Regular Maintenance:**
  - Routine checks, updates, and manual reviews ensure that all components are secure and performing well.

- **Alerting Systems:**
  - Notifications and alerts for unusual activities or potential faults help to quickly address issues before they escalate.

## 9. Conclusion and Overall Backend Summary

To summarize, the backend of tovector.ai is designed to support a robust, secure, and scalable platform for converting images to vector formats. The key aspects include:

- A modular and maintainable architecture that supports a variety of services like authentication, image processing, and analytics.
- SQL-based data management with PostgreSQL in Supabase, ensuring data integrity and compliance with standards such as GDPR.
- Clear, RESTful API endpoints that handle everything from image uploads to credit deductions and analytics reporting.
- Hosting on a reliable, scalable cloud platform (Supabase) that offers cost efficiency and robust backup solutions.
- Additional infrastructure components, including load balancers, caching, and CDN, to enhance performance and user experience.
- Rigid security and monitoring systems to uphold data privacy, regulatory compliance, and consistent performance.

This backend setup aligns perfectly with the project's goals, serving the needs of graphic designers, print shop owners, and e-commerce sellers by ensuring that their image conversion tasks are handled quickly, securely, and efficiently.

By combining modern cloud technologies, security best practices, and user-friendly API designs, tovector.ai offers a backend that stands out for its reliability and performance.