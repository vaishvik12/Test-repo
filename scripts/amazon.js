import { products } from "../data/products.js";
import { cart, addToCart } from "../data/cart.js";


let productHtml = ``;
const product1 = '';

products.forEach((product) => {
  productHtml += `<div class="product-container">
  <div class="product-image-container">
    <img class="product-image"
      src="${product.image}">
  </div>

  <div class="product-name limit-text-to-2-lines">
      ${product.name}
  </div>

  <div class="product-rating-container">
    <img class="product-rating-stars"
      src="images/ratings/rating-${product.rating.stars * 10}.png">
    <div class="product-rating-count link-primary">
      ${product.rating.count}
    </div>
  </div>

  <div class="product-price">
      ${(product.priceCents / 100).toFixed(2)}
  </div>

  <div data-product-id = "${product.id}"
  class="product-quantity-container js-product-quantity">
    <select>
      <option selected value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
      <option value="4">4</option>
      <option value="5">5</option>
      <option value="6">6</option>
      <option value="7">7</option>
      <option value="8">8</option>
      <option value="9">9</option>
      <option value="10">10</option>
    </select>
  </div>

  <div class="product-spacer"></div>

  <div class="added-to-cart js-added-to-cart-${product.id}">
    <img src="images/icons/checkmark.png">
    Added
  </div>

  <button data-product-name = "${product.name}"
   data-product-id = "${product.id}"
  class="add-to-cart-button button-primary js-add-to-cart">
    Add to Cart
  </button>
</div>`;
});

function updateCartQuantity(){
    let cartQuantity = document.querySelector(".js-cart-quantity");

    let totalCartItems = 0;

    cart.forEach(cartItem => {
      totalCartItems += cartItem.quantity;
    });

    cartQuantity.innerHTML = totalCartItems;
};


function addedToCart(productId){
  
    let addedToCartDiv = document.querySelector(`.js-added-to-cart-${productId}`);

    addedToCartDiv.style.opacity = 1;

    if(timeoutIds[productId]){
      clearTimeout(timeoutIds[productId]);
    }

    timeoutIds[productId] = setTimeout(() => {
      addedToCartDiv.style.opacity = 0;
    },2000);

}


let grid = document.querySelector(".js-products-grid");
grid.innerHTML = productHtml;


let addToCartBttn = document.querySelectorAll(".js-add-to-cart");
let timeoutIds = {};

addToCartBttn.forEach(button => {
  button.addEventListener("click", () => {
    let {productId,productName} = button.dataset;

    let selectorDiv = document.querySelectorAll(".js-product-quantity");
    let quantity = 0;
    selectorDiv.forEach(div => {
      if (productId === div.dataset.productId) {
        let select = div.querySelector("select");
        quantity = Number(select.value);
      }
    })

    addToCart(productId,quantity);
    updateCartQuantity();
    addedToCart(productId);
    console.log(cart);
  })
})



