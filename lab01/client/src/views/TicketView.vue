<script lang="ts">
import axios from "axios";
import { useUserStore } from "@/stores/user";

export default {
  data() {
    return {
      userStore: undefined,
      ticket: undefined,
    };
  },
  mounted() {
    this.$data.userStore = useUserStore();
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
  },
};
</script>

<template>
  <div v-if="ticket">
    <h2>Ticket info:</h2>
    <p>ID: {{ ticket.id }}</p>
    <p>Generated time: {{ ticket.generatedTime }}</p>
    <p>Vatin: {{ ticket.vatin }}</p>
    <p>First name: {{ ticket.firstName }}</p>
    <p>Last name: {{ ticket.lastName }}</p>
  </div>
</template>
