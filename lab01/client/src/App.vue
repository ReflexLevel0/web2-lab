<script lang="ts">
import Button from "primevue/button";
import { UserManager, WebStorageStateStore, User } from "oidc-client";
import { useUserStore } from "@/stores/user";

const settings: any = {
  userStore: new WebStorageStateStore({ store: window.localStorage }),
  authority: `https://${import.meta.env.VITE_DOMAIN}`,
  client_id: import.meta.env.VITE_CLIENT_ID,
  redirect_uri: window.location.origin,
  response_type: "id_token token",
  scope: "openid profile",
  post_logout_redirect_uri: window.location.origin,
  filterProtocolClaims: true,
};
const userManager = new UserManager(settings);

export default {
  data() {
    return {
      ticketCount: undefined,
      userStore: undefined,
    };
  },
  methods: {
    async login() {
      userManager.signinRedirect();
    },
    async logout() {
      userManager.signoutRedirect();
    },
    toggleTheme() {
      document.documentElement.classList.toggle("dark-mode");
    },
  },
  components: {
    Button,
  },
  mounted() {
    this.$data.userStore = useUserStore();
    userManager
      .signinCallback()
      .then((user) => {
        console.log("User signed in", user);
      })
      .catch((err) => {
        console.log("Error handling redirect callback", err);
      })
      .finally(() => {
        userManager.getUser().then((user: any) => {
          this.$data.userStore.isAuthenticated = user !== null && !user.expired;
          this.$data.userStore.user = user;
        });
      });
  },
};
</script>

<template>
  <nav>
    <Button @click="toggleTheme()">Toggle dark mode</Button>
    <div
      class="logout"
      v-if="userStore !== undefined && userStore.isAuthenticated"
    >
      <img :src="userStore.user.profile.picture" />
      <div class="username">
        <b>{{ userStore.user.profile.nickname }}</b>
      </div>
      <Button @click="logout">Log out</Button>
    </div>
    <Button v-else @click="login">Log in</Button>
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
