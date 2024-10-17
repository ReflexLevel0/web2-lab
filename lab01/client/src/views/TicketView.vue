<script lang="ts">
import axios from 'axios'

export default {
  data() {
    return {
      ticket: undefined
    }
  },
  mounted(){
    axios.get(`${import.meta.env.VITE_SERVER_URL}/ticket/${this.$route.params.id}`)
    .then(res => {
      this.$data.ticket = res.data
    })
  }
}
</script>

<template>
<h2>Ticket info:</h2>
<p>ID: {{ticket.id}}</p>
<p>Generated time: {{ticket.generatedTime}}</p>
<p>Vatin: {{ticket.vatin}}</p>
<p>First name: {{ticket.firstName}}</p>
<p>Last name: {{ticket.lastName}}</p>
</template>
