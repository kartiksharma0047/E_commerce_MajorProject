import { useState, useEffect, useContext } from 'react';
import './CSS/Cart.css';
import { DataContext } from './DataContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faInfo, faShield } from '@fortawesome/free-solid-svg-icons';
import { Data } from './ProductData';
import { Link } from "react-router-dom";
import EmptyCart from "./Image/empty-cart (1).png";
import { Hourglass } from 'react-loader-spinner';

function Cart() {
  const { PageData, setPageData } = useContext(DataContext);
  const { theme } = PageData;
  const [AllProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const CartData = PageData.CurrentLoggedData.CartData.length === 0 ?
    PageData.CurrentGoogleLogin.CartData :
    PageData.CurrentLoggedData.CartData;

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

  const getCartItems = () => {
    // Count the occurrences of each product ID
    const productCountMap = CartData.reduce((acc, productId) => {
      acc[productId] = (acc[productId] || 0) + 1;
      return acc;
    }, {});

    // Filter and map AllProducts to include productCount
    return AllProducts.filter(product => CartData.includes(product.id))
      .map(product => ({
        ...product,
        count: productCountMap[product.id] || 0
      }));
  };

  const updateCartItem = (productId, countChange) => {
    setPageData(prevState => {
      const currentCart = prevState.CurrentLoggedData.CartData.length === 0 ?
        prevState.CurrentGoogleLogin.CartData :
        prevState.CurrentLoggedData.CartData;

      let updatedCart = [...currentCart];
      if (countChange === 1) {
        updatedCart.push(productId);
      } else {
        const index = updatedCart.indexOf(productId);
        if (index > -1) {
          updatedCart.splice(index, 1);
        }
      }

      return {
        ...prevState,
        CurrentLoggedData: {
          ...prevState.CurrentLoggedData,
          CartData: prevState.CurrentLoggedData.CartData.length === 0 ? [] : updatedCart,
          CartCount: updatedCart.length
        },
        LoggedData: prevState.LoggedData.map(data => {
          if (data.email === prevState.CurrentLoggedData.email) {
            return {
              ...data,
              CartData: updatedCart,
              CartCount: updatedCart.length
            };
          }
          return data;
        }),
        CurrentGoogleLogin: {
          ...prevState.CurrentGoogleLogin,
          CartData: prevState.CurrentLoggedData.CartData.length === 0 ? updatedCart : [],
          CartCount: updatedCart.length
        },
        PreviousGoogleLogin: prevState.PreviousGoogleLogin.map(data => {
          if (data.email === prevState.CurrentGoogleLogin.email) {
            return {
              ...data,
              CartData: updatedCart,
              CartCount: updatedCart.length
            };
          }
          return data;
        })
      };
    });
  };

  const removeAllCartItems = (productId) => {
    setPageData(prevState => {
      const currentCart = prevState.CurrentLoggedData.CartData.length === 0 ?
        prevState.CurrentGoogleLogin.CartData :
        prevState.CurrentLoggedData.CartData;

      const updatedCart = currentCart.filter(id => id !== productId);

      return {
        ...prevState,
        CurrentLoggedData: {
          ...prevState.CurrentLoggedData,
          CartData: prevState.CurrentLoggedData.CartData.length === 0 ? [] : updatedCart,
          CartCount: updatedCart.length
        },
        LoggedData: prevState.LoggedData.map(data => {
          if (data.email === prevState.CurrentLoggedData.email) {
            return {
              ...data,
              CartData: updatedCart,
              CartCount: updatedCart.length
            };
          }
          return data;
        }),
        CurrentGoogleLogin: {
          ...prevState.CurrentGoogleLogin,
          CartData: prevState.CurrentLoggedData.CartData.length === 0 ? updatedCart : [],
          CartCount: updatedCart.length
        },
        PreviousGoogleLogin: prevState.PreviousGoogleLogin.map(data => {
          if (data.email === prevState.CurrentGoogleLogin.email) {
            return {
              ...data,
              CartData: updatedCart,
              CartCount: updatedCart.length
            };
          }
          return data;
        })
      };
    });
  };

  const cartItems = getCartItems();

  const TotalPrice = () => {
    let sum = 0;
    cartItems.forEach(item => {
      sum += item.price * item.count;
    });
    return sum > 0 ? sum : 0;
  };

  const calculateDiscount = (total) => {
    if (total <= 250) {
      return total * 0.05;
    } else if (total > 250 && total <= 400) {
      return total * 0.08;
    } else if (total > 440 && total <= 700) {
      return total * 0.19;
    } else if (total > 700 && total <= 1000) {
      return total * 0.25;
    } else {
      return total * 0.3;
    }
  };

  const totalPrice = TotalPrice();
  const discount = calculateDiscount(totalPrice);

  const calculateDeliveryDate = (ID) => {
    const currentDate = new Date();
    const deliveryDate = new Date(currentDate);
    deliveryDate.setDate(currentDate.getDate() + (ID % 2 === 0 ? 4 : 5));
    const options = { day: 'numeric', month: 'short', weekday: 'short' };
    return deliveryDate.toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className={`CartLoading ${theme==='light' ? 'LightCartLoading' : 'DarkCartloading'}`}>
        <Hourglass
          visible={true}
          height="100"
          width="100"
          ariaLabel="hourglass-loading"
          wrapperStyle={{}}
          colors={['#306cce', '#72a1ed']}
        />
      </div>
    );
  }
  const AddToCheckOut = () => {
    setPageData(prevState => {
      const currentCart = prevState.CurrentLoggedData.CartData.length === 0
        ? prevState.CurrentGoogleLogin.CartData
        : prevState.CurrentLoggedData.CartData;
  
      const currentDate = new Date().toISOString().split('T')[0];

      const checkoutData = {
        CurrentDate: currentDate,
        CurrentRecord: currentCart,
      };

      return {
        ...prevState,
        CurrentLoggedData: {
          ...prevState.CurrentLoggedData,
          CartData: [],
          CartCount: 0,
          CheckOut: {
            ...prevState.CurrentLoggedData.CheckOut,
            currentCheckout: checkoutData,
          },
        },
        LoggedData: prevState.LoggedData.map(data => {
          if (data.email === prevState.CurrentLoggedData.email) {
            return {
              ...data,
              CartData: [],
              CartCount: 0,
              CheckOut: {
                ...data.CheckOut,
                currentCheckout: checkoutData,
              },
            };
          }
          return data;
        }),
        CurrentGoogleLogin: {
          ...prevState.CurrentGoogleLogin,
          CartData: [],
          CartCount: 0,
          CheckOut: {
            ...prevState.CurrentGoogleLogin.CheckOut,
            currentCheckout: checkoutData,
          },
        },
        PreviousGoogleLogin: prevState.PreviousGoogleLogin.map(data => {
          if (data.email === prevState.CurrentGoogleLogin.email) {
            return {
              ...data,
              CartData: [],
              CartCount: 0,
              CheckOut: {
                ...data.CheckOut,
                currentCheckout: checkoutData,
              },
            };
          }
          return data;
        }),
      };
    });
  
    localStorage.setItem('CurrentLoggedData', JSON.stringify({
      ...PageData.CurrentLoggedData,
      CartData: [],
      CartCount: 0,
    }));
    localStorage.setItem('CurrentGoogleLogin', JSON.stringify({
      ...PageData.CurrentGoogleLogin,
      CartData: [],
      CartCount: 0,
    }));
  };  

  return (
    <div className={`CartContainer ${theme === 'light' ? 'LightCartLayout' : 'DarkCartLayout'}`}>
      <div className='CartLayout'>
        {cartItems.length === 0 ? (
          <div className='EmptyCart'>
            <img src={EmptyCart} alt="Empty Cart" />
            <h1>Your cart is empty</h1>
            <p>Looks like you have not added anything to your cart. Go ahead & explore top categories</p>
            <Link to={`/product`}>Go To Products</Link>
          </div>
        ) : (
          <div className='CartItemLayout'>
            <ul className='CartItemDetail'>
              {cartItems.map((item, index) => (
                <li key={index}>
                  <div className='CartItemDetailLeft'>
                    <div className='CartItemDetailLeftChild'>
                      <img src={item.image} alt={item.title} />
                    </div>
                    <div className='CartItemDetailRightChild'>
                      <h1>{item.title}</h1>
                      <h2>$&nbsp;{item.price}</h2>
                    </div>
                  </div>
                  <div className='CartItemDetailMid'>
                    <button
                      onClick={() => item.count > 1 && updateCartItem(item.id, -1)}
                      disabled={item.count === 1}
                    >
                      -
                    </button>
                    <input type="text" value={item.count} disabled />
                    <button
                      onClick={() => item.count < 99 && updateCartItem(item.id, 1)}
                      disabled={item.count === 99}
                    >
                      +
                    </button>
                  </div>
                  <div className='CartItemDetailRight'>
                    <h2 className='date'>Delivery by {calculateDeliveryDate(item.id)}</h2>
                    <button className="button-82-pushable" role="button" onClick={() => removeAllCartItems(item.id)}>
                      <span className="button-82-shadow"></span>
                      <span className="button-82-edge"></span>
                      <span className="button-82-front text">
                        Remove Item
                      </span>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className='PriceDetails'>
              <div className='ItemPrice'>
                <h1>PRICE DETAILS</h1>
                <div className='Price'>
                  <h1>Price ({CartData.length} item)</h1>
                  <h2>${totalPrice.toFixed(2)}</h2>
                </div>
                <div className='DiscountPrice'>
                  <h1>Discount</h1>
                  <h2>-&nbsp;${discount.toFixed(2)}</h2>
                </div>
                <div className='DeliveryPrice'>
                  <h1>Delivery Charges&nbsp;<FontAwesomeIcon title='Get Free Delivery On Order Above $250' icon={faInfo} /></h1>
                  {(TotalPrice().toFixed(2) <= 250) ? (
                    <h2>$5</h2>
                  ) : (
                    <h2>
                      <span className='underLine'>$5</span>&nbsp;
                      <span className='GreenColor'>Free</span>
                    </h2>
                  )}
                </div>
                <div className='TotalPrice'>
                  <h1>Total Amount</h1>
                  <h2>$ {(TotalPrice().toFixed(2) <= 250) ? Number(TotalPrice() - discount).toFixed(2) : Number(TotalPrice() - discount - 5).toFixed(2)}</h2>
                </div>
                <div className='PriceHighlights'>
                  <h1>You will save ${(discount.toFixed(2) <= 250) ? (Number(discount.toFixed(2)) + 5) : (discount.toFixed(2))} on this order</h1>
                </div>
              </div>
              <div className='PlaceOrder'>
                <Link onClick={AddToCheckOut} to='/checkout/details'>Place Order</Link>
                <div className='ExtraDetails'>
                  <div className='ShieldCheck'>
                    <FontAwesomeIcon icon={faShield} />
                    <FontAwesomeIcon icon={faCheck} />
                  </div>
                  <p>Safe and Secure Payments, Easy returns, 100% Authentic products.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;