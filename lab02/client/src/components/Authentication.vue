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
      this.brokenAuthEnabled = enabled;
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
          alert("EXPLOIT FAILED: can't get data from URL");
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
    <p>
      Upute: klikom na "Broken authentication enabled" i prijavom u sustav preko
      gumba "Log in", omogućava se čitanje osjetljivih podataka iz URL-a
      browsera nakon prijave korisnika jer klijent traži token. Onemogućavanjem
      checkbox-a ta se funkcionalnost onemogućava te se pokušajem prijave u
      sustav iz URL-a samo može isčitati kod koji nije osjetljiva informacija.
    </p>
    <p>Testni login podaci: <b>blabla@gmail.com Test1234</b></p>
    <label for="authentication-input"
      >Broken Authentication ranjivost omogućena:
    </label>
    <input
      id="authentication-input"
      type="checkbox"
      v-model="brokenAuthEnabled"
      @input="this.setBrokenAuthenticationEnabled(!this.brokenAuthEnabled)"
    />

    <br /><br />

    <button v-if="isAuthenticated" @click="logout">Odjava</button>
    <button v-else @click="login">Prijava</button>
  </div>
</template>
