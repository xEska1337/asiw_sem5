import { Link } from 'react-router';

export default function NotFoundPage() {
    return (
        <section>
            <h1>404</h1>
            <Link to="/">← Back to Home</Link>
        </section>
    );
}