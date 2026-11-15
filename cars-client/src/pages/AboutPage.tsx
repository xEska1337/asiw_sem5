import { Link } from 'react-router';

export default function AboutPage() {
    return (
        <section>
            <h1>About</h1>
            <p>
                <strong>Cars Client</strong> — a demo app built with React, React Router,
                Axios and Zustand on the frontend and ASP.NET Core with Identity + JWT on
                the backend.
            </p>
            <p>
                Features: registration, e-mail confirmation, login with JWT, password reset,
                protected routes, role-based UI (Admin vs User) and per-user favourites.
            </p>
            <Link to="/">← Back to home</Link>
        </section>
    );
}