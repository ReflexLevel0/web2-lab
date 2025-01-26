import { defineStore } from 'pinia'
import { push } from 'notivue'
export const useCartStore = defineStore('cart', {
  state: () => ({ items: {} }),
  getters: {
    itemCount: state => {
      let count = 0
      Object.keys(state.items).forEach(value => {
        count += new Number(state.items[value].count)
      })
      return count
    }
  },
  actions: {
    addToCart(item) {
      if (this.itemCount >= 99) {
        push.error('Can\'t add more then 99 items to cart!')
        return
      }

      if (item in this.items == false) {
        this.items[item] = { count: 0 }
      }

      this.items[item].count += 1
      push.success(`Added ${item} to cart`)
    },
    removeFromCart(item) {
      if (this.items[item].count <= 1) {
        delete this.items[item]
      } else {
        this.items[item].count -= 1
      }

      push.success(`Removed ${item} from cart`)
    }
  }
})
