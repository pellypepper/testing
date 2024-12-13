import React, { useState, useEffect } from "react";
import "./home.css";
import Navbar from "../../component/navbar/navbar";
import Footer from "../../component/footer/footer";
import ProductSlider from "../../component/product/product";
import { FaWhatsapp } from "react-icons/fa";
import Spinner from "../../component/spinner";

export default function Home({ removeFromCart }) {
    const [cart, setCart] = useState(() => {
        const savedCart = sessionStorage.getItem("cart");
        return savedCart ? JSON.parse(savedCart) : [];
    });
    const [searchQuery, setSearchQuery] = useState("");
    const [alertMessage, setAlertMessage] = useState("");
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [products, setProducts] = useState([]);
    const [fadeOut, setFadeOut] = useState(false);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [loadingCart, setLoadingCart] = useState(true);
    const [isBtnClick, setBtnClick] = useState(false);


    const getUserId = () => {
        let userId = sessionStorage.getItem("user_id");
        if (!userId) {
            userId = "user_" + Math.random().toString(36).substring(2, 15);
            sessionStorage.setItem("user_id", userId);
        }
        return userId;
    };

    const updateSessionStorageCart = (cart) => {
        sessionStorage.setItem("cart", JSON.stringify(cart));
    };

    const addToCart = async (product, quantity) => {
        const userId = getUserId();
        const parsedQuantity = parseInt(quantity);
        setBtnClick((prev)=> !prev);

        const existingProductIndex = cart.findIndex(item => item.id === product.id);
        let updatedCart;

        if (existingProductIndex > -1) {
            updatedCart = cart.map((item, index) =>
                index === existingProductIndex
                    ? { ...item, quantity: item.quantity + parsedQuantity }
                    : item
            );
        } else {
            updatedCart = [...cart, { ...product, quantity: parsedQuantity }];
        }

        setCart(updatedCart);
        updateSessionStorageCart(updatedCart);

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/cart`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: userId,
                    product: {
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        img: product.img,
                    },
                    quantity: parsedQuantity,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to add item to cart");
            }

            const updatedCartFromServer = await response.json();
            if (JSON.stringify(updatedCart) !== JSON.stringify(updatedCartFromServer)) {
                setCart(updatedCartFromServer);
                updateSessionStorageCart(updatedCartFromServer);
            }

            setAlertMessage(`${product.name} has been added to the cart.`);
        } catch (error) {
            console.error("Error updating cart on server:", error);
            // Optionally revert or handle error
        }
    };


    useEffect(() => {
        const fetchProducts = async () => {
            setLoadingProducts(true);
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/products`);
                if (!response.ok) throw new Error("Failed to fetch products");
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error("Error fetching products:", error);
                alert("Could not fetch products. Please try again later.");
            } finally {
                setLoadingProducts(false);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        const fetchCart = async () => {
            const userId = getUserId();
            setLoadingCart(true);
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/${userId}`);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const cartData = await response.json();
                setCart(cartData);
                updateSessionStorageCart(cartData);
            } catch (error) {
                console.error("Error fetching cart:", error);
                setCart([]);
            } finally {
                setLoadingCart(false);
            }
        };

        fetchCart();
    }, []);

    useEffect(() => {
        if (alertMessage) {
            const timer = setTimeout(() => {
                setFadeOut(true);
            }, 5000);

            return () => clearTimeout(timer);
        } else {
            setFadeOut(false);
        }
    }, [alertMessage]);

    useEffect(() => {
        if (searchQuery) {
            const filtered = products.filter(product =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredProducts(filtered);
        } else {
            setFilteredProducts(products); // Show all products when search query is empty
        }
    }, [searchQuery, products]);

    if (loadingCart) {
        return <Spinner />;
    }

    return (
        <main className="Home">
            <Navbar removeFromCart={removeFromCart} cart={cart} setCart={setCart} setSearchQuery={setSearchQuery} />
            <section className="home-text-wrapper">
                <div className="row p-5 text-center">
                    <div className="home-text">
                        <h1>Welcome to MedMore Store</h1>
                        <span>Where you can find the best food products</span>
                    </div>
                    <div className="home-btn d-flex flex-column flex-md-row justify-content-center mt-4">
                        <button className="col-12 col-md-4 my-1 mx-1">New Product</button>
                        <button className="col-12 col-md-4 my-1 mx-1">All Products</button>
                        <button className="col-12 col-md-4 my-1 mx-1">Our Favorites</button>
                    </div>
                </div>
            </section>

            <section>
                {loadingProducts ? (
                   <Spinner />
                ) : (
                    <ProductSlider
                    products={filteredProducts}
                        addToCart={addToCart}
                        searchQuery={searchQuery}
                    />
                )}
            </section>

            {alertMessage && (
                <div className={`alert-popup ${fadeOut ? 'alert-popup-exit' : ''}`}>
                    {alertMessage}
                </div>
            )}

            <section className="footer mt-5">
                <Footer />
            </section>

            <div className="whatsapp-logo">
                <a
                    href="https://wa.me/07398653511"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="whatsapp-button"
                >
                    <FaWhatsapp size={40} color="#25D366" />
                </a>
            </div>
        </main>
    );
}
