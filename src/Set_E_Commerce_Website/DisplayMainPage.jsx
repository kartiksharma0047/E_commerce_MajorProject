import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DataProvider } from './DataContext';
import Layout from './HeadingBarPage';
import Home from './Home';
import About from './About';
import Product from './Product';
import CheckOut from './Checkout Jsx/CheckOut';
import Orders from './Orders';
import Cart from './Cart';
import ProductOutlet from './ProductOutlet';
import ProductDetails from './ProductDetails';
import Details from './Checkout Jsx/Details';
import Address from './Checkout Jsx/Address';
import Billing from './Checkout Jsx/Billing';

function App() {
    return (
        <DataProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/product" element={<ProductOutlet />}>
                            <Route index element={<Product />} />
                            <Route path="/product/:id" element={<ProductDetails />} />
                        </Route>
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/checkout" element={<CheckOut />}>
                            <Route path='details' element={<Details/>}/>
                            <Route path='address' element={<Address/>}/>
                            <Route path='billing' element={<Billing/>}/>
                        </Route>
                        <Route path="/orders" element={<Orders />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </DataProvider>
    );
}

export default App;
