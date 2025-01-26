<script>
import { useCartStore } from '../stores/cart.js'
import { Notivue, Notification, push } from 'notivue'

export default {
  data() {
    return {
      cartStore: useCartStore(),
    }
  },
  methods: {
    incrementItem(miniatureName) {
      let newCount = this.$data.cartStore.items.get(miniatureName) + 1
      this.setItemCount(miniatureName, newCount)
    },
    decrementItem(miniatureName) {
      let newCount = this.$data.cartStore.items.get(miniatureName) - 1
      this.setItemCount(miniatureName, newCount)
    },
    setItemCount(miniatureName, newCount) {
      let oldCount = this.$data.cartStore.items.get(miniatureName)

      if (newCount <= 0) {
        newCount = 0
        this.$data.cartStore.items.delete(miniatureName)
      } else {
        if (this.$data.cartStore.itemCount > 99) {
          newCount = 99
        }
        this.$data.cartStore.items.set(miniatureName, newCount)
      }

      let difference = newCount - oldCount
      if (difference > 0) {
        push.success(`Added ${difference} ${miniatureName} to cart`)
      } else {
        push.success(`Removed ${-difference} ${miniatureName} from cart`)
      }
    },
  },
  components: {
    Notivue,
    Notification,
  },
}
</script>

<template>
  <div class="cart">
    <Notivue v-slot="item">
      <Notification :item="item" />
    </Notivue>
    <div class="cart-name-list">
      <div v-for="item in cartStore.items" :key="item[0]">
        <div>{{ item[0] }}</div>
      </div>
    </div>
    <div class="cart-amount-list">
      <div class="item-amount" v-for="item in cartStore.items" :key="item[0]">
        <button @click="decrementItem(item[0])">-</button>
        <input
          v-model="item[1]"
          type="number"
          @input="(event) => setItemCount(item[0], event.target.value)"
        />
        <button @click="incrementItem(item[0])">+</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cart {
  display: flex;
  flex-direction: row;
}
.cart-name-list,
.cart-amount-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.item-amount {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 1rem;
  margin-left: 3rem;
}
button {
  width: 1.5rem;
  border-radius: 50%;
}
</style>
