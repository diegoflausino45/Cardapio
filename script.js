//Seleção de Elementos
const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")

let cart = []

//Abrir Modal
cartBtn.addEventListener('click', function(){
    updateCartModal()
    cartModal.style.display = "flex"
})

//Fechar Modal
cartModal.addEventListener('click', function(event){
    if(event.target === cartModal){
        cartModal.style.display = "none"
    } 
})

closeModalBtn.addEventListener('click', function(){
    cartModal.style.display = "none"
})

menu.addEventListener('click', function(event){
    let parentButton = event.target.closest(".add-to-cart-btn")

    if(parentButton){
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))
        //Adicionar no carrinho
        addToCart(name, price)
    }
})

//Função para adicionar no carrinho
function addToCart(name, price){
    const existingItem = cart.find(item => item.name === name)
    if(existingItem){
        existingItem.quantity += 1
    }else{
        cart.push({
            name, 
            price, 
            quantity: 1,
        })
    }

    updateCartModal()
}

//Função para atualizar o carrinho
function updateCartModal(){
    cartItemContainer.innerHTML = ""
    let total = 0

    cart.forEach(item => {
        const cartItemElement = document.createElement("div")

         cartItemElement.innerHTML = `
         <div class = "mb-4">
            <h1 class="font-bold">${item.name}</h1>
                <div class="flex justify-between">
                    <p>(Quantidade: ${item.quantity})</p>
                    <button class="font-bold btn remove-from-cart-btn" data-name="${item.name}">remover</button>
                </div>
            <p>R$ ${item.price.toFixed(2)}</p>
         </div>
         `
         total += item.price * item.quantity
         
         cartItemContainer.appendChild(cartItemElement)
    })
    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    })
    cartCounter.innerText = cart.length
}

//Função para remover o item do carrinho
cartItemContainer.addEventListener("click", function(event){
    if(event.target.classList.contains("remove-from-cart-btn")){
        const name = event.target.getAttribute("data-name")

        removeItemCart(name)
    }
})

function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name)

    if(index !== -1){
        const item = cart[index]

        if(item.quantity > 1){
            item.quantity -=1
            updateCartModal()
            return
        }

        cart.splice(index, 1)
        updateCartModal()
    }
}

//Acessar e validar endereço
addressInput.addEventListener("input", function(event){
    let inputValue = event.target.value

    if(inputValue !== "" || cartItemContainer === ""){
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }
})

//Finalizar Pedido
checkoutBtn.addEventListener("click", function(){
    //const isOpen = checkRestaurantOpen()
    //if(!isOpen){
    //    Toastify({
    //        text: "Ops... o restaurante está fechado!",
    //        duration: 3000,
    //        close: true,
    //        gravity: "top", // `top` or `bottom`
    //        position: "right", // `left`, `center` or `right`
    //        stopOnFocus: true, // Prevents dismissing of toast on hover
    //        style: {
    //          background: "#ef4444",
    //        },
    //        onClick: function(){} // Callback after click
    //      }).showToast();
    //return
    //}

    if(cart.length === 0) return
    if(addressInput.value === ""){
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return
    }

    //Enviar o pedido para api whats
    const cartItems = cart.map((item) => {
        return(
        `${item.name} - Quantidade:(${item.quantity}) --> Preço: R$${item.price.toFixed(2)} `
        )
    }).join(" | ")

    const menssage = encodeURIComponent(cartItems)
    const phone = "14997754810"

    window.open(`https://wa.me/${phone}?text=${menssage} | Endereço: ${addressInput.value}`, "_blank")

    cart = []
    updateCartModal()

})

// Verificar a hora e manipular o card horario
function checkRestaurantOpen(){
    const data = new Date()
    const hora = data.getHours()
    return hora >= 18 && hora < 22
    //true = restaurante está aberto
}

const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantOpen()

if(isOpen){
    spanItem.classList.remove("bg-red-500")
    spanItem.classList.add("bg-green-600")
}else{
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500")
}