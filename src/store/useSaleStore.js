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
    /**
     * 카테고리 조회 or 검색(키워드/등급) 조회를 하나로 합침
     *
     * @param {Number} categoryIdx 
     * @param {Number} page 
     * @param {Number} size 
     * @param {{keyword?: string, grade?: string}} filter 
     */
    async fetchSaleListByCategory(categoryIdx, page = 0, size = 3, filter = {}) {
      const { keyword, grade } = filter
      try {
        let res
        if (!keyword && !grade) {
          // 기본 카테고리 조회
          res = await axios.get(`/api/sale/category/${categoryIdx}`, {
            params: { page, size }
          })
        } else {
          // 검색용 엔드포인트 호출
          res = await axios.get(`/api/sale/search`, {
            params: { categoryIdx, page, size, keyword, grade }
          })
        }
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
    },
    /** 판매상품 삭제 */
    async deleteSale(saleIdx) {
      try {
        await axios.post(`/api/sale/${saleIdx}/delete`)
        // 삭제하고 나면 로컬 saleProducts에서도 제거
        this.saleProducts = this.saleProducts.filter(s => s.saleIdx !== saleIdx)
      } catch (err) {
        console.error('판매상품 삭제 실패', err)
        throw err
      }
    },

    /** 판매상품 수정 */
    async updateSale(categoryIdx, saleIdx, payload) {
      try {
        const res = await axios.post(`/api/sale/${saleIdx}/update`, payload)
        // 성공 시, store의 saleProducts 갱신(간단히 전체 다시 로드)
        await this.fetchSaleProductList()
        return res.data.result
      } catch (err) {
        console.error('판매상품 수정 실패', err)
        throw err
      }
    }







  }
})
