# Healthcare Provider Dashboard Frontend

This project is the frontend for a healthcare provider management system where providers can create accounts, add patients, view patient information, and request pre-authorization for treatments.

## Technologies Used

- **Next.js** (v14, App Router)
- **TypeScript**
- **TailwindCSS**
- **Shadcn/UI**
- **Sonner** for toast notifications

## Features

- **Healthcare provider account creation**: Providers can create accounts and log in using JWT-based authentication.
- **Add patients**: Providers can add patient details, including medical history and treatment plans.
- **View patients**: Providers can view patient information in a dashboard.
- **Request pre-authorization**: Providers can request pre-authorization for treatments.
- **Authentication**: Providers can sign up and sign in using JWT tokens.
- **Toast notifications**: Feedback is provided to the user using the Sonner toast notification system.

## Local Setup

1. Clone the repository
2. npm install 
3. Create mongodb account and use the URI via .env
4. Clone and run backend for this 
5. Use the backend uri via .env **NEXT_PUBLIC_SERVER_API_URL**
