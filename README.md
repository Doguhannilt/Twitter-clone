
# Twitter Clone Backend

This is the backend for a Twitter clone application built using Node.js, Express, and MongoDB. It includes features like user authentication, post creation, notifications, and user profile management.

## Features

- **User Authentication**: Signup, login, logout, and token generation.
- **User Profiles**: View and update user profiles, follow users, and get suggested users.
- **Posts**: Create, like, comment on posts, and view posts by user or those from followed users.
- **Notifications**: Get and delete notifications.

## API Endpoints

### Authentication
- **POST** `/api/auth/signup` - Register a new user.
- **POST** `/api/auth/login` - Log in with a user account.
- **POST** `/api/auth/logout` - Log out from the session.
- **GET** `/api/auth/authenticated` - Check if the user is authenticated.

### Notifications
- **GET** `/api/notifications/` - Get all notifications for the authenticated user.
- **DELETE** `/api/notifications/` - Delete notifications for the authenticated user.

### Users
- **GET** `/api/users/profile/:username` - Get a user's profile by their username.
- **GET** `/api/users/suggested` - Get a list of suggested users to follow.
- **POST** `/api/users/follow/:id` - Follow a user by their ID.
- **PUT** `/api/users/update` - Update the authenticated user's profile.

### Posts
- **GET** `/api/posts/all` - Get all posts.
- **GET** `/api/posts/following` - Get posts from followed users.
- **GET** `/api/posts/likes/:id` - Get users who liked a specific post.
- **GET** `/api/posts/user/:username` - Get posts by a specific user.
- **POST** `/api/posts/create` - Create a new post.
- **GET** `/api/posts/:id` - Get a specific post by ID.
- **POST** `/api/posts/comment/:id` - Comment on a specific post.
- **POST** `/api/posts/like/:id` - Like a specific post.

## Technologies Used

- **Node.js**
- **Express**
- **MongoDB**
- **Mongoose**
- **JSON Web Tokens (JWT)**
- **Bcrypt.js** (for password hashing)
- **Cloudinary** (for media storage)
- **Cookie-Parser**
- **CORS**
- **Dotenv**
- **Nodemon** (for development)

## Getting Started

### Prerequisites

- Node.js installed on your machine
- MongoDB installed and running

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/twitter-clone-backend.git
   cd twitter-clone-backend
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add the following variables:
   ```plaintext
   MONGO_URI=your_mongo_db_connection_string
   JWT_SECRET=your_jwt_secret_key
   CLOUDINARY_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. The server will be running on `http://localhost:5000`.

## Acknowledgements

Special thanks to **As a Programmer** and **Dave Gray** for their tutorials, which greatly inspired this project.

