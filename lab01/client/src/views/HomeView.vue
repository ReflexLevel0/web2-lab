<script lang="ts">
import { useAuth0 } from '@auth0/auth0-vue'
import InlineMessage from 'primevue/inlinemessage'
import axios from 'axios'

export default {
  data() {
    return {
      isAuthenticated: this.$auth0.isAuthenticated,
      ticketCount: undefined
    }
  },

  // Getting number of generated tickets on mount
  mounted() {
    axios.get(`${import.meta.env.VITE_SERVER_URL}/ticket/count`)
      .then((res) => {
        this.$data.ticketCount = res.data
      })
  },
  components: {
    InlineMessage
  }
}
</script>

<template>
  <h1>Generated tickets: {{ ticketCount === undefined ? "loading..." : ticketCount }}</h1>
  <div class="login-warning">
    <InlineMessage v-if="isAuthenticated === false" severity="warn">Log in to buy a ticket!</InlineMessage>
  </div>
</template>

<style scoped>
.login-warning {
  width: 100wv;
  display: flex;
  justify-content: space-around;
}
</style>
