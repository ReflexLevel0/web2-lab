<script>
import { useCartStore } from '../stores/cart.js'

export default {
  data() {
    return {
      cartStore: useCartStore(),
    }
  },
  props: {
    name: String,
    price: Number,
    imageUrl: String,
  },
  methods: {
    addToCart() {
      this.$data.cartStore.addToCart(this.$props.name, this.$props.price)
    },
  },
}
</script>

<template>
  <div class="miniature-root">
    <h3>{{ this.$props.name }}</h3>
    <img :src="this.$props.imageUrl" />
    <div class="miniature-price-display">
      <div>{{ this.$props.price }}€</div>
      <button @click="addToCart()">🛒</button>
    </div>
  </div>
</template>

<style scoped>
.miniature-root {
  display: flex-column;
  width: 200px;
}
.miniature-root > img {
  width: 200px;
}
.miniature-price-display {
  display: flex;
  justify-content: space-between;
}
.miniature-price-display > div {
  font-size: 1.1rem;
}
button {
  background-color: transparent;
  border: none;
  font-size: 1.3rem;
}
</style>
