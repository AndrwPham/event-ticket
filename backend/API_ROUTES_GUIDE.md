
# API Guide for Frontend – Sending Data to NestJS Backend

This guide explains how the frontend should interact with the NestJS backend to send data, including authentication, event creation, ticket handling, and more.

---

### Authentication Routes

### `POST /auth/register`
Register a new user.

**Request Body (JSON):**
```json
{
  "email": "user@example.com",
  "password": "yourPassword",
  "fullName": "User Name"
}
```

### `POST /auth/login`
Log in and receive access and refresh tokens.

**Request Body (JSON):**
```json
{
  "email": "user@example.com",
  "password": "yourPassword"
}
```

**Response:**
```json
{
  "access_token": "jwt-access-token",
  "refresh_token": "jwt-refresh-token"
}
```

### `POST /auth/refresh`
Use refresh token to get a new access token.

**Headers:**
```
Authorization: Bearer <refresh_token>
```

---

## 📅 Event Routes

### `POST /events`
Create a new event.

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: Application-json
```

**Request Body (JSON):**
```json
{
  "title": "Live Music Night",
  "description": "A night of fun music!",
  "categoryId": "abc123",
  "cityId": "ct456",
  "districtId": "dt789",
  "wardId": "wd101",
  "date": "2025-05-30T18:00:00Z"
}
```

---

## 🎫 Ticket Routes

### `POST /tickets`
Create a ticket type for an event.

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: Application-json
```

**Request Body:**
```json
{
  "eventId": "event123",
  "name": "VIP",
  "price": 500000,
  "quantity": 100
}
```

---

## 🖼 Image Upload

### `POST /images`
Upload an image (e.g. event poster, user profile, ticket preview).

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: Application-json
```

**Form Fields:**
- `type`: `event` | `user` | `ticket` | `logo` | `banner` (no rule here just suggestions to fit frontend logic)
- `url`: ID of related entity

---

## 🛒 Order Tickets

### `POST /orders`
Create an order for purchasing tickets.

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: Application-json
```

**Request Body:**
```json
{
  "userId": "user123",
  "ticketItems": [
    { "ticketId": "ticketA", "quantity": 2 },
    { "ticketId": "ticketB", "quantity": 1 }
  ]
}
```

---

## 📝 Review an Event

### `POST /reviews`
Submit a review for an event.

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: Application-json
```

**Request Body:**
```json
{
  "eventId": "event123",
  "rating": 5,
  "comment": "Amazing event!"
}
```

---

## ℹ️ Notes

- Use `Authorization: Bearer <access_token>` for all authenticated requests.
- Use correct `Content-Type` (`application/json` or `multipart/form-data`).

---

For more endpoints (`PATCH`, `DELETE`, or `GET`), refer to the backend route logs or API documentation.

