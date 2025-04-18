// /store/useProductStore.js
import { defineStore } from 'pinia'
import axios from 'axios'

export const useProductStore = defineStore('product', {
  state: () => ({
    products: []
  }),

  actions: {
    // form: { name, code, description, manufacturer, condition, location, count, files: File[] }
    async registerProduct(payload) {
      try {
        let formData
    
        if (payload instanceof FormData) {
          // Modal에서 보낸 FormData 그대로 사용
          formData = payload
        } else {
          // 기존 방식: raw form 객체
          formData = new FormData()
          const dto = {
            name:        payload.name,
            code:        payload.code,
            description: payload.description,
            manufacturer:payload.manufacturer,
          }
          formData.append('dto', new Blob([JSON.stringify(dto)], { type: 'application/json' }))
          payload.files.forEach(file => formData.append('images', file))
        }
    
        const res = await axios.post(
          '/api/admin/product/create',
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        )
    
        if (res.data.isSuccess) {
          await this.fetchProductList()
        }
        return res.data
      } catch (error) {
        console.error('상품 등록 실패', error)
        throw error
      }
    },

    async fetchProductList() {
      try {
        const res = await axios.get('/api/product/list')
        const list = Array.isArray(res.data.result) ? res.data.result : []
        this.products = list.map(item => ({
          code: item.code,
          name: item.name,
          description: item.description,
          manufacturer: item.manufacturer,
          condition: item.condition,
          location: item.location,
          count: item.count,
          productImages: item.productImages || []
        }))
      } catch (error) {
        console.error('상품 목록 조회 실패', error)
        this.products = []
      }
    }
  }
})
