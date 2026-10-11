# PopcornPass — Movie Booking Platform

PopcornPass is a full-stack movie-ticket booking app. This README is also the **single-pass frontend implementation brief**: give the section named [Frontend build prompt](#frontend-build-prompt) to a coding agent from the repository root to build the complete customer-facing frontend against the existing API.

## Product at a glance

Customers browse movies, inspect details and upcoming showtimes, choose available seats, review the price, complete a **simulated** payment, and view their bookings. Admin users can add movies and create showtimes. The frontend is a React/Vite app; the API is Express and MongoDB-backed, with Redis required for seat holds and booking confirmation.

## Current project state

The frontend is an early scaffold, not a finished product. The router and page files exist, but Home, Movies, MovieDetail, Booking, and Payment are placeholders. Login and signup forms are visual starting points with frontend-only behavior; Profile uses a temporary local-storage user. `src/services/api.js` exists but is empty. Build the actual app using the existing React 19, React Router, Tailwind CSS 4, and Lucide React dependencies.

### Repository layout

```text
Backend/
  server.js
  src/
    app.js
    controllers/
    middlewares/
    models/
    routes/
    utils/
Frontend/
  index.html
  vite.config.js
  src/
    App.jsx
    App.css
    index.css
    component/common/Navbar.jsx
    pages/
    services/api.js
    utils/
```

## Frontend build prompt

Copy everything in this prompt into your coding agent while its workspace is the repository root:

> **Build the complete PopcornPass frontend in one pass.** Work in the existing `Frontend` app and use the existing React 19, Vite, React Router, Tailwind CSS 4, and Lucide React dependencies. Do not replace the backend, add a second app, or introduce dependencies unless the existing stack truly cannot meet a requirement. Inspect the current frontend and API before editing. Implement the working app—not just mockups or a plan—and verify it with the frontend lint and production build.
>
> **Product:** A polished, responsive movie-ticket booking experience. Users discover movies, see showtimes, select seats, review a live price, complete a clearly labelled simulated payment, then see their confirmation and booking history. Admins can create movies and shows using existing theatres. Do not imply that real payments, Google sign-in, booking cancellation, theatre creation, genre/language/format filtering, or show-format selection are supported; the API has no such features.
>
> **Visual direction:** Keep the PopcornPass identity and the existing auth-page direction: cinematic near-black/navy surfaces, rich violet as the main action color, warm amber for highlights, and restrained mint accents. Use poster-led layouts, generous spacing, strong readable type, subtle gradients/glows, rounded cards, clear contrast, and small purposeful motion. Make the layout feel like a premium cinema product, not a generic admin dashboard. Reuse `src/assets/hero.png`, `src/assets/popcorn.png`, and the existing `PopcornScene`/auth visual elements where they improve the experience. Do not rely on remote image services being available: provide attractive fallbacks when movie artwork is missing. Ensure mobile, tablet, and desktop layouts all work; include visible focus states, semantic labels, keyboard-operable controls, and reduced-motion-friendly animation.
>
> **App structure and routes:** Keep a shared responsive navigation with Home, Movies, My Bookings, Profile, and an Admin link for admin users; use React Router `Link`/`useNavigate`, not full-page anchors or `window.location`. Preserve and complete these routes: `/` (home), `/movies` (catalogue), `/movie/:id` (movie detail and showtimes), `/booking/:showId` (seat selection), `/booking` (booking history), `/payment` (checkout/confirmation), `/login`, `/signup`, `/profile`, `/admin`. Add a not-found page. Keep the existing route spellings; profile’s “My Bookings” destination must be `/booking`. Use a shared page shell, reusable movie cards, buttons, inputs, loading/error/empty states, and accessible dialogs or notifications where useful. Avoid duplicating page-level fetch and error handling.
>
> **Pages and interactions:**
>
> 1. **Home:** A distinctive cinematic hero with a clear “Explore movies” action, a concise value proposition, and a “Now Showing” movie row/grid populated from the API. Include sensible loading, empty, and retryable error states.
> 2. **Movies:** Fetch the catalogue; provide a search field wired to the API’s `search` query and a status selector for `now_showing`, `upcoming`, and `ended`. Search/filter changes must refresh the list. Do not add genre or language filters because the API does not filter those fields. Make movie cards link to `/movie/:id`.
> 3. **Movie detail:** Fetch the movie by route ID and its upcoming shows. Display artwork fallback, title, description, duration, genres, languages, and release/status metadata when present. Show each available show’s theatre/screen, location, start time, language, and ticket price. A show selection begins booking only after authentication; otherwise take the user to login and preserve or clearly recover the selected movie/show. Navigate an authenticated user to `/booking/:showId`.
> 4. **Seat selection and checkout:** Use `/booking/:showId` for the seat map and `/booking` for booking history; do not conflate the two. Fetch the show details, available-seat status, and pricing using the actual endpoints below. Render a responsive, labelled grid with `AVAILABLE`, `LOCKED`, and `BOOKED` states; allow selecting only available seats, show selected seats distinctly, and show an accessible legend. Require at least one seat. On continue, authenticate if needed, request a hold for the selected seats, display the server’s 300-second expiry, and take the user to `/payment`. Handle a 409 by refreshing seat state and explaining that a seat became unavailable. Never treat a client-side selection as a successful hold. Refresh seats when returning to the page; do not promise automatic hold renewal or release because there are no corresponding endpoints.
> 5. **Payment:** Show a clear order summary (movie, theatre, showtime, seats, subtotal, discount/offer if returned, and total). Payment is a simulation: label the action “Confirm booking” or “Simulate payment”; never collect or display card details. Submit the booking with the held show and seats, prevent double submission, and show API errors (including expired holds) with a path back to choose seats again. On success show the booking reference, payment ID, status, amount, show details, and a link to `/booking`. Use the booking response as the source of truth.
> 6. **Login and signup:** Connect the existing forms to the API. Login takes email and password; signup takes name, email, and password (the API does not accept username login). Show field and server errors, pending state, and successful navigation. The API sets an HttpOnly `auth_token` cookie and also returns a token; use cookie credentials on requests. Do not store passwords or put an HttpOnly cookie in local storage. If using the returned bearer token for requests, keep its handling deliberate and consistent; cookie-based auth with `credentials: "include"` is supported.
> 7. **Profile and bookings:** Fetch the current user from `/auth/me`, show their name/email and role, and use `/bookings/my` for history. Render clear loading, error, and no-bookings states; link each booking to a detail view using `/bookings/:bookingId` if a detail surface is implemented. The API has no logout endpoint and the cookie is HttpOnly, so do not claim that a frontend-only action revokes the session; explain this limitation if presenting a sign-out control. Guard protected pages in the UI, but rely on the API for real authorization. Admin UI is shown only to users whose `role` is `admin`.
> 8. **Admin:** Provide working forms to create a movie and a show. Use existing theatre records from `GET /theatres` (there is no theatre creation API). Movie fields: title (required), description, duration, genres, languages, release date, status, and optional `assetKey`. Show fields: movie, theatre, start time, language, and ticket price. Fetch movies and theatres for the selectors. Surface validation and permission errors; do not show a success state until the API succeeds.
>
> **API and integration:** Implement a small shared API client in `src/services/api.js`. Use `VITE_API_BASE_URL` as the API base URL, defaulting to `http://localhost:3000/api`; include cookies (`credentials: "include"`), JSON headers/bodies when appropriate, parse JSON safely, and throw a useful error containing the server’s `{ "message": "..." }` text and HTTP status. Never silently convert failed requests into empty success data. Keep response and request field names exactly as listed in this README. Use `Intl.DateTimeFormat` and `Intl.NumberFormat` with `en-IN`/INR for dates and prices.
>
> **Quality bar:** Fetch real API data; do not substitute dummy data in the finished app. Implement loading, empty, and error states for every data-backed screen, validate form input, avoid stale async responses where practical, and keep booking state recoverable across the movie → seats → payment flow (session storage is acceptable for non-sensitive pending selection; never store passwords). Make all navigation work on refresh and on direct route entry. Do not leave TODOs, placeholder pages, dead controls, fake authentication, or fake bookings. Keep changes scoped to `Frontend` and this README. Run `npm run lint` and `npm run build` from `Frontend`, fix issues caused by this implementation, and report any API or infrastructure prerequisites that prevent an end-to-end booking.

## API contract for the frontend

All paths below are relative to `/api`. JSON request bodies are expected where shown. Successful list endpoints return JSON arrays; an API error generally returns `{ "message": "..." }`. MongoDB documents include `_id`; populated references can be objects, so read the fields actually returned rather than assuming IDs only.

| Method and path                             | Auth           | Request / response                                                                                                                                                                                                                                          |
| ------------------------------------------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `POST /auth/register`                       | Public         | Body `{ name, email, password }`; returns `{ token, user: { id, name, email, role } }` and sets the auth cookie.                                                                                                                                            |
| `POST /auth/login`                          | Public         | Body `{ email, password }`; returns `{ token, user: { id, name, email, role } }` and sets the auth cookie.                                                                                                                                                  |
| `GET /auth/me`                              | User           | Returns the authenticated user, including name, email, role, and other profile fields.                                                                                                                                                                      |
| `GET /movies?status=now_showing&search=...` | Public         | Returns movie documents: `title`, `description`, `duration`, `genres`, `languages`, `releaseDate`, `status`, optional `assetKey`. Supported filters are `status` and text `search` only.                                                                    |
| `GET /movies/:movieId`                      | Public         | Returns one movie document.                                                                                                                                                                                                                                 |
| `POST /movies`                              | Admin          | Body includes `title` and optional `description`, `duration`, `genres`, `languages`, `releaseDate`, `status`, `assetKey`; returns the created movie.                                                                                                        |
| `GET /movies/:movieId/shows`                | Public         | Returns future shows, with populated `theater` and fields including `startTime`, `language`, and `ticketPrice`.                                                                                                                                             |
| `GET /theatres`                             | Public         | Returns theatres with `name`, `location`, `screenName`, `totalRows`, and `seatsPerRow`.                                                                                                                                                                     |
| `GET /theatres/:theatreId`                  | Public         | Returns one theatre.                                                                                                                                                                                                                                        |
| `GET /shows/:showId`                        | Public         | Returns show details populated with `movie` and `theater`; seats are excluded.                                                                                                                                                                              |
| `GET /shows/:showId/seats`                  | Redis required | Returns `[{ seatId, status }]`; status is `AVAILABLE`, `LOCKED`, or `BOOKED`.                                                                                                                                                                               |
| `GET /shows/:showId/price?seats=2`          | Public         | Returns `{ subtotal, discount, total, offer }`. `offer` may be `null`; display server values, not a hard-coded promotion.                                                                                                                                   |
| `POST /shows/:showId/seats/lock`            | User + Redis   | Body `{ seats: ["A1", "A2"] }`; returns `{ message, seats, expiresInSeconds }`. Holds expire after 300 seconds. A `409` means the selected seats could not be held.                                                                                         |
| `POST /shows`                               | Admin          | Body `{ movie, theater, startTime, language, ticketPrice }`; returns `{ _id }`. The backend generates the seat layout from the theatre’s row/seat counts.                                                                                                   |
| `POST /bookings`                            | User + Redis   | Body `{ show: showId, seats: ["A1", "A2"] }`; confirms the held seats and returns a booking with `seatsBooked`, `subtotal`, `discount`, `offerName`, `totalAmount`, `paymentStatus`, and `paymentId`. A `409` can indicate an expired hold or booked seats. |
| `GET /bookings/my`                          | User           | Returns the current user’s bookings, newest first, with populated show, movie, and theatre.                                                                                                                                                                 |
| `GET /bookings/:bookingId`                  | Owner or admin | Returns one booking with populated show, movie, and theatre.                                                                                                                                                                                                |

Protected endpoints accept either the HttpOnly `auth_token` cookie or a bearer authorization header. Cross-origin requests must include credentials. The API does not expose a logout, cancellation, hold-renewal, hold-release, payment-provider, theatre-creation, or booking-update endpoint. Do not implement UI that promises any of those actions.

## Setup and run

### Requirements

- Node.js and npm
- MongoDB, configured with `MONGO_URL`
- Redis for seat availability, holds, and booking confirmation
- Optional Gmail SMTP credentials for ticket confirmation email

### Configure the backend

Create `Backend/.env` with values appropriate to your environment:

```dotenv
PORT=3000
MONGO_URL=mongodb://127.0.0.1:27017/movieBooking
JWT_SECRET=replace-with-a-long-random-secret
REDIS_URL=redis://127.0.0.1:6379
EMAIL_USER=your-gmail-address
EMAIL_PASS=your-gmail-app-password
```

Email settings are optional. The API can start without Redis, but seat availability, holds, and booking confirmation require Redis. Never commit real credentials.

### Install and run

In separate terminals, from the repository root:

```sh
cd Backend
npm install
npm run dev
```

```sh
cd Frontend
npm install
npm run dev
```

The backend defaults to `http://localhost:3000`; Vite prints the frontend URL in its terminal. If the API is hosted elsewhere, create `Frontend/.env.local`:

```dotenv
VITE_API_BASE_URL=http://localhost:3000/api
```

`Frontend/vite.config.js` does not currently configure an API proxy. The frontend API client should use the environment variable above and default to `http://localhost:3000/api`.

### Frontend checks

From `Frontend`:

```sh
npm run lint
npm run build
```

## Important product and backend constraints

- Payment is **simulated**. A confirmed booking receives a generated `PAY-...` payment ID; no payment processor charges the customer.
- Booking confirmation requires that the user is authenticated, Redis is available, and every requested seat is still held by that user. A hold lasts five minutes.
- Ticket email requires Gmail SMTP configuration. Email failure does not reverse a successful booking.
- Movie genres and languages are metadata only; the list endpoint does not filter by them. Shows contain a language but no format.
- The current admin APIs create movies and shows, but not theatres. Theatre selection must use existing records.
- The current auth API has no logout endpoint. The cookie is HttpOnly; frontend code cannot directly remove it.
