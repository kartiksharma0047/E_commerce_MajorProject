import { useContext, useState, useEffect } from 'react';
import { auth, provider, signInWithPopup } from './firebase';
import { DataContext } from './DataContext';
import './CSS/Sign_Log_In.css';
import { FcGoogle } from "react-icons/fc";
import { BiHide, BiSolidShow } from "react-icons/bi";
import PopupNotification from './PopUpNotification';

function Sign_Log_In({ modalType, onClose }) {
    const { PageData, addUser, handleGoogleSignInData, showPopup, loginUser } = useContext(DataContext);
    const { theme, popupMessage } = PageData;
    const [SignInPass, SetSignInPass] = useState(false);
    const [LogInPass, SetLogInPass] = useState(false);
    const [currentModal, setCurrentModal] = useState(modalType);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    useEffect(() => {
        resetForm();
        setCurrentModal(modalType);
    }, [modalType]);

    const resetForm = () => {
        setEmail('');
        setPassword('');
        setEmailError('');
        setPasswordError('');
    };

    const handleGoogleSignIn = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const email = result.user.email;

            const newUser = {
                email: email,
                CartCount: 0,
                CartData: [],
                CheckOut: {
                    previousCheckout: [{Date:'',Record:[],pending:true}],
                    currentCheckout: {
                        CurrentDate: '',
                        CurrentRecord: []
                    }
                }
            };

            if (currentModal === 'sign') {
                handleGoogleSignInData(newUser, true); // Passing true to indicate sign up
            } else if (currentModal === 'log') {
                handleGoogleSignInData(newUser, false); // Passing false to indicate log in
            }

            setTimeout(() => {
                onClose();
            }, 3000);
        } catch (error) {
            showPopup('An error occurred', false);
        }
    };

    const handleSignInPasswordShow = () => {
        SetSignInPass(!SignInPass);
    };

    const handleLogInPasswordShow = () => {
        SetLogInPass(!LogInPass);
    };

    const handleModalShift = (newModalType) => (e) => {
        e.preventDefault();
        resetForm();
        setCurrentModal(newModalType);
    };

    const validateEmail = (email) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            return 'Enter an email';
        } else if (!emailPattern.test(email)) {
            return 'Enter a valid email';
        }
        return '';
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const emailValidationError = validateEmail(email);
        const passwordValidationError = password ? '' : 'Enter a password';

        setEmailError(emailValidationError);
        setPasswordError(passwordValidationError);

        if (!emailValidationError && !passwordValidationError) {
            if (currentModal === 'sign') {
                const existingUser = PageData.LoggedData.find(user => user.email === email);
                if (existingUser) {
                    showPopup('Account is already registered', false); // false for error
                } else {
                    const newUser = {
                        email,
                        password,
                        CartCount: 0,
                        CartData: [],
                        CheckOut: {
                            previousCheckout: [{Date:'',Record:[],pending:true}],
                            currentCheckout: {
                                CurrentDate: '',
                                CurrentRecord: []
                            }
                        }
                    };
                    addUser(newUser);
                    showPopup('Successfully signed up', true); // true for success
                    setTimeout(() => {
                        onClose();
                    }, 3000);
                    resetForm();
                }
            } else if (currentModal === 'log') {
                if (loginUser(email, password)) {
                    setTimeout(() => {
                        onClose();
                    }, 3000);
                }
            }
        } else {
            showPopup('Invalid email or password', false); // false for error
        }
    };

    return (
        <div className={`modal-content 
            ${theme === 'light' ? "modalLightContent" : "modalDarkContent"}
            ${currentModal === 'sign' ? 'ApplyModalTransition' : 'ResetModalTransition'} `}>
            <button onClick={onClose} className="SignLogInCloseBtn">&times;</button>
            <PopupNotification message={popupMessage} />
            <div className='ConatainLogSign'>
                <div className='SignLogHideDiv'></div>
                {currentModal === 'sign' && (
                    <div className='SignInDiv'>
                        <div className='SignInLeft'>
                            <h2>Create your account</h2>
                            <div className='SignInForm'>
                                <div onClick={handleGoogleSignIn} className="google-signin-button">
                                    <FcGoogle />
                                    <p>Continue with Google</p>
                                </div>
                                <div className='SignOrLine'>
                                    <p>or</p>
                                    <hr />
                                </div>
                                <form onSubmit={handleSubmit}>
                                    <div className='SignInEmail'>
                                        <label>Email</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                        {emailError && <p className="error">{emailError}</p>}
                                    </div>
                                    <div className='SignInPassword'>
                                        <label>Password</label>
                                        <input
                                            type={SignInPass ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        <BiSolidShow
                                            onClick={handleSignInPasswordShow}
                                            className={`SignPassShow ${SignInPass ? "HideIcon" : null}`} />
                                        <BiHide onClick={handleSignInPasswordShow} className={`SignPassHide ${SignInPass ? null : "HideIcon"}`} />
                                        {passwordError && <p className="error">{passwordError}</p>}
                                    </div>
                                    <button type="submit" className='CreateAccountBtn'>Create Account</button>
                                </form>
                                <p className='ConditionalParaSignIn'>By creating your account, you agree to the <a href="">Terms of Services</a> and <a href="">Privacy Policy</a></p>
                            </div>
                        </div>
                        <div className='SignInRight'>
                            <h1>Come join us!</h1>
                            <p>We are excited to have you here. If you haven't already, create an account to get access to exclusive offers, rewards, and discounts.</p>
                            <div className='ToLoginDiv'>
                                <h4>Already have an account?
                                    <a href='' onClick={handleModalShift('log')}>Log in</a>
                                </h4>
                            </div>
                        </div>
                    </div>
                )}
                {currentModal === 'log' && (
                    <div className='LogInDiv'>
                        <div className='LogInLeft'>
                            <h1>Welcome back!</h1>
                            <p>Welcome back! We are so happy to have you here. It's great to see you again. We hope you had a safe and enjoyable time away.</p>
                            <div className='ToSiginDiv'>
                                <h4>No account yet?&nbsp;
                                    <a href="" onClick={handleModalShift('sign')}>Signup</a>
                                </h4>
                            </div>
                        </div>
                        <div className='LogInRight'>
                            <h2>Log In</h2>
                            <div className='LogInForm'>
                                <form onSubmit={handleSubmit}>
                                    <div className='LogInEmail'>
                                        <label>Email</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                        {emailError && <p className="error">{emailError}</p>}
                                    </div>
                                    <div className='LogInPassword'>
                                        <label>Password</label>
                                        <input
                                            type={LogInPass ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        <BiSolidShow
                                            onClick={handleLogInPasswordShow}
                                            className={`LogInPassShow ${LogInPass ? "HideIcon" : null}`} />
                                        <BiHide onClick={handleLogInPasswordShow} className={`LogInPassHide ${LogInPass ? null : "HideIcon"}`} />
                                        {passwordError && <p className="error">{passwordError}</p>}
                                    </div>
                                    <button type="submit" className='LoginAccountBtn'>Login</button>
                                </form>
                                <div className='google-login'>
                                    <hr />
                                    <p>or</p>
                                    <div className='LogInGoogleLogo' onClick={handleGoogleSignIn}>
                                        <h5>Login with Google</h5>
                                        <FcGoogle />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Sign_Log_In; 