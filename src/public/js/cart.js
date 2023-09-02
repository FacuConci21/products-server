async function fetchCartById(params) {
  const cartIdInput = document.getElementById("cartId");
  const cartId = cartIdInput.value;

  console.log("Fetching cart ...");

  const response = await fetch(`/api/carts/${cartId}`);
  const data = await response.json();

  if (data.payload) {
    console.log("Cart fetched.");
  } else {
    console.error(data);
  }
}

fetchCartById();
