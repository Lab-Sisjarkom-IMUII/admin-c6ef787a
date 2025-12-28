# 📚 API Documentation: Admin Authentication

Dokumentasi lengkap untuk API endpoints Admin Authentication yang terpisah dari user authentication. Admin menggunakan username/password dengan JWT token khusus.

## 📋 Daftar Isi

1. [Overview](#overview)
2. [Base Information](#base-information)
3. [Authentication Flow](#authentication-flow)
4. [Endpoints](#endpoints)
   - [Admin Login](#1-admin-login)
5. [JWT Token Structure](#jwt-token-structure)
6. [Admin Auth Middleware](#admin-auth-middleware)
7. [Data Models](#data-models)
8. [Error Handling](#error-handling)
9. [Security Considerations](#security-considerations)
10. [Examples](#examples)

---

## Overview

Admin Authentication API menyediakan sistem autentikasi terpisah untuk admin yang berbeda dari user authentication:

- **Admin**: Menggunakan username/password dengan bcrypt hashing
- **User**: Menggunakan Google OAuth (terpisah)

### Fitur Utama

- Login dengan username/password
- Generate JWT token khusus admin dengan issuer terpisah
- Middleware untuk protect admin routes
- Auto-update last login time
- Token expiration configurable

---

## Base Information

### Base URL
```
http://localhost:8080/api/v1
```

### Admin JWT Configuration

Admin JWT menggunakan secret dan issuer yang berbeda dari user JWT:

- **Issuer**: `imuii-admin` (berbeda dari user token)
- **Audience**: `imuii-app`
- **Secret**: Dikonfigurasi via `ADMIN_JWT_SECRET` environment variable
- **Expiration**: Default 24 hours (dikonfigurasi via `ADMIN_JWT_EXPIRATION`)

---

## Authentication Flow

```
1. Admin mengirim username/password ke /api/v1/admin/auth/login
2. Server verify password menggunakan bcrypt
3. Server generate JWT token dengan claims admin
4. Server update last_login_at
5. Server return JWT token dan admin info
6. Client menyimpan token dan menggunakannya untuk request berikutnya
7. Client mengirim token di Authorization header: "Bearer <token>"
8. AdminAuthMiddleware verify token dan extract admin info
```

---

## Endpoints

### 1. Admin Login

Login admin dengan username dan password. Mengembalikan JWT token yang digunakan untuk authenticated requests.

**Endpoint:**
```http
POST /api/v1/admin/auth/login
```

**Authentication:** Not Required (Public endpoint untuk login)

**Request Body:**
```json
{
  "username": "admin",
  "password": "password123"
}
```

**Request Fields:**
- `username` (string, required) - Username admin (min 3, max 50 karakter)
- `password` (string, required) - Password admin (min 6 karakter)

**Validation Rules:**
- Username: 3-50 karakter, required
- Password: Minimal 6 karakter, required

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoiNTUwZTg0MDAtZTI5Yi00MWQ0LWE3MTYtNDQ2NjU1NDQwMDAwIiwidXNlcm5hbWUiOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5AaW11aWkuaWQiLCJyb2xlIjoiYWRtaW4iLCJpc3MiOiJpbXVpaS1hZG1pbiIsImF1ZCI6ImltdWlpLWFwcCIsImV4cCI6MTcwNTMyNDgwMCwiaWF0IjoxNzA1MjM4NDAwfQ.signature",
    "admin": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "username": "admin",
      "email": "admin@imuii.id",
      "role": "admin",
      "last_login_at": "2024-01-15T10:00:00Z"
    }
  }
}
```

**Response Fields:**
- `success` (boolean) - Status success
- `token` (string) - JWT token untuk authenticated requests
- `admin` (object) - Informasi admin:
  - `id` (string) - UUID admin
  - `username` (string) - Username admin
  - `email` (string) - Email admin
  - `role` (string) - Role admin (selalu "admin")
  - `last_login_at` (datetime|null) - Waktu login terakhir

**Error Responses:**

**400 Bad Request - Validation Error:**
```json
{
  "success": false,
  "message": "Validation failed",
  "code": 400,
  "error": "Key: 'AdminLoginRequest.Username' Error:Field validation for 'Username' failed on the 'required' tag"
}
```

**401 Unauthorized - Invalid Credentials:**
```json
{
  "success": false,
  "message": "Invalid username or password",
  "code": 401
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "message": "Failed to generate JWT token",
  "code": 500
}
```

**Notes:**
- Password di-hash menggunakan bcrypt dengan cost 10
- JWT token memiliki expiration time (default 24 hours)
- `last_login_at` diupdate setiap kali login berhasil
- Token harus digunakan di Authorization header untuk protected endpoints

---

## JWT Token Structure

### Token Claims

Admin JWT token berisi claims berikut:

```json
{
  "adminId": "550e8400-e29b-41d4-a716-446655440000",
  "username": "admin",
  "email": "admin@imuii.id",
  "role": "admin",
  "iss": "imuii-admin",
  "aud": "imuii-app",
  "exp": 1705324800,
  "iat": 1705238400
}
```

### Claims Description

- `adminId` (string) - UUID admin
- `username` (string) - Username admin
- `email` (string) - Email admin
- `role` (string) - Role admin (selalu "admin")
- `iss` (string) - Issuer, harus "imuii-admin"
- `aud` (string) - Audience, harus "imuii-app"
- `exp` (number) - Expiration time (Unix timestamp)
- `iat` (number) - Issued at time (Unix timestamp)

### Token Verification

Token harus memenuhi kriteria berikut:
1. Signature valid (diverifikasi dengan `ADMIN_JWT_SECRET`)
2. Issuer (`iss`) = "imuii-admin"
3. Role = "admin"
4. Token belum expired (`exp` > current time)

---

## Admin Auth Middleware

### Usage

Middleware `AdminAuthMiddleware` digunakan untuk protect admin routes:

```go
adminProtected := admin.Group("", middleware.AdminAuthMiddleware(cfg.AdminJWT.Secret))
```

### Middleware Behavior

1. **Extract Token**: Mengambil token dari `Authorization` header dengan format `Bearer <token>`
2. **Verify Token**: Memverifikasi JWT token dengan admin secret
3. **Check Issuer**: Memastikan issuer = "imuii-admin"
4. **Check Role**: Memastikan role = "admin"
5. **Set Context**: Menyimpan admin info di Fiber context:
   - `admin_id` - Admin UUID
   - `admin_username` - Admin username
   - `admin_email` - Admin email
   - `admin_role` - Admin role

### Accessing Admin Info in Handler

```go
func (h *SomeHandler) SomeMethod(c *fiber.Ctx) error {
    adminID := c.Locals("admin_id").(string)
    adminUsername := c.Locals("admin_username").(string)
    adminEmail := c.Locals("admin_email").(string)
    
    // Use admin info...
}
```

### Middleware Error Responses

**401 Unauthorized - Missing Authorization Header:**
```json
{
  "success": false,
  "message": "Authorization header required",
  "code": 401
}
```

**401 Unauthorized - Invalid Header Format:**
```json
{
  "success": false,
  "message": "Invalid authorization header format",
  "code": 401
}
```

**401 Unauthorized - Invalid Token:**
```json
{
  "success": false,
  "message": "Invalid or expired admin token",
  "code": 401
}
```

**401 Unauthorized - Invalid Issuer:**
```json
{
  "success": false,
  "message": "Invalid token issuer",
  "code": 401
}
```

**401 Unauthorized - Invalid Role:**
```json
{
  "success": false,
  "message": "Invalid role",
  "code": 401
}
```

---

## Data Models

### AdminLoginRequest
```typescript
{
  username: string;  // 3-50 characters, required
  password: string;  // min 6 characters, required
}
```

### AdminLoginResponse
```typescript
{
  success: boolean;
  token: string;     // JWT token
  admin: AdminInfo;
}
```

### AdminInfo
```typescript
{
  id: string;              // UUID
  username: string;
  email: string;
  role: string;            // Always "admin"
  last_login_at: datetime | null;
}
```

### Admin Model (Database)
```typescript
{
  id: UUID;                // Primary key, auto-generated
  username: string;        // Unique, not null
  password_hash: string;   // Bcrypt hash, not null
  email: string;           // Unique, not null
  role: string;            // Default "admin"
  last_login_at: datetime | null;
  created_at: datetime;
  updated_at: datetime;
}
```

---

## Error Handling

### Standard Error Response Format
```json
{
  "success": false,
  "message": "Error message",
  "code": 400,
  "error": "Detailed error information (optional)"
}
```

### HTTP Status Codes

- `200 OK` - Request berhasil
- `400 Bad Request` - Request tidak valid (validation error)
- `401 Unauthorized` - Tidak terautentikasi atau credentials tidak valid
- `500 Internal Server Error` - Server error

### Common Error Scenarios

1. **Missing Username/Password**
   - Status: 400
   - Message: "Validation failed"
   - Error: Field validation error

2. **Invalid Username/Password**
   - Status: 401
   - Message: "Invalid username or password"

3. **Token Expired**
   - Status: 401
   - Message: "Invalid or expired admin token"

4. **Invalid Token Format**
   - Status: 401
   - Message: "Invalid authorization header format"

---

## Security Considerations

### Password Security

1. **Bcrypt Hashing**
   - Password di-hash menggunakan bcrypt dengan cost 10
   - Password tidak pernah disimpan dalam plain text
   - Password tidak pernah dikembalikan dalam response

2. **Password Requirements**
   - Minimal 6 karakter (dapat dikonfigurasi)
   - Disarankan menggunakan password yang kuat

### JWT Token Security

1. **Secret Key**
   - Admin JWT secret harus berbeda dari user JWT secret
   - Secret harus kuat dan random
   - Secret harus disimpan di environment variable, bukan di code

2. **Token Expiration**
   - Default expiration: 24 hours
   - Dapat dikonfigurasi via `ADMIN_JWT_EXPIRATION` environment variable
   - Token yang expired tidak dapat digunakan

3. **Token Storage**
   - Client harus menyimpan token dengan aman
   - Disarankan menggunakan httpOnly cookie atau secure storage
   - Jangan simpan token di localStorage untuk production

### Best Practices

1. **HTTPS Only**
   - Selalu gunakan HTTPS di production
   - Jangan kirim credentials melalui HTTP

2. **Rate Limiting**
   - Implementasi rate limiting untuk prevent brute force attacks (future)
   - Limit login attempts per IP

3. **Token Rotation**
   - Pertimbangkan implementasi token refresh mechanism (future)
   - Allow admin untuk revoke token

4. **Audit Logging**
   - Log semua login attempts (success dan failed)
   - Log admin actions untuk audit trail

---

## Examples

### Example 1: Admin Login

**Request:**
```bash
curl -X POST http://localhost:8080/api/v1/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "admin": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "username": "admin",
      "email": "admin@imuii.id",
      "role": "admin",
      "last_login_at": "2024-01-15T10:00:00Z"
    }
  }
}
```

### Example 2: Using Token for Protected Endpoint

**Request:**
```bash
curl -X GET http://localhost:8080/api/v1/admin/subdomains/active \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response:**
```json
{
  "success": true,
  "message": "Active subdomains retrieved successfully",
  "data": {
    "success": true,
    "subdomains": [...]
  }
}
```

### Example 3: Login with Invalid Credentials

**Request:**
```bash
curl -X POST http://localhost:8080/api/v1/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "wrongpassword"
  }'
```

**Response:**
```json
{
  "success": false,
  "message": "Invalid username or password",
  "code": 401
}
```

### Example 4: Login with Validation Error

**Request:**
```bash
curl -X POST http://localhost:8080/api/v1/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "ad",
    "password": "123"
  }'
```

**Response:**
```json
{
  "success": false,
  "message": "Validation failed",
  "code": 400,
  "error": "Key: 'AdminLoginRequest.Username' Error:Field validation for 'Username' failed on the 'min' tag\nKey: 'AdminLoginRequest.Password' Error:Field validation for 'Password' failed on the 'min' tag"
}
```

### Example 5: Access Protected Endpoint Without Token

**Request:**
```bash
curl -X GET http://localhost:8080/api/v1/admin/subdomains/active
```

**Response:**
```json
{
  "success": false,
  "message": "Authorization header required",
  "code": 401
}
```

### Example 6: Access Protected Endpoint with Invalid Token

**Request:**
```bash
curl -X GET http://localhost:8080/api/v1/admin/subdomains/active \
  -H "Authorization: Bearer invalid_token_here"
```

**Response:**
```json
{
  "success": false,
  "message": "Invalid or expired admin token",
  "code": 401
}
```

---

## Configuration

### Environment Variables

```bash
# Admin JWT Secret (REQUIRED)
ADMIN_JWT_SECRET=your-super-secret-admin-key-change-in-production

# Admin JWT Expiration (hours, default: 24)
ADMIN_JWT_EXPIRATION=24
```

### Config File (config/local.yaml)

```yaml
admin_jwt:
  secret: "admin-secret-key-change-in-production"
  expiration: 24  # hours
```

### Config File (config/production.yaml)

```yaml
admin_jwt:
  secret: ""  # Set via ADMIN_JWT_SECRET env var
  expiration: 24
```

---

## Database Schema

### Admins Table

```sql
CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  last_login_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Creating Admin User

**Via SQL:**
```sql
INSERT INTO admins (username, password_hash, email, role)
VALUES (
  'admin',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- bcrypt hash dari "password123"
  'admin@imuii.id',
  'admin'
);
```

**Via Seed Script:**
```bash
# Seed script akan membuat admin default jika belum ada
# Username: daffa
# Password: @Daffaraihan2004
```

---

## Implementation Notes

### Password Hashing

Password di-hash menggunakan `golang.org/x/crypto/bcrypt` dengan cost 10:

```go
hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), 10)
```

### JWT Token Generation

Token di-generate menggunakan `github.com/golang-jwt/jwt/v4` dengan claims khusus admin:

```go
claims := &jwt.AdminJWTClaims{
    AdminID:   admin.ID.String(),
    Username:  admin.Username,
    Email:     admin.Email,
    Role:      "admin",
    StandardClaims: jwt.StandardClaims{
        Issuer:    "imuii-admin",
        Audience:  "imuii-app",
        ExpiresAt: expirationTime,
        IssuedAt:  time.Now().Unix(),
    },
}
```

### Token Verification

Middleware memverifikasi token dengan:
1. Signature verification dengan admin secret
2. Issuer check (must be "imuii-admin")
3. Role check (must be "admin")
4. Expiration check

---

## Related Documentation

- [Subdomain Management API](./API-SUBDOMAIN-MANAGEMENT.md)
- [Monitoring API](./API-MONITORING.md) (if exists)
- [Project Management API](./API-PROJECT-MANAGEMENT.md) (if exists)

---

## Testing

### Manual Testing

1. **Test Login dengan Credentials Benar**
   ```bash
   curl -X POST http://localhost:8080/api/v1/admin/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","password":"password123"}'
   ```

2. **Test Login dengan Password Salah**
   ```bash
   curl -X POST http://localhost:8080/api/v1/admin/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","password":"wrongpassword"}'
   ```

3. **Test Admin Middleware dengan Token Valid**
   ```bash
   curl -X GET http://localhost:8080/api/v1/admin/subdomains/active \
     -H "Authorization: Bearer <admin_token>"
   ```

4. **Test Admin Middleware Tanpa Token**
   ```bash
   curl -X GET http://localhost:8080/api/v1/admin/subdomains/active
   ```

5. **Test Admin Middleware dengan User Token (harus 401)**
   ```bash
   curl -X GET http://localhost:8080/api/v1/admin/subdomains/active \
     -H "Authorization: Bearer <user_token>"
   ```

---

**Last Updated:** 2024-01-15  
**Version:** 1.0.0

