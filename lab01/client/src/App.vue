<script lang="ts">
import { useAuth0 } from '@auth0/auth0-vue'
import Button from 'primevue/button'
import InlineMessage from 'primevue/inlinemessage'
import axios from 'axios'

export default {
  data() {
    return {
      user: this.$auth0.user,
      isAuthenticated: this.$auth0.isAuthenticated,
      ticketCount: undefined
    }
  },
  methods: {
    login() {
      this.$auth0.loginWithRedirect()
    },
    logout() {
      this.$auth0.logout()
    },
    toggleTheme() {
      document.documentElement.classList.toggle("dark-mode")
    }
  },
  mounted() {
    axios.get('http://localhost:5242/ticket/count')
      .then((res) => {
        this.$data.ticketCount = res.data
      })
  },
  components: {
    Button,
    InlineMessage
  }
}
</script>

<template>
  <div class="top-bar">
    <Button @click="toggleTheme()">Toggle dark mode</button>
    <div class="logout" v-if="isAuthenticated">
      <img :src="user.picture" />
      <div class="username"><b>{{ user.nickname }}</b></div>
      <Button @click="logout">Log out</button>
    </div>
    <Button v-else @click="login">Log in</button>
  </div>

  <h1>Generated tickets: {{ ticketCount === undefined ? "loading..." : ticketCount }}</h1>

  <div class="login-warning">
    <InlineMessage v-if="isAuthenticated === false" severity="warn">Log in to buy a ticket!</InlineMessage>
  </div>

</template>

<style scoped>
.top-bar {
  display: flex;
  justify-content: space-between;
  height: 32px;
  margin-bottom: 20px;
}

.logout {
  display: flex;
  justify-content: end;
  gap: 20px;
}

.username {
  align-content: center;
}

.login-warning {
  width: 100wv;
  display: flex;
  justify-content: space-around;
}
</style>
