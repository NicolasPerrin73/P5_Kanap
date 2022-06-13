/***************** CART SECTION *****************/

console.log("current local Storage: ", localStorage);
// Get card in string chain
let LSlinea = localStorage.getItem("card");
// Convert string chain in Objet
let cart = JSON.parse(LSlinea);
// See cart in console
console.log("current cart: ", cart);

let cartItems = document.querySelector("#cart__items");

/**
 * Display each item in cart on page
 */
function displayCart() {
  //Create article for each item in cart
  for (i = 0; i < cart.length; i++) {
    // Create article
    let cardItem = document.createElement("article");
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
    fetch(`http://localhost:3000/api/products/${cart[i].id}`)
      .then(function (res) {
        if (res.ok) {
          return res.json();
        }
      })
      .then(function (product) {
        let pPrice = document.createElement("p");
        pPrice.textContent = product.price + "€";
        cartItemContentDescription.appendChild(pPrice);
      })
      .catch(function (err) {
        console.log("Erreur: " + err);
      });
    /**/
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
  let spanTotalQuantity = document.querySelector("#totalQuantity");
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
  let spanTotalPrice = document.querySelector("#totalPrice");
  spanTotalPrice.textContent = total;
}

/**
 * Get price of each product from API, push it and multiply it with quantity
 * on price Array, then call calculateTotalPrice function
 */
async function getTotalPrice() {
  if (cart == null || cart.length == 0) {
    let spanTotalPrice = document.querySelector("#totalPrice");
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
  console.log("price Array: ", priceArray);
}

getTotalPrice();

/**
 * Listen quantity changes of each product, add it to localStorage and recalculate total
 * price and quantity
 */
function getQuantityChange() {
  // Add all input in Array
  let allQuantityInput = document.querySelectorAll(".itemQuantity");
  // For each input of Array listen changes
  allQuantityInput.forEach(function (input) {
    input.addEventListener("change", function () {
      // Get the id and color of the input
      let inputElement = input.closest("article");
      let dataId = inputElement.dataset.id;
      let color = inputElement.dataset.color;
      // Get the quantity value in number type of the input
      let quantityInputValue = input.value;
      let quantityInput = parseInt(quantityInputValue, 10);
      // Find the same product in cart to modify the quantity
      const testColor = cart.find((test) => test.color == color);
      const testId = cart.find((test2) => test2.id == dataId);
      if (testId != undefined && testColor != undefined) {
        testColor.quantity = quantityInput;
      }
      // Put the cart in LocalStorage
      let cartLinea = JSON.stringify(cart);
      localStorage.setItem("card", cartLinea);
      // Call the function to calculate and display
      totalQuantity();
      priceArray = [];
      getTotalPrice();
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
  let allDeleteText = document.querySelectorAll(".deleteItem");
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
      console.log("cart after deleted product: ", cart);
      console.log("local storage after deleted product: ", localStorage);
    });
  });
}

deleteItem();

/***************** FORM SECTION *****************/

// Get fist name input & error message
let firstNameInput = document.querySelector("#firstName");
let firstNameErrorMsg = document.querySelector("#firstNameErrorMsg");
// Get last name input & error message
let lastNameInput = document.querySelector("#lastName");
let lastNameErrorMsg = document.querySelector("#lastNameErrorMsg");
// Get adress input & error message
let addressInput = document.querySelector("#address");
let addressErrorMsg = document.querySelector("#addressErrorMsg");
// Get city input & error message
let citytInput = document.querySelector("#city");
let cityErrorMsg = document.querySelector("#cityErrorMsg");
// Get email input & error message
let emailInput = document.querySelector("#email");
let emailErrorMsg = document.querySelector("#emailErrorMsg");
// Regular expression for form validation
// Name without number and special characters
let RegExpName = /^((?![0-9&"{}()[\]\|`_^@=+\$%µ\*!§:\/;.,\?<>~]).)*$/;
// Adress without special characters
let RegExpAdress = /^((?![&"{}()[\]\|`_^@=+\$%µ\*!§:\/;.,\?<>~]).)*$/;
// Valid email syntax
let RegExpEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
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
        "Prénom invalide, ne doit pas contenir de chiffre ou de caractères spéciaux";
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
        "Nom invalide, ne doit pas contenir de chiffre ou de caractères spéciaux";
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
        "Adresse invalide, ne doit pas de caractères spéciaux";
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
        "Ville invalide, ne doit pas contenir de chiffre ou de caractères spéciaux";
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
let order = document.querySelector("#order");


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
      console.log(contact);
      console.log(productId);
      let orderInformation = {
        contact: contact,
        products: productId,
      };
      console.log(orderInformation);

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
          console.log(data.orderId);
          location.href = `/front/html/confirmation.html?orderId=${data.orderId}`;
        })
        .catch(function (err) {
          console.log(err);
        });
    } else if (formValid == false) {
      console.log("form not ok");
    } else if (cart.length == 0){
      console.log('empty cart')
    }
  });
}

getOrder();
