const items = document.getElementById('items')


// Function to add item 
const createItem = function(products){
    for(let i = 0; i < products.length; i++){

        const item = document.createElement('a')

        item.innerHTML = `
        <article>
        <img src="${products[i].imageUrl}" alt="${products[i].altTxt}">
        <h3 class="productName">${products[i].name}</h3>
        <p class="productDescription">${products[i].description}.</p>
        </article>`
        item.setAttribute('href', `./product.html?id=${products[i]._id}`)

        items.appendChild(item)
}
}
// API call function
fetch('http://localhost:3000/api/products')
    .then(function(res){
        if(res.ok){
            return res.json();
        }
    })
    .then(function(products){
            createItem(products)           
        }
        
    )
    .catch(function(err){
        console.log("Erreur" +  err)
    })

createItem(products)

