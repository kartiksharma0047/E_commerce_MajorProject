import { faFacebook, faInstagram, faTelegram, faTwitter, faYoutube } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import './CSS/Copyright.css';

function Copyright() {
    return (
        <div className="CopyrightDiv">
            <div className="SocialMedia">
                <a href=""><FontAwesomeIcon icon={faTwitter} /></a>
                <a href=""><FontAwesomeIcon icon={faInstagram} /></a>
                <a href=""><FontAwesomeIcon icon={faTelegram} /></a>
                <a href=""><FontAwesomeIcon icon={faFacebook} /></a>
                <a href=""><FontAwesomeIcon icon={faYoutube} /></a>
            </div>
            <div className="CopyrightInfo">
                <h1>Copyright trademark.Co.in</h1>
                <p>trademark&Company@gmail.com</p>
            </div>
        </div>
    )
}
export default Copyright;