import { defineStore } from 'pinia'
import axios from 'axios'

export const useSaleStore = defineStore('sale', {
  state: () => ({
    saleList: { content: [], totalPages: 0 }  // Page 객체 기본 구조
  }),

  actions: {
    async fetchSaleListByCategory(categoryIdx, page = 0, size = 3) {
      try {
        const res = await axios.get(`/api/sale/category/${categoryIdx}?page=${page}&size=${size}`)
        this.saleList = res.data.result || { content: [], totalPages: 0 }
      } catch (err) {
        console.error('판매 목록 조회 실패', err)
        this.saleList = { content: [], totalPages: 0 }  // 실패 시 초기화
      }
    }
  }
})
