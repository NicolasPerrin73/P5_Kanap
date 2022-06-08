// Use searchParams method for getting the id in url
let url = window.location.href;
let u = new URL(url);
let id = u.searchParams.get("id");
// Get class .item__img
let itemImg = document.querySelector(".item__img");

/**
 *DOM modification with current product
 * @param {*} product
 */
function currentProduct(product) {
  // Image product
  let img = document.createElement("img");
  img.setAttribute("src", product.imageUrl);
  img.setAttribute("alt", product.altTxt);
  itemImg.appendChild(img);

  // Product title
  let title = document.querySelector("#title");
  title.textContent = `${product.name}`;

  //Product price
  let price = document.querySelector("#price");
  price.textContent = `${product.price}`;

  //Product description
  let description = document.querySelector("#description");
  description.textContent = `${product.description}`;

  // Product color option
  for (let i = 0; i < product.colors.length; i++) {
    let option = document.createElement("option");
    option.setAttribute("value", product.colors[i]);
    option.textContent = `${product.colors[i]}`;
    let select = document.querySelector("#colors");
    select.appendChild(option);
  }
}

function addProductInfo(products) {
  globalThis.productsArray = products;
}

// API call return promise, when fulffiled, call currentPoduct function
fetch(`http://localhost:3000/api/products/${id}`)
  .then(function (res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function (product) {
    currentProduct(product);
    addProductInfo(product);
  })
  .catch(function (err) {
    console.log("Erreur" + err);
  });

/**
 * When click on 'Ajouter au panier' button, add item to LocalStorage
 */
function addToCard() {
  document.querySelector("#addToCart").addEventListener("click", function () {
    // Get color and quantity of current product
    let quantityInputValue = document.querySelector("#quantity").value;
    let colorInput = document.getElementById("colors");
    let colorSelected = colorInput.options[colorInput.selectedIndex].value;
    let quantityInput = parseInt(quantityInputValue, 10);
    // create an objet of this product
    let article = {
      id: id,
      color: colorSelected,
      quantity: quantityInput,
      image: productsArray.imageUrl,
      imageTxt: productsArray.altTxt,
      name: productsArray.name,
    };

    //If product is already in cart
    if (article.color == "" && article.quantity == 0) {
      alert("Merci de sélectionner une couleur, ainsi que la quantité");
    } else if (article.color == "") {
      alert("Merci de choisir une couleur");
    } else if (cart.length == 0) {
      cart.push(article);
    } else if (cart.length >= 1) {
      const testColor = cart.find((test) => test.color == article.color);
      const testId = cart.find((test2) => test2.id == article.id);
      if (testId == undefined || testColor == undefined) {
        cart.push(article);
      } else if (testId != undefined && testColor != undefined) {
        testColor.quantity += article.quantity;
      }
    }
    //See the cart in console
    console.log(cart);
    // Stringify object of cart
    let cartLinea = JSON.stringify(cart);
    // Add cart to LocaleStorage
    localStorage.setItem("card", cartLinea);
  });
}

// Get card in string chain
let LSlinea = localStorage.getItem("card");
// Convert string chain in Objet
let cartJson = JSON.parse(LSlinea);

/**
 *Create the card array with LocaleStorage
 */
function createCard() {}
if (localStorage.length != 0) {
  window.cart = cartJson;
} else {
  window.cart = [];
}

createCard();
addToCard();
