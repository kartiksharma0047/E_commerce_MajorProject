import { DataContext } from "./DataContext";
import { Data } from "./ProductData";
import { Link } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import PopupNotification from './PopUpNotification';
import './CSS/Product.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

function Product() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { PageData, showPopup, addToCart } = useContext(DataContext);
  const { theme, LoggedIn, popupMessage } = PageData;
  const [searchProduct, setSearchProduct] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedSort, setSelectedSort] = useState('None');
  const [priceRange, setPriceRange] = useState(1000);
  const [animatedProductId, setAnimatedProductId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await Data();
        setProducts(data);
        setFilteredProducts(data);
        const uniqueCategories = [...new Set(data.map(product => capitalizeFirstLetter(product.category)))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const handleSearchChange = (event) => {
    const searchValue = event.target.value;
    setSearchProduct(searchValue);

    if (searchValue.length > 0) {
      const filteredSuggestions = products.filter(product =>
        product.title.toLowerCase().startsWith(searchValue.toLowerCase()) &&
        (selectedCategory === 'all' || product.category.toLowerCase() === selectedCategory.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleCategoryChange = (event) => {
    const category = event.target.value;
    setSelectedCategory(category);
  };

  const handleSortChange = (event) => {
    const sortOption = event.target.value;
    setSelectedSort(sortOption);
  };

  const handlePriceChange = (event) => {
    const price = event.target.value;
    setPriceRange(price);
  };

  const handleInputChange = (event) => {
    const price = event.target.value;
    if (price === '' || (price >= 0 && price <= 1000)) {
      setPriceRange(price);
    }
  };

  const handleSearchSubmit = () => {
    let filtered = products.filter(product =>
      product.title.toLowerCase().includes(searchProduct.toLowerCase()) &&
      (selectedCategory === 'all' || product.category.toLowerCase() === selectedCategory.toLowerCase()) &&
      product.price <= priceRange
    );

    if (selectedSort === 'a-z') {
      filtered = filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (selectedSort === 'z-a') {
      filtered = filtered.sort((a, b) => b.title.localeCompare(a.title));
    } else if (selectedSort === 'Rating (5-1)') {
      filtered = filtered.sort((a, b) => b.rating.rate - a.rating.rate);
    } else if (selectedSort === 'Rating (1-5)') {
      filtered = filtered.sort((a, b) => a.rating.rate - b.rating.rate);
    }

    setFilteredProducts(filtered);
    setSuggestions([]);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchProduct(suggestion.title);
    setSuggestions([]);
  };

  const handleBuyNowClick = (productId) => {
    if (LoggedIn) {
      addToCart(productId);
      handleDotAnimation(productId);
    } else {
      showPopup('Login First', false);
    }
  };

  const handleDotAnimation = (productId) => {
    setAnimatedProductId(productId);
    setTimeout(() => {
      setAnimatedProductId(null);
    }, 1000);
  };

  useEffect(() => {
    const suggestionList = document.querySelectorAll('.Suggestions li');
    if (suggestionList.length > 0) {
      suggestionList[0].classList.add('active');
    }

    suggestionList.forEach((li) => {
      li.addEventListener('mouseover', () => {
        suggestionList.forEach(item => item.classList.remove('active'));
        li.classList.add('active');
      });

      li.addEventListener('mouseout', () => {
        li.classList.remove('active');
        if (suggestionList.length > 0) {
          suggestionList[0].classList.add('active');
        }
      });
    });

    return () => {
      suggestionList.forEach((li) => {
        li.removeEventListener('mouseover', () => { });
        li.removeEventListener('mouseout', () => { });
      });
    };
  }, [suggestions]);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredProducts.length / productsPerPage); i++) {
    pageNumbers.push(i);
  }

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className={`ProductDiv ${theme === 'light' ? 'LightProductDiv' : 'DarkProductDiv'}`}>
      <div className="ProductFiltering">
        <div className="UpperFilterSection">
          <div className="SearchProduct">
            <label>Search Product</label>
            <input
              type="text"
              value={searchProduct}
              onChange={handleSearchChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearchSubmit();
              }}
            />
            {suggestions.length > 0 && (
              <ul className="Suggestions">
                {suggestions.map((suggestion, index) => (
                  <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                    {(suggestion.title.length) > 20 ? suggestion.title.slice(0, 20) + "..." : suggestion.title}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="SearchCategories">
            <label>Select Category</label>
            <select onChange={handleCategoryChange} value={selectedCategory}>
              <option value="all">All</option>
              {categories.map((itemEle, index) => (
                <option key={index} value={itemEle}>{itemEle}</option>
              ))}
            </select>
          </div>
          <div className="SortProducts">
            <label>Sort By</label>
            <select onChange={handleSortChange} value={selectedSort}>
              <option value="None">None</option>
              <option value="a-z">Alphabetical (A-Z)</option>
              <option value="z-a">Alphabetical (Z-A)</option>
              <option value="Rating (5-1)">Rating (5-1)</option>
              <option value="Rating (1-5)">Rating (1-5)</option>
            </select>
          </div>
        </div>
        <div className="LowerFilterSection">
          <div id="SelectPrice">
            <label>Select Price</label>
            <input
              type="range"
              min={0}
              max={1000}
              value={priceRange}
              onChange={handlePriceChange}
            />
            <input
              type="text"
              value={priceRange}
              onChange={handleInputChange}
            />
          </div>
          <button id="SearchFilter" onClick={handleSearchSubmit}>Search</button>
          <button id="ResetFilter" onClick={() => {
            setFilteredProducts(products);
            setSelectedCategory('all');
            setSearchProduct('');
            setSelectedSort('None');
            setPriceRange(1000);
          }}>Reset</button>
        </div>
      </div>
      <div className="ProductList">
        <h1><span className="ResultCount">{filteredProducts.length}</span>&nbsp;results</h1>
        <div className="ProductShow">
          {currentProducts.map(product => (
            <div key={product.id} className="ProductCard">
              <Link to={`/product/${product.id}`} className="ProductCardDetail" title={product.title}>
                <h2>{(product.title.length) > 20 ? product.title.slice(0, 20) + "..." : product.title}</h2>
                <img src={product.image} alt={product.title} />
                <p>$&nbsp;{product.price}</p>
              </Link>
              <button onClick={() => handleBuyNowClick(product.id)}>
                Buy Now
                <div className={animatedProductId === product.id ? "ActiveBuyDivbtn" : "NonActiveBuyDivbtn"}>
                  <div id="ActiveBuyContainer">
                    <FontAwesomeIcon icon={faCheck} />
                    <span className={animatedProductId === product.id ? "CheckBoxBackground ActiveBuySpanbtn" : "CheckBoxBackground"}></span>
                  </div>
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>
      <ul className="PaginationBtns">
        {pageNumbers.map(number => (
          <li key={number}>
            <button onClick={() => handlePageChange(number)}>
            {number}
            </button>
          </li>
        ))}
      </ul>
      <PopupNotification message={popupMessage} />
    </div>
  );
}

export default Product;