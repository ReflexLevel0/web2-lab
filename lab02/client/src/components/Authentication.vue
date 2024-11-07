<script lang="ts">
import { UserManager, WebStorageStateStore } from "oidc-client";

export default {
  data() {
    return {
      userManager: undefined,
      isAuthenticated: false,
      brokenAuthEnabled: false,
    };
  },
  methods: {
    async login() {
      this.userManager.signinRedirect();
    },
    async logout() {
      this.userManager.signoutRedirect();
    },
    setBrokenAuthenticationEnabled(enabled: boolean) {
      localStorage.setItem(
        "brokenAuthEnabled",
        enabled == true ? "true" : "false",
      );
      this.brokenAuthenticationEnabled = enabled;
      const settings: any = {
        userStore: new WebStorageStateStore({ store: window.localStorage }),
        authority: "https://" + import.meta.env.VITE_DOMAIN,
        client_id: import.meta.env.VITE_CLIENT_ID,
        redirect_uri: window.location.origin,
        response_type: enabled ? "id_token token" : "code",
        scope: "openid profile",
        post_logout_redirect_uri: window.location.origin,
        filterProtocolClaims: true,
      };
      this.userManager = new UserManager(settings);
    },
  },
  mounted() {
    let brokenAuthEnabled = localStorage.getItem("brokenAuthEnabled");
    this.setBrokenAuthenticationEnabled(
      brokenAuthEnabled === "true" ? true : false,
    );
    this.userManager
      .signinCallback()
      .then((user) => {
        console.log("User signed in", user);
        let window_url = window.location.href;
        if (window_url.indexOf("access_token") != -1) {
          alert("SESSION DATA FETCHED FROM URL: " + window_url.split("#")[1]);
        } else {
          alert("FAILED TO FETCH DATA FROM URL");
        }
      })
      .catch((err) => {
        console.log("Error handling redirect callback", err);
      })
      .finally(() => {
        this.userManager.getUser().then((user: any) => {
          this.$data.isAuthenticated = user !== null && !user.expired;
        });
      });
  },
};
</script>

<template>
  <div>
    <h2>Broken authentication</h2>
    <label for="authentication-input">Broken authentication enabled: </label>
    <input
      id="authentication-input"
      type="checkbox"
      v-model="brokenAuthEnabled"
      @input="this.setBrokenAuthenticationEnabled(!this.brokenAuthEnabled)"
    />

    <br />

    <button v-if="isAuthenticated" @click="logout">Log out</button>
    <button v-else @click="login">Log in</button>
  </div>
</template>
