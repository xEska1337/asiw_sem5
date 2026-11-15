import { useState, type ChangeEvent, type SubmitEvent } from 'react';
import { Link, useSearchParams } from 'react-router';
import { resetPassword } from '../services/authService';

export default function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const email = searchParams.get('email');
    const token = searchParams.get('token');

    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    function handlePasswordChange(e: ChangeEvent<HTMLInputElement>) {
        setNewPassword(e.target.value);
    }

    async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!email || !token) return;

        setSubmitting(true);
        setError(null);

        try {
            const result = await resetPassword(email, token, newPassword);
            setMessage(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to change the password.');
        } finally {
            setSubmitting(false);
        }
    }

    if (!email || !token) {
        return (
            <section>
                <h1>Invalid link</h1>
                <Link to="/login">Back to login</Link>
            </section>
        );
    }

    return (
        <section>
            <h1>Set a new password</h1>

            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}

            <form className="car-form" onSubmit={handleSubmit}>
                <label>
                    New password
                    <input
                        type="password"
                        value={newPassword}
                        onChange={handlePasswordChange}
                        required
                        minLength={8}
                    />
                </label>
                <button type="submit" disabled={submitting}>
                    {submitting ? 'Saving…' : 'Change password'}
                </button>
            </form>
        </section>
    );
}