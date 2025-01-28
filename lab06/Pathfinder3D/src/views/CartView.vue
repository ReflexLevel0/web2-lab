<script>
import Cart from '../components/Cart.vue'

export default {
  components: {
    Cart,
  },
  methods: {
    redirectToHome() {
      this.$router.push({ path: '/' })
    },
  },
}
</script>

<template>
  <Cart @onItemsPurchased="redirectToHome()" />
</template>
