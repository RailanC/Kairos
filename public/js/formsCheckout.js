//Contact
const inputFullname = document.getElementById('full-name');
const inputEmail = document.getElementById('email');
const inputPhone = document.getElementById('phone');
//Shipping Address Details
const inputShipAddress1 = document.getElementById('ship_line1');
const inputShipAddress2 = document.getElementById('ship_line2');
const inputShipCity = document.getElementById('ship_city');
const inputShipPostalCode = document.getElementById('ship_postal');
//Billing Address Details
const inputBillingAddress1 = document.getElementById('bill_line1');
const inputBillingAddress2 = document.getElementById('bill_line2');
const inputBillingCity = document.getElementById('bill_city');
const inputBillingPostalCode = document.getElementById('bill_postal');

//Button
const buttonSubmit = document.getElementById('checkout-submit');

inputFullname.addEventListener("keyup", validateForm); 
inputEmail.addEventListener("keyup", validateForm); 
inputPhone.addEventListener("keyup", validateForm); 
//Shipping Address Details
inputShipAddress1.addEventListener("keyup", validateForm); 
inputShipAddress2.addEventListener("keyup", validateForm); 
inputShipCity.addEventListener("keyup", validateForm); 
inputShipPostalCode.addEventListener("keyup", validateForm); 
//Billing Address Details
inputBillingAddress1.addEventListener("keyup", validateForm); 
inputBillingAddress2.addEventListener("keyup", validateForm); 
inputBillingCity.addEventListener("keyup", validateForm); 
inputBillingPostalCode.addEventListener("keyup", validateForm); 

function validateForm(){
    const fullnameOk = validateRequired(inputFullname);
    const emailOk = validateEmail(inputEmail);
    const phoneOk = validatePhone(inputPhone);

    const shipAddress1Ok = validateRequired(inputShipAddress1);
    const shipCityOk = validateRequired(inputShipCity);
    const shipPostalCodeOk = validatePostalCode(inputShipPostalCode);

    if(fullnameOk && emailOk && phoneOk && shipAddress1Ok && shipCityOk && shipPostalCodeOk){
        buttonSubmit.disabled = false;
    }else{
        buttonSubmit.disabled = true;
    }

}

function validateRequired(input){
    return validateResult(input.value != '', input);
}

function validateEmail(input){
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mailUser = input.value;
    return validateResult(mailUser.match(emailRegex), input);
    
}

function validatePhone(input){
    const phoneRegex = /[0-9]{9}/;
    const phoneUser = input.value;
    return validateResult(phoneUser.match(phoneRegex), input);
}

function validatePostalCode(input){
    const phoneRegex = /[0-9]{5}/;
    const phoneUser = input.value;
    return validateResult(phoneUser.match(phoneRegex), input);
}


function validateResult(validation, input){
    if(validation){
        input.classList.add("is-valid");
        input.classList.remove("is-invalid"); 
        return true;
    }else{
        input.classList.remove("is-valid");
        input.classList.add("is-invalid");
        return false;
    }
}
