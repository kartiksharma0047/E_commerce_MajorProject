import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect } from 'react';
import './CSS/PopUpNotification.css';
import { faCircleCheck, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { useContext } from 'react';
import { DataContext } from './DataContext';

function PopupNotification({ message }) {

    const { PageData } = useContext(DataContext);
    const { isPopupSuccess } = PageData;
    useEffect(() => {
        const timer = setTimeout(() => {
        }, 3000);
    
        return () => clearTimeout(timer);
      }, [message]);

    if (!message) return null;

    return (
        <div className={`popup-notification ${isPopupSuccess ? 'success-popup-notification' : 'error-popup-notification'}`}>
            <div className='popup-container'>
                <h1>{message}</h1>
                <FontAwesomeIcon icon={isPopupSuccess ? faCircleCheck : faCircleXmark} />
                <div></div>
            </div>
        </div>
    );
}

export default PopupNotification;
