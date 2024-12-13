import React from 'react';
import { FaCcVisa, FaCcMastercard, FaCcAmex, FaCcDiscover,FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa';
import './footer.css';



export default function Footer() {
    return (
        <footer>
            <div className="footer-wrapper">
                <div className="row p-3">
                    <div className='col-12 col-md-6'>
                        <h3>CONTACT US</h3>
                        <div className='d-flex flex-row row-1 mt-4'>
                        <FaPhoneAlt size={20} color="green" />
                            <p>07398653511</p>
                        </div>
                        <div className='d-flex flex-row row-1'>
                        <FaMapMarkerAlt size={20} color="red" />
                            <p>35 Golders Green Liverpool L7 6HG</p>
                        </div>
                        <div className='d-flex icon-wrapper mt-2'>
                        <FaCcVisa size={50} color="#1a1f71" title="Visa" />
                        <FaCcMastercard size={50} color="#ff5f00" title="MasterCard" />
                        <FaCcAmex size={50} color="#2e77bc" title="American Express" />
                        <FaCcDiscover size={50} color="#ff6000" title="Discover" />
                        </div>

                    </div>

                    <div className='col-12 col-md-6 mt-5 mt-md-0 footer-2'>
                       <h3>SIGNUP FOR DISCOUNT AND UPDATE</h3>
                       <textarea placeholder="Enter your email"></textarea>
                       <button>Submit</button>
                    </div>
                </div>
            </div>

              <div className="footer-bottom">
              <p>© 2021 FoodStuff. All Rights Reserved</p>
                </div>
        </footer>
    )
}