# 🎬 Movie Booking Platform

[![Live Demo](https://img.shields.io/badge/Vercel-Live%20Demo-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://popcornpass-phi.vercel.app/)

A full-stack movie discovery and ticket booking application built with React, Node.js, Express, MongoDB, and Redis. Users can browse movies, explore showtimes, select seats, temporarily reserve them, and confirm bookings through a simulated payment flow. Administrators can manage movies and create shows for configured theatres.

## ✨ Features

### 🎟️ Customer Features
- User registration and login
- JWT-based authentication using HTTP-only cookies
- Browse movies and view detailed movie information
- Explore upcoming shows for each movie
- View theatre, screen, language, date, time, and ticket prices
- Interactive, show-specific seat selection
- Temporary seat reservations with automatic expiry
- Simulated payment and booking confirmation
- Personal booking history
- View individual booking details
- Email ticket notifications after successful bookings

### 🛠️ Admin Features
- Add movies through protected admin endpoints
- Create shows for existing movies and theatres
- Automatically generate seat layouts from theatre configurations
- Restrict movie and show creation to authenticated administrators

### 🔒 Seat Booking and Concurrency
- Independent seat availability for every show
- Seat identifiers such as `A1`, `A2`, `B1`, and `B2`
- Real-time availability based on MongoDB and Redis state
- Five-minute temporary seat holds
- Atomic Redis locks to prevent simultaneous reservations
- Automatic expiry of abandoned seat holds
- Conditional MongoDB updates to prevent double booking
- Rollback handling when booking confirmation fails
- Booking operations fail safely if Redis is unavailable

## 🧰 Tech Stack

### Frontend
- React 19
- React Router
- Vite
- Tailwind CSS 4
- Lucide React

### Backend
- Node.js
- Express 5
- Mongoose
- MongoDB
- Redis
- JSON Web Tokens (JWT)
- bcryptjs
- cookie-parser
- cors
- Nodemailer
- express-rate-limit

## 🏗️ Project Structure

```text
MovieBookingPlatform/
├── Backend/
│   ├── server.js
│   ├── src/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   └── utils/
│   ├── package.json
│   └── .env
│
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   ├── package.json
│   └── .env
│
└── README.md
```

*The exact directory structure may vary slightly depending on the current implementation.*

## 🔄 How Booking Works

1. A user registers or logs in.
2. The user browses movies and selects a show.
3. The application fetches the seat layout for that specific show.
4. The user selects available seats.
5. The backend temporarily locks the selected seats in Redis for five minutes.
6. The user proceeds to the simulated payment step.
7. The backend validates the seat locks and confirms the booking.
8. MongoDB records the confirmed booking and updates the seat statuses to `BOOKED`.
9. The user can view the confirmed booking in their booking history.

## 🔐 Redis Seat Locking

Redis prevents multiple users from reserving the same seat simultaneously.

A lock key follows this pattern:

```text
lock:<showId>:<seatId>
```

Example:

```text
lock:6aca80b8f7db46e6afee9d7a:A1
```

Locks are created atomically with a five-minute expiry:

```javascript
redis.set(key, userId, {
  NX: true,
  EX: 300
});
```

- `NX` creates the lock only if it does not already exist.
- `EX: 300` expires the lock after 300 seconds.
- Other users cannot acquire a seat while its lock is active.
- Partially acquired locks are released if a multi-seat lock operation fails.
- Booking confirmation validates that all requested locks belong to the current user.
- MongoDB conditionally updates only seats that remain `AVAILABLE`.
- If booking creation fails after seat updates, the backend restores the affected seats.

**MongoDB is the source of truth for permanent seat status. Redis manages temporary seat locks.**

Redis is required for safe seat locking and booking confirmation.

## 🗃️ Data Models

### Movie
Stores movie information such as title, description, duration, genres, languages, release date, status, and poster asset key.

### Theatre
Stores theatre and screen configuration:

- `name`
- `location`
- `screenName`
- `totalRows`
- `seatsPerRow`

### Show
Represents a particular screening:

- `movie` — reference to a movie
- `theater` — reference to a theatre
- `startTime`
- `language`
- `ticketPrice`
- `seats[]` — seat identifier and status

Seat statuses:

| Status | Meaning |
|---|---|
| `AVAILABLE` | Seat is available for selection |
| `LOCKED` | Seat is temporarily held in Redis |
| `BOOKED` | Seat has been permanently booked |

### Booking
Stores confirmed reservation information:

- `user`
- `show`
- `seatsBooked`
- `subtotal`
- `discount`
- `offerName`
- `totalAmount`
- `paymentStatus`
- `paymentId`
- `status`
- `bookingDate`

## 🔌 API Endpoints

All endpoints use the `/api` prefix.

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a user |
| POST | `/api/auth/login` | Log in and set the authentication cookie |
| GET | `/api/auth/me` | Get the current authenticated user |

### Movies and Theatres

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/movies` | List movies |
| GET | `/api/movies/:movieId` | Get movie details |
| GET | `/api/movies/:movieId/shows` | Get upcoming shows for a movie |
| POST | `/api/movies` | Add a movie — admin only |
| GET | `/api/theatres` | List theatres |
| GET | `/api/theatres/:theatreId` | Get theatre details |

### Shows and Seats

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/shows/:showId` | Get show details |
| GET | `/api/shows/:showId/seats` | Get current seat availability |
| GET | `/api/shows/:showId/price?seats=2` | Calculate price for a seat count |
| POST | `/api/shows` | Create a show — admin only |
| POST | `/api/shows/:showId/seats/lock` | Temporarily hold selected seats |

### Bookings

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/bookings` | Confirm a booking |
| GET | `/api/bookings/my` | List the current user's bookings |
| GET | `/api/bookings/:bookingId` | Get a booking owned by the user or accessed by an admin |

Protected endpoints require authentication. Movie and show creation endpoints require the `admin` role.

## ⚙️ Prerequisites

Install or configure:

- Node.js 18 or newer
- npm
- MongoDB or MongoDB Atlas
- Redis, running locally or hosted

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd MovieBookingPlatform
```

Replace the placeholder with your repository URL.

### 2. Configure the Backend

Create a `Backend/.env` file:

```env
PORT=3000
MONGO_URL=mongodb://127.0.0.1:27017/movie_booking
JWT_SECRET=replace-with-a-long-random-secret
REDIS_URL=redis://127.0.0.1:6379

EMAIL_USER=your-email@example.com
EMAIL_PASS=your-email-app-password
```

Update the values for your environment. Email variables are only needed if email notifications are enabled.

**Never commit real database credentials, JWT secrets, email passwords, or other secrets to GitHub.**

### 3. Install Backend Dependencies

```bash
cd Backend
npm install
```

### 4. Start the Backend

For development:

```bash
npm run dev
```

For a normal start:

```bash
npm start
```

The API will typically be available at:

```text
http://localhost:3000/api
```

### 5. Configure the Frontend

Create `Frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

If you use a different backend address, update this variable accordingly.

For the Vercel deployment, the frontend uses the same-origin `/api` path in production and [Frontend/vercel.json](./Frontend/vercel.json) rewrites it to the deployed Render backend. If the frontend is deployed on another platform, set `VITE_API_BASE_URL` to that platform's backend API URL before building.

### 6. Install Frontend Dependencies

Open a new terminal from the repository root:

```bash
cd Frontend
npm install
```

### 7. Start the Frontend

```bash
npm run dev
```

Open the URL printed by Vite, typically:

```text
http://localhost:5173
```

### 8. Build and Lint

Create a production build:

```bash
npm run build
```

Run linting:

```bash
npm run lint
```

To preview the production build locally:

```bash
npm run preview
```

## 👤 Initial Application Setup

1. Start MongoDB and Redis.
2. Start the backend and frontend.
3. Register a normal user through the application.
4. Promote the appropriate user to administrator by setting their `role` to `admin` in MongoDB, following the user schema.
5. Sign in with the admin account.
6. Add movies and create shows for configured theatres.
7. Open a movie, choose a show, select seats, and complete the simulated payment.
8. Verify that the booking appears in the user's booking history.

When a show is created, its seat layout is generated from the theatre's `totalRows` and `seatsPerRow`. Updating a theatre's layout later does not automatically rebuild existing shows.

## ☁️ Deployment

The project can be deployed using separate services while keeping the frontend and backend in the same GitHub repository.

Suggested architecture:

- **Frontend:** Vercel
- **Backend:** Render Web Service
- **Database:** MongoDB Atlas
- **Redis:** Render Key Value or another compatible hosted Redis service

Configure the required environment variables in the hosting providers' dashboards. Update the frontend API URL and configure CORS, cookies, and credentials for the deployed domains.

For production deployment, verify Redis persistence and availability, authentication cookie settings, database access rules, and the complete booking flow.

## 💳 Payment Disclaimer

The payment flow is currently simulated. It does not process real payments or charge a payment method. A production payment gateway must be integrated before accepting actual payments.

## 🧪 Important Implementation Details

- Every show has its own independent seat layout.
- Permanent seat bookings are stored in MongoDB.
- Temporary holds are stored in Redis with TTL expiration.
- Protected booking routes enforce authentication and ownership checks.
- Administrative creation routes enforce the `admin` role.
- Upcoming-show queries exclude shows that have already started.
- Seat details are fetched through a dedicated endpoint.
- Email notification failures do not necessarily undo a confirmed booking.

## 🛠️ Troubleshooting

### Redis Connection Errors

Check that Redis is running and that `REDIS_URL` is correct. Seat locking and booking confirmation intentionally fail when Redis is unavailable.

### MongoDB Connection Errors

Verify `MONGO_URL`, database credentials, network access rules, and MongoDB availability.

### Frontend Cannot Reach the API

Check `VITE_API_BASE_URL`, ensure the backend is running, and verify CORS and credentials configuration. Restart Vite after changing environment variables.

### Seats Appear in Unexpected Rows

The seat layout is generated in row-major order using the theatre's configuration. Ensure the frontend renders the same number of seats per row used when the show was created.

---

**Movie Booking Platform** — Discover movies, choose your seats, and book your next cinematic experience. 🎬
