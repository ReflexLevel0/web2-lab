<script lang="ts">
import { useAuth0 } from '@auth0/auth0-vue'
import Button from 'primevue/button'

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
  components: {
    Button
  }
}
</script>

<template>
  <nav>
    <Button @click="toggleTheme()">Toggle dark mode</button>
    <div class="logout" v-if="isAuthenticated">
      <img :src="user.picture" />
      <div class="username"><b>{{ user.nickname }}</b></div>
      <Button @click="logout">Log out</button>
    </div>
    <Button v-else @click="login">Log in</button>
  </nav>
  <main>
    <RouterView />
  </main>
</template>

<style scoped>
nav {
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
</style>
