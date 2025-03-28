flowchart TD
    A[User Visits Website] --> B[Landing Page]
    B --> C[Upload Image]
    C --> D[Check Image Dimensions]
    D --> E{Image Exceeds Pixel Limit?}
    E -- Yes --> F[Resize Image and Notify]
    E -- No --> G[Proceed Without Resizing]
    F --> H[Store Image in Supabase]
    G --> H[Store Image in Supabase]
    H --> I[Editor Popup]
    I --> J{Logged In?}
    J -- No --> K[Show Sign Up and Get 1 Free Preview]
    K --> L[User Signup via Clerk Auth]
    L --> M[Editor Popup Logged In]
    J -- Yes --> M[Editor Popup Logged In]
    M --> N{Choose Action}
    N -- Preview --> O[Preview Page Deduct 0.2 Credits]
    N -- Vectorize --> P[Vectorize Page Deduct 1 Credit]
    O --> Q[Vectorize Button on Preview]
    Q --> P[Vectorize Page Deduct 1 Credit]
    P --> R[Show Vectorized Image]
    R --> S[Download Dropdown]
    S --> T[Generate Temporary Signed URL]
    
    I --> U[Credit Purchase Option]
    U --> V[Pre-checkout Form]
    V --> W[Stripe Payment Integration]
    W --> X[Confirmation Page with Receipt]
    
    I --> Y[Admin Dashboard]
    Y --> Z[Sales Analytics Dashboard]
    Z --> AA[Reporting Tools and Export Options]