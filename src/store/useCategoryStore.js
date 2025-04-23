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
        const res = await axios.get('/api/sale/categories')
        const list = Array.isArray(res.data.result) ? res.data.result : []
    
        const flat = list.map(item => ({
          idx: Number(item.idx),
          name: item.name,
          iconUrl: item.iconUrl,
          parentIdx: item.parentIdx !== undefined ? Number(item.parentIdx) : null
        }))
    
        this.categories = flat
    
        console.log('카테고리 트리:', this.categories)
      } catch (error) {
        console.error('카테고리 목록 조회 실패:', error)
      }
    }

  }
})