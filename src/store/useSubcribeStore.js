// src/stores/useSubscribeStore.js
import { defineStore } from 'pinia'
import axios from 'axios'

export const useSubscribeStore = defineStore('subscribe', {
    state: () => ({
        detail: null,           // 구독 상세 데이터
        loading: false,
        error: null,
        cartItems: [],          // ✅ 장바구니 일반 항목
        cartLoading: false,
        cartError: null
    }),

    actions: {
        // ✅ 구독 상세 정보
        async fetchSubscribeDetail(detailIdx) {
            this.loading = true
            this.error = null
            try {
                const res = await axios.get(`/api/subscribe/info/${detailIdx}`)
                if (res.data.isSuccess) {
                    this.detail = res.data.result
                } else {
                    this.error = res.data.message
                }
            } catch (err) {
                this.error = err.message || '에러 발생'
            } finally {
                this.loading = false
            }
        },

        // ✅ 장바구니 목록 불러오기
        async fetchCartItems() {
            this.cartLoading = true
            this.cartError = null
            try {
                const res = await axios.get('/api/cart/list')
                if (res.data.isSuccess) {
                    this.cartItems = res.data.result.map(item => ({
                        cartIdx : item.cartidx,
                        name: item.salename,
                        price: item.price,
                        deliveryTime: '당일도착',
                        image: item.productImgurl,
                        period: item.period,
                        checked: true,
                        saleIdx: item.saleidx,
                    }))
                } else {
                    this.cartError = res.data.message
                }
            } catch (err) {
                this.cartError = err.message || '장바구니 요청 실패'
            } finally {
                this.cartLoading = false
            }
        },
        // 새로운 삭제 액션 (옵션)
        async deleteCartItem(cartIdx) {
            await axios.post(`/api/cart/${cartIdx}/delete`)
            this.cartItems = this.cartItems.filter(i => i.cartIdx !== cartIdx)
        }
    }
})



