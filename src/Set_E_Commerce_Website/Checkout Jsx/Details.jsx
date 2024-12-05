import CheckOutHeader from "./CheckOutHeader";
import { DataContext } from "../DataContext";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import '../CSS/Checkout_Css/Details.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from 'react-router-dom';

function Details() {
  const [countries, setCountries] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [phoneCode, setPhoneCode] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedGender, setSelectedGender] = useState("");
  const [isFormValid, setIsFormValid] = useState(false); // Track form validation
  const { PageData } = useContext(DataContext);
  const { theme } = PageData;
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [DetailsForm, setDetailsForm] = useState([]); // Array to store form data
  const navigate = useNavigate(); // Used for navigation

  const headers = new Headers();
  headers.append("X-CSCAPI-KEY", "TjZNU1M4VDR1UUlVeVNDdFlXMVdBWFIzUGs0Q016eXhPY0F0cUZydA==");

  const requestOptions = {
    method: 'GET',
    headers: headers,
    redirect: 'follow'
  };

  useEffect(() => {
    fetch("https://api.countrystatecity.in/v1/countries", requestOptions)
      .then(response => response.json())
      .then(result => {
        setCountries(result);
        setLoadingCountries(false);
      })
      .catch(error => {
        console.log('Error fetching countries:', error);
        setLoadingCountries(false);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const watchFields = watch(["FirstName", "LastName", "DOB", "Gender", "Email", "PhoneNumber", "Country"]);

  useEffect(() => {
    const allRequiredFieldsFilled = watchFields.every(field => field && field !== "");
    const phoneValid = watchFields[5] && watchFields[5].length === 10;
    setIsFormValid(allRequiredFieldsFilled && phoneValid);
  }, [watchFields]);

  const onSubmit = (data) => {
    // Store the form data in the array
    const formData = { ...data, phoneCode };
    setDetailsForm(prevDetailsForm => [...prevDetailsForm, formData]);

    // Console log data when form is valid and next button is clicked
    console.log("Stored Form Data:", [...DetailsForm, formData]);
    
    // Redirect to the next page
    navigate('/checkout/address');
  };

  const handleCountryChange = (value) => {
    setSelectedCountry(value);
    const selectedCountryObj = countries.find(country => country.iso2 === value);
    setPhoneCode(selectedCountryObj ? selectedCountryObj.phonecode : "");
    setDropdownOpen(false); // Close the dropdown after selecting the country
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen); // Toggle dropdown visibility
  };

  return (
    <div className="CheckOutDetails">
      <CheckOutHeader />
      <div className={`DetailsContainer ${theme === 'light' ? 'LightDetailsContainer' : 'DarkDetailsContainer'}`}>
        <h1>Personal Information</h1>
        <form className="DetailsBox" onSubmit={handleSubmit(onSubmit)}>
          <div className="DetailsBoxInputRow">
            <div>
              <input
                type="text"
                placeholder="First Name"
                {...register("FirstName", { required: "First name is required" })}
              />
              {errors.FirstName && <p className="DetailsCheckoutError">{errors.FirstName.message}</p>}
            </div>
            <div>
              <input
                type="text"
                placeholder="Last Name"
                {...register("LastName", { required: "Last name is required" })}
              />
              {errors.LastName && <p className="DetailsCheckoutError">{errors.LastName.message}</p>}
            </div>
          </div>
          <div className="DetailsBoxInputRow">
            <div>
              <input
                type="date"
                style={{ color: '#757575' }}
                {...register("DOB", { required: "Date of birth is required" })}
              />
              {errors.DOB && <p className="DetailsCheckoutError">{errors.DOB.message}</p>}
            </div>
            <div>
              <select
                {...register("Gender", { required: "Gender is required" })}
                onChange={(e) => setSelectedGender(e.target.value)}
                value={selectedGender}
                style={{ color: selectedGender === '' ? '#757575' : 'black' }}
              >
                <option value="" disabled>
                  Select Gender
                </option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>

              {errors.Gender && <p className="DetailsCheckoutError">{errors.Gender.message}</p>}
            </div>
          </div>
          <div className="DetailsBoxInputRow">
            <div>
              <input
                type="email"
                placeholder="Email"
                {...register("Email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                    message: "Email is not valid"
                  }
                })}
              />
              {errors.Email && <p className="DetailsCheckoutError">{errors.Email.message}</p>}
            </div>
            <div>
              <select
                {...register("Country", { required: "Country is required" })}
                onChange={(e) => handleCountryChange(e.target.value)}
                value={selectedCountry}
                style={{ color: selectedCountry === '' ? '#757575' : 'black' }}
              >
                <option value="" disabled>
                  Select Country
                </option>
                {!loadingCountries ? (
                  countries.map((ele, index) => (
                    <option key={index} value={ele.iso2}>
                      {ele.name}
                    </option>
                  ))
                ) : (
                  <option disabled>Loading countries...</option>
                )}
              </select>

              {errors.Country && <p className="DetailsCheckoutError">{errors.Country.message}</p>}
            </div>
          </div>
          <div className="DetailsBoxInputRow">
            <div className="PhoneInput">
              <div className="custom-select">
                <div className="selected-option" onClick={toggleDropdown}>
                  {phoneCode ? (phoneCode.length <= 5 ? phoneCode : phoneCode.slice(0, 5) + '...') : (
                    <>
                      -- <FontAwesomeIcon icon={faCaretDown} />
                    </>
                  )}
                </div>
                {dropdownOpen && (
                  <ul className="options-list">
                    {countries.map((ele, index) => (
                      <li title={ele.phonecode + " (" + ele.name + ")"} key={index} onClick={() => handleCountryChange(ele.iso2)}>
                        {ele.phonecode.length <= 3 ? ele.phonecode : ele.phonecode.slice(0, 3) + '..'}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <input
                className="PhoneInputBox"
                type="text"
                placeholder="Phone number"
                {...register("PhoneNumber", {
                  required: "Phone number is required",
                  minLength: {
                    value: 10,
                    message: "Phone number must be at least 10 digits"
                  },
                  maxLength: {
                    value: 10,
                    message: "Phone number can't be greater than 10 digits"
                  }
                })}
              />
              {errors.PhoneNumber && <p className="DetailsCheckoutError">{errors.PhoneNumber.message}</p>}
            </div>
            <div>
              <input
                type="text"
                placeholder="Alternate number (Optional)"
                {...register("AlternateNumber", {
                  minLength: {
                    value: 10,
                    message: "Alternate number must be at least 10 digits"
                  },
                  maxLength: {
                    value: 10,
                    message: "Alternate number must be at least 10 digits"
                  }
                })}
              />
              {errors.AlternateNumber && <p className="DetailsCheckoutError">{errors.AlternateNumber.message}</p>}
            </div>
          </div>
          <div className="NextPrev">
            <Link to='/checkout'>Prev</Link>
            <button
              type="submit"
              className={isFormValid ? "" : "CheckoutDisabledBtn"}
              disabled={!isFormValid}
            >
              Next
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Details;
