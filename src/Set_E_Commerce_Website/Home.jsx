import { useContext, useEffect, useState } from "react";
import "./CSS/Home.css";
import { Data } from "./ProductData";
import { NavLink } from "react-router-dom";
import { DataContext } from "./DataContext";

function Home() {
  const [products, setProducts] = useState([]);
  const [highRate, setHighRate] = useState([]);
  const { PageData } = useContext(DataContext);
  const { theme } = PageData;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await Data();
        setProducts(data);

        const sortedProducts = data.sort((a, b) => b.rating.rate - a.rating.rate);
        setHighRate(sortedProducts);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // Split highRate into top 3 and next 3
  const top3 = highRate.slice(0, 3);
  const next3 = highRate.slice(3, 6);

  return (
    <div className={`HomeDiv ${theme === 'light' ? "HomeDivLight" : "HomeDivDark"}`}>
      <div className="HomeDivTop">
        <div className="HomeDivTopLeft"></div>
        <div className="HomeDivTopMiddle">
          <h1>Incredible Prices on All Your Favorite Items</h1>
          <p>Get more or less on selected brands</p>
          <NavLink to="/product">Shop Now</NavLink>
        </div>
        <div className="HomeDivTopRight">
          <h1>Your Cozy Era</h1>
          <p>Get peak comfy chip with new winter essentials</p>
          <NavLink to="/product">Product</NavLink>
        </div>
      </div>
      <div className="HighRatedItem">
        <h1>Highest Rated Products</h1>
        <div className="ItemDivision">
          <ul className="ItemDivisionTop">
            {top3.map((product, index) => (
              <NavLink key={index} to="/product">
                <li title={product.title}>
                  <img src={product.image} alt={product.title} />
                  <h2>{product.title.length > 20 ? product.title.slice(0, 20) + "..." : product.title}</h2>
                  <p>$&nbsp;{product.price}</p>
                </li>
              </NavLink>
            ))}
          </ul>
          <ul className="ItemDivisionBottom">
            {next3.map((product, index) => (
              <NavLink key={index} to="/product">
                <li title={product.title}>
                  <img src={product.image} alt={product.title} />
                  <h2>{product.title.length > 20 ? product.title.slice(0, 20) + "..." : product.title}</h2>
                  <p>$&nbsp;{product.price}</p>
                </li>
              </NavLink>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Home;
