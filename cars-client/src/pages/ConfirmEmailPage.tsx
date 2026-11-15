import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { confirmEmail } from '../services/authService';

export default function ConfirmEmailPage() {
    const [searchParams] = useSearchParams();
    const userId = searchParams.get('userId');
    const token = searchParams.get('token');

    const [message, setMessage] = useState('Confirming account…');
    const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

    const confirmedKeyRef = useRef<string | null>(null);

    useEffect(() => {
        if (!userId || !token) return;

        const key = `${userId}:${token}`;
        if (confirmedKeyRef.current === key) return;
        confirmedKeyRef.current = key;

        async function confirm() {
            try {
                const result = await confirmEmail(userId!, token!);
                setMessage(result);
                setIsSuccess(true);
            } catch {
                setMessage('Failed to confirm the account.');
                setIsSuccess(false);
            }
        }

        confirm();
    }, [userId, token]);

    if (!userId || !token) {
        return (
            <section>
                <h1>Invalid link</h1>
                <Link to="/login">Go to login</Link>
            </section>
        );
    }

    return (
        <section>
            <h1>Account confirmation</h1>

            {isSuccess === true && <p className="success-message">{message}</p>}
            {isSuccess === false && <p className="error-message">{message}</p>}
            {isSuccess === null && <p>{message}</p>}

            <Link to="/login">Go to login</Link>
        </section>
    );
}