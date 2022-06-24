// Use searchParams method for getting the id in url
const url = window.location.href;
const u = new URL(url);
const id = u.searchParams.get("id");
// Get class .item__img
const itemImg = document.querySelector(".item__img");
// Declare an array for product information
let productInfo = [];
//Declare a variable for cart
let cart;

/**
 *DOM modification with current product
 * @param {*} product
 */
function displayCurrentProduct(product) {
  // Title of page
  document.title = product.name;

  // Image product
  const img = document.createElement("img");
  img.setAttribute("src", product.imageUrl);
  img.setAttribute("alt", product.altTxt);
  itemImg.appendChild(img);

  // Product title
  const title = document.querySelector("#title");
  title.textContent = `${product.name}`;

  //Product price
  const price = document.querySelector("#price");
  price.textContent = `${product.price}`;

  //Product description
  const description = document.querySelector("#description");
  description.textContent = `${product.description}`;

  // Product color option
  for (let i = 0; i < product.colors.length; i++) {
    const option = document.createElement("option");
    option.setAttribute("value", product.colors[i]);
    option.textContent = `${product.colors[i]}`;
    const select = document.querySelector("#colors");
    select.appendChild(option);
  }
}

// API call return promise, when fullfiled,add response in product array and call currentPoduct function
fetch(`http://localhost:3000/api/products/${id}`)
  .then(function (res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function (product) {
    productInfo = product;
    displayCurrentProduct(product);
  })
  .catch(function (err) {
    console.log("Erreur" + err);
  });

// Get card in string chain
const LSlinea = localStorage.getItem("card");
// Convert string chain in Objet
const cartJson = JSON.parse(LSlinea);

/**
 *Create the card array with LocaleStorage
 */
function createCard() {}
if (localStorage.length != 0) {
  cart = cartJson;
} else {
  cart = [];
}

createCard();

/**
 * When click on 'Ajouter au panier' button, add item to LocalStorage
 */
function addToCard() {
  document.querySelector("#addToCart").addEventListener("click", function () {
    // Get color and quantity of current product
    let quantityInputValue = document.querySelector("#quantity").value;
    const colorInput = document.getElementById("colors");
    let colorSelected = colorInput.options[colorInput.selectedIndex].value;
    let quantityInput = parseInt(quantityInputValue, 10);
    // create an objet of this product
    let article = {
      id: id,
      color: colorSelected,
      quantity: quantityInput,
      image: productInfo.imageUrl,
      imageTxt: productInfo.altTxt,
      name: productInfo.name,
    };

    //If product is already in cart
    if (article.color == "" && article.quantity == 0) {
      alert("Merci de sélectionner une couleur, ainsi que la quantité");
    } else if (article.color == "") {
      alert("Merci de choisir une couleur");
    } else if (article.quantity == 0) {
      alert("Merci d'indiquer une quantité");
    } else if (cart.length == 0) {
      cart.push(article);
    } else if (cart.length >= 1) {
      const sameColorItem = cart.find((test) => test.color == article.color);
      const sameIdItem = cart.find((test2) => test2.id == article.id);
      if (sameIdItem == undefined && sameColorItem == undefined) {
        cart.push(article);
      } else if (sameIdItem != undefined && sameColorItem == undefined) {
        let index = cart.indexOf(sameIdItem) + 1;
        cart.splice(index, 0, article);
      } else if (sameIdItem != undefined && sameColorItem != undefined) {
        sameColorItem.quantity += article.quantity;
      }
    }
    //See the cart in console
    console.log("current cart: ", cart);
    // Stringify object of cart
    const cartLinea = JSON.stringify(cart);
    // Add cart to LocaleStorage
    localStorage.setItem("card", cartLinea);
  });
}

console.log("current cart: ", cart);
addToCard();
