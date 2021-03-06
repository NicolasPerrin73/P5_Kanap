/***************** CART SECTION *****************/

console.log("current local Storage: ", localStorage);
// Get card in string chain
let LSlinea = localStorage.getItem("card");
// Convert string chain in Objet
let cart = JSON.parse(LSlinea);
// See cart in console
console.log("current cart: ", cart);

const cartItems = document.querySelector("#cart__items");

/**
 * Display each item in cart on page
 */
function displayCart() {
  //Create article for each item in cart
  for (i = 0; i < cart.length; i++) {
    // Create article
    const cardItem = document.createElement("article");
    cardItem.classList.add("cart__item");
    cardItem.dataset.id = `${cart[i].id}`;
    cardItem.dataset.color = `${cart[i].color}`;
    cartItems.appendChild(cardItem);
    // Create image
    const cartItemImg = document.createElement("div");
    cartItemImg.classList.add("cart__item__img");
    cardItem.appendChild(cartItemImg);
    const image = document.createElement("img");
    image.setAttribute("src", cart[i].image);
    image.setAttribute("alt", cart[i].imageTxt);
    cartItemImg.appendChild(image);
    // Create cart item content
    const cardItemContent = document.createElement("div");
    cardItemContent.classList.add("cart__item__content");
    cardItem.appendChild(cardItemContent);
    // Create cart item content description
    const cartItemContentDescription = document.createElement("div");
    cartItemContentDescription.classList.add(
      "cart__item__content__description"
    );
    cardItemContent.appendChild(cartItemContentDescription);
    // Create product name
    const h2 = document.createElement("h2");
    h2.textContent = cart[i].name;
    cartItemContentDescription.appendChild(h2);
    // Create product color
    const pColor = document.createElement("p");
    pColor.textContent = cart[i].color;
    cartItemContentDescription.appendChild(pColor);
    //Create product price
    fetch(`http://localhost:3000/api/products/${cart[i].id}`)
      .then(function (res) {
        if (res.ok) {
          return res.json();
        }
      })
      .then(function (product) {
        const pPrice = document.createElement("p");
        pPrice.textContent = product.price + "???";
        cartItemContentDescription.appendChild(pPrice);
      })
      .catch(function (err) {
        console.log("Erreur: " + err);
      });
    /**/
    // Create cart item content settings
    const cartItemContentSettings = document.createElement("div");
    cartItemContentSettings.classList.add("cart__item__content__settings");
    cardItemContent.appendChild(cartItemContentSettings);
    //Create cart item content settings quantity
    const cartItemContentSettingsQuantity = document.createElement("div");
    cartItemContentSettingsQuantity.classList.add(
      "cart__item__content__settings__quantity"
    );
    cartItemContentSettings.appendChild(cartItemContentSettingsQuantity);
    // Create quantity text
    const pQuantity = document.createElement("p");
    pQuantity.textContent = "Qt?? : ";
    cartItemContentSettingsQuantity.appendChild(pQuantity);
    // Create quantity input
    const inputQuantity = document.createElement("input");
    inputQuantity.classList.add("itemQuantity");
    inputQuantity.setAttribute("type", "number");
    inputQuantity.setAttribute("name", "itemQuantity");
    inputQuantity.setAttribute("min", "1");
    inputQuantity.setAttribute("max", "100");
    inputQuantity.setAttribute("value", cart[i].quantity);
    cartItemContentSettingsQuantity.appendChild(inputQuantity);
    // Create delete text
    const cartItemContentSettingsDelete = document.createElement("div");
    cartItemContentSettingsDelete.classList.add(
      "cart__item__content__settings__delete"
    );
    cartItemContentSettings.appendChild(cartItemContentSettingsDelete);
    const pDelete = document.createElement("p");
    pDelete.textContent = "Supprimer";
    pDelete.classList.add("deleteItem");
    cartItemContentSettingsDelete.appendChild(pDelete);
  }
}

// No error in console if cart is empty
if (cart != null) {
  displayCart();
}

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

// Display 0 article if cart is emply, else call totalQuantity function
if (cart == null) {
  const spanTotalQuantity = document.querySelector("#totalQuantity");
  spanTotalQuantity.textContent = "0";
} else {
  totalQuantity();
}

// Initialize price Array
let priceArray = [];

/**
 * Calculate the total price of product in cart and display it
 */
function calculateTotalPrice() {
  const initialValue = 0;
  const total = priceArray.reduce(
    (previousValue, currentValue) => previousValue + currentValue,
    initialValue
  );
  const spanTotalPrice = document.querySelector("#totalPrice");
  spanTotalPrice.textContent = total;
}

/**
 * Get price of each product from API, push it and multiply it with quantity
 * on price Array, then call calculateTotalPrice function
 */
async function getTotalPrice() {
  if (cart == null || cart.length == 0) {
    const spanTotalPrice = document.querySelector("#totalPrice");
    spanTotalPrice.textContent = "0";
  } else {
    for (i = 0; i < cart.length; i++) {
      await fetch(`http://localhost:3000/api/products/${cart[i].id}`)
        .then(function (res) {
          if (res.ok) {
            return res.json();
          }
        })
        .then(function (product) {
          priceArray.push(product.price * cart[i].quantity);
          calculateTotalPrice();
        })
        .catch(function (err) {
          console.log("Erreur: " + err);
        });
    }
  }
}

getTotalPrice();

/**
 * Listen quantity changes of each product, add it to localStorage and recalculate total
 * price and quantity
 */
function getQuantityChange() {
  // Add all input in Array
  const allQuantityInput = document.querySelectorAll(".itemQuantity");
  // For each input of Array listen changes
  allQuantityInput.forEach(function (input) {
    input.addEventListener("change", function () {
      // Get the id and color of the input
      const inputElement = input.closest("article");
      const dataId = inputElement.dataset.id;
      const color = inputElement.dataset.color;
      // Get the quantity value in number type of the input
      let quantityInputValue = input.value;
      let quantityInput = parseInt(quantityInputValue, 10);
      // Find the same product in cart to modify the quantity
      const sameColorItem = cart.find((test) => test.color == color);
      const sameIdItem = cart.find((test2) => test2.id == dataId);
      if (sameIdItem != undefined && sameColorItem != undefined) {
        sameColorItem.quantity = quantityInput;
      }
      // Put the cart in LocalStorage
      const cartLinea = JSON.stringify(cart);
      localStorage.setItem("card", cartLinea);
      // Call the function to calculate and display
      totalQuantity();
      priceArray = [];
      getTotalPrice();
      console.log("current cart: ", cart);
    });
  });
}

getQuantityChange();

/**
 * Listen click on "Supprimer" text of each product,
 * remove the product of cart, local storage and
 * call functions to display cart
 */
function deleteItem() {
  // Add all delete text in Array
  const allDeleteText = document.querySelectorAll(".deleteItem");
  // For each text of Array listen click
  allDeleteText.forEach(function (text) {
    text.addEventListener("click", function () {
      // Get the id and color of product
      let textElement = text.closest("article");
      let dataId = textElement.dataset.id;
      let color = textElement.dataset.color;
      // Set the cart without deleted product
      cart = cart.filter((item) => item.id != dataId || item.color != color);
      // Add it to local Storage
      let cartLinea = JSON.stringify(cart);
      localStorage.setItem("card", cartLinea);
      // Reset the cart display
      cartItems.innerHTML = "";
      // Call functions to display current cart
      displayCart();
      totalQuantity();
      priceArray = [];
      getTotalPrice();
      getQuantityChange();
      // Recursive function
      deleteItem();
      // See cart changes in console
      console.log("current cart: ", cart);
    });
  });
}

deleteItem();

/***************** FORM SECTION *****************/

// Get fist name input & error message
const firstNameInput = document.querySelector("#firstName");
const firstNameErrorMsg = document.querySelector("#firstNameErrorMsg");
// Get last name input & error message
const lastNameInput = document.querySelector("#lastName");
const lastNameErrorMsg = document.querySelector("#lastNameErrorMsg");
// Get adress input & error message
const addressInput = document.querySelector("#address");
const addressErrorMsg = document.querySelector("#addressErrorMsg");
// Get city input & error message
const citytInput = document.querySelector("#city");
const cityErrorMsg = document.querySelector("#cityErrorMsg");
// Get email input & error message
const emailInput = document.querySelector("#email");
const emailErrorMsg = document.querySelector("#emailErrorMsg");
// Regular expression for form validation
// Name without number and special characters
const RegExpName = /^((?![0-9&"{}()[\]\|`_^@=+\$%??\*!??:\/;.,\?<>~]).)*$/;
// Adress without special characters
const RegExpAdress = /^((?![&"{}()[\]\|`_^@=+\$%??\*!??:\/;.,\?<>~]).)*$/;
// Valid email syntax
const RegExpEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
// Variables for RegExp test
let testFirstName = false;
let testLastName = false;
let testAddress = false;
let testCity = false;
let testEmail = false;
// Variable for form with all input passed RegExp test
let formValid = false;

/**
 * Listen the event change on first name to test the RexExp rules
 */
function validFirstName() {
  firstNameInput.addEventListener("change", function () {
    testFirstName = RegExpName.test(firstNameInput.value);
    if (firstNameInput.value == "") {
      testFirstName = false;
    } else if (testFirstName == false) {
      firstNameErrorMsg.textContent =
        "Pr??nom invalide, ne doit pas contenir de chiffre ou de caract??res sp??ciaux";
    } else if (testFirstName == true) {
      firstNameErrorMsg.textContent = "";
    }
  });
}

/**
 * Listen the event change on last name to test the RexExp rules
 */
function validLastName() {
  lastNameInput.addEventListener("change", function () {
    testLastName = RegExpName.test(lastNameInput.value);
    if (lastNameInput.value == "") {
      testLastName = false;
    } else if (testLastName == false) {
      lastNameErrorMsg.textContent =
        "Nom invalide, ne doit pas contenir de chiffre ou de caract??res sp??ciaux";
    } else if (testLastName == true) {
      lastNameErrorMsg.textContent = "";
    }
  });
}

/**
 * Listen the event change on address to test the RexExp rules
 */
function validAdress() {
  addressInput.addEventListener("change", function () {
    testAddress = RegExpAdress.test(addressInput.value);
    if (addressInput.value == "") {
      testAddress = false;
    } else if (testAddress == false) {
      addressErrorMsg.textContent =
        "Adresse invalide, ne doit pas de caract??res sp??ciaux";
    } else if (testAddress == true) {
      addressErrorMsg.textContent = "";
    }
  });
}

/**
 * Listen the event change on city to test the RexExp rules
 */
function validCity() {
  citytInput.addEventListener("change", function () {
    testCity = RegExpName.test(citytInput.value);
    if (citytInput.value == "") {
      testCity = false;
    } else if (testCity == false) {
      cityErrorMsg.textContent =
        "Ville invalide, ne doit pas contenir de chiffre ou de caract??res sp??ciaux";
    } else if (testCity == true) {
      cityErrorMsg.textContent = "";
    }
  });
}

/**
 * Listen the event change on email to test the RexExp rules
 */
function validEmail() {
  emailInput.addEventListener("input", function () {
    testEmail = RegExpEmail.test(emailInput.value);
    if (emailInput.value == "") {
      testEmail = false;
      emailErrorMsg.textContent = "";
    } else if (testEmail == false) {
      emailErrorMsg.textContent = "Email invalide";
    } else if (testEmail == true) {
      emailErrorMsg.textContent = "";
    }
  });
}

// Verify users input
validFirstName();
validLastName();
validAdress();
validCity();
validEmail();

// Get the "Commander!" button
const order = document.querySelector("#order");

/**
 * Change the boolean variable formValid if all inputs passed RegExp rules
 */
function validForm() {
  if (
    testFirstName === true &&
    testLastName === true &&
    testAddress === true &&
    testCity === true &&
    testEmail === true
  ) {
    formValid = true;
  } else {
    formValid = false;
  }
}

// Declare the variable for use it in another function
let contact;

/**
 * Create an object with all user information of form
 */
function getContactInformation() {
  contact = {
    firstName: firstNameInput.value,
    lastName: lastNameInput.value,
    address: addressInput.value,
    city: citytInput.value,
    email: emailInput.value,
  };
}

// Array for all products ID in cart
let productId = [];

/**
 * Push all products id in cart in the array
 */
function getProductIDArray() {
  productId = [];
  for (i = 0; i < cart.length; i++) {
    productId.push(cart[i].id);
  }
}

/**
 * Listen the click event on "Commander!" button
 * send user information to API with product id array
 * got confirmation page with order number
 */
function getOrder() {
  order.addEventListener("click", function (e) {
    e.preventDefault();
    validForm();
    if (formValid == true && cart.length >= 1) {
      getContactInformation();
      getProductIDArray();

      let orderInformation = {
        contact: contact,
        products: productId,
      };

      fetch("http://localhost:3000/api/products/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderInformation),
      })
        .then(function (res) {
          if (res.ok) {
            return res.json();
          }
        })
        .then(function (data) {
          location.href = `./confirmation.html?orderId=${data.orderId}`;
        })
        .catch(function (err) {
          console.log(err);
        });
    } else if (formValid == false) {
      alert("Le formulaire n'est pas valide");
    } else if (cart.length == 0) {
      alert("Le panier est vide");
    }
  });
}

getOrder();
