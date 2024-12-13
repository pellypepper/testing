import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../component/navbar/navbar";
import Footer from "../../component/footer/footer";
import Country from "../../component/search/country";
import ShippingMethod from "../../component/shippingmethod/shippingmethod";
import Spinner from "../../component/spinner"; // Adjust the import path accordingly
import "./checkout.css";

export default function Checkout({ removeFromCart }) {
    const navigate = useNavigate();
    const loadCart = () => JSON.parse(sessionStorage.getItem("cart")) || [];
    const [cart, setCart] = useState(loadCart());
    const [form, setForm] = useState({
        firstname: "",
        lastname: "",
        email: "",
        number: "",
        address: "",
        shippingMethod: "standard",
        country: "", 
        state: ""  ,
        postcode: "", 
    });
    const [alertMessage, setAlertMessage] = useState("");
    const [loading, setLoading] = useState(false); // Spinner state

    const shippingFees = {
        standard: 10,
        express: 20,
        "cash-on-delivery": 0,
    };

    const updateCart = (newCart) => {
        setCart(newCart);
        sessionStorage.setItem("cart", JSON.stringify(newCart));
    };

    // Calculate the total price
    const calculateTotal = () => {
        const subtotal = cart.reduce(
            (total, product) => total + product.price * product.quantity,
            0
        );
        const shippingCost = shippingFees[form.shippingMethod] || 0;
        return subtotal + shippingCost;
    };

    // Handle form input changes
    const handleInputChange = ({ target: { name, value } }) => {
        setForm((prevForm) => ({ ...prevForm, [name]: value }));
    };

    // Handle country selection
    const handleCountrySelect = (country) => {
        setForm((prevForm) => ({ ...prevForm, country }));
    };

    // Handle state selection
    const handleStateSelect = (state) => {
        setForm((prevForm) => ({ ...prevForm, state }));
    };

    // Remove product from cart
    const handleRemoveFromCart = (product) => {
        removeFromCart(product);
        updateCart(cart.filter((item) => item.productId !== product.productId));
        setAlertMessage(`${product.productName} has been removed from your cart.`);
    };

    // Manage alert lifecycle
    useEffect(() => {
        if (alertMessage) {
            const timer = setTimeout(() => setAlertMessage(""), 5000);
            return () => clearTimeout(timer);
        }
    }, [alertMessage]);

    // Handle form submission
    const handleOrderSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Show spinner
        const total = calculateTotal();
        
        // Simulate a network request (e.g., sending order data)
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate delay
        console.log(form)
        navigate("/payment", { state: { total, cart, form } });
        setLoading(false); // Hide spinner
    };

    return (
        <main className="checkout-section">
            <Navbar />
            <section className="checkout-main">
                <div className="checkout-container">
                    {loading && <Spinner />} {/* Use the imported Spinner component */}
                    {/* Cart Section */}
                    <div className="cart-section">
                        <h2>Your Cart</h2>
                        <div className="cart-list">
                            {cart.length === 0 ? (
                                <p>Your cart is empty.</p>
                            ) : (
                                cart.map((product, index) => (
                                    <div key={index} className="cart-item">
                                        <div className="cart-item-details">
                                            <p>{product.productName}</p>
                                            <p>
                                                £{product.price} x {product.quantity} 
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveFromCart(product)}
                                            aria-label={`Remove ${product.productName} from cart`}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                        {alertMessage && <div className="alert-popup">{alertMessage}</div>}
                        <div className="shipping-wrapper">
                            <h3>Shipping Method</h3>
                            <ShippingMethod
                                shippingMethod={form.shippingMethod}
                                handleChange={handleInputChange}
                            />
                        </div>
                        <div className="cart-total">
                            <h4>Items: {cart.length}</h4>
                            <h4>Total: £{calculateTotal().toFixed(2)}</h4>
                        </div>
                    </div>

                    {/* Checkout Form Section */}
                    <div className="checkout-form-section">
                        <h2>Checkout Details</h2>
                        <form onSubmit={handleOrderSubmit}>
                            <div className="input-wrapper">
                                <input
                                    type="text"
                                    name="firstname"
                                    value={form.firstname}
                                    onChange={handleInputChange}
                                    placeholder="First Name"
                                    className="col-6 p-2"
                                    required
                                />
                                <input
                                    type="text"
                                    name="lastname"
                                    value={form.lastname}
                                    onChange={handleInputChange}
                                    placeholder="Last Name"
                                    className="col-5 p-2"
                                    required
                                />
                            </div>
                            <div className="input-wrapper">
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleInputChange}
                                    placeholder="Email"
                                    className="col-6 p-2"
                                    required
                                />
                                <input
                                    type="tel"
                                    name="number"
                                    value={form.number}
                                    onChange={handleInputChange}
                                    placeholder="Phone Number"
                                    className="col-5 p-2"
                                    required
                                />
                            </div>
                            <textarea
                                name="address"
                                value={form.address}
                                onChange={handleInputChange}
                                placeholder="Shipping Address"
                                className="col-12 p-2"
                                required
                            />
                            <Country
                                onCountrySelect={handleCountrySelect} // Pass the handler for country selection
                                onStateSelect={handleStateSelect} // Pass the handler for state selection
                            />
                            <input
                                  name="postcode"
                                type="text"
                                value={form.postcode}
                                onChange={handleInputChange}
                                placeholder="Zip/Post code"
                                className="col-12 p-2"
                                required
                            />
                            <button type="submit" disabled={loading}>
                                {loading ? "Processing..." : "Proceed to Payment"}
                            </button>
                        </form>
                    </div>
                </div>
            </section>
            <Footer />
        </main>
    );
}
