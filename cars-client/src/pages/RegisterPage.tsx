import { useState, type ChangeEvent, type SubmitEvent } from 'react';
import { Link, useNavigate } from 'react-router';
import { register } from '../services/authService';

export default function RegisterPage() {
    const navigate = useNavigate();

    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    function handleChange(
        setter: (value: string) => void,
    ): (event: ChangeEvent<HTMLInputElement>) => void {
        return (event) => setter(event.target.value);
    }

    async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        setMessage(null);

        try {
            const result = await register({ userName, email, password });
            setMessage(result);
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Registration failed.');
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <section>
            <h1>Register</h1>

            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}

            <form className="car-form" onSubmit={handleSubmit}>
                <label>
                    Username
                    <input
                        type="text"
                        value={userName}
                        onChange={handleChange(setUserName)}
                        required
                    />
                </label>
                <label>
                    E-mail
                    <input
                        type="email"
                        value={email}
                        onChange={handleChange(setEmail)}
                        required
                    />
                </label>
                <label>
                    Password
                    <input
                        type="password"
                        value={password}
                        onChange={handleChange(setPassword)}
                        required
                        minLength={8}
                    />
                </label>
                <button type="submit" disabled={submitting}>
                    {submitting ? 'Creating account…' : 'Create account'}
                </button>
            </form>

            <p>
                Already have an account? <Link to="/login">Log in</Link>
            </p>
        </section>
    );
}