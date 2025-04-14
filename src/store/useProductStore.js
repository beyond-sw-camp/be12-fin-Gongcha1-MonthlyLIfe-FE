// /store/useProductStore.js
import { defineStore } from 'pinia'
import axios from 'axios'

export const useProductStore = defineStore('product', {
  state: () => ({
    products: []
  }),

  actions: {
    // 상품 등록
    async registerProduct(form) {
      try {
        const payload = {
          name: form.name,
          code: form.code,
          description: form.description,
          manufacturer: form.manufacturer,
          productImages: form.productImages.map(img => ({
            productImgUrl: img.productImgUrl
          }))
        }

        const res = await axios.post('/api/admin/product/create', payload)

        if (res.data.isSuccess) {
          // 등록된 상품을 목록에 추가
          this.products.push({
            code: res.data.result,
            name: form.name,
            description: form.description,
            manufacturer: form.manufacturer,
            productImages: form.productImages,
          })
        }

        return res.data
      } catch (error) {
        console.error('상품 등록 실패', error)
        throw error
      }
    },

    // 상품 목록 초기 조회
    async fetchProductList() {
      try {
        const res = await axios.get('/api/product/list')
        console.log('상품 목록 응답:', res.data)
    
        const list = Array.isArray(res.data.result) ? res.data.result : []
        this.products = list.map(item => ({
          code: item.code,
          name: item.name,
          description: item.description,
          manufacturer: item.manufacturer,
          productImages: item.productImages || []
        }))
      } catch (error) {
        console.error('상품 목록 조회 실패', error)
      }
    }
    
  }
})
