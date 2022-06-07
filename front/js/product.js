// Use searchParams method for getting the id in url
let url = window.location.href;
let u = new URL(url);
let id = u.searchParams.get("id");
let itemImg = document.querySelector(".item__img");

/**
 *DOM modification with current product
 *
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

// API call return promise, when fulffiled call currentPoduct function
fetch(`http://localhost:3000/api/products/${id}`)
  .then(function (res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function (product) {
    currentProduct(product);
  })
  .catch(function (err) {
    console.log("Erreur" + err);
  });

/**
 *
 *
 */
function addToCard() {
  document.querySelector("#addToCart").addEventListener("click", function () {
    // Get color and quantity
    let quantityInputValue = document.querySelector("#quantity").value;
    let colorInput = document.getElementById("colors");
    let colorSelected = colorInput.options[colorInput.selectedIndex].value;
    let quantityInput = parseInt(quantityInputValue, 10);
    // create an objet of this
    let article = {
      id: id,
      color: colorSelected,
      quantity: quantityInput,
    };

    if (panier.length == 0) {
      panier.push(article);
    } else if (panier.length >= 1) {
      const testColor = panier.find((test) => test.color == article.color);
      console.log(testColor);
      const testId = panier.find((test2) => test2.id == article.id);
      console.log(testId);
      if (testId == undefined || testColor == undefined) {
        panier.push(article);
      } else if (testId != undefined && testColor != undefined) {
        testColor.quantity += article.quantity;
      }
    }

    console.log(panier);
  });
}
let panier = [];
addToCard();

/* LORSQU'ON clique sur ajouter au panier
    Si l'artile n'est pas présent dans le panier
    ALORS on ajoute l'article au panier
    Sinon si la couleur et l'article sont présent
    ALORS on incremente sa quantite
    Sinon si l'article est déjà present
    Alors on ne l'ajoute pas */
