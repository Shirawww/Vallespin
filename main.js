document.addEventListener("DOMContentLoaded", function() {
    if (document.body.classList.contains('products-page')) {
        initializeProductsPage();
    } else if (document.body.classList.contains('cart-page')) {
        initializeCartPage();
    }
});

function initializeProductsPage() {
    var addCartButtons = document.getElementsByClassName("add-cart");
    for (var i = 0; i < addCartButtons.length; i++) {
        var button = addCartButtons[i];
        button.addEventListener("click", addCartClicked);
    }

    var quantityInputs = document.getElementsByClassName("cart-quantity");
    for (var i = 0; i < quantityInputs.length; i++) {
        var input = quantityInputs[i];
        input.addEventListener("change", updateCartQuantity);
    }
}

function addCartClicked(event) {
    var button = event.target;
    var shopProduct = button.parentElement;
    var id = shopProduct.getAttribute("data-id");
    var title = shopProduct.getElementsByClassName("product-title")[0].innerText;
    var price = shopProduct.getElementsByClassName("price")[0].innerText;
    var productIMG = shopProduct.getElementsByClassName("product-img")[0].src;
    var quantity = shopProduct.getElementsByClassName("cart-quantity")[0].value;

    addProductToCart(id, title, price, productIMG, quantity);

    // Hide the "Add to Cart" button
    button.style.display = 'none';
}

function addProductToCart(id, title, price, productIMG, quantity) {
    var cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    var existingItem = cartItems.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity += parseInt(quantity);
    } else {
        cartItems.push({ id, title, price, productIMG, quantity: parseInt(quantity) });
    }

    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    alert("Product added to cart");
}

function updateCartQuantity(event) {
    var input = event.target;
    var shopProduct = input.parentElement;
    var id = shopProduct.getAttribute("data-id");
    var cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    var existingItem = cartItems.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity = parseInt(input.value);
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
        updatetotal();
    }
}

function initializeCartPage() {
    loadCartItems();

    var removeCartButtons = document.getElementsByClassName("remove-btn");
    for (var i = 0; i < removeCartButtons.length; i++) {
        var button = removeCartButtons[i];
        button.addEventListener("click", removeCartItem);
    }
    
    var quantityInputs = document.getElementsByClassName("cart-quantity");
    for (var i = 0; i < quantityInputs.length; i++) {
        var input = quantityInputs[i];
        input.addEventListener("change", quantityChanged);
    }
    
    document.getElementsByClassName("checkout-btn")[0].addEventListener("click", buyButtonClicked);
}

function loadCartItems() {
    var cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    var cartContent = document.getElementsByClassName("cart-content")[0];
    cartContent.innerHTML = '';
    cartItems.forEach(item => {
        var cartShopBox = document.createElement("div");
        cartShopBox.classList.add("cart-box");
        var cartBoxContent = `
            <img src="${item.productIMG}" class="cart-img">
            <div class="item-details">
                <div class="cart-product-title">${item.title}</div>
                <div class="cart-price">${item.price}</div>
                <p>Quantity: <input type="number" value="${item.quantity}" min="1" class="cart-quantity" data-id="${item.id}">
            </div>
            <button class="remove-btn">Remove</button>`;
        cartShopBox.innerHTML = cartBoxContent;
        cartContent.append(cartShopBox);
        cartShopBox.getElementsByClassName("remove-btn")[0].addEventListener("click", removeCartItem);
        cartShopBox.getElementsByClassName("cart-quantity")[0].addEventListener("change", quantityChanged);
    });
    updatetotal();
}

function buyButtonClicked() {
    if (confirm("Are you sure you want to purchase these items?")) {
        alert("You have successfully placed your order!");
        localStorage.removeItem("cartItems");
        var cartContent = document.getElementsByClassName("cart-content")[0];
        while (cartContent.hasChildNodes()) {
            cartContent.removeChild(cartContent.firstChild);
        }
    }
    updatetotal();
}

function removeCartItem(event) {
    var buttonClicked = event.target;
    var title = buttonClicked.parentElement.getElementsByClassName("cart-product-title")[0].innerText;
    var cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    cartItems = cartItems.filter(item => item.title !== title);
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    buttonClicked.parentElement.remove();
    updatetotal();
}

function quantityChanged(event) {
    var input = event.target;
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1;
    }
    var id = input.getAttribute("data-id");
    var cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    for (var i = 0; i < cartItems.length; i++) {
        if (cartItems[i].id === id) {
            cartItems[i].quantity = parseInt(input.value);
            break;
        }
    }
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    updatetotal();
}

function updatetotal() {
    var cartContent = document.getElementsByClassName("cart-content")[0];
    var cartBoxes = cartContent.getElementsByClassName("cart-box");
    var total = 0;
    for (var i = 0; i < cartBoxes.length; i++) {
        var cartBox = cartBoxes[i];
        var priceElement = cartBox.getElementsByClassName("cart-price")[0];
        var quantityElement = cartBox.getElementsByClassName("cart-quantity")[0];
        var price = parseFloat(priceElement.innerText.replace("₱", ""));
        var quantity = quantityElement.value;
        total += price * quantity;
    }
    total = Math.round(total * 100) / 100;
    document.getElementsByClassName("total-price")[0].innerText = "₱" + total;
}


//contact page
document.getElementById("submit-btn").addEventListener("click", function() {
    var name = document.getElementById("name").value.trim();
    var email = document.getElementById("email").value.trim();
    var message = document.getElementById("message").value.trim();

    if (name === "" || email === "" || message === "") {
        alert("Please fill in all fields");
    } else {
        alert("Thank you for your feedback. Our team will work on the problem as soon as we can.");
    }
});