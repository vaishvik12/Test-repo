import {cart, removeFromCart, calculateCartQuantity, saveToStorage} from "../data/cart.js";
import {products} from "../data/products.js";
import convertCurrency from "./utils/currency.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";
import {shipping} from "../data/shipping.js";

let todayDate = dayjs();
let formatedDate = todayDate.format("dddd, MMMM D");
console.log(formatedDate);



let cartHtml = ``;

function renderCheckout(){
cartHtml = '';
cart.forEach(cartItem => {
 let matchingItem;
  products.forEach(product => {
    if(cartItem.productId === product.id){
      matchingItem = product;
      return;
    };
  });

    let matchingShippingOption;

    shipping.forEach(option => {
      if(String(cartItem.shippingId) === String(option.shippingId)){
        matchingShippingOption = option;
      }
    });

    let shippingDate = todayDate.add(matchingShippingOption.shippingDays, "days");


cartHtml += `
<div class="cart-item-container js-cart-item-container-${matchingItem.id}">
  <div class="delivery-date">
    Delivery date: ${shippingDate.format("dddd, MMMM D")}
  </div>

  <div class="cart-item-details-grid">
    <img class="product-image"
      src="${matchingItem.image}">

    <div class="cart-item-details">
      <div class="product-name">
        ${matchingItem.name}
      </div>
      <div class="product-price">
        $${convertCurrency(matchingItem.priceCents)}
      </div>
      <div class="product-quantity">
        <span>
          Quantity: <span class="quantity-label">${cartItem.quantity}</span>
        </span>
        <span data-product-id = ${matchingItem.id}
         class="update-quantity-link link-primary js-update-quantity-link">
          Update
        </span>
          <input type = "text" class = "update-input update-not-in-use js-update-input-${matchingItem.id}">
          <button data-product-id = ${matchingItem.id}
          class = "save-button update-not-in-use  js-save-button
          js-save-button-${matchingItem.id}">Save</button>
        <span data-product-id = ${matchingItem.id}
        class="delete-quantity-link link-primary js-delete-quantity">
          Delete
        </span>
      </div>
    </div>

    <div class="delivery-options">
      <div class="delivery-options-title">
        Choose a delivery option:
      </div>
      ${genrateDeliveryOptions(matchingItem,cartItem)}
    </div>
  </div>
</div>
`
genrateOrderSummary();
});

function genrateDeliveryOptions(matchingItem, cartItem){
  let shippingHtml = ``;
  shipping.forEach(option => {

    let todaysDate = dayjs();
    
    let shippingDate = todayDate.add(option.shippingDays, "days");
    
    let shippingPrice = option.priceCents === 0
     ?  "Free Shipping"
      : `$${convertCurrency(option.priceCents)}`;

    let isChecked = String(cartItem.shippingId) === String(option.shippingId);

    shippingHtml +=
      `  <div data-product-id = ${matchingItem.id}
          data-shipping-id = ${option.shippingId}
      class="delivery-option">
        <input type="radio" 
        ${isChecked ? "checked" : ""}
        class="delivery-option-input"
          name="delivery-option-${matchingItem.id}">
        <div>
          <div class="delivery-option-date">
          ${shippingDate.format("dddd, MMMM D")}
          </div>
          <div class="delivery-option-price">
          ${shippingPrice}
          </div>
        </div>
      </div>`
  });

  return shippingHtml;
}



let orderSummaryDiv = document.querySelector('.js-order-summary');
orderSummaryDiv.innerHTML = cartHtml;

attachEventListner();
};


//delete cart items

function attachEventListner(){
let deleteButtons = document.querySelectorAll(".js-delete-quantity");
let returnLink = document.querySelector('.js-return-to-home-link');


deleteButtons.forEach(deleteButton => {
  deleteButton.addEventListener("click", () => {
    const productId = deleteButton.dataset.productId;
    removeFromCart(productId);
    let matchingDiv = document.querySelector(`.js-cart-item-container-${productId}`);
    matchingDiv.remove();
    let quantity = calculateCartQuantity();
    returnLink.innerHTML = `${quantity} items`;
    renderCheckout();
  });
});

let quantity = calculateCartQuantity();
returnLink.innerHTML = `${quantity} items`;

// update cart items
let updateButtons = document.querySelectorAll(".js-update-quantity-link");

updateButtons.forEach(updateButton => {
  updateButton.addEventListener("click", () => {
  let {productId} = updateButton.dataset;
  let input = document.querySelector(`.js-update-input-${productId}`);
  let saveButton = document.querySelector(`.js-save-button-${productId}`);
  input.classList.toggle('update-in-use');
  saveButton.classList.toggle('update-in-use');
  input.focus();
  });
});


//save updated quantity

let saveButtons = document.querySelectorAll('.js-save-button');

saveButtons.forEach(saveButton => {
  saveButton.addEventListener("click", () => {
    let {productId} = saveButton.dataset;
    let input = document.querySelector(`.js-update-input-${productId}`);
    let newQuantity = Number(input.value);

    cart.forEach(cartItem => {
      if(cartItem.productId === productId){
        cartItem.quantity = newQuantity;
      }
    });

    let updatedQuantity = calculateCartQuantity();
    returnLink.innerHTML = `${updatedQuantity} items`;
    input.classList.toggle('update-in-use');
    saveButton.classList.toggle('update-in-use');
    saveToStorage();
    renderCheckout();
  })
})

let deliveryOptions = document.querySelectorAll('.delivery-option');

deliveryOptions.forEach(option => {
  option.addEventListener("click", () => {
    let {productId, shippingId} = option.dataset;
    

    let matchingProduct;
    cart.forEach(cartItem => {
      if(cartItem.productId === productId){
        matchingProduct = cartItem;
      }
    });

    matchingProduct.shippingId = shippingId;
    console.log(cart);
    saveToStorage();
    renderCheckout();
  })
})
}


function genrateOrderSummary(){

  let itemsPrice = 0;
  let totalItems = 0;
  let shippingAndHandling = 0;
  let totalBeforeTax = 0;
  let estimatedTax = 0;
  let totalAfterTax = 0;
  let tax = 0.1;



  cart.forEach(cartItem => {
    let productId = cartItem.productId;
    
    products.forEach(product => {
      if(product.id === productId){
        itemsPrice += product.priceCents * cartItem.quantity;
      }
    })

   shipping.forEach(option => {
      if(String(option.shippingId) === String(cartItem.shippingId)){
        shippingAndHandling += option.priceCents;
      }
  })
  });

totalBeforeTax = itemsPrice + shippingAndHandling;
estimatedTax = totalBeforeTax * tax;

let paymentHtml = 
  `
<div class="payment-summary-title">
        Order Summary
      </div>

      <div class="payment-summary-row">
        <div>Items (${calculateCartQuantity()}):</div>
        <div class="payment-summary-money">$${convertCurrency(itemsPrice)}</div>
      </div>

      <div class="payment-summary-row">
        <div>Shipping &amp; handling:</div>
        <div class="payment-summary-money">$${convertCurrency(shippingAndHandling)}</div>
      </div>

      <div class="payment-summary-row subtotal-row">
        <div>Total before tax:</div>
        <div class="payment-summary-money">$${convertCurrency(totalBeforeTax)}</div>
      </div>

      <div class="payment-summary-row">
        <div>Estimated tax (10%):</div>
        <div class="payment-summary-money">$${convertCurrency(estimatedTax)}</div>
      </div>

      <div class="payment-summary-row total-row">
        <div>Order total:</div>
        <div class="payment-summary-money">$${convertCurrency(totalBeforeTax + estimatedTax)}</div>
      </div>

      <button class="place-order-button button-primary">
        Place your order
      </button>
  `
  
  let paymnetDiv = document.querySelector('.js-payment-summary');
  paymnetDiv.innerHTML = paymentHtml;
}


renderCheckout();