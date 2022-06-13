// Use searchParams method for getting the id in url
let url = window.location.href;
let u = new URL(url);
let id = u.searchParams.get("orderId");

let orderId = (document.querySelector("#orderId").textContent = id);
