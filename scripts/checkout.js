import {cart, removeFromCart, calculateCartQuantity} from "../data/cart.js";
import {products} from "../data/products.js";
import {convertCurrency} from "./utils/currency.js";

let cartHtml = ``;
cart.forEach(cartItem => {
 let matchingItem;
  products.forEach(product => {
    if(cartItem.productId === product.id){
      matchingItem = product;
      return;
    };
  });

cartHtml += `
<div class="cart-item-container js-cart-itme-container-${matchingItem.id}">
  <div class="delivery-date">
    Delivery date: Wednesday, June 15
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
        <span class="update-quantity-link link-primary">
          Update
        </span>
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

      <div class="delivery-option">
        <input type="radio" class="delivery-option-input"
          name="delivery-option-${matchingItem.id}">
        <div>
          <div class="delivery-option-date">
            Tuesday, June 21
          </div>
          <div class="delivery-option-price">
            FREE Shipping
          </div>
        </div>
      </div>
      <div class="delivery-option">
        <input type="radio" checked class="delivery-option-input"
          name="delivery-option-${matchingItem.id}">
        <div>
          <div class="delivery-option-date">
            Wednesday, June 15
          </div>
          <div class="delivery-option-price">
            $4.99 - Shipping
          </div>
        </div>
      </div>
      <div class="delivery-option">
        <input type="radio" class="delivery-option-input"
          name="delivery-option-${matchingItem.id}">
        <div>
          <div class="delivery-option-date">
            Monday, June 13
          </div>
          <div class="delivery-option-price">
            $9.99 - Shipping
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
`
});


let orderSummaryDiv = document.querySelector('.js-order-summary');
orderSummaryDiv.innerHTML = cartHtml;


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