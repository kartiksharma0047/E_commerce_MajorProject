import { NavLink, Outlet, useLocation } from 'react-router-dom';
import './CSS/HeadingBarPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faDownload, faHeadphones, faRightFromBracket, faSun, faUser, faX } from '@fortawesome/free-solid-svg-icons';
import { motion, useScroll, useSpring } from 'framer-motion';
import { useState, useContext, useEffect } from 'react';
import { DataContext } from './DataContext';
import Sign_Log_In from './Sign_Log_In';
import Copyright from './Copyright';

function Layout() {
    document.title = 'Getify Website';
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 20,
        restDelta: 0.001
    });
    const { PageData, setPageData, updateCartCount, logout } = useContext(DataContext);
    const { theme, LoggedIn, CurrentLoggedData, CurrentGoogleLogin } = PageData;
    const cartCount = PageData.CurrentLoggedData.CartCount || PageData.CurrentGoogleLogin.CartCount;
    const [themeShow, setThemeShow] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState(null);
    const [prevActivePath, setPrevActivePath] = useState('');
    const location = useLocation();
    const [FaUserBtn, SetFaUserBtn] = useState(false);

    const handleBtnToggle = (btnType) => {
        setModalType(btnType);
        setIsModalOpen(!isModalOpen);
    };

    const handleThemeToggle = () => {
        setThemeShow(!themeShow);
    };

    const handleThemeChange = (e) => {
        setPageData(prevState => ({
            ...prevState,
            theme: e.target.value
        }));
    };

    useEffect(() => {
        if (!isModalOpen) {
            setPrevActivePath(location.pathname);
        }
    }, [location, isModalOpen]);

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setModalType(null);
        const prevLink = document.querySelector(`a[href='${prevActivePath}']`);
        if (prevLink) {
            prevLink.classList.add(theme === 'light' ? 'LightActive' : 'DarkActive');
        }
    };

    const onNavLinkClick = (path) => {
        setPrevActivePath(path);
    };

    const addToCart = () => {
        const newCount = cartCount + 1;
        updateCartCount(newCount);
        localStorage.setItem('cartCount', newCount);
    };

    const UsernameFaUserBtn = () => {
        SetFaUserBtn(!FaUserBtn);
    };

    const handleLogout = () => {
        logout();
        SetFaUserBtn(false);
    };

    const emailUsernameAccount = CurrentLoggedData.email.split('@')[0];
    const emailUsernameGoogle = CurrentGoogleLogin.email.split('@')[0];
    const displayUsername = emailUsernameAccount || emailUsernameGoogle;

    useEffect(() => {
        const storedCartCount = parseInt(localStorage.getItem('cartCount'), 10);
        if (!isNaN(storedCartCount)) {
            setPageData(prevState => ({
                ...prevState,
                CurrentLoggedData: {
                    ...prevState.CurrentLoggedData,
                    CartCount: storedCartCount
                }
            }));
        }
    }, [setPageData]);

    return (
        <div className='LayoutPage'>
            <div className={`HeaderContainer ${isModalOpen ? 'no-scroll' : ''}`}>
                <motion.div className="progress-bar" style={{ scaleX }} />
                <div className={`HeaderTop ${theme === 'light' ? 'LightTopHeaderBackGround' : 'DarkTopHeaderBackGround'}`}>
                    {LoggedIn ? (
                        <div className="UsernameHeader">
                            <h3>Welcome, <span>{displayUsername}</span></h3>
                            <div className='UsernameHeadDiv'>
                                <div className='UsernameDiv' onClick={UsernameFaUserBtn}>
                                    <FontAwesomeIcon icon={faUser} />
                                </div>
                                <div className={FaUserBtn ? "FaUserDropDown" : "FaUserDropDownHidden"}>
                                    <div className='FaUserDropDownTop'>
                                        <h5 title={displayUsername}>{displayUsername.length > 20 ? displayUsername.substring(0, 20) + '...' : displayUsername}</h5>
                                        <div>
                                            <FontAwesomeIcon icon={faUser} />
                                        </div>
                                    </div>
                                    <div className='FaUserDropDownDown'>
                                        <button>
                                            <FontAwesomeIcon icon={faHeadphones} />
                                            24x7 Customer Care
                                        </button>
                                        <button>
                                            <FontAwesomeIcon icon={faDownload} />
                                            Download App
                                        </button>
                                        <button onClick={handleLogout}>
                                            <FontAwesomeIcon icon={faRightFromBracket} />
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            <button
                                value="Sign in"
                                onClick={() => handleBtnToggle('sign')}
                                className={modalType === 'sign' ? "BtnBackground" : "BtnBackgroundNull"}
                            >
                                Sign in
                            </button>
                            <button
                                onClick={() => handleBtnToggle('log')}
                                className={modalType === 'log' ? "BtnBackground" : "BtnBackgroundNull"}
                            >
                                Log in
                            </button>
                        </>
                    )}
                </div>
                <div className={`HeaderBottom ${theme === 'light' ? 'LightBottomBackGround' : 'DarkBottomBackGround'}`}>
                    <h1>G</h1>
                    <ul>
                        <li>
                            <NavLink
                                className={({ isActive }) => isActive && !isModalOpen ? (theme === 'light' ? 'LightActive' : 'DarkActive') : ''}
                                to="/"
                                onClick={() => onNavLinkClick('/')}
                            >
                                Home
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                className={({ isActive }) => isActive && !isModalOpen ? (theme === 'light' ? 'LightActive' : 'DarkActive') : ''}
                                to="/about"
                                onClick={() => onNavLinkClick('/about')}
                            >
                                About
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                className={({ isActive }) => isActive && !isModalOpen ? (theme === 'light' ? 'LightActive' : 'DarkActive') : ''}
                                to="/product"
                                onClick={() => onNavLinkClick('/product')}
                            >
                                Product
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                className={({ isActive }) => isActive && !isModalOpen ? (theme === 'light' ? 'LightActive' : 'DarkActive') : ''}
                                to="/cart"
                                onClick={() => onNavLinkClick('/cart')}
                            >
                                Cart
                            </NavLink>
                        </li>
                        {LoggedIn ? (
                            <li>
                                <NavLink
                                    className={({ isActive }) => isActive && !isModalOpen ? (theme === 'light' ? 'LightActive' : 'DarkActive') : ''}
                                    to="/checkout"
                                    onClick={() => onNavLinkClick('/checkout')}
                                >
                                    Checkout
                                </NavLink>
                            </li>
                        ) : null}
                        {LoggedIn ? (
                            <li>
                                <NavLink
                                    className={({ isActive }) => isActive && !isModalOpen ? (theme === 'light' ? 'LightActive' : 'DarkActive') : ''}
                                    to="/orders"
                                    onClick={() => onNavLinkClick('/orders')}
                                >
                                    Orders
                                </NavLink>
                            </li>
                        ) : null}
                    </ul>
                    <div className="HeaderBottomRight">
                        <FontAwesomeIcon className={theme === 'light' ? 'LightFont' : 'DarkFont'} onClick={handleThemeToggle} icon={faSun} />
                        <div className="CartAdjust">
                            <p className={`CartCount ${cartCount < 10 ? 'CartCountShift' : 'CartCountUnShift'} ${(theme === 'light' ? "CartCountLight" : "CartCountDark")}`}>{cartCount}</p>
                            <FontAwesomeIcon className={theme === 'light' ? 'LightFont' : 'DarkFont'} icon={faCartShopping} />
                        </div>
                    </div>
                </div>
                {themeShow && (
                    <div className={`ThemeSettings ${theme === 'light' ? "ThemeSettingLight" : "ThemeSettingDark"}`}>
                        <FontAwesomeIcon className={theme === 'light' ? "LightXFont" : "DarkXFont"} icon={faX} onClick={handleThemeToggle} />
                        <h2>Select Theme</h2>
                        <div className="RadioManagement">
                            <input type="radio" name="theme" value="dark" checked={theme === 'dark'} onChange={handleThemeChange} />
                            <label>Dark</label>
                            <div className="bullet">
                                <div className="line zero"></div>
                                <div className="line one"></div>
                                <div className="line two"></div>
                                <div className="line three"></div>
                                <div className="line four"></div>
                                <div className="line five"></div>
                                <div className="line six"></div>
                                <div className="line seven"></div>
                            </div>
                        </div>
                        <div className="RadioManagement">
                            <input type="radio" name="theme" value="light" checked={theme === 'light'} onChange={handleThemeChange} />
                            <label>Light</label>
                            <div className="bullet">
                                <div className="line zero"></div>
                                <div className="line one"></div>
                                <div className="line two"></div>
                                <div className="line three"></div>
                                <div className="line four"></div>
                                <div className="line five"></div>
                                <div className="line six"></div>
                                <div className="line seven"></div>
                            </div>
                        </div>
                    </div>
                )}
                <div className={isModalOpen ? 'blur-background' : ''}>
                    <Outlet />
                </div>
                <Copyright />
            </div>
            {isModalOpen && (
                <div className={`modal-overlay ${theme === 'light' ? 'light-themeModal' : 'dark-themeModal'}`}>
                    <Sign_Log_In modalType={modalType} onClose={handleCloseModal} />
                </div>
            )}
        </div>
    );
}

export default Layout;
