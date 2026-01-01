# 🎓 Quiz Registration & Certificate Portal

A production-ready full-stack application built with the latest **Next.js 15** and **React 19**. This platform serves as a secure gateway for users to register for events, process payments, and generate automated certificates upon completion.

## ⚡ Project Overview

This application handles the pre-quiz and post-quiz workflows for an external testing platform. It manages user authentication, payment processing for registration fees, and programmatic PDF certificate generation.

## 🛠️ Tech Stack

| Category | Technologies |
| :--- | :--- |
| **Framework** | Next.js 15.4.4, React 19.1.0 |
| **Database** | MongoDB, Mongoose 8.16 |
| **Authentication** | NextAuth.js v4, Bcrypt |
| **Payment** | PayGlocal JS Client |
| **UI Library** | React Icons, React Spinners, React Datepicker |
| **Styling** | SASS, Framer Motion |
| **Services** | Cloudinary (Media), Nodemailer (Email), Google Recaptcha |
| **Utils** | pdf-lib, sharp, axios, uuid, countrycitystatejson |

## 📂 Workflow

1.  **Landing:** User arrives and registers for the specific quiz event.
2.  **Redirection:** User is directed to the external quiz provider.
3.  **Validation:** System validates user participation.
4.  **Reward:** User returns to download their personalized certificate.

## 🔧 Installation & Setup

If you have access to this repository, follow these steps to run it locally:

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/your-username/quiz-registration-portal.git
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables**
    Create a `.env.local` file in the root directory and add the following:

4.  **Run the development server**
    ```bash
    npm run dev
    ```

## 🔒 License & Rights

This software was developed as a freelance solution for League Of Logic http://ct.ei-usa.com/.
* **Copyright:** [2025]
* **Usage:** Unauthorized copying of this file, via any medium, is strictly prohibited. Proprietary and confidential.
