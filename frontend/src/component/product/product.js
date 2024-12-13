import React, { useState, useEffect } from "react";
import ProductCard from "./productcard"; // Ensure the correct case is used
import Spinner from "../spinner"; // Ensure the correct case is used
import "./product.css";

const ProductSlider = ({ addToCart, searchQuery }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/products`);
                if (!response.ok) throw new Error("Failed to fetch products");
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error("Error fetching products:", error);
                alert("Could not fetch products. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const currentProducts = filteredProducts.slice(
        currentIndex,
        currentIndex + itemsPerPage
    );

    return (
        <div>
            {loading ? (
                <Spinner />
            ) : (
                <>
                    <div className="product-container">
                        {currentProducts.length > 0 ? (
                            currentProducts.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    addToCart={addToCart}
                                />
                            ))
                        ) : (
                            <p>No products found</p>
                        )}
                    </div>
                    {filteredProducts.length > itemsPerPage && (
                        <div className="navigation-buttons">
                            <button
                                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - itemsPerPage))}
                                disabled={currentIndex === 0} // Disable if at the first page
                            >
                                Previous
                            </button>
                            <button
                                onClick={() =>
                                    setCurrentIndex((prev) =>
                                        Math.min(filteredProducts.length - itemsPerPage, prev + itemsPerPage)
                                    )
                                }
                                disabled={currentIndex + itemsPerPage >= filteredProducts.length} // Disable if at the last page
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ProductSlider;
