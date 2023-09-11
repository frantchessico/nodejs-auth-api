

---

# Nodejs Auth API Documentation

Welcome to the official documentation of Nodejs Auth API. This API provides a comprehensive set of functionalities for user management, authentication, email verification, and password reset.

## Table of Contents

- [Authentication](#authentication)
  - [Registration](#registration)
  - [Login](#login)
- [User Profile](#user-profile)
  - [Get User Profile](#get-user-profile)
  - [Update User Profile](#update-user-profile)
  - [Delete User Account](#delete-user-account)
- [Password Management](#password-management)
  - [Request Password Reset](#request-password-reset)
  - [Reset Password](#reset-password)
- [Email Verification](#email-verification)
  - [Request Email Verification](#request-email-verification)
  - [Verify Email](#verify-email)
- [Middleware](#middleware)
  - [Authentication Guard](#authentication-guard)
  - [User Verification](#user-verification)
- [Token Management](#token-management)

## Authentication

### Registration

- **URL:** `/api/register`
- **Method:** `POST`
- **Description:** Register a new user account.
- **Request Body:**
  - `firstName` (string, required): First name of the user.
  - `lastName` (string, required): Last name of the user.
  - `email` (string, required): Email address of the user.
  - `password` (string, required): Password for the user's account.
- **Response:**
  - `message`: Success message.
  - `token`: JWT token for email verification.

### Login

- **URL:** `/api/login`
- **Method:** `POST`
- **Description:** Authenticate a user and generate an access token.
- **Request Body:**
  - `email` (string, required): Email address of the user.
  - `password` (string, required): Password for the user's account.
- **Response:**
  - `token`: JWT access token for authentication.

## User Profile

### Get User Profile

- **URL:** `/api/profile`
- **Method:** `GET`
- **Description:** Get the user profile of the authenticated user.
- **Response:**
  - User profile information.

### Update User Profile

- **URL:** `/api/profile`
- **Method:** `PUT`
- **Description:** Update the user profile of the authenticated user.
- **Request Body:**
  - `firstName` (string, optional): New first name of the user.
  - `lastName` (string, optional): New last name of the user.
- **Response:**
  - Updated user profile information.

### Delete User Account

- **URL:** `/api/profile`
- **Method:** `DELETE`
- **Description:** Delete the user account of the authenticated user.
- **Response:**
  - Success message.

## Password Management

### Request Password Reset

- **URL:** `/api/reset-password`
- **Method:** `POST`
- **Description:** Request a password reset for the user's account.
- **Request Body:**
  - `email` (string, required): Email address of the user.
- **Response:**
  - `message`: Success message.
  - `token`: JWT token for password reset.

### Reset Password

- **URL:** `/api/reset-password`
- **Method:** `PUT`
- **Description:** Reset the user's password using a valid reset token.
- **Request Headers:**
  - `pass_token` (string, required): JWT reset token in the headers.
- **Request Body:**
  - `newPassword` (string, required): New password for the user's account.
- **Response:**
  - Success message.

## Email Verification

### Request Email Verification

- **URL:** `/api/request-email-verification`
- **Method:** `POST`
- **Description:** Request email verification for the user's account.
- **Request Body:**
  - `email` (string, required): Email address of the user.
- **Response:**
  - `message`: Success message.
  - `token`: JWT token for email verification.

### Verify Email

- **URL:** `/api/verify-email`
- **Method:** `PUT`
- **Description:** Verify the user's email using a valid email verification token.
- **Request Headers:**
  - `emailverifytoken` (string, required): JWT email verification token in the headers.
- **Response:**
  - Success message.

## Middleware

### Authentication Guard

- **Middleware Name:** `AUTH_GUARD`
- **Description:** Protects routes by verifying the user's authentication token. Ensures that only authenticated users can access protected resources.

### User Verification

- **Middleware Name:** `checkUserExists` and `isEmailVerified`
- **Description:** Provides user verification functionalities such as checking if a user exists during registration and verifying email status before allowing access to certain routes.

## Token Management

### Token Generation and Verification

- **Token Types:** 'default', 'resetPassword', 'emailVerification'
- **Token Generation:** `generateToken(_id: string, type: string, options?: TokenOptions): Promise<string>`
- **Token Verification:** `verifyToken(token: string, type: string): JwtPayload`

---

This concludes the documentation for MyAPI. You can use these routes and functionalities to manage user accounts, handle authentication, and ensure security in your application. Feel free to expand and customize this documentation to suit your specific needs and provide additional details about the API's usage and features.

## Developed by:
**Francisco Inoque**
