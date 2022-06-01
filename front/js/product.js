// Use searchParams method for getting the id in url

let url = window.location.href;

let u = new URL(url);

let id = u.searchParams.get("id");

let itemImg = document.querySelector(".item__img");

const addProduct = function (product) {
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
};

// API call function
fetch(`http://localhost:3000/api/products/${id}`)
  .then(function (res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function (product) {
    addProduct(product);
  })
  .catch(function (err) {
    console.log("Erreur" + err);
  });

// Add to cart
const addTocart = function () {
  document.querySelector("#addToCart").addEventListener("click", function () {
    let quantityInput = document.querySelector("#quantity").value;

    let colorInput = document.getElementById("colors");
    let colorSelected = colorInput.options[colorInput.selectedIndex].value;

    console.log(colorSelected, quantityInput, id);
  });
};

addTocart();
