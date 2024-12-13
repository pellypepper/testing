import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import CartItem from "./cartitem";
import "./cart.css";

export default function Cart({ removeFromCart, cartRef }) {
    const loadCart = () => JSON.parse(sessionStorage.getItem("cart")) || [];
    const [cart, setCart] = useState(loadCart());
    const [alertMessage, setAlertMessage] = useState("");
    const [fadeOut, setFadeOut] = useState(false);
    const navigate = useNavigate();

    const updateCart = (newCart) => {
        setCart(newCart);
        sessionStorage.setItem("cart", JSON.stringify(newCart));
    };

    const handleCartClose = () => {
        if (cartRef?.current) {
            cartRef.current.classList.remove("active");
        }
    };

    const handleCheckout = () => {
        // Directly navigate to checkout without a loading state
        navigate("/checkout", { state: { cart } });
    };

    const handleRemoveFromCart = (product) => {
        removeFromCart(product);
        updateCart(cart.filter((item) => item.productId !== product.productId));
        setAlertMessage(`${product.productName} has been removed from your cart.`);
    };

    useEffect(() => {
        if (alertMessage) {
            const timer = setTimeout(() => setFadeOut(true), 5000);
            return () => clearTimeout(timer);
        }
    }, [alertMessage]);

    return (
        <main className="cart-main">
            <div className="cart-section">
                <div className="cart-section-text">
                    <FaTimes className="times" onClick={handleCartClose} />
                    <h2>Shopping Cart</h2>
                </div>
                <div className="cart-list">
                    {cart.length === 0 ? (
                        <p>Your cart is empty</p>
                    ) : (
                        cart.map((product, index) => (
                            <CartItem
                                key={index}
                                product={product}
                                index={index}
                                onIncrease={() =>
                                    updateCart(cart.map((item, i) =>
                                        i === index
                                            ? { ...item, quantity: item.quantity + 1 }
                                            : item
                                    ))
                                }
                                onDecrease={() =>
                                    updateCart(cart.map((item, i) =>
                                        i === index && item.quantity > 1
                                            ? { ...item, quantity: item.quantity - 1 }
                                            : item
                                    ))
                                }
                                onRemove={handleRemoveFromCart}
                            />
                        ))
                    )}
                </div>
                <div className="cart-total">
                    <h4>
                        Total: £
                        {cart.reduce((total, product) => total + product.price * product.quantity, 0).toFixed(2)}
                    </h4>
                    <button onClick={handleCheckout}>Proceed to Checkout</button>
                </div>
                {alertMessage && (
                    <div className={`alert-popup ${fadeOut ? "alert-popup-exit" : ""}`}>
                        {alertMessage}
                    </div>
                )}
            </div>
        </main>
    );
}
