<script lang="ts">
import InlineMessage from "primevue/inlinemessage";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import FloatLabel from "primevue/floatlabel";
import axios from "axios";
import { useUserStore } from "@/stores/user";

export default {
  data() {
    return {
      ticketCount: undefined,
      userStore: undefined,
    };
  },

  mounted() {
    this.$data.userStore = useUserStore();
    axios.get(`${import.meta.env.VITE_SERVER_URL}/ticket/count`).then((res) => {
      this.$data.ticketCount = res.data;
    });
  },

  components: {
    InlineMessage,
    Button,
    InputNumber,
    InputText,
    FloatLabel,
  },

  methods: {
    //async buyTicket() {
    //  console.log(this.$auth0.idTokenClaims._value.__raw)
    //  await axios.post(`${import.meta.env.VITE_SERVER_URL}/ticket/add`, {
    //    vatin: this.$data.vatin,
    //    firstName: this.$data.firstName,
    //    lastName: this.$data.lastName,
    //    headers: {
    //      'Authorization': `Bearer ${this.$auth0.idTokenClaims._value.__raw}`
    //    }
    //  }).then(res => {
    //    window.location.reload()
    //  }).catch(res => {
    //    if(res.status === 400){
    //      alert(res.response.data)
    //    }
    //    else if(res.status === 401){
    //      alert('Ticket generation request failed: unauthorized')
    //    }
    //    else{
    //      alert(`Ticket generation request failed with code ${res.status}`)
    //    }
    //  })
    //}
  },
};
</script>

<template>
  <h1>
    Generated tickets:
    {{ ticketCount === undefined ? "loading..." : ticketCount }}
  </h1>
  <!--<div class="login-warning">
    <InlineMessage
      v-if="userStore !== undefined && userStore.isAuthenticated === false"
      severity="warn"
      >Log in to buy a ticket!</InlineMessage
    >
    <form v-else v-on:submit.prevent="buyTicket()">
      <FloatLabel variant="on" class="form-field">
        <InputText id="vatin" :invalid="!vatin" v-model="vatin"/>
        <label for="vatin">Vatin</label>
      </FloatLabel>
      <FloatLabel variant="on" class="form-field">
        <InputText id="firstName" :invalid="!firstName" v-model="firstName"/>
        <label for="firstName">First name</label>
      </FloatLabel>
      <FloatLabel variant="on" class="form-field">
        <InputText id="lastName" :invalid="!lastName" v-model="lastName"/>
        <label for="lastName">Last name</label>
      </FloatLabel>
      <Button type="submit">Purchase ticket</Button>
    </form>
  </div>-->
</template>

<style scoped>
.form-field {
  margin-bottom: 20px;
}
</style>
