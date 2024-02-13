import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useTimesStore = defineStore('times', () => {
  const times = ref({ focus: 15, rest: 5 })

  return { times }
})
