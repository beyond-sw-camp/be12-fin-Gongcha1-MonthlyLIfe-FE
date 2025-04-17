import { defineStore } from 'pinia'
import axios from 'axios'

export const useSaleStore = defineStore('sale', {
  state: () => ({
    saleList: { content: [], totalPages: 0 },
    saleProducts: [],
    saleDetail: {
      name: '',
      description: '',
      categoryIdx: null,
      saleIdx: null,
      productList: [],
      priceList: []
    }
  }),

  actions: {
    async fetchSaleListByCategory(categoryIdx, page = 0, size = 3) {
      try {
        const res = await axios.get(`/api/sale/category/${categoryIdx}?page=${page}&size=${size}`)
        this.saleList = res.data.result || { content: [], totalPages: 0 }
      } catch (err) {
        console.error('판매 목록 조회 실패', err)
        this.saleList = { content: [], totalPages: 0 }
      }
    },

    async registerSale(dto) {
      try {
        const res = await axios.post('/api/sale/create', dto)
        return res.data
      } catch (err) {
        console.error('판매 등록 실패:', err)
        throw err
      }
    },

    async fetchSaleProductList() {
      try {
        const res = await axios.get('/api/sale/list')
        const list = Array.isArray(res.data.result) ? res.data.result : []
        this.saleProducts = list
      } catch (error) {
        console.error('판매 상품 목록 조회 실패', error)
      }
    },

    async fetchSaleDetail(categoryIdx, saleIdx) {
      try {
        const res = await axios.get(`/api/sale/category/${categoryIdx}/${saleIdx}`)
        const result = res.data.result
        this.saleDetail = {
          name: result.name,
          description: result.description,
          categoryIdx: result.categoryIdx,
          saleIdx: result.saleIdx,
          productList: result.productList,
          priceList: result.priceList
        }
      } catch (err) {
        console.error('판매 상세 정보 조회 실패', err)
        this.saleDetail = {
          name: '',
          description: '',
          categoryIdx: null,
          saleIdx: null,
          productList: [],
          priceList: []
        }
      }
    }
  }
})
