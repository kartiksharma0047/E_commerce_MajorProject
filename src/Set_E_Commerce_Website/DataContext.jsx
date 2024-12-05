import { createContext, useState, useEffect } from 'react';

const DataContext = createContext();

const DataProvider = ({ children }) => {
    const [PageData, setPageData] = useState({
        theme: 'dark',
        LoggedIn: JSON.parse(localStorage.getItem('LoggedIn')) || false,
        CurrentLoggedData: JSON.parse(localStorage.getItem('CurrentLoggedData')) || {
            email: '',
            password: '',
            CartCount: 0,
            CartData: [],
            CheckOut: {
                previousCheckout: [{Date:'',Record:[],pending:true}],
                currentCheckout: {
                    CurrentDate: '',
                    CurrentRecord: []
                }
            }
        },
        LoggedData: JSON.parse(localStorage.getItem('LoggedData')) || [],
        CurrentGoogleLogin: JSON.parse(localStorage.getItem('CurrentGoogleLogin')) || {
            email: '',
            CartCount: 0,
            CartData: [],
            CheckOut: {
                previousCheckout: [{Date:'',Record:[],pending:true}],
                currentCheckout: {
                    CurrentDate: '',
                    CurrentRecord: []
                }
            }
        },
        PreviousGoogleLogin: JSON.parse(localStorage.getItem('PreviousGoogleLogin')) || [],
        popupMessage: '',
        isPopupSuccess: true
    });

    useEffect(() => {
        localStorage.setItem('LoggedData', JSON.stringify(PageData.LoggedData));
    }, [PageData.LoggedData]);

    useEffect(() => {
        localStorage.setItem('CurrentLoggedData', JSON.stringify(PageData.CurrentLoggedData));
    }, [PageData.CurrentLoggedData]);

    useEffect(() => {
        localStorage.setItem('LoggedIn', JSON.stringify(PageData.LoggedIn));
    }, [PageData.LoggedIn]);

    useEffect(() => {
        localStorage.setItem('CurrentGoogleLogin', JSON.stringify(PageData.CurrentGoogleLogin));
    }, [PageData.CurrentGoogleLogin]);

    useEffect(() => {
        localStorage.setItem('PreviousGoogleLogin', JSON.stringify(PageData.PreviousGoogleLogin));
    }, [PageData.PreviousGoogleLogin]);

    const updateCartCount = (newCount) => {
        setPageData(prevState => ({
            ...prevState,
            CurrentLoggedData: {
                ...prevState.CurrentLoggedData,
                CartCount: newCount
            },
            LoggedData: prevState.LoggedData.map(data => {
                if (data.email === prevState.CurrentLoggedData.email) {
                    return {
                        ...data,
                        CartCount: newCount
                    };
                }
                return data;
            }),
            CurrentGoogleLogin: {
                ...prevState.CurrentGoogleLogin,
                CartCount: newCount
            },
            PreviousGoogleLogin: prevState.PreviousGoogleLogin.map(data => {
                if (data.email === prevState.CurrentGoogleLogin.email) {
                    return {
                        ...data,
                        CartCount: newCount
                    };
                }
                return data;
            })
        }));
    };

    const addUser = (user) => {
        setPageData(prevState => ({
            ...prevState,
            LoggedData: [...prevState.LoggedData, user],
            CurrentLoggedData: user,
            LoggedIn: true,
            CurrentGoogleLogin: user,
            PreviousGoogleLogin: [...prevState.PreviousGoogleLogin, user],
        }));
    };

    const isUserRegistered = (email) => {
        return PageData.PreviousGoogleLogin.some(user => user.email === email) ||
            PageData.LoggedData.some(user => user.email === email);
    };

    const handleGoogleSignInData = (user, isSignUp) => {
        if (isUserRegistered(user.email)) {
            if (isSignUp) {
                showPopup('Account already exists', false);
            } else {
                const existingUser = PageData.PreviousGoogleLogin.find(data => data.email === user.email);
                setPageData(prevState => ({
                    ...prevState,
                    CurrentGoogleLogin: existingUser,
                    LoggedIn: true
                }));
                showPopup('Successfully logged in with Google', true);
            }
        } else {
            if (isSignUp) {
                addUser(user);
                showPopup('Successfully signed up with Google', true);
            } else {
                showPopup('Sign up with your Google account first', false);
            }
        }
    };

    const showPopup = (message, isSuccess) => {
        setPageData(prevState => ({
            ...prevState,
            popupMessage: message,
            isPopupSuccess: isSuccess
        }));
        setTimeout(() => {
            setPageData(prevState => ({
                ...prevState,
                popupMessage: ''
            }));
        }, 3000);
    };

    const logout = () => {
        setPageData(prevState => ({
            ...prevState,
            LoggedIn: false,
            CurrentLoggedData: {
                email: '',
                password: '',
                CartCount: 0,
                CartData: [],
                CheckOut: {
                    previousCheckout: [{Date:'',Record:[],pending:true}],
                    currentCheckout: {
                        CurrentDate: '',
                        CurrentRecord: []
                    }
                }
            },
            CurrentGoogleLogin: {
                email: '',
                CartCount: 0,
                CartData: [],
                CheckOut: {
                    previousCheckout: [{Date:'',Record:[],pending:true}],
                    currentCheckout: {
                        CurrentDate: '',
                        CurrentRecord: []
                    }
                }
            }
        }));
    };

    const loginUser = (email, password) => {
        const existingUser = PageData.LoggedData.find(user => user.email === email && user.password === password);
        if (existingUser) {
            setPageData(prevState => ({
                ...prevState,
                CurrentLoggedData: existingUser,
                LoggedIn: true
            }));
            showPopup('Successfully logged in', true);
            return true;
        } else {
            showPopup('Invalid email or password', false);
            return false;
        }
    };

    const addToCart = (productId) => {
        setPageData(prevState => {
            const currentUser = prevState.LoggedIn ? prevState.CurrentLoggedData : prevState.CurrentGoogleLogin;
            let updatedCart = [...currentUser.CartData, productId];

            const updateUserData = (userData) => ({
                ...userData,
                CartData: updatedCart,
                CartCount: updatedCart.length
            });

            return {
                ...prevState,
                CurrentLoggedData: prevState.LoggedIn ? updateUserData(prevState.CurrentLoggedData) : prevState.CurrentLoggedData,
                LoggedData: prevState.LoggedData.map(data =>
                    data.email === currentUser.email ? updateUserData(data) : data
                ),
                CurrentGoogleLogin: !prevState.LoggedIn ? updateUserData(prevState.CurrentGoogleLogin) : prevState.CurrentGoogleLogin,
                PreviousGoogleLogin: prevState.PreviousGoogleLogin.map(data =>
                    data.email === currentUser.email ? updateUserData(data) : data
                )
            };
        });
    };

    return (
        <DataContext.Provider value={{ PageData, setPageData, updateCartCount, addUser, handleGoogleSignInData, showPopup, logout, loginUser, isUserRegistered, addToCart }}>
            {children}
        </DataContext.Provider>
    );
};

export { DataContext, DataProvider };