# API Specification - Authentication & Authorization

## Teknologi yang Digunakan

- **Backend**: Node.js
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Token)

## Authentication Flow

### 1. User Registration

**Endpoint:**

```
POST /auth/register
```

**Request Body:**

```json
{
  "username": "string",
  "name": "string",
  "password": "string",
  "email": "string"
}
```

**Response:**

```json
{
  "message": "User registered successfully",
  "user": {
    "username": "string",
    "email": "string",
    "name": "string"
  }
}
```

### 2. User Login

**Endpoint:**

```
POST /auth/login
```

**Request Body:**

```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**

```json
{
  "message": "Login successfuly",
  "accessToken": "string",
  "refreshToken": "string"
}
```

### 3. Token Refresh

**Endpoint:**

```
POST /auth/refresh
```

**Request Body:**

```json
{
  "refreshToken": "string"
}
```

**Response:**

```json
{
  "accessToken": "string"
}
```

### 4. Logout

**Endpoint:**

```
POST /auth/logout
```

**Request Body:**

```json
{
  "refreshToken": "string"
}
```

**Response:**

```json
{
  "message": "Logout successful"
}
```

## Authorization

### 5. Get User Profile (Protected Route)

**Endpoint:**

```
GET /users/me
```

**Headers:**

```
Authorization: Bearer <accessToken>
```

**Response:**

```json
{
  "username": "string",
  "email": "string"
}
```

## Error Responses

```json
{
  "error": "Unauthorized",
  "message": "Invalid credentials"
}
```

```json
{
  "error": "Forbidden",
  "message": "Access denied"
}
```
