import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './order.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

export default function OrderConfirmation(){
    const location = useLocation();
    const navigate = useNavigate();
    const orderDetails = location.state?.order || {};

     // Check if order details are available
     if (!orderDetails.id) {
        return (
            <div className="error-message">
                <h1>Order Not Found</h1>
                <p>There was an issue with your order. Please try again.</p>
                <button onClick={() => navigate('/')}>Return to Home</button>
            </div>
        );
    }

    const handleContinueShopping = () => {
        console.log(orderDetails.items)
        navigate('/'); // Redirect to homepage
    };

    return (
       <main className='order-wrapper'>
            <div className="order-confirmation">
        <h1>Thank You for Your Order!</h1>
        <p>Your order has been successfully processed.</p>
        <div className="order-summary">
            <h2>Order Summary</h2>
            <p><strong>Order ID:</strong> {orderDetails.id}</p>
            <p>A confirmation message has been sent to {orderDetails.email}</p>
            <FontAwesomeIcon icon={faCheckCircle} color="green" size="3x" />
          
        </div>
        <button className="btn" onClick={handleContinueShopping}>Continue Shopping</button>
    </div>
       </main>
    );
};


