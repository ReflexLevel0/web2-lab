<script>
import { useCartStore } from '../stores/cart.js'
import { Notivue, Notification, push } from 'notivue'

export default {
  data() {
    return {
      terms_and_conditions: false,
      cartStore: useCartStore(),
    }
  },
  methods: {
    incrementItem(miniatureName) {
      this.$data.cartStore.addToCart(miniatureName)
    },
    decrementItem(miniatureName) {
      this.$data.cartStore.removeFromCart(miniatureName)
    },
    purchaseItems() {
      let itemCount = this.$data.cartStore.itemCount
      this.$data.cartStore.items = {}
      push.success(`Purchased ${itemCount} minis!`)
    },
  },
  components: {
    Notivue,
    Notification,
  },
  watch: {
    terms_and_conditions: (value) => {
      let purchaseBtn = document.getElementById('purchase')

      if (value == true) {
        purchaseBtn.removeAttribute('disabled')
        return
      }

      purchaseBtn.setAttribute('disabled', 'true')
    },
  },
  computed: {
    totalPrice() {
      let price = 0
      let items = this.$data.cartStore.items
      Object.keys(items).forEach((key) => {
        price += items[key].count * items[key].price
      })
      return price.toFixed(2)
    },
  },
}
</script>

<template>
  <div>
    <!--Used for displaying notifications-->
    <Notivue v-slot="item">
      <Notification :item="item" />
    </Notivue>

    <!--Displaying "No items in cart" text if cart is empty-->
    <h2 v-if="Object.keys(cartStore.items).length == 0">No items in cart</h2>

    <div v-else class="cart">
      <!--All items in the cart-->
      <div class="cart-content">
        <!--Column 1: list of names-->
        <div class="cart-name-list">
          <div v-for="name in Object.keys(cartStore.items)" :key="name">
            <div>{{ name }}</div>
          </div>
        </div>

        <!--Column 2: list of amounts-->
        <div class="cart-amount-list">
          <div class="item-amount" v-for="name in Object.keys(cartStore.items)" :key="name">
            <button class="amount-button" @click="decrementItem(name)">-</button>
            <div>{{ cartStore.items[name].count }}</div>
            <button class="amount-button" @click="incrementItem(name)">+</button>
          </div>
        </div>
      </div>

      <!--Purchasing minis-->
      <div>
        <h2>Total price: {{ totalPrice }}€</h2>
        <div style="display: flex; flex-direction: row">
          <input v-model="terms_and_conditions" type="checkbox" />
          <label for="terms-and-conditions">I accept the terms and conditions</label>
        </div>
        <button id="purchase" disabled @click="purchaseItems()">Purchase</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cart {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.cart-content {
  display: flex;
  flex-direction: row;
}
.cart-name-list,
.cart-amount-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.item-amount {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 1rem;
  margin-left: 3rem;
}
.amount-button {
  width: 1.5rem;
  border-radius: 50%;
}
label {
  margin-left: 0.5rem;
}
</style>
