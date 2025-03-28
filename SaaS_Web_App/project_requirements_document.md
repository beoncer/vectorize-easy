# Project Requirements Document for tovector.ai

---

## 1. Project Overview

tovector.ai is a web-based platform specially designed for small and mid-sized business owners in the design and printing industry. It enables users to easily convert their PNG and JPG images into scalable vector formats. The platform streamlines daily vectorization tasks by providing an intuitive image upload and conversion workflow while collecting actionable insights through a built-in reporting dashboard. This approach helps graphic designers, print shop owners, and online sellers enhance their operations and grow their businesses.

The main reason for building tovector.ai is to remove the hassle from repetitive image conversion tasks while providing clear, structured, and data-driven feedback. The core objectives are to deliver an effortless upload-to-vector conversion process, implement detailed credit-based pricing with Stripe payment integration and VAT calculations, and offer insightful analytics to monitor user behavior and revenue trends. Success will be measured by smooth user transitions, high conversion rates of previews to full vectorizations, and accurate, interactive reports for admins.

---

## 2. In-Scope vs. Out-of-Scope

**In-Scope:**
- Secure user account creation and authentication (using Clerk Auth) with no major role distinctions.
- Home page featuring a drag-and-drop uploader for PNG/JPG images (max 35MB) with file type and size validations.
- Automatic redirection post-upload, storing images securely in Supabase Storage with corresponding metadata.
- Editor popup (/edit) that displays the image with clear calls-to-action:
  - For logged-out users: “Sign Up and Get 1 Free Preview” button.
  - For logged-in users: “Preview (0.2 credits)” and “Vectorize (1 credit)” buttons.
- Workflow pages:
  - /preview: Displaying the uploaded image with a “Vectorize (1 credit)” button.
  - /vectorize: Displaying a placeholder for the vectorized result and a download dropdown (SVG, PDF, EPS, DXF, PNG).
- Credit deduction and logging for both preview (0.2 credits) and vectorization (1 credit) actions.
- Stripe Checkout integration for one-time credit purchases with a pre-checkout form to capture Company Name and VAT details.
- Comprehensive analytics dashboard for admins featuring charts for key metrics (total conversions, credit usage, revenue figures, user activity, download format distribution).
- Advanced reporting tools with multiple export options (CSV, PDF, XLSX, JSON) and filtering for detailed usage logs.
- Enforced image and user data retention policies, backups, GDPR-compliant data privacy, and detailed logging of each action.

**Out-of-Scope:**
- Advanced image editing features (such as cropping, resizing, or other adjustments) beyond showing a simple resize notification.
- Custom subscription models or recurring payment features (all credit purchases are one-time payments).
- Deep customization of vectorization options (detail, smoothing, and color handling) as the system will rely on the vectorization API.
- Future AI-driven features via OpenAI will be integrated at a later stage, with no modular toggling required initially.
- Enhancements such as additional mobile responsiveness or specific accessibility guidelines outside a simple responsive design.

---

## 3. User Flow

A typical user lands on the Home page where they are greeted with a clean, minimalistic interface featuring a central image uploader designed for drag-and-drop functionality. Users select a PNG or JPG image (up to 35MB), which undergoes file type and size validations. Once a valid image is uploaded, it is stored in Supabase Storage and its metadata recorded. Immediately, the user is redirected to the /edit popup where the image is shown full-screen and the system verifies the image ownership, validity, and retention period.

In the /edit popup, the interface adapts based on the user's authentication status. Logged-out users see a “Sign Up and Get 1 Free Preview” button that leads them to create an account and receive a free preview credit. Logged-in users observe two clear options: initiate a low-cost preview (deducting 0.2 credits) or start the full vectorization process (consuming 1 credit). Choosing preview brings the user to a dedicated /preview page with a placeholder image and a “Vectorize (1 credit)” button. When the user opts for vectorization (either from /edit or /preview), they are directed to the /vectorize page where a vectorized placeholder is displayed, accompanied by a format selection dropdown and a download button. If there are insufficient credits at any point, the user is guided to the Pricing page to purchase credits via a smooth Stripe Checkout flow with pre-checkout VAT handling.

---

## 4. Core Features

- **User Authentication:** Secure sign-up, login, and account management via Clerk Auth with clear processes for both logged-out and logged-in states.
- **Image Upload & Validation:** Drag-and-drop uploader on Home with file type (PNG/JPG) and size (max 35MB) checks; automatic resizing notifications when images exceed maximum pixel values.
- **Editor Popup (/edit):** Display the uploaded image on a full-screen popup with contextual buttons:
  - For non-authenticated users: “Sign Up and Get 1 Free Preview.”
  - For authenticated users: “Preview (0.2 credits)” and “Vectorize (1 credit).”
- **Preview Process (/preview):** Show the original (or placeholder) image, enabling users to preview the vectorization process with a follow-up “Vectorize (1 credit)” action.
- **Vectorization & Download (/vectorize):** Present the converted image placeholder with a dropdown to select download formats (SVG, PDF, EPS, DXF, PNG) and a “Download” button that triggers secure file downloads.
- **Credit Management & Logging:** Deduct credits accordingly, handle insufficient balances by redirecting users to credit purchase, and log all credit-related actions in Supabase.
- **Pricing & Payment Flow:** Secure Stripe Checkout integration for one-time credit purchases; pre-checkout form to capture billing details, company name, and VAT information, plus dynamic VAT calculation and breakdown.
- **Sales Analytics Dashboard:** Interactive charts (line, bar, area, funnel, and pie charts) to track key metrics—total conversions, credit usage, revenue figures, user activity, and download format preferences.
- **Reporting Tools:** Advanced filtering and export options for usage data in CSV, PDF, XLSX, and JSON formats.
- **Data Retention & Privacy:** Automatic deletion of uploaded images after 24 hours, retention of transaction records as per legal requirements, encrypted storage, and GDPR-compliant user data handling.

---

## 5. Tech Stack & Tools

- **Frontend Framework:** Next.js for server-side rendering and routing.
- **Styling:** Tailwind CSS for modern, responsive design, supplemented by Shadcn UI components for consistent UI elements.
- **Language:** TypeScript to ensure robust type safety across the application.
- **Backend & Storage:** Supabase for database management and secure file storage with Row-Level Security (RLS).
- **Authentication:** Clerk Auth for handling user sign-up, login, and session management robustly.
- **Payments:** Stripe Checkout for handling one-time credit purchases, complete with VAT calculations and pre-checkout forms.
- **Future AI Integration:** OpenAI (for future AI-driven preview or vectorization enhancements) will be integrated when needed.
- **Development Tools:** 
  - V0 by Vercel for AI-powered frontend component building.
  - Cursor as an advanced IDE for real-time coding suggestions.
  - Lovable for generating comprehensive UI and full-stack web app components.

---

## 6. Non-Functional Requirements

- **Performance:**  
  - Fast image upload and redirection; server response times should be minimal to maintain a smooth user experience.
  - Quick processing of credit deduction and file download requests.
- **Security:**  
  - Ensure that all stored data is encrypted (both at rest and in transit).
  - Implement Row-Level Security (RLS) so that users can access only their own images and data.
  - Validate all incoming files and user inputs to prevent malicious activities.
- **Compliance:**  
  - Adhere to GDPR requirements by providing user data access, deletion capabilities, and complete privacy policies.
  - Maintain transaction records as per EU tax regulations and implement proper VAT handling.
- **Usability:**  
  - A clean, minimalistic design aligned with the platform’s visual style (white background, black 'Fixel Display' font, red accents).
  - The platform will be responsive; layout adjustments should work smoothly across mobile and desktop without any specialized mobile guidelines.
- **Backup & Data Retention:**  
  - Enable automated daily backups for the Supabase database and regular external backups for storage.
  - Enforce automatic deletion of images after 24 hours and transaction data retention in accordance with legal requirements.
- **Reliability:**  
  - Error handling messages should be clear, and any failed process (upload, vectorization, credit deductions) must trigger appropriate notifications and logs.

---

## 7. Constraints & Assumptions

- The system relies on third-party services such as Supabase, Stripe, and Clerk Auth. Their availability and performance will affect the overall functionality.
- All vectorization operations will use the external vectorization API (https://vectorizer.ai/api#quickstart), with no additional custom settings for conversion precision.
- User roles are treated similarly with no significant differences between admin and regular users, aside from accessing the analytics dashboard.
- The image retention policy is fixed (30 days for images) and credit operations are strictly managed in Supabase.
- The design is based on a minimalistic theme with specific color accents (red for buttons and accents, black text) and the 'Fixel Display' font to ensure brand consistency.
- Future AI features via OpenAI are not integrated in the current scope, and any such enhancements will be added later as separate modules.
- It is assumed that the uploaded file meets the technical requirements (valid file type, acceptable size) and that users agree to the data retention and privacy policies upon sign-up.

---

## 8. Known Issues & Potential Pitfalls

- **API Rate Limits & External Service Dependence:**  
  - The vectorization API and third-party services like Stripe and Clerk Auth could face rate limiting or outages. Mitigation includes implementing graceful error handling with clear user messages and retry mechanisms.
  
- **Credit Deduction and Logging Accuracy:**  
  - Ensuring proper atomic operations when deducting credits and logging actions is critical. Consider transaction-based updates and thorough testing to avoid fraudulent or duplicated charges.
  
- **Validations & User Errors:**  
  - Strict client-side and server-side validations are needed for image uploads and form inputs. Testing various error scenarios (file type, size errors, invalid VAT numbers) is essential to prevent disruptions in user flow.
  
- **Data Retention and Backup Automation:**  
  - Implementing correct and reliable auto-deletion of outdated files may be challenging. Regular monitoring and quarterly tests of backup restoration processes are recommended.
  
- **Scalability of Analytics Dashboard:**  
  - As data volume grows, the interactive analytics and reporting functions might slow down. Employ efficient querying, indexing, and caching strategies within Supabase to mitigate performance bottlenecks.

---

This document is the central reference for tovector.ai. All subsequent technical documents—covering tech stack details, frontend guidelines, backend structure, and implementation plans—should be generated from this clear, unambiguous Project Requirements Document.