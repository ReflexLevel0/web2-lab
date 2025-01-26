<script setup>
import Miniature from '../components/Miniature.vue'
import { Notivue, Notification, push } from 'notivue'
</script>

<script>
export default {
  data() {
    return {
      miniatures: [
        {
          name: 'Quivering Cube',
          price: 5.99,
          imageUrl: 'quivering-cube.jpg',
        },
        {
          name: 'Beaky',
          price: 12.99,
          imageUrl: 'beaky.jpg',
        },
        {
          name: 'Adult Umbral Dragon',
          price: 19.99,
          imageUrl: 'adult-umbral-dragon_pre.jpg',
        },
        {
          name: 'Child of Urgathoa',
          price: 8.99,
          imageUrl: 'child-of-urgathoa.jpg',
        },
        {
          name: 'Hunting Spider',
          price: 4.99,
          imageUrl: 'hunting-spider_render.jpg',
        },
        {
          name: 'Thrasfyr',
          price: 11.99,
          imageUrl: 'thrasfyr_pre.jpg',
        },
        {
          name: 'Werebat',
          price: 8.99,
          imageUrl: 'werebat_render.jpg',
        },
      ],
    }
  },
  components: { Miniature },
  methods: {
    displayAddedToCartNotif(miniatureName) {
      push.success(`Added ${miniatureName} to cart`)
    },
  },
}
</script>

<template>
  <div class="miniature-list">
    <Notivue v-slot="item">
      <Notification :item="item" />
    </Notivue>
    <div v-for="m in miniatures" :key="m.name">
      <Miniature
        :name="m.name"
        :price="m.price"
        :imageUrl="m.imageUrl"
        @onAddedToCart="displayAddedToCartNotif(m.name)"
      />
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
</style>
