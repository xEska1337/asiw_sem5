import { useState, type ChangeEvent, type SubmitEvent } from 'react';
import { Link, useNavigate } from 'react-router';
import { login } from '../services/authService';
import { useAuthStore } from '../store/useAuthStore';

export default function LoginPage() {
    const navigate = useNavigate();
    const setUser = useAuthStore((state) => state.setUser);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    function handleEmailChange(e: ChangeEvent<HTMLInputElement>) {
        setEmail(e.target.value);
    }

    function handlePasswordChange(e: ChangeEvent<HTMLInputElement>) {
        setPassword(e.target.value);
    }

    async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            const user = await login({ email, password });
            setUser(user);
            navigate('/cars');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed.');
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <section>
            <h1>Log in</h1>

            {error && <p className="error-message">{error}</p>}

            <form className="car-form" onSubmit={handleSubmit}>
                <label>
                    E-mail
                    <input type="email" value={email} onChange={handleEmailChange} required />
                </label>
                <label>
                    Password
                    <input
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                        required
                    />
                </label>
                <button type="submit" disabled={submitting}>
                    {submitting ? 'Logging in…' : 'Log in'}
                </button>
            </form>

            <p>
                <Link to="/forgot-password">Forgot your password?</Link>
            </p>
            <p>
                Don't have an account? <Link to="/register">Register</Link>
            </p>
        </section>
    );
}