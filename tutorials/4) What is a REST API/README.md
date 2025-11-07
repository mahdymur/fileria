# Tutorial 4: What is a REST API

In this tutorial, you'll learn what a REST API is and why it's important for web development.

## What You'll Learn

- What an API is and why we use them
- What REST means and how REST APIs work
- HTTP methods (GET, POST, PUT, DELETE)
- How APIs enable communication between frontend and backend
- Real-world examples of APIs

## What is an API?

**API** stands for **Application Programming Interface**. Think of it as a waiter in a restaurant:

- You (the frontend) tell the waiter what you want
- The waiter (the API) takes your order to the kitchen (the backend)
- The kitchen prepares your food (processes the request)
- The waiter brings your food back (returns the response)

An API is a way for different parts of your application (or different applications) to talk to each other.

## What is REST?

**REST** stands for **Representational State Transfer**. It's a set of rules for building APIs that make them easy to understand and use.

### Key Principles of REST:

1. **Stateless**: Each request contains all the information needed to process it
2. **Resource-based**: Everything is treated as a resource (like a user, a post, a comment)
3. **Standard HTTP methods**: Uses common HTTP verbs to perform actions

## HTTP Methods

REST APIs use HTTP methods (also called verbs) to perform different actions:

### GET - Read Data
- Used to retrieve information
- Like asking "Can I see that user's profile?"
- Example: `GET /api/users/123` - Get user with ID 123

### POST - Create Data
- Used to create new resources
- Like saying "Please create a new user"
- Example: `POST /api/users` - Create a new user

### PUT/PATCH - Update Data
- Used to update existing resources
- PUT replaces the entire resource, PATCH updates part of it
- Like saying "Please update this user's email"
- Example: `PUT /api/users/123` - Update user with ID 123

### DELETE - Delete Data
- Used to remove resources
- Like saying "Please delete this user"
- Example: `DELETE /api/users/123` - Delete user with ID 123

## How REST APIs Work

### Request Structure

Every API request has:
1. **URL/Endpoint**: Where to send the request
   - Example: `https://api.example.com/users`
2. **Method**: What action to perform (GET, POST, etc.)
3. **Headers**: Additional information (authentication, content type)
4. **Body**: Data to send (for POST/PUT requests)

### Response Structure

Every API response has:
1. **Status Code**: Indicates success or failure
   - 200: Success
   - 201: Created successfully
   - 400: Bad request (client error)
   - 404: Not found
   - 500: Server error
2. **Body**: The actual data returned

## Real-World Examples

### Example 1: Getting User Information

```
GET /api/users/123

Response:
{
  "id": 123,
  "name": "John Doe",
  "email": "john@example.com"
}
```

### Example 2: Creating a New Post

```
POST /api/posts
Body: {
  "title": "My First Post",
  "content": "This is the content..."
}

Response:
{
  "id": 456,
  "title": "My First Post",
  "content": "This is the content...",
  "created_at": "2024-01-15T10:30:00Z"
}
```

### Example 3: Updating User Profile

```
PUT /api/users/123
Body: {
  "name": "Jane Doe",
  "email": "jane@example.com"
}

Response:
{
  "id": 123,
  "name": "Jane Doe",
  "email": "jane@example.com"
}
```

## Why Use REST APIs?

1. **Separation of Concerns**: Frontend and backend can be developed separately
2. **Reusability**: One API can serve multiple clients (web, mobile, etc.)
3. **Scalability**: Easy to scale and maintain
4. **Standardization**: Uses well-known HTTP methods and status codes
5. **Flexibility**: Can change the backend without affecting the frontend (as long as the API contract stays the same)

## REST API Best Practices

1. **Use Nouns, Not Verbs**: `/api/users` not `/api/getUsers`
2. **Use Plural Nouns**: `/api/users` not `/api/user`
3. **Use HTTP Status Codes**: Return appropriate status codes
4. **Version Your APIs**: `/api/v1/users` allows for future changes
5. **Use Consistent Naming**: Keep naming conventions consistent

## Common REST API Patterns

### Collection Endpoints
- `GET /api/users` - Get all users
- `POST /api/users` - Create a new user

### Item Endpoints
- `GET /api/users/123` - Get user with ID 123
- `PUT /api/users/123` - Update user with ID 123
- `DELETE /api/users/123` - Delete user with ID 123

### Nested Resources
- `GET /api/users/123/posts` - Get all posts by user 123
- `POST /api/users/123/posts` - Create a post for user 123

## Next Steps

Now that you understand REST APIs, you're ready to:
- Create your own API routes in Next.js (Tutorial 5)
- Build full CRUD operations (Tutorial 6)
- Connect your frontend to your backend

## See It Working

Check out the example page at `/examples/rest-api` to see a visual explanation and interactive examples of REST APIs!

