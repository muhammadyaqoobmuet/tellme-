# TellMe App

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js"/>
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB"/>
</p>

<p align="center">
  🚀 <a href="https://tellme-eta.vercel.app/" target="_blank" style="font-size:20px; font-weight:bold;">Live Demo</a> 🌍
</p>



**Receive Mysterious Messages From Anyone.**  
Share your personal TellMe link and get anonymous messages, confessions, and surprises from friends and strangers.

## Table of Contents

- [Technology Stack](#technology-stack)
- [API Structure](#api-structure)
- [Setup and Run Locally](#setup-and-run-locally)
- [Features](#features)
- [Usage](#usage)
- [Architecture](#architecture)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Technology Stack

- **Next.js**: React framework for server-side rendering and API routes.
- **TypeScript**: Adds type safety to JavaScript code.
- **NextAuth**: Handles secure authentication.
- **Mongoose**: Manages MongoDB database interactions.
- **Zod**: Provides schema validation for forms and data.
- **React Hook Form**: Simplifies form handling in React.
- **useHook**: Custom hooks for reusable logic.
- **TS Debouncing**: Optimizes performance with debounced functions.

## API Structure

The TellMe app's backend is powered by Next.js API routes, organized as follows:

- **`accept-messages`**: Receives anonymous messages sent to a user's TellMe link.
- **`auth`**:
  - `check-username`: Checks if a username is available during registration.
  - General authentication logic for user sessions.
- **`delete-message/[messageId]`**: Deletes a specific message by its ID.
- **`get-messages`**: Retrieves a user's received messages.
- **`send-message`**:
  - Sends anonymous messages to a recipient.
  - `sendmail/[username]`: Sends email notifications to users about new messages.
- **`signup`**: Registers new users with the app.
- **`verifycode`**: Verifies codes for email or account validation.

These endpoints enable core functionalities like anonymous messaging, user management, and notifications.

## Setup and Run Locally

Follow these steps to get the TellMe app running on your machine:

### 1. Clone the Repository:

```bash
git clone https://github.com/your-repo/tellme-app.git
cd tellme-app
npm install
```

### 2. Set Up Environment Variables:

```
MONGODB_URI=your-mongodb-connection-string
NEXTAUTH_SECRET=your-nextauth-secret
EMAIL_SERVER=smtp://user:pass@host:port
```

### 3.Start the Development Server:

```
npm run dev
```

## Features

- **Anonymous Messaging**: Receive messages without sender identities revealed.
- **Personal TellMe Link**: Get a unique link to share with others.
- **Message Management**: View and delete your messages easily.
- **Secure Authentication**: Sign up and log in with NextAuth.
- **Email Notifications**: Get notified when new messages arrive (optional).

## Usage

1. **Sign Up**: Register using the signup form on the app.
2. **Get Your TellMe Link**: After signing up, copy your unique TellMe link from the dashboard.
3. **Share Your Link**: Send it to friends or post it online to start receiving messages.
4. **Receive Messages**: View anonymous messages, confessions, and surprises in your dashboard.
5. **Manage Messages**: Delete any messages you don’t want to keep.

## Architecture

The TellMe app leverages **Next.js** for server-side rendering and API routes, paired with **TypeScript** for robust type safety. **Mongoose** connects the app to a MongoDB database for storing users and messages. **NextAuth** ensures secure authentication, while **Zod** and **React Hook Form** handle form validation and submission. Custom hooks via **useHook** and **TS debouncing** enhance performance and reusability.

## Troubleshooting

- **Build Errors**: Verify all dependencies are installed (`npm install`) and TypeScript types are correct.
- **Authentication Issues**: Ensure `NEXTAUTH_SECRET` and other auth-related env variables are set.
- **Database Connection**: Confirm the `MONGODB_URI` is valid and MongoDB is running.

## Contributing

We’d love your help improving TellMe! Here’s how to contribute:

- **Report Issues**: Submit bug reports or feature requests via GitHub Issues.
- **Submit Pull Requests**: Fork the repo, make your changes, and submit a PR.
- **Code Quality**: Ensure your code passes linting and tests before submitting.
