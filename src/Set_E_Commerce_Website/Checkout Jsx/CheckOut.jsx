import { useState, useEffect, useContext } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import '../CSS/Checkout_Css/CheckOut.css';
import { Hourglass } from 'react-loader-spinner';
import { Data } from '../ProductData';
import { DataContext } from '../DataContext';
import nullCheckoutImg from '../Image/purchase.png';

function CheckOut() {
  const { PageData } = useContext(DataContext);
  const { theme } = PageData;
  const [AllProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation(); // Get current location to conditionally render

  const CurrentCheckoutRecord = PageData.CurrentLoggedData.CheckOut.currentCheckout.CurrentRecord.length === 0
    ? PageData.CurrentGoogleLogin.CheckOut.currentCheckout.CurrentRecord
    : PageData.CurrentLoggedData.CheckOut.currentCheckout.CurrentRecord;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await Data();
        setAllProducts(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className={`CheckOutDiv ${theme === 'light' ? 'LightCheckOutDiv' : 'DarkCheckOutDiv'}`}>
      {loading ? (
        <div className='CheckOutLoading'>
          <Hourglass
            visible={true}
            height="100"
            width="100"
            ariaLabel="hourglass-loading"
            wrapperStyle={{}}
            colors={['#306cce', '#72a1ed']}
          />
        </div>
      ) : (
        <div className='CheckOutLoaded'>
          {CurrentCheckoutRecord.length === 0 ? (
            <div className='CheckOutLoadedEmpty'>
              <img src={nullCheckoutImg} alt="Empty Checkout" />
              <h1>No items to checkout</h1>
              <p>Your checkout is currently empty. Please add some products to your cart before proceeding to checkout.</p>
              <Link to={`/product`}>Go To Products</Link>
            </div>
          ) : (
            <div className='CheckOutLoadedContain'>
              <div className='CurrentCheckout'>
                {location.pathname === '/checkout' ? (
                  <div>
                    <h2>Checkout Overview</h2>
                    <Link to="details">Go to Details</Link>
                    <Link to="address">Go to Address</Link>
                    <Link to="billing">Go to Billing</Link>
                  </div>
                ) : (
                  <Outlet />
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CheckOut;
