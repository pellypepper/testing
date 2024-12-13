import React, { useState } from "react";
import Navbar from "../../component/navbar/navbar";
import Footer from "../../component/footer/footer";
import Spinner from "../../component/spinner"; // Import the spinner component
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons';
import './display.css';

export default function ProductDisplay() {
    const location = useLocation();
    const product = location.state?.product || {};
    const navigate = useNavigate();

    // Randomly generate a rating for demonstration purposes
    const rating = Math.floor(Math.random() * 5) + 1;
    const stars = Array.from({ length: 5 }, (v, i) => (i < rating ? solidStar : regularStar));

    // Initialize cart state from localStorage
    const loadCart = () => JSON.parse(localStorage.getItem("cart")) || [];
    const [cart, setCart] = useState(loadCart());
    const [loading, setLoading] = useState(false); // State for loading spinner

    const updateCart = (newCart) => {
        setCart(newCart);
        localStorage.setItem("cart", JSON.stringify(newCart));
    };

    const adjustQuantity = (amount) => {
        const updatedCart = cart.map((item) =>
            item.name === product.name ? { ...item, quantity: Math.max(item.quantity + amount, 1) } : item
        );
        updateCart(updatedCart);
    };

    // Navigate to checkout page
    const handleCheckout = async () => {
        setLoading(true); // Show spinner when processing checkout
        const existingProduct = cart.find(item => item.name === product.name);
        const updatedCart = existingProduct
            ? cart.map(item =>
                item.name === product.name
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
              )
            : [...cart, { ...product, quantity: 1 }];

        updateCart(updatedCart);

        // Simulate a network delay before navigating to checkout
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate delay
        setLoading(false); // Hide spinner after processing

        navigate("/checkout");
    };

    return (
        <main>
            <Navbar />
            <section className="product-section my-4 container">
                {loading && <Spinner />} {/* Show spinner when loading */}
                <div className="product-wrapper p-4">
                    <div className="product-image">
                        <img src={product.img} alt={product.name} />
                    </div>
                    <div className="product-text mt-4 mt-md-0">
                        <h1>{product.name}</h1>
                        <span>${typeof product.price === 'number' ? product.price.toFixed(2) : 'N/A'}</span>
                        <div className="rating">
                            {stars.map((star, index) => (
                                <FontAwesomeIcon key={index} icon={star} className="star" />
                            ))}
                        </div>
                        <p>Quantity</p>
                        <div className="quantity-controls">
                            <button className="btn-1" onClick={() => adjustQuantity(-1)}>-</button>
                            <span>{cart.find(item => item.name === product.name)?.quantity || 1}</span>
                            <button className="btn-1" onClick={() => adjustQuantity(1)}>+</button>
                        </div>
                        <div className="reviews">
                            <p>Reviews</p>
                            <span>Pickup available within Liverpool</span>
                            <span>Usually ready in 24 Hours</span>
                        </div>
                        <button className="btn" onClick={handleCheckout} disabled={loading}>
                            {loading ? "Processing..." : "Proceed to Checkout"}
                        </button>
                    </div>
                </div>
            </section>
            <Footer />
        </main>
    );
}
