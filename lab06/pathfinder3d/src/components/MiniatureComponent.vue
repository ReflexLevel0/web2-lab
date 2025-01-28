<script>
import { useCartStore } from "../stores/cart.js";

export default {
  data() {
    return {
      cartStore: useCartStore(),
    };
  },
  props: {
    name: String,
    price: Number,
    imageUrl: String,
  },
  methods: {
    addToCart() {
      this.$data.cartStore.addToCart(
        this.$props.name,
        this.$props.price,
        this.$props.imageUrl
      );
    },
  },
};
</script>

<template>
  <div class="miniature-root">
    <h3>{{ this.$props.name }}</h3>
    <img :src="this.$props.imageUrl" />
    <div class="miniature-price-display">
      <div>{{ this.$props.price }}€</div>
      <button class="cartBtn" @click="addToCart()">🛒</button>
    </div>
  </div>
</template>

<style scoped>
.miniature-root {
  display: flex;
  flex-direction: column;
  width: 200px;
}

.miniature-root > img {
  width: 100%;
}

.miniature-price-display {
  display: flex;
  justify-content: space-between;
}

.miniature-price-display > div {
  font-size: 1.1rem;
}

.cartBtn {
  background: transparent;
  border-color: transparent;
  font-size: 1.3rem;
}
</style>
