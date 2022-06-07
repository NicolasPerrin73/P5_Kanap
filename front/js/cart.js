console.log(localStorage);
// Get card in string chain
let LSlinea = localStorage.getItem("card");
// Convert string chain in Objet
let cart = JSON.parse(LSlinea);
// See cart in console
console.log(cart);

/**
 * Display each item in cart on page
 */
function displayCart() {
  //Create article for each item in cart
  for (i = 0; i < cart.length; i++) {
    // Create article
    let cardItem = document.createElement("article");
    let cartItems = document.querySelector("#cart__items");
    cardItem.classList.add("cart__item");
    cardItem.dataset.id = `${cart[i].id}`;
    cardItem.dataset.color = `${cart[i].color}`;
    cartItems.appendChild(cardItem);
    // Create image
    let cartItemImg = document.createElement("div");
    cartItemImg.classList.add("cart__item__img");
    cardItem.appendChild(cartItemImg);
    let image = document.createElement("img");
    image.setAttribute("src", cart[i].image);
    image.setAttribute("alt", cart[i].imageTxt);
    cartItemImg.appendChild(image);
    // Create cart item content
    let cardItemContent = document.createElement("div");
    cardItemContent.classList.add("cart__item__content");
    cardItem.appendChild(cardItemContent);
    // Create cart item content description
    let cartItemContentDescription = document.createElement("div");
    cartItemContentDescription.classList.add(
      "cart__item__content__description"
    );
    cardItemContent.appendChild(cartItemContentDescription);
    // Create product name
    let h2 = document.createElement("h2");
    h2.textContent = cart[i].name;
    cartItemContentDescription.appendChild(h2);
    // Create product color
    let pColor = document.createElement("p");
    pColor.textContent = cart[i].color;
    cartItemContentDescription.appendChild(pColor);
    //Create product price
    let pPrice = document.createElement("p");
    pPrice.textContent = cart[i].price + "€";
    cartItemContentDescription.appendChild(pPrice);
    // Create cart item content settings
    let cartItemContentSettings = document.createElement("div");
    cartItemContentSettings.classList.add("cart__item__content__settings");
    cardItemContent.appendChild(cartItemContentSettings);
    //Create cart item content settings quantity
    let cartItemContentSettingsQuantity = document.createElement("div");
    cartItemContentSettingsQuantity.classList.add(
      "cart__item__content__settings__quantity"
    );
    cartItemContentSettings.appendChild(cartItemContentSettingsQuantity);
    // Create quantity text
    let pQuantity = document.createElement("p");
    pQuantity.textContent = "Qté : ";
    cartItemContentSettingsQuantity.appendChild(pQuantity);
    // Create quantity input
    let inputQuantity = document.createElement("input");
    inputQuantity.classList.add("itemQuantity");
    inputQuantity.setAttribute("type", "number");
    inputQuantity.setAttribute("name", "itemQuantity");
    inputQuantity.setAttribute("min", "1");
    inputQuantity.setAttribute("max", "100");
    inputQuantity.setAttribute("value", cart[i].quantity);
    cartItemContentSettingsQuantity.appendChild(inputQuantity);
    // Create delete text
    let cartItemContentSettingsDelete = document.createElement("div");
    cartItemContentSettingsDelete.classList.add(
      "cart__item__content__settings__delete"
    );
    cartItemContentSettings.appendChild(cartItemContentSettingsDelete);
    let pDelete = document.createElement("p");
    pDelete.textContent = "Supprimer";
    pDelete.classList.add("deleteItem");
    cartItemContentSettingsDelete.appendChild(pDelete);
  }
}

displayCart();

/**
 * Calculate total quantity of products and display it
 */
function totalQuantity() {
  let cartQtyArray = [];
  for (i = 0; i < cart.length; i++) {
    cartQtyArray.push(cart[i].quantity);
  }
  const initialValue = 0;
  const total = cartQtyArray.reduce(
    (previousValue, currentValue) => previousValue + currentValue,
    initialValue
  );
  let spanTotalQuantity = document.querySelector("#totalQuantity");
  spanTotalQuantity.textContent = total;
}

totalQuantity();

/**
 * Calculate total price of products and display it
 */
function totalPrice() {
  let priceArray = [];
  for (i = 0; i < cart.length; i++) {
    priceArray.push(cart[i].price * cart[i].quantity);
  }
  const initialValue = 0;
  const total = priceArray.reduce(
    (previousValue, currentValue) => previousValue + currentValue,
    initialValue
  );
  let spanTotalPrice = document.querySelector("#totalPrice");
  spanTotalPrice.textContent = total;
}

totalPrice();
