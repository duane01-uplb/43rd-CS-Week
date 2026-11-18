# API

## Conventions
 - Prefer SvelteKit form actions (`+page.server.ts` actions) for form-driven mutations when possible.
 - Use SvelteKit endpoints (`src/routes/api/*/+server.ts`) for plain HTTP JSON endpoints or webhook handlers.
 - All data reads/writes (events, registrations, profiles) go through Drizzle. Every admin action/endpoint handler must check the session/role (via `requireSession()` / `requireAdmin()`) before querying — Drizzle bypasses RLS, so this check is not optional. See `agents/AUTHORIZATION.md`. Public registration is anonymous and needs no session check.

## Public web app

| Route | Behavior |
|---|---|
| `GET /` | Show upcoming open events. |
| `GET /events` | List open events by default. Use `status=all` to include closed events and `upcoming=1` to restrict results by start time. |
| `GET /events/:id` | Show the event and its registration fields. Draft events return 404. |
| `POST /events/:id?/register` | Submit the named registration form action anonymously. |

- `POST /events/:id?/register` creates a registration without a session:
  field/event-status/capacity validation, then an insert pinned to the
  single anonymous identity (`ANONYMOUS_USER_ID`). File answers are
  uploaded to Supabase Storage with the service-role client before the database
  transaction. The transaction locks the event, rechecks its status and
  confirmed seat count, then inserts. Rejected registrations trigger cleanup
  of their attempted uploads. Closed events reject submissions, and events
  with external registration redirect to the event's signup site.

## Admin app

| Route | Behavior |
|---|---|
| `GET /login`, `POST /login` | Show sign-in and authenticate via the cookie-backed Supabase client. |
| `GET /admin` | Show event and registration counts. |
| `GET /admin/events` | List events, including drafts. |
| `GET /admin/events/new`, `POST /admin/events/new` | Show the create form and create an event. |
| `GET /admin/events/:id/edit`, `POST /admin/events/:id/edit` | Show the edit form and save changes. |
| `GET /admin/registrations` | List and filter registrations. |
| `GET /admin/registrations/export` | Download the filtered list as CSV. |
| `GET /admin/registrations/file?path=...` | Redirect to a proof-file URL signed for five minutes. |

- Protected routes call `requireAdmin()`. The edit action takes the same
  event lock as registration before checking confirmed seats and saving
  capacity or status changes. Both event forms interpret wall time in
  Asia/Manila and store a timezone-aware timestamp.
- The admin registration list and `GET /admin/registrations/export` share
  the `q` and `status` filters. Search matches event titles, profile names,
  and submitted participant names. CSV export neutralizes formula-like cells.
