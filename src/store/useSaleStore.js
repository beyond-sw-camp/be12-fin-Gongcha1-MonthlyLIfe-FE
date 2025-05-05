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
    },
    bestSales: [],
    categorySummaries: {},  
    packageList: { content: [], totalPages: 0 },
    categorySales: {}
  }),

  actions: {
    /**
     * 카테고리 상품 조회 or 검색(키워드/등급) 조회를 하나로 합침
     */
    async fetchSaleListByCategory(categoryIdx, page = 0, size = 3, filter = {}) {
      const { keyword, grade } = filter
      try {
        let res
        if (!keyword && !grade) {
          res = await axios.get(`/api/sale/category/${categoryIdx}`, { params: { page, size } })
        } else {
          res = await axios.get(`/api/sale/search`, { params: { categoryIdx, page, size, keyword, grade } })
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
        await this.fetchSaleProductList()
        return res.data.result
      } catch (err) {
        console.error('판매상품 수정 실패', err)
        throw err
      }
    },

    /** 전체 상품 조회 (페이징) */
    async fetchAllSales(page = 0, size = 6) {
      try {
        const res = await axios.get('/api/sale/list', { params: { page, size } })
        this.saleList = res.data.result || { content: [], totalPages: 0 }
      } catch (err) {
        console.error('전체 판매 목록 조회 실패', err)
        this.saleList = { content: [], totalPages: 0 }
      }
    },

    /** 구독 수 기준 Best 상품 조회 (전체) */
    async fetchBestSales(limit = 5) {
      try {
        const res = await axios.get('/api/sale/best', { params: { limit } })
        this.bestSales = res.data.result || []
      } catch (err) {
        console.error('베스트 상품 조회 실패', err)
        this.bestSales = []
      }
    },

    /** 카테고리별 베스트 상품 조회 */
    async fetchCategoryBestSales(categoryIdx, limit = 5) {
      try {
        const res = await axios.get(`/api/sale/${categoryIdx}/best`, { params: { limit } })
        this.bestSales = res.data.result || []
      } catch (err) {
        console.error('카테고리별 베스트 상품 조회 실패', err)
        this.bestSales = []
      }
    },

    async fetchPackageSales(page = 0, size = 6) {
      try {
        const res = await axios.get('/api/sale/packages', { params: { page, size } })
        this.packageList = res.data.result
      } catch (err) {
        console.error('패키지 특가 조회 실패', err)
        this.packageList = { content: [], totalPages: 0 }
      }
    },

    /** 키워드 검색 조회 */
    async fetchSalesByKeyword(page = 0, size = 6, keyword = '') {
      try {
        const res = await axios.get('/api/sale/searchall', { params: { page, size, keyword } })
        this.saleList = res.data.result || { content: [], totalPages: 0 }
      } catch {
        this.saleList = { content: [], totalPages: 0 }
      }
    },

    /**
        * 전체 판매상품(페이징 응답) 조회
        * @param {number} page 0-based 페이지
        * @param {number} size 한 페이지당 아이템 수
        */
    async fetchSaleProductsList(page = 0, size = 6) {
      try {
        const res = await axios.get('/api/sale/list', { params: { page, size } })
        // res.data.result === { content: [...], totalPages: N }
        const pageData = res.data.result || { content: [], totalPages: 0 }
        this.saleProducts = pageData.content
      } catch (error) {
        console.error('판매 상품 목록 조회 실패', error)
        this.saleProducts = []
      }
    },


    // async fetchCategorySales(categoryIdx, page = 0, size = 5) {
    //   const res = await axios.get(`/api/sale/category/${categoryIdx}`, { params: { page, size } })
    //   this.categorySales[categoryIdx] = res.data.result.content || []
    // },
    /** 
     * 카테고리별 요약 조회: 
     * 내용 안에 productList.productImages, condition 정보를 
     * imageUrl, condition 필드로 꺼내서 붙여 줍니다.
     */
    // /store/useSaleStore.js
    async fetchCategorySales(categoryIdx, page = 0, size = 5) {
      try {
        const res = await axios.get(
          `/api/sale/category/${categoryIdx}`,
          { params: { page, size } }
        );
        // DTO(content)가 이미 imageUrl, conditionName, price, period를 갖고 있으니
        // 그대로 할당만 합니다.
        const summaries = res.data.result?.content || [];
        this.categorySales[categoryIdx] = summaries;
      } catch (err) {
        console.error('카테고리별 요약 조회 실패', err);
        this.categorySales[categoryIdx] = [];
      }
    },

     /**
    * 특정 카테고리의 Best 요약 상품 조회 (GetBestSaleRes[])
    * categorySummaries[categoryIdx] 에만 덮어씁니다.
    */
   async fetchCategoryBestSummaries(categoryIdx, limit = 5) {
       try {
         const res = await axios.get(
           `/api/sale/${categoryIdx}/best`,
           { params: { limit } }
         )
         this.categorySummaries[categoryIdx] = res.data.result || []
       } catch (err) {
         console.error('카테고리별 Best 요약 조회 실패', err)
         this.categorySummaries[categoryIdx] = []
       }
     }



  }
})
