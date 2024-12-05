import CheckOutHeader from "./CheckOutHeader";
import { useState, useEffect, useContext } from "react";
function Address() {
  return (
    <div className="CheckOutDetails">
      <CheckOutHeader />
      <div className="AddressContainers">
        <h1>Address Information</h1>
        <form className="AddressBox">
          <div className="AddressBoxInputRow">
            <div>
              <input type="text" placeholder="Enter "/>
            </div>
            <div>
              <input type="text" />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Address;
