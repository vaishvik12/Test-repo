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
      if(cartItem.shippingId === option.shippingId){
        matchingShippingOption = option;
      }
    });

    let todaysDate = dayjs();
    let shippingDate = todayDate.add(matchingShippingOption.shippingDays, "days");


cartHtml += `
<div class="cart-item-container js-cart-itme-container-${matchingItem.id}">
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
});

function genrateDeliveryOptions(matchingItem, cartItem){
  let shippingHtml = ``;
  shipping.forEach(option => {

    let todaysDate = dayjs();
    
    let shippingDate = todayDate.add(option.shippingDays, "days");
    
    let shippingPrice = option.priceCents === 0
     ?  "Free Shipping"
      : `$${convertCurrency(option.priceCents)}`;

    let isChecked = cartItem.shippingId === option.shippingId;

    shippingHtml +=
      `  <div class="delivery-option">
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
    let matchingDiv = document.querySelector(`.js-cart-itme-container-${productId}`);
    matchingDiv.remove();
    let quantity = calculateCartQuantity();
    returnLink.innerHTML = `${quantity} items`;
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
}


renderCheckout();