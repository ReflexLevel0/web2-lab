<script>
import { RouterLink, RouterView } from 'vue-router'
import { useCartStore } from './stores/cart.js'

export default {
  data() {
    return {
      cartStore: useCartStore(),
    }
  },
  components: {
    RouterLink,
    RouterView,
  },
  computed: {
    itemCount() {
      return this.$data.cartStore.itemCount == 0 ? '' : ` (${this.$data.cartStore.itemCount})`
    },
  },
}
</script>

<template>
  <header>
    <div class="wrapper">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/cart">Cart{{ itemCount }}</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav {
  text-align: left;
  margin-left: -1rem;
  font-size: 1rem;

  padding: 1rem 0;
  margin-top: 1rem;
}
</style>
