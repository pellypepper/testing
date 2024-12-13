import './shippingmethod.css';

function ShippingMethod({ shippingMethod, handleChange }) {
    return (
        <select
            className="col-12 p-2 shipping-select"
            name="shippingMethod"
            value={shippingMethod}
            onChange={handleChange}
        >
            <option value="standard">Standard $10</option>
            <option value="express">Express $20</option>
            <option value="cash-on-delivery">Cash on Delivery</option>
        </select>
    );
}
export default ShippingMethod;