// CartItem.js
import React from "react";
import "./cart.css";

export default function CartItem({ product, index, onIncrease, onDecrease, onRemove }) {
    console.log("CartItem.js: product:", product.name);
    return (
        <div key={index} className="cart-item">
            <div className="cart-item-details">
                <p>{product.productName}</p>
                <p>£{(product.price * product.quantity).toFixed(2)}</p>
            </div>
            <div className="cart-item-controls">
                <div className="quantity-controls">
                    <button className="btn-1" onClick={() => onDecrease(index)}>-</button>
                    <span>{product.quantity}</span>
                    <button className="btn-1" onClick={() => onIncrease(index)}>+</button>
                </div>
                <button className="btn-2" onClick={() => onRemove(product)}>Remove</button>
            </div>
        </div>
    );
}
