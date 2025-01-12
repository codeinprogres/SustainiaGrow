document.addEventListener("DOMContentLoaded", () => {
    const cart = [];
    const cartItemsContainer = document.getElementById("cart-items");
    const addToCartButtons = document.querySelectorAll(".item-add-button");
    const searchInput = document.getElementById("search-bar");

    addToCartButtons.forEach((button, index) => {
        button.addEventListener("click", () => {
            const item = {
                title: button.previousElementSibling.previousElementSibling.innerText,
                description: button.previousElementSibling.innerText,
            };

            cart.push(item);
            updateCart();
        });
    });

    function updateCart() {
        cartItemsContainer.innerHTML = "";
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = "<li>Your cart is empty!</li>";
        } else {
            cart.forEach((item, index) => {
                const listItem = document.createElement("li");
                listItem.innerHTML = `
                    <span>${item.title} - ${item.description}</span>
                    <button class="remove-item" data-index="${index}">Remove</button>
                `;
                cartItemsContainer.appendChild(listItem);
            });

            document.querySelectorAll(".remove-item").forEach((button) => {
                button.addEventListener("click", (e) => {
                    const index = e.target.dataset.index;
                    cart.splice(index, 1);
                    updateCart();
                });
            });
        }
    }

    searchInput.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase();
        const items = document.querySelectorAll(".marketplace-item");

        items.forEach(item => {
            const title = item.querySelector(".item-title").innerText.toLowerCase();
            if (title.includes(query)) {
                item.style.display = "block";
            } else {
                item.style.display = "none";
            }
        });
    });
});
