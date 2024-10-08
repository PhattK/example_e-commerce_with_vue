import { defineStore } from "pinia";

export const useCartStore = defineStore('cart', {
    state: () => ({
        items: [],
        checkout: {}
    }),
    getters: {
        summaryPrice (state) {
            return state.items.reduce((acc, item) => acc + (item.price * item.quantity), 0)
        },
        summaryQuantity (state) {
            return state.items.reduce((acc, item) => acc + item.quantity, 0)
        }
    },
    actions: {
        loadCart () {
            const cartItem = localStorage.getItem('cart-item')
            if (cartItem) {
                this.items = JSON.parse(cartItem)
            }
        },
        addToCart (productData) {
            const itemIndex = this.items.findIndex(
                item => item.name === productData.name
            )
            if (itemIndex >= 0) {
                this.updateQuantity(itemIndex, this.items[itemIndex].quantity + 1)
            } else {
                productData.quantity = 1
                this.items.push(productData)
            }
            localStorage.setItem('cart-item', JSON.stringify(this.items))
        },
        updateQuantity (index, quantity) {
            this.items[index].quantity = quantity
            localStorage.setItem('cart-item', JSON.stringify(this.items))
        },
        removeItemInCart (index) {
            this.items.splice(index, 1)
            localStorage.setItem('cart-item', JSON.stringify(this.items))
        },
        placeorder (userData) {
            const orderData = {
                ...userData,
                totalPrice: this.summaryPrice,
                paymentMethod: 'Credit Card',
                createdDate: (new Date()).toLocaleString(),
                orderNumber: `AA${Math.floor((Math.random() * 90000) + 10000)}`,
                products: this.items
            }
            localStorage.setItem('order-data', JSON.stringify(orderData))
        },
        loadCheckout () {
            const orderData = localStorage.getItem('order-data')
            if (orderData) {
                this.checkout = JSON.parse(orderData)
            }
        }
    }
})