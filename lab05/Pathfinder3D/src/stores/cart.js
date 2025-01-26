import { defineStore } from 'pinia'
export const useCartStore = defineStore('cart', {
  state: () => ({ items: new Map() }),
  getters: {
    itemCount: state => {
      let count = 0
      state.items.forEach((value, _) => {
        count += new Number(value)
      })
      return count
    }
  },
  actions: {
    addToCart(item) {
      if (!this.items.has(item)) {
        this.items.set(item, 0)
      }
      this.items.set(item, this.items.get(item) + 1)
    }
  }
})
