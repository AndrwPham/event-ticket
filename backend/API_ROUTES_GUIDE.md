# 📘 API Routes Documentation

This guide provides an overview of all available API routes in the backend system. Each section corresponds to a controller and its available endpoints.

---

## 🔐 AuthController `/auth`

### POST `/auth/register`

* **Description**: Register a new user
* **Body**:

```json
{
  "email": "string",
  "username": "string",
  "password": "string"
}
```

### POST `/auth/login`

* **Description**: Login a user
* **Body**:

```json
{
  "username": "string",
  "password": "string"
}
```

### POST `/auth/logout`

* **Description**: Logout the current user
* **Headers**: `Authorization: Bearer <token>`

### GET `/auth/user`

* **Description**: Get current logged-in user info
* **Headers**: `Authorization: Bearer <token>`

### POST `/auth/refresh`

* **Description**: Refresh access token
* **Body**: `{ "refreshToken": "string" }`

---
# From here all routes just need a normal header: Content-Type: application/json. With specific POST, PATCH, DELETE need additional Authorization: Bearer <access_token> header!

## 📅 EventController `/events`

### POST `/events`

* **Description**: Create new event

### GET `/events`

* **Description**: Get all events

### GET `/events/:id`

* **Description**: Get event by ID

### PATCH `/events/:id`

* **Description**: Update event by ID

### DELETE `/events/:id`

* **Description**: Delete event by ID

### GET `/events/category/:categoryId`

* **Description**: Get events by category

### GET `/events/city/:cityId`

* **Description**: Get events by city

### GET `/events/district/:districtId`

* **Description**: Get events by district

### GET `/events/ward/:wardId`

* **Description**: Get events by ward

---

## 🖼️ ImageController `/images`

### POST `/images`

* **Description**: Upload image

### GET `/images`

* **Description**: Get all images

### GET `/images/:id`

* **Description**: Get image by ID

### GET `/images/images/:userId`

* **Description**: Get images by user ID

### GET `/images/images/:userId/:type`

* **Description**: Get user images by type

### GET `/images/images/:eventId`

* **Description**: Get images by event ID

### GET `/images/images/:eventId/:type`

* **Description**: Get event images by type

### GET `/images/images/:ticket`

* **Description**: Get images by ticket ID

### GET `/images/images/:ticket/:type`

* **Description**: Get ticket images by type

### PATCH `/images/:id`

* **Description**: Update image by ID

### DELETE `/images/:id`

* **Description**: Delete image by ID

---

## 🎟️ TicketController `/tickets`

### POST `/tickets`

* **Description**: Create ticket

### GET `/tickets`

* **Description**: Get all tickets

### GET `/tickets/:id`

* **Description**: Get ticket by ID

### GET `/tickets/event/:id`

* **Description**: Get tickets by event ID

### PATCH `/tickets/:id`

* **Description**: Update ticket

### DELETE `/tickets/:id`

* **Description**: Delete ticket

---

## 📂 CategoryController `/categories`

### POST `/categories`

* **Description**: Create category

### GET `/categories`

* **Description**: Get all categories

### GET `/categories/:id`

* **Description**: Get category by ID

### PATCH `/categories/:id`

* **Description**: Update category

### DELETE `/categories/:id`

* **Description**: Delete category

---

## 📦 OrderController `/orders`

### POST `/orders`

* **Description**: Create new order

### GET `/orders`

* **Description**: Get all orders

### GET `/orders/user/:userId`

* **Description**: Get orders by user ID

### PATCH `/orders/:id`

* **Description**: Update order by ID

### PATCH `/orders/:id/cancel`

* **Description**: Cancel order

### PATCH `/orders/:id/confirm`

* **Description**: Confirm order

---

## 🎫 TicketItemController `/ticket-items`

### POST `/ticket-items`

* **Description**: Create ticket item

### GET `/ticket-items`

* **Description**: Get all ticket items

### GET `/ticket-items/user/:userId`

* **Description**: Get ticket items by user ID

### GET `/ticket-items/order/:orderId`

* **Description**: Get ticket items by order ID

### GET `/ticket-items/ticket/:ticketId`

* **Description**: Get ticket items by ticket ID

---

## ⭐ ReviewController `/reviews`

### POST `/reviews`

* **Description**: Post a review

### GET `/reviews`

* **Description**: Get all reviews

### GET `/reviews/event/:eventId`

* **Description**: Get reviews for an event

### PATCH `/reviews/:id`

* **Description**: Update review

### DELETE `/reviews/:id`

* **Description**: Delete review

---

> ⚠️ Don't forget to add one more authentication header (Bearer) for POST, PATCH, DELETE routes! 
