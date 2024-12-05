import { useEffect, useState, useContext, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Data } from "./ProductData";
import { Hourglass } from 'react-loader-spinner';
import "./CSS/ProductDetails.css";
import { DataContext } from './DataContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons';
import PopupNotification from './PopUpNotification';

function ProductDetails() {
  const [product, setProduct] = useState(null);
  const { id } = useParams();
  const { PageData, showPopup, addToCart } = useContext(DataContext);
  const { theme, LoggedIn, popupMessage } = PageData;
  const [price, setPrice] = useState([]);
  const canvasRef = useRef(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await Data();
        const productDetail = data.find(item => item.id === parseInt(id));
        setProduct(productDetail);

        if (productDetail && productDetail.price) {
          const priceStr = productDetail.price.toFixed(2); // Ensure price has 2 decimal places
          setPrice(priceStr.split('.'));
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchProduct();
  }, [id]);

  // Canvas coding
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const c = canvas.getContext('2d');
      const colors = ['red', 'orange', 'yellow', 'lightgreen', 'green'];
      const rating = product ? product.rating.rate : 0;

      const SizeCanvas = () => {
        canvas.width = 200;
        canvas.height = 100;
      };

      const arcObj = () => {
        let color;
        if (rating > 0 && rating <= 1) {
          color = colors[0];
        } else if (rating > 1 && rating <= 2) {
          color = colors[1];
        } else if (rating > 2 && rating <= 3) {
          color = colors[2];
        } else if (rating > 3 && rating <= 4) {
          color = colors[3];
        } else {
          color = colors[4];
        }

        let angle = Math.PI + (0.62828 * rating);
        return { color, angle };
      };

      const draw = () => {
        const arc = arcObj();
        c.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the main arc
        c.beginPath();
        c.lineWidth = 10;
        c.arc(canvas.width / 2, canvas.height, 95, 0, arc.angle, false);
        c.strokeStyle = arc.color;
        c.stroke();
        c.closePath();

        // Draw the child arc
        c.beginPath();
        c.arc(canvas.width / 2, canvas.height, 93, 0, Math.PI, true);
        c.fillStyle = `${theme === 'light' ? 'rgb(195, 195, 195)' : 'rgb(25, 25, 25)'}`;
        c.fill();
        c.closePath();
      };

      const animate = () => {
        requestAnimationFrame(animate);
        draw();
      };

      window.addEventListener("resize", SizeCanvas);
      SizeCanvas();
      animate();

      return () => {
        window.removeEventListener("resize", SizeCanvas);
      };
    }
  }, [product, theme]);

  const handleAddToCart = () => {
    if (!LoggedIn) {
      showPopup('Please login first', false);
    } else {
      addToCart(product.id);
      showPopup('Product is added to cart', true);
    }
  };

  if (!product) {
    return (
      <div className={`ProductDetailsLoading ${theme === 'light' ? "LightProductDetail" : "DarkProductDetail"}`}>
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

  return (
    <div className={`ProductDetailsPage ${theme === 'light' ? "LightProductDetail" : "DarkProductDetail"}`}>
      <Link to='/product' className='ArrowBackProduct'>
        <FontAwesomeIcon icon={faArrowAltCircleLeft} />
      </Link>
      <h1>{product.title}</h1>
      <div className='ProductDetailsPagePosition'>
        <div className='ProductDetailsPageLeft'>
          <img src={product.image} alt={product.title} />
        </div>
        <div className='ProductDetailsPageRight'>
          <h2>Description : </h2>
          <p>{product.description}</p>
          <div className='Category_Price_Rating_Div'>
            <div className='Category_Price_Div'>
              <p className='CategorySpan'><span>Category : </span>{product.category.charAt(0).toUpperCase() + product.category.slice(1)}</p>
              <p className='PriceSpan'>$ {price[0]}.<span>{price[1]}</span></p>
            </div>
            <div className='RatingCanvaDiv'>
              <canvas ref={canvasRef} />
              <h1>{product.rating.rate}</h1>
              <h2>Rating</h2>
              <p>({product.rating.count} reviews)</p>
            </div>
          </div>
          <div className='ProductDetailsButton'>
            <button onClick={handleAddToCart}>Add To Cart</button>
          </div>
        </div>
      </div>
      <PopupNotification message={popupMessage} />
    </div>
  );
}

export default ProductDetails;