export let cart = JSON.parse(localStorage.getItem("cart"));

if(!cart){
cart = [];
}


export function saveToStorage(){
  localStorage.setItem("cart",JSON.stringify(cart));
}

export function addToCart(productId,quantity){
let matchingItem;

cart.forEach(cartItem => {
  if (cartItem.productId === productId) {
    matchingItem = cartItem;
  }
})

if (matchingItem) {
  matchingItem.quantity += quantity;
} else {
  cart.push({
    productId,
    quantity
  });
};

saveToStorage();
};

export function removeFromCart(productId){
  const newCart = [];

  cart.forEach(cartItem => {
    if(cartItem.productId !== productId){
      newCart.push(cartItem);
    }
  })

  cart = newCart;
  saveToStorage();
}

export function calculateCartQuantity(){
let quantity = 0;

cart.forEach(cartItems => {
  quantity += cartItems.quantity;
})
return quantity;
};