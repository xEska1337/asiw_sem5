import { NavLink, Outlet, useNavigate } from 'react-router';
import { useAuthStore } from '../store/useAuthStore';
import { useCarUiStore } from '../store/useCarUiStore';

export default function RootLayout() {
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);

    const favoriteCount = useCarUiStore((state) =>
        user ? (state.favoriteCarIdsByUser[user.id] ?? []).length : 0,
    );

    const linkClass = ({ isActive }: { isActive: boolean }) =>
        isActive ? 'active' : undefined;

    function handleLogout() {
        logout();
        navigate('/login');
    }

    return (
        <div className="app-shell">
            <header>
                <h1>Cars Client</h1>
                <nav>
                    <NavLink to="/" end className={linkClass}>Home</NavLink>

                    {user && (
                        <>
                            <NavLink to="/cars" end className={linkClass}>Cars</NavLink>
                            <NavLink to="/cars/new" className={linkClass}>Add Car</NavLink>
                        </>
                    )}

                    <NavLink to="/about" className={linkClass}>About</NavLink>

                    {user ? (
                        <>
                            <span className="favorite-counter">Favourites: {favoriteCount}</span>
                            <span className="user-info">
                                {user.userName} ({user.roles.join(', ')})
                            </span>
                            <button type="button" className="nav-button" onClick={handleLogout}>
                                Log out
                            </button>
                        </>
                    ) : (
                        <>
                            <NavLink to="/login" className={linkClass}>Login</NavLink>
                            <NavLink to="/register" className={linkClass}>Register</NavLink>
                        </>
                    )}
                </nav>
            </header>
            <main>
                <Outlet />
            </main>
        </div>
    );
}