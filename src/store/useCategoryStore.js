import { defineStore } from 'pinia'
import axios from 'axios'

export const useCategoryStore = defineStore('category', {
  state: () => ({
    categories: []
  }),

  actions: {
    // 카테고리 목록 조회
    async fetchCategoryList() {
      try {
        const res = await axios.get('/api/sale/categories')  // API 경로 백엔드에 맞게 수정

        console.log('카테고리 응답:', res.data)

        const list = Array.isArray(res.data.result) ? res.data.result : []
        this.categories = list.map(item => ({
          idx: item.idx,
          name: item.name,
          iconUrl: item.iconUrl
        }))
      } catch (error) {
        console.error('카테고리 목록 조회 실패', error)
      }
    }
  }
})
