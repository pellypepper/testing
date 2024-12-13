import React, { useRef, useState } from "react";
import { FaSearch, FaTimes, FaBars, FaUser, FaShoppingCart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "./navbar.css";
import Cart from "../cart/cart";
import Spinner from "../spinner";

export default function Navbar({ cart, setCart, removeFromCart, setSearchQuery }) {
    const menuRef = useRef(null);
    const searchRef = useRef(null);
    const loginRef = useRef(null);
    const cartRef = useRef(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false); // Track loading state
    const navigate = useNavigate();

    // Utility functions for toggling menu visibility
    const toggleVisibility = (ref) => ref.current?.classList.toggle("active");
    const closeVisibility = (ref) => ref.current?.classList.remove("active");

    const handleLoginFormSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            alert("Please enter both email and password.");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                alert(errorData.error || "Login failed");
                return;
            }

            const data = await response.json();
            console.log("Login successful:", data);

            if (data.user?.isadmin) {
                navigate("/admin"); // Redirect to admin page if user is admin
            } else {
                alert("You do not have permission to access the admin page.");
            }
        } catch (error) {
            console.error("Network error:", error);
            alert("An error occurred. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="main">
            <div className="container-fluid">
                <div className="row h-100">
                    <div className="logo-wrapper col-6">
                        <Link to="/"><div className="logo">MEDMORE</div>
</Link>
                    </div>
                    <nav className="col-6 d-flex justify-content-end">
                        <button onClick={() => toggleVisibility(searchRef)} className="rounded-pill">
                            <FaSearch className="icon" />
                        </button>
                        <button onClick={() => toggleVisibility(loginRef)} className="rounded-pill">
                            <FaUser className="icon" />
                        </button>
                        <button onClick={() => toggleVisibility(menuRef)} className="rounded-pill">
                            <FaBars className="icon" />
                        </button>
                        <button onClick={() => toggleVisibility(cartRef)} className="rounded-pill">
                            <FaShoppingCart className="icon" />
                        </button>
                    </nav>
                </div>
            </div>

            {/* Sidebar Menu */}
            <aside className="side-menu" ref={menuRef}>
                <div onClick={() => closeVisibility(menuRef)} className="close-div">
                    <FaTimes className="times" />
                </div>
                <nav>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <p></p>
                        <li><Link to="/about">About</Link></li>
                        <p></p>
                        <li><Link to="/services">Services</Link></li>
                        <p></p>
                        <li><Link to="/contact">Contact</Link></li>
                        <p></p>
                    </ul>
                </nav>
            </aside>

            {/* Search Form */}
            <form className="form" ref={searchRef} onSubmit={(e) => e.preventDefault()}>
                <input
                    type="search"
                    placeholder="Search"
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <FaTimes onClick={() => closeVisibility(searchRef)} className="times" />
            </form>

            {/* Login Modal */}
            <div className="login" ref={loginRef}>
                <div className="login-wrapper">
                    <FaTimes onClick={() => closeVisibility(loginRef)} className="times" />
                    <h3>LOGIN</h3>
                    <p className="border"></p>
                    <form onSubmit={handleLoginFormSubmit}>
                        <input
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            required
                        />
                        <input
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            required
                        />
                        <div className="remember-wrapper">
                            <div className="d-flex">
                                <input type="checkbox" />
                                <span>Remember me</span>
                            </div>
                            <Link to="/forgot-password">Forgot Password?</Link>
                        </div>
                        <button type="submit">
                            {loading ? <Spinner /> : "Submit"}
                        </button>
                    </form>
                </div>
            </div>

            {/* Cart Modal */}
            <div ref={cartRef} className="cart">
                <Cart
                    cartRef={cartRef}
                    cart={cart}
                    removeFromCart={removeFromCart}
                    setCart={setCart}
                />
            </div>
        </main>
    );
}
