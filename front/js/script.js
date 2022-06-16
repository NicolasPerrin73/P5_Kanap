// Get items section from DOM
const items = document.getElementById("items");

/**
 * Display products on page
 * @param {*} products
 */
function createItem(products) {
  for (let i = 0; i < products.length; i++) {
    const item = document.createElement("a");

    item.innerHTML = `
        <article>
        <img src="${products[i].imageUrl}" alt="${products[i].altTxt}">
        <h3 class="productName">${products[i].name}</h3>
        <p class="productDescription">${products[i].description}.</p>
        </article>`;
    item.setAttribute("href", `./product.html?id=${products[i]._id}`);

    items.appendChild(item);
  }
}

// API promise call function
fetch("http://localhost:3000/api/products")
  .then(function (res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function (products) {
    createItem(products);
  })
  .catch(function (err) {
    console.log("Erreur" + err);
  });

//See local Storage in console
console.log("current local Storage: ", localStorage);
