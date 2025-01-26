<script>
import { useCartStore } from '../stores/cart.js'
import { Notivue, Notification } from 'notivue'

export default {
  data() {
    return {
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
  },
  components: {
    Notivue,
    Notification,
  },
}
</script>

<template>
  <div>
    <h2 v-if="Object.keys(cartStore.items).length == 0">No items in cart</h2>
    <div v-else class="cart">
      <Notivue v-slot="item">
        <Notification :item="item" />
      </Notivue>
      <div class="cart-name-list">
        <div v-for="name in Object.keys(cartStore.items)" :key="name">
          <div>{{ name }}</div>
        </div>
      </div>
      <div class="cart-amount-list">
        <div class="item-amount" v-for="name in Object.keys(cartStore.items)" :key="name">
          <button @click="decrementItem(name)">-</button>
          <div>{{ cartStore.items[name].count }}</div>
          <button @click="incrementItem(name)">+</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cart {
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
button {
  width: 1.5rem;
  border-radius: 50%;
}
</style>
