<script lang="ts">
import axios from "axios";
import { useUserStore } from "@/stores/user";
import InlineMessage from "primevue/inlinemessage";

export default {
  data() {
    return {
      userStore: undefined,
      ticket: undefined,
    };
  },
  mounted() {
    this.$data.userStore = useUserStore();
    if (this.$data.userStore.user !== null) {
      axios
        .get(
          `${import.meta.env.VITE_SERVER_URL}/ticket/${this.$route.params.id}`,
          {
            headers: {
              Authorization: `Bearer ${this.$data.userStore.user.id_token}`,
            },
          },
        )
        .then((res) => {
          this.$data.ticket = res.data;
        });
    }
  },
  components: {
    InlineMessage,
  },
};
</script>

<template>
  <div
    class="login-warning"
    v-if="userStore !== undefined && userStore.user == null"
  >
    <InlineMessage severity="warn">Log in to view ticket info!</InlineMessage>
  </div>
  <div v-else-if="ticket !== undefined">
    <h2>Ticket info:</h2>
    <p>ID: {{ ticket.id }}</p>
    <p>Generated time: {{ ticket.generatedTime }}</p>
    <p>Vatin: {{ ticket.vatin }}</p>
    <p>First name: {{ ticket.firstName }}</p>
    <p>Last name: {{ ticket.lastName }}</p>
  </div>
</template>

<style scoped>
.login-warning {
  width: 100wv;
  display: flex;
  justify-content: space-around;
}
</style>
