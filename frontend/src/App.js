
import './App.css';
import React, { useState} from "react";
import Home from  './pages/home/home';
import 'bootstrap/dist/css/bootstrap.min.css';
import { loadStripe } from '@stripe/stripe-js';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Payment from "./pages/payment/payment";
import Detail from './pages/details/detail';
import Card from './pages/card/card';
import ProductDisplay from './pages/productdisplay/display';
import { Elements } from '@stripe/react-stripe-js'; 
import Checkout from "./pages/checkout/checkout";
import AdminDashboard from './pages/adminDashboard/admin';
import OrderConfirmation from './pages/order/order';

const stripePromise = loadStripe('pk_test_51QRXGxBlRPuLLUxXKbMlflbrE4ghJsLt9PkDkh47BNvc9sKbSsF7Fi48bZVeC29Za5LKKIaHe9g935Jeh2Mj1vc600gVvRCsQw'); // Use your actual publishable key


function App() {
      const [cart, setCart] = useState(() => {
        const savedCart = sessionStorage.getItem("cart");
        return savedCart ? JSON.parse(savedCart) : [];
    });

    const updateSessionStorageCart = (cart) => {
        sessionStorage.setItem("cart", JSON.stringify(cart));
    };

    const removeFromCart = async (product) => {
        console.log("Removing item from cart:", product);
    
        // Optimistically update the cart state in the UI
   
        const updatedCart = cart.filter(item => item.id !== product.productId);
        setCart(updatedCart);
        updateSessionStorageCart(updatedCart);
         console.log(product.productId);
        // Remove the cart from session storage if empty
        if (updatedCart.length === 0) {
            sessionStorage.removeItem("cart");
        }
    
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/cart`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: sessionStorage.getItem("user_id"), productId: product.productId }),
            });
    
            // Check if the response was successful
            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(errorMessage || "Failed to remove item from cart");
            }
    
            // Update the cart with the server response
            const serverCart = await response.json();
    
            // Ensure you use the server response to reflect the correct cart state
            setCart(serverCart);  
            updateSessionStorageCart(serverCart);
            console.log("Updated cart state:", updatedCart);



        } catch (error) {
            console.error("Error removing item from server:", error);
            // Revert the optimistic update if the server fails
            setCart(cart); // Restore the cart to its previous state
           
        }
    };
    
    return (
        <Elements stripe={stripePromise}>
        <Router>
            <Routes>
                <Route path="/" element={<Home removeFromCart={removeFromCart}/>} />
                <Route path="/checkout" element={<Checkout removeFromCart={removeFromCart} />} />
                <Route path="/admin" element={<AdminDashboard />} /> 
                <Route path="/payment" element={<Payment/>} />
                <Route path="/card" element={< Card  />} />
                <Route path="/detail" element={<Detail/>} />
                <Route path="/display" element={<ProductDisplay/>} />
                <Route path="/order" element={<OrderConfirmation />} />
            </Routes>
        </Router>
        </Elements>
    );
}

export default App;