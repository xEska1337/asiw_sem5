import { useState, type ChangeEvent, type SubmitEvent } from 'react';
import { Link } from 'react-router';
import { forgotPassword } from '../services/authService';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    function handleEmailChange(e: ChangeEvent<HTMLInputElement>) {
        setEmail(e.target.value);
    }

    async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        setMessage(null);

        try {
            const result = await forgotPassword(email);
            setMessage(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Request failed.');
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <section>
            <h1>Forgot password</h1>

            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}

            <form className="car-form" onSubmit={handleSubmit}>
                <label>
                    E-mail
                    <input
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        required
                    />
                </label>
                <button type="submit" disabled={submitting}>
                    {submitting ? 'Sending…' : 'Send reset link'}
                </button>
            </form>

            <p>
                <Link to="/login">Back to login</Link>
            </p>
        </section>
    );
}