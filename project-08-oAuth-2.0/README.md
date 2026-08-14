# Project 08 — OAuth 2.0 Authentication with Google

A practical Express.js project demonstrating **OAuth 2.0 authentication** using Google as an external identity provider.

This project implements a Google login flow using **Passport.js** and the **Google OAuth 2.0 strategy**, showing how an application can allow users to authenticate through an existing Google account instead of managing their passwords directly.

This is the eighth blueprint in the **Backend System Design — 40 Project Blueprints** series.

---

# 🎯 What This Project Teaches

This project focuses on the fundamentals of OAuth authentication:

* OAuth 2.0
* Google authentication
* Passport.js
* Passport strategies
* External identity providers
* OAuth authorization flow
* Authorization URLs
* Callback URLs
* OAuth scopes
* Access tokens
* Refresh tokens
* User profiles
* Authentication redirects
* `passport.initialize()`
* Protected authentication flows

The key goal is to understand:

> **OAuth allows an application to authenticate a user through an external identity provider such as Google without requiring the application to directly manage the user's Google password.**

---

# 🔐 Understanding OAuth

OAuth is a protocol commonly used to allow applications to obtain limited access to information or services provided by another system.

In this project:

```text
Your Application
       │
       │ "I want the user to log in"
       ▼
    Google
       │
       │ User authenticates
       ▼
Google Authorization
       │
       ▼
Callback URL
       │
       ▼
Your Application
       │
       ▼
Authenticated User
```

Instead of creating a traditional login form such as:

```text
Username
Password
   ↓
Your Server
```

the application redirects the user to Google.

---

# 🌐 OAuth vs Traditional Authentication

With traditional authentication:

```text
User
  │
  │ Username + Password
  ▼
Your Application
  │
  ▼
Verify Credentials
```

With OAuth:

```text
User
  │
  ▼
Your Application
  │
  ▼
Google
  │
  ▼
User Authenticates
  │
  ▼
Google Callback
  │
  ▼
Your Application
```

The application delegates authentication to Google.

---

# 🏗️ Architecture

```text
                              Client
                                │
                                ▼
                       GET /auth/google
                                │
                                ▼
                     Passport Google Strategy
                                │
                                ▼
                       Redirect to Google
                                │
                                ▼
                     ┌────────────────────┐
                     │      Google        │
                     │                    │
                     │ User Login        │
                     │ User Consent      │
                     └─────────┬──────────┘
                               │
                               ▼
                    /auth/google/callback
                               │
                               ▼
                    Passport Authentication
                               │
                     ┌─────────┴─────────┐
                     │                   │
                  Failure             Success
                     │                   │
                     ▼                   ▼
                     /              User Profile
                                         │
                                         ▼
                                    JSON Response
```

---

# 📡 API Endpoints

| Method | Endpoint                | Purpose                                  |
| ------ | ----------------------- | ---------------------------------------- |
| `GET`  | `/auth/google`          | Start Google OAuth authentication        |
| `GET`  | `/auth/google/callback` | Receive Google's authentication callback |

---

# 1. Google OAuth Login

The authentication process begins at:

```http
GET /auth/google
```

The route uses Passport:

```javascript
passport.authenticate("google", {
  scope: ["profile", "email"]
})
```

The `google` strategy tells Passport to use the configured Google OAuth strategy.

The scopes specify the information the application is requesting.

This project requests:

```text
profile
email
```

---

# 🔑 Understanding OAuth Scopes

A scope describes the type of access or information an application is requesting.

This project uses:

```javascript
scope: ["profile", "email"]
```

Conceptually:

```text
Application
     │
     ▼
Request:
     │
     ├── profile
     │
     └── email
     │
     ▼
Google
```

The exact information available depends on the provider and the scopes granted.

The important concept is:

> **Scopes define what access or information the application is requesting from the identity provider.**

---

# 2. Configuring Google OAuth

Passport is configured with the Google OAuth strategy:

```javascript
passport.use(new GoogleStrategy({
  clientID: "GOOGLE_CLIENT_ID",
  clientSecret: "GOOGLE_CLIENT_SECRET",
  callbackURL: "/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => {
  return done(null, profile);
}));
```

The strategy requires several important values.

---

## Client ID

```text
GOOGLE_CLIENT_ID
```

The client ID identifies your application to Google.

---

## Client Secret

```text
GOOGLE_CLIENT_SECRET
```

The client secret is used as part of the application's OAuth credentials.

It should be kept private.

---

## Callback URL

```text
/auth/google/callback
```

The callback URL is where Google redirects the user after the OAuth process.

The flow is:

```text
Application
     │
     ▼
Google
     │
     ▼
Authentication
     │
     ▼
Callback URL
     │
     ▼
Application
```

---

# 3. Passport Initialization

The application initializes Passport with:

```javascript
app.use(passport.initialize());
```

This allows Passport to process authentication requests and strategies.

The basic relationship is:

```text
Express
   │
   ▼
Passport
   │
   ▼
Google Strategy
   │
   ▼
Google OAuth
```

---

# 4. OAuth Callback

After the user completes authentication with Google, Google redirects the user back to:

```http
GET /auth/google/callback
```

The route uses:

```javascript
passport.authenticate("google", {
  failureRedirect: "/"
})
```

If authentication fails:

```text
Google
   ↓
Authentication Failed
   ↓
Passport
   ↓
Redirect /
```

If authentication succeeds, the final callback executes:

```javascript
(req, res) => {
  res.json({
    message: "Logged in with Google"
  });
}
```

---

# 👤 Understanding the User Profile

The Google strategy callback receives:

```javascript
(accessToken, refreshToken, profile, done)
```

The important values include:

```text
accessToken
refreshToken
profile
```

The `profile` contains information returned by Google about the authenticated user.

The project currently returns that profile directly through:

```javascript
return done(null, profile);
```

The comment in the code indicates that a real application would normally save relevant user information to a database.

For example:

```text
Google Profile
      ↓
Find User
      ↓
User Exists?
   │       │
  Yes      No
   │       │
   ▼       ▼
Login    Create User
   │       │
   └───┬───┘
       ▼
Authenticated User
```

---

# 🔄 Complete OAuth Flow

```text
                         Client
                           │
                           ▼
                  /auth/google
                           │
                           ▼
                 Passport Google
                     Strategy
                           │
                           ▼
                      Google
                           │
                           ▼
                  User Authentication
                           │
                           ▼
                    User Consent
                           │
                           ▼
              /auth/google/callback
                           │
                           ▼
                 Passport Verification
                           │
                    ┌──────┴──────┐
                    │             │
                 Failure        Success
                    │             │
                    ▼             ▼
                  "/"       User Profile
                                  │
                                  ▼
                             Application
```

---

# 🧠 Key Concepts

## 1. OAuth 2.0

OAuth 2.0 provides a standardized authorization framework that allows applications to interact with an external authorization or identity provider.

In this project, Google is the external provider.

```text
Your Application
       ↓
     Google
       ↓
Authentication
       ↓
Callback
       ↓
Your Application
```

---

## 2. Identity Provider

An identity provider is a system that can authenticate users and provide identity information to applications.

In this project:

```text
Identity Provider
       ↓
     Google
```

Instead of your application directly validating the user's Google password, Google performs the authentication.

---

## 3. Passport.js

Passport is an authentication middleware for Node.js.

It provides a common authentication interface while allowing different authentication strategies to be plugged into an application.

This project uses:

```text
Passport
   ↓
Google OAuth Strategy
```

---

## 4. Passport Strategy

Passport uses strategies to implement different authentication mechanisms.

This project imports:

```javascript
const GoogleStrategy =
  require("passport-google-oauth20").Strategy;
```

and registers it with:

```javascript
passport.use(...)
```

The strategy handles the Google OAuth interaction.

---

## 5. Access Token

The strategy callback receives:

```javascript
accessToken
```

An access token can be used by an application to access resources permitted by the authorization granted through the OAuth flow.

The exact use of the token depends on the provider and the requested permissions.

---

## 6. Refresh Token

The strategy callback also receives:

```javascript
refreshToken
```

Refresh tokens can be used in OAuth systems to obtain new access tokens without requiring the user to authenticate again, depending on the provider and configuration.

This project receives the value but does not implement refresh-token handling.

---

## 7. Callback URL

The callback URL is the endpoint Google uses to return the user to your application after the OAuth process.

This project uses:

```text
/auth/google/callback
```

The callback must correspond to the redirect URI configured for the Google OAuth application.

---

# 🔐 Authentication Flow vs Authorization

OAuth can be confusing because it is fundamentally an authorization framework, while applications often use an OAuth provider to implement user authentication.

Conceptually:

```text
Google
  │
  │ Authenticates User
  ▼
OAuth Flow
  │
  │ Returns authorized information
  ▼
Your Application
  │
  ▼
Establishes User Session / Identity
```

A production application should carefully define how the Google identity is mapped to a local application account and how the authenticated state is maintained.

---

# 🚨 Important Security Note

The OAuth credentials in this project are placeholders:

```javascript
clientID: "GOOGLE_CLIENT_ID"
```

and:

```javascript
clientSecret: "GOOGLE_CLIENT_SECRET"
```

These values must be replaced with actual credentials when configuring the application.

However, **real credentials should never be committed directly into source code or GitHub repositories**.

Production applications should use:

* Environment variables
* Secret managers
* HTTPS
* Secure callback URLs
* Input validation
* Secure session management
* Proper token handling
* Appropriate OAuth scopes
* CSRF protection where applicable
* Secure cookies where sessions are used
* Database-backed user accounts
* Proper account-linking logic
* Token expiration and rotation strategies where appropriate

For example:

```text
.env
```

could contain:

```text
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
```

and the application could load them through environment variables.

The `.env` file should not be committed to GitHub.

---

# 📦 Technologies

* **Node.js**
* **Express.js**
* **Passport.js**
* **passport-google-oauth20**
* **JavaScript**
* **OAuth 2.0**
* **Google OAuth**
* **HTTP**
* **JSON**

---

# 🚀 Getting Started

## Prerequisites

Make sure Node.js and npm are installed:

```bash
node -v
npm -v
```

You will also need a Google OAuth application configured with valid credentials.

---

## 1. Install Dependencies

From the project directory:

```bash
npm install
```

The required packages include:

```bash
npm install express passport passport-google-oauth20
```

---

## 2. Configure Google OAuth Credentials

Create a Google OAuth application and obtain:

```text
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
```

Configure the OAuth callback URL to match:

```text
/auth/google/callback
```

For local development, the complete callback URL would typically be:

```text
http://localhost:9100/auth/google/callback
```

The exact configuration depends on how your Google OAuth application is configured.

---

## 3. Configure the Application

Replace:

```javascript
clientID: "GOOGLE_CLIENT_ID"
```

with your Google client ID.

Replace:

```javascript
clientSecret: "GOOGLE_CLIENT_SECRET"
```

with your Google client secret.

For production, use environment variables rather than hardcoding credentials.

---

## 4. Start the Server

```bash
node index.js
```

The server will run on:

```text
http://localhost:9100
```

You should see:

```text
OAuth API running on port 9100
```

---

# 🧪 Testing

You can test the OAuth flow using:

* A web browser
* Postman
* Browser developer tools

Because OAuth involves redirects and user interaction with Google, a normal web browser is the most appropriate way to test the complete login flow.

---

# Test Google Authentication

## 1. Start Login

Open:

```text
http://localhost:9100/auth/google
```

The application should redirect the browser to Google's authentication page.

The flow should look like:

```text
Browser
   ↓
/auth/google
   ↓
Google Login
   ↓
Google Authorization
   ↓
/auth/google/callback
   ↓
Application
```

---

## 2. Authenticate With Google

Sign in with the Google account you are using for testing.

Depending on the OAuth application's configuration, Google may display a consent screen asking the user to approve the requested permissions.

This project requests:

```text
profile
email
```

---

## 3. Successful Authentication

After successful authentication, Google redirects the user to:

```text
/auth/google/callback
```

The application responds with:

```json
{
  "message": "Logged in with Google"
}
```

---

## 4. Failed Authentication

If authentication fails, Passport uses:

```javascript
failureRedirect: "/"
```

The user is redirected to:

```text
/
```

Note that this project does not define a dedicated `/` route, so a production implementation should provide an appropriate failure page or API response.

---

# 📁 Project Structure

```text
project-08/
│
├── index.js
├── package.json
└── README.md
```

### `index.js`

Contains the Express application, Passport configuration, Google OAuth strategy, login route, callback route, and server configuration.

### `package.json`

Contains the Node.js project configuration and dependencies.

### `README.md`

Contains the documentation for the project and the OAuth concepts demonstrated.

---

# 💡 Possible Improvements

This project intentionally keeps the OAuth implementation simple so the core OAuth flow is easier to understand.

Possible improvements include:

* Store Google users in PostgreSQL or MongoDB
* Create a User model
* Check whether a Google account already exists
* Automatically create new users
* Link Google accounts to existing accounts
* Add session-based authentication after OAuth
* Add JWT authentication after OAuth
* Implement Passport session support
* Add `serializeUser`
* Add `deserializeUser`
* Store OAuth credentials in environment variables
* Add proper error handling
* Add CSRF protection
* Add secure cookies
* Add HTTPS
* Add account linking
* Add logout
* Add refresh-token handling where appropriate
* Store tokens securely when they need to be retained
* Add rate limiting
* Add authentication middleware
* Add authorization middleware
* Add automated OAuth tests

A more realistic architecture could look like:

```text
                    Google
                       │
                       ▼
                 OAuth Login
                       │
                       ▼
              Callback Endpoint
                       │
                       ▼
              Verify Google User
                       │
                       ▼
                Find User
                 │       │
              Exists   New User
                 │       │
                 │       ▼
                 │    Create User
                 │       │
                 └───┬───┘
                     ▼
              Create Auth State
                     │
             ┌───────┴────────┐
             │                │
          Session            JWT
             │                │
             └───────┬────────┘
                     ▼
              Protected API
```

---

# 🎓 Learning Outcome

After completing this project, you should be able to explain:

* What OAuth 2.0 is
* What an OAuth identity provider is
* How Google OAuth works conceptually
* What Passport.js does
* What a Passport strategy is
* What OAuth scopes are
* What access tokens are
* What refresh tokens are
* What a callback URL is
* Why OAuth requires redirect flows
* How Google authenticates the user
* How the application receives the Google profile
* Why OAuth credentials must remain secret
* How OAuth can be combined with sessions or JWTs
* How a production application can persist OAuth users
* Why authentication and account management are separate concerns

The key lesson is:

> **OAuth allows your application to delegate authentication to an external identity provider such as Google and then use the resulting identity information to establish authentication within your own application.**

---

# 🔗 Blueprint Information

**Series:** Backend System Design — 40 Project Blueprints

**Project:** 08 / 40

**Concept:** OAuth 2.0 Authentication with Google

**Focus:** Understanding external authentication providers, OAuth redirects, Passport strategies, scopes, callback URLs, and Google identity integration.

---

# 👨‍💻 Creator

**Andrew Emaye**

This project is part of my practical backend development and system-design learning series, focused on understanding the architectures, patterns, and building blocks used to create scalable applications.

---

# 🔒 Privacy Policy

This project is an educational backend application and does not intentionally collect, sell, or share personal user information.

Any Google profile information received during OAuth testing is processed only as part of the educational demonstration and is not intended to represent a production user database.

This project does not intentionally store, sell, or distribute users' Google account information.

If this project is extended to process real user information, appropriate privacy, security, authentication, consent, and data-protection measures should be implemented.

---

# 📄 License

This project is licensed under the **MIT License**.

You are free to use, copy, modify, merge, publish, distribute, sublicense, and sell copies of the project, subject to the conditions of the MIT License.

See the `LICENSE` file in this repository for the full license text.

---

## ⭐ Keep Learning

**Build it. Break it. Understand it. Scale it.**
