import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import "./country.css";
import { countryStateData } from "./countryStateData"; // Ensure this is your correct import path

export default function Country({ onCountrySelect, onStateSelect }) {
    const [search, setSearch] = useState("");
    const [filteredCountries, setFilteredCountries] = useState(Object.keys(countryStateData));
    const [states, setStates] = useState([]);
    const [selectedState, setSelectedState] = useState("");
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [stateDropdownVisible, setStateDropdownVisible] = useState(false);

    // Handle search in country dropdown
    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearch(value);
        setFilteredCountries(
            Object.keys(countryStateData).filter((country) =>
                country.toLowerCase().includes(value)
            )
        );
    };

    // Toggle dropdown visibility
    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };

    // Handle country selection
    const handleCountrySelect = (country) => {
        setSearch(country);
        setStates(countryStateData[country] || []);
        setSelectedState("");
        setDropdownVisible(false);
        setStateDropdownVisible(false); // Reset state dropdown visibility

        // Call the provided function to update the parent component's state
        onCountrySelect(country);
    };

    // Handle state selection
    const handleStateSelect = (state) => {
        setSelectedState(state);
        setStateDropdownVisible(false);

        // Call the provided function to update the parent component's state
        onStateSelect(state);
    };

    // Toggle state dropdown visibility
    const toggleStateDropdown = () => {
        setStateDropdownVisible(!stateDropdownVisible);
    };

    return (
        <div className="dropdown-wrapper">
            {/* Country Dropdown */}
            <div className="input-container">
                <input
                    type="text"
                    value={search}
                    onChange={handleSearch}
                    onFocus={() => setDropdownVisible(true)}
                    onBlur={() => setTimeout(() => setDropdownVisible(false), 100)}
                    placeholder="Search for a country..."
                    className="dropdown-input p-2"
                />
                <button
                    onClick={toggleDropdown}
                    type="button"
                    className="dropdown-toggle"
                >
                    {dropdownVisible ? <FaChevronUp /> : <FaChevronDown />}
                </button>
            </div>
            {dropdownVisible && filteredCountries.length > 0 && (
                <ul className="dropdown-list">
                    {filteredCountries.map((country, index) => (
                        <li
                            key={index}
                            onClick={() => handleCountrySelect(country)}
                            className="dropdown-item"
                        >
                            {country}
                        </li>
                    ))}
                </ul>
            )}

            {/* State Dropdown */}
            <div className="input-container mt-2">
                <input
                    type="text"
                    value={selectedState}
                    onClick={toggleStateDropdown}
                    placeholder="Select a state/region..."
                    readOnly
                    className="dropdown-input p-2"
                />
                <button
                    onClick={toggleStateDropdown}
                    type="button"
                    className="dropdown-toggle"
                >
                    {stateDropdownVisible ? <FaChevronUp /> : <FaChevronDown />}
                </button>
            </div>

            {stateDropdownVisible && states.length > 0 && (
                <ul className="dropdown-list">
                    {states.map((state, index) => (
                        <li
                            key={index}
                            onClick={() => handleStateSelect(state)}
                            className="dropdown-item"
                        >
                            {state}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
