import { defineStore } from 'pinia'
import axios from 'axios'

export const useSaleStore = defineStore('sale', {
  state: () => ({
    saleList: { content: [], totalPages: 0 },  // Page 객체 기본 구조
    saleProducts: []
  }),

  actions: {
    // 판매 목록 조회
    async fetchSaleListByCategory(categoryIdx, page = 0, size = 3) {
      try {
        const res = await axios.get(`/api/sale/category/${categoryIdx}?page=${page}&size=${size}`)
        this.saleList = res.data.result || { content: [], totalPages: 0 }
      } catch (err) {
        console.error('판매 목록 조회 실패', err)
        this.saleList = { content: [], totalPages: 0 }
      }
    },

    // 판매 등록
    async registerSale(dto) {
      try {
        const res = await axios.post('/api/sale/create', dto)
        console.log('판매 등록 성공:', res.data)
        return res.data
      } catch (err) {
        console.error('판매 등록 실패:', err)
        throw err
      }
    },

    // 상품 목록 초기 조회
    async fetchSaleProductList() {
      try {
        const res = await axios.get('/api/sale/list')
        console.log('판매 상품 목록 응답:', res.data)
    
        const list = Array.isArray(res.data.result) ? res.data.result : []
        this.saleProducts = list.map(item => ({
          name: item.name,
          description: item.description,
        }))
      } catch (error) {
        console.error('판매 상품 목록 조회 실패', error)
      }
    }
    

  }
})
