import { useContext } from 'react';
import '../CSS/Checkout_Css/CheckoutHeader.css';
import { DataContext } from '../DataContext';
import { useLocation } from 'react-router-dom';

function CheckOutHeader() {
    const { PageData } = useContext(DataContext);
    const { theme } = PageData;

    const UrlAddress = useLocation().pathname.split('/').pop();

    const classMap = {
        details: 0,
        address: 1,
        billing: 2,
    };
    const currentStep = classMap[UrlAddress] || 0;

    return (
        <div className={`CheckOutHeader ${theme === 'light' ? 'LightCheckOutHeader' : 'DarkCheckOutHeader'}`}>
            <div className={`detailsHeader ${currentStep >= 0 ? 'activeStep' : ''} ${currentStep === 0 ? 'glowHeader' : ''}`}>
                <p>1</p>
                <h3>Details</h3>
            </div>
            <span className={`borderSpan1 ${currentStep >= 1 ? 'borderHeader1' : ''}`} />
            <div className={`addressHeader ${currentStep >= 1 ? 'activeStep' : ''} ${currentStep === 1 ? 'glowHeader' : ''}`}>
                <p>2</p>
                <h3>Address</h3>
            </div>
            <span className={`borderSpan2 ${currentStep >= 2 ? 'borderHeader2' : ''}`} />
            <div className={`billingHeader ${currentStep >= 2 ? 'activeStep' : ''} ${currentStep === 2 ? 'glowHeader' : ''}`}>
                <p>3</p>
                <h3>Billing</h3>
            </div>
        </div>
    );
}

export default CheckOutHeader;
