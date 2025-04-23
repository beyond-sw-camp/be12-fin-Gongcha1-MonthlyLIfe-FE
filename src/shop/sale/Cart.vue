<script setup>
import { onMounted, computed, ref } from 'vue'
import axios from 'axios'
import { useSubscribeStore } from '../../store/useSubcribeStore.js'
import { useRouter } from 'vue-router'


const store = useSubscribeStore()
const activeTab = ref('general')
const router = useRouter()

onMounted(() => {
  store.fetchCartItems()
  console.log(generalItems.value)
})

const generalItems = computed(() => store.cartItems || [])

const totalPrice = computed(() =>
    generalItems.value.reduce((sum, item) => (item.checked ? sum + item.price : sum), 0)
)
// 선택된거 카운터
const selectedCount = computed(() =>
    generalItems.value.filter(item => item.checked).length

)
// 삭제 인데 삭제 안됌
const removeItem = async (index) => {
  const { cartIdx } = generalItems.value[index]
  await store.deleteCartItem(cartIdx)
}

// 직접 API 호출 후 배열에서 제거
// 구독으로 가면서 값 전달해주는거
const goToPayment = () => {
  const selected = generalItems.value.filter(item => item.checked)
  router.push({
    name: 'subscription',
    query: {
      items: encodeURIComponent(JSON.stringify(selected))
    }
  })
}
</script>
<template>
  <div class="container py-5">
    <h3 class="mb-5">🛒 장바구니</h3>

    <!-- Tabs -->
    <ul class="nav nav-tabs mb-4 fs-5">
      <li class="nav-item">
        <button
            class="nav-link"
            :class="{ active: activeTab === 'general' }"
            @click="activeTab = 'general'"
        >
          일반구매({{ generalItems.length }})
        </button>
      </li>
    </ul>

    <div class="row">
      <!-- Left: Product List -->
      <div class="col-md-8">
        <div class="product-list-container">
          <template v-if="generalItems.length > 0">
            <div
                v-for="(item, index) in generalItems"
                :key="'single-' + index"
                class="border rounded p-4 mb-4"
            >
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h5 class="mb-0">{{ item.name }}</h5>
                <button class="btn btn-sm" @click.prevent="removeItem(index)">
                  <font-awesome-icon :icon="['fas', 'x']"/>
                </button>
              </div>

              <div class="d-flex align-items-center">
                <input
                    type="checkbox"
                    class="form-check-input me-4"
                    v-model="item.checked"
                />
                <img
                    :src="item.image"
                    alt="상품"
                    class="me-4"
                    width="80"
                    height="120"
                />
                <div class="flex-grow-1">
                  <p class="text-muted mb-2">
                    {{ item.deliveryTime }} · {{ item.price }}원
                  </p>
                  <!-- 기간을 고정 텍스트로 표시 -->
                  <p class="mb-0">구독 기간: <strong>{{ item.period }}개월</strong></p>
                </div>
              </div>
            </div>
          </template>

          <template v-else>
            <div class="empty-cart text-center py-5">
              <p class="fs-4">장바구니가 비어 있습니다.</p>
            </div>
          </template>
        </div>
      </div>

      <!-- Right: Price Summary -->
      <div class="col-md-4">
        <div class="bg-light border p-4 rounded summary-box">
          <p class="mb-2 fw-bold fs-5">주문 예산 금액</p>
          <p class="mb-2 fs-6">
            상품 금액:
            <span class="float-end">{{ totalPrice }}원</span>
          </p>
          <p class="mb-2 text-danger fs-6">
            할인 금액: <span class="float-end">-0원</span>
          </p>
          <hr/>
          <p class="fw-bold fs-5">
            총 금액: <span class="float-end">{{ totalPrice - 0 }}원</span>
          </p>

          <p v-if="selectedCount === 0" class="text-muted text-center mt-3">
            장바구니가 비어 있습니다.
          </p>

          <button
              class="btn btn-primary w-100 mt-4 py-2 fs-5"
              :disabled="selectedCount === 0"
              @click="goToPayment"
          >
            구매하기 ({{ selectedCount }})
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.btn-group .btn {
  min-width: 80px;
  font-size: 1rem;
}

.summary-box {
  min-height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
}

.product-list-container {
  min-height: 500px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
}

.empty-cart {
  color: #777;
  text-align: center;
}

.container.py-5 {
  width: 1000px;
  margin: 0 auto;
}
</style>
