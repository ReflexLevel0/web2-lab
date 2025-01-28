<script>
import Miniature from '../components/Miniature.vue'
import { Notification, Notivue } from 'notivue'

export default {
  data() {
    return {
      fetchingMiniatures: true,
      miniatures: [],
    }
  },
  components: { Miniature, Notivue, Notification },
  mounted() {
    this.$data.fetchingMiniatures = true

    //Fetching miniatures (and also simulating a short timeout so that
    //"Loading..." text is displayed)
    fetch('https://run.mocky.io/v3/c70bb666-8589-4d51-802e-59cf53ba4720')
      .then((response) => response.json())
      .then((json) => {
        setTimeout(() => {
          this.$data.miniatures = json.miniatures
          this.$data.fetchingMiniatures = false
        }, 500)
      })
  },
}
</script>

<template>
  <div>
    <Notivue v-slot="item">
      <Notification :item="item" />
    </Notivue>

    <!--Displaying loading text until miniatures are loaded-->
    <div v-if="fetchingMiniatures" class="loading">Loading minis...</div>

    <!--Miniature list-->
    <div v-else class="miniature-list">
      <div v-for="m in miniatures" :key="m.name">
        <Miniature :name="m.name" :price="m.price" :imageUrl="m.imageUrl" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.miniature-list {
  display: flex;
  flex-wrap: wrap;
}

.miniature-list > div {
  margin-right: 20px;
}

.loading {
  font-size: 2rem;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
