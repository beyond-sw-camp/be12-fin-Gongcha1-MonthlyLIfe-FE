import { defineStore } from 'pinia'
import axios from 'axios'

export const useSaleStore = defineStore('sale', {
  state: () => ({
    saleList: []
  }),

  actions: {
    async fetchSaleListByCategory(categoryIdx) {
      try {
        const res = await axios.get(`/api/sale/category/${categoryIdx}`)
        this.saleList = Array.isArray(res.data.result) ? res.data.result : []
      } catch (err) {
        console.error('판매 목록 조회 실패', err)
      }
    }
  }
})
