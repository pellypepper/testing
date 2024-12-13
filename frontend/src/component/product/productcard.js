import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "../spinner"; // Adjust the path according to your project structure
import "./product.css";

const ProductCard = ({ product, addToCart }) => {
    const [quantity, setQuantity] = useState(1);
    const [alertMessage, setAlertMessage] = useState("");
    const [fadeOut, setFadeOut] = useState(false);
    const [loading, setLoading] = useState(false);
  
    const navigate = useNavigate();

    const updateQuantity = (delta) => setQuantity((prev) => Math.max(1, prev + delta));

    const handleProductDisplay = (e) => {
        e.preventDefault();
        navigate("/display", { state: { product } });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
  
        try {
        
         
            addToCart(product, quantity);
            setAlertMessage(`${quantity} ${product.name} added to cart.`);
            await new Promise((resolve) => setTimeout(resolve, 500));
        } catch (error) {
            console.error('Failed to add to cart:', error);
            setAlertMessage('Failed to add product to cart.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (alertMessage) {
            const timer = setTimeout(() => setFadeOut(true), 5000);
            return () => clearTimeout(timer);
        }
    }, [alertMessage]);
 

   

//  const imageUrl = product.img


    return (
        <div className=" card">
            {loading && <Spinner />}
            <img
                onClick={handleProductDisplay}
                src={product.img}
                className="card-img rounded-0"
                alt={product.name}
                role="button"
                aria-label={`View details of ${product.name}`}
    
               
            />
            <div className="card-body">
                <p className="card-title">{product.name}</p>
                <p>£{product.price}</p>
                <form className="product-form" onSubmit={handleSubmit}>
                    <div className="quantity-controls">
                        <button type="button" onClick={() => updateQuantity(-1)}>-</button>
                        <span>{quantity}</span>
                        <button type="button" onClick={() => updateQuantity(1)}>+</button>
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? "Adding..." : "Add to Cart"}
                    </button>
                </form>
                {alertMessage && (
                    <div className={`alert-popup ${fadeOut ? "alert-popup-exit" : ""}`}>
                        {alertMessage}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductCard;
