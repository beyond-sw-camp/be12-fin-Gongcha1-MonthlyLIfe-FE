<template>
  <div class="container py-5">
    <h3 class="mb-5">🛒 장바구니</h3>

    <!-- Tabs -->
    <ul class="nav nav-tabs mb-4 fs-5">
      <li class="nav-item">
        <button class="nav-link" :class="{ active: activeTab === 'general' }" @click="activeTab = 'general'">
          일반구매({{ generalItems.length }})
        </button>
      </li>
      <li class="nav-item">
        <button class="nav-link" :class="{ active: activeTab === 'subscription' }" @click="activeTab = 'subscription'">
          정기발송(0)
        </button>
      </li>
    </ul>

    <div class="row">
      <!-- Left: Product List -->
      <div class="col-md-8">
        <div class="product-list-container">
          <!-- 상품이 하나라도 있으면 목록 출력, 없으면 안내 메시지 -->
          <template v-if="generalItems.length > 0 || packageGroups.length > 0">
            <!-- 단일 상품 -->
            <div
                v-for="(item, index) in generalItems"
                :key="'single-' + index"
                class="border rounded p-4 mb-4"
            >
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h5 class="mb-0">{{ item.name }}</h5>
                <button class="btn btn-sm btn-outline-danger" @click.prevent="removeItem('general', index)">삭제</button>
              </div>

              <div class="d-flex align-items-center">
                <input type="checkbox" class="form-check-input me-4" v-model="item.checked"/>
                <img :src="item.image" alt="상품" class="me-4" width="80" height="120"/>
                <div class="flex-grow-1">
                  <p class="text-muted mb-3">{{ item.deliveryTime }} · {{ item.price }}원</p>
                  <div class="btn-group btn-group-sm">
                    <button
                        v-for="term in item.terms"
                        :key="term"
                        class="btn px-3"
                        :class="{ 'btn-primary': item.selectedTerm === term, 'btn-outline-secondary': item.selectedTerm !== term }"
                        @click="item.selectedTerm = term"
                    >
                      {{ term }}개월
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- 패키지 상품 -->
            <div
                v-for="(group, gIdx) in packageGroups"
                :key="'group-' + gIdx"
                class="border rounded p-4 mb-4"
            >
              <div class="d-flex justify-content-between align-items-center mb-3">
                <div class="d-flex align-items-center">
                  <!-- 패키지 그룹 전체 선택 체크박스 -->
                  <input type="checkbox" class="form-check-input me-2" v-model="group.checked"/>
                  <h5 class="fw-bold mb-0">[{{ group.name }}]</h5>
                </div>
                <button class="btn btn-sm btn-outline-danger" @click="removePackageGroup(gIdx)">삭제</button>
              </div>

              <!-- 패키지 내부 항목은 체크박스 없이 정보만 표시 -->
              <div
                  v-for="(item, iIdx) in group.items"
                  :key="'group-item-' + iIdx"
                  class="border p-3 mb-3 rounded"
              >
                <div class="d-flex align-items-center">
                  <!-- 개별 체크박스 제거 -->
                  <img :src="item.image" alt="상품" class="me-4" width="80" height="120"/>
                  <div class="flex-grow-1">
                    <h5 class="mb-2">{{ item.name }}</h5>
                    <p class="text-muted mb-3">{{ item.deliveryTime }} · {{ item.price }}원</p>
                    <div class="btn-group btn-group-sm">
                      <button
                          v-for="term in item.terms"
                          :key="term"
                          class="btn px-3"
                          :class="{ 'btn-primary': item.selectedTerm === term, 'btn-outline-secondary': item.selectedTerm !== term }"
                          @click="item.selectedTerm = term"
                      >
                        {{ term }}개월
                      </button>
                    </div>
                  </div>
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
          <p class="mb-2 fs-6">상품 금액: <span class="float-end">{{ totalPrice }}원</span></p>
          <p class="mb-2 text-danger fs-6">할인 금액: <span class="float-end">-800원</span></p>
          <hr/>
          <p class="fw-bold fs-5">총 금액: <span class="float-end">{{ totalPrice - 800 }}원</span></p>

          <!-- 상품 선택이 없을 경우 안내 문구 -->
          <p v-if="selectedCount === 0" class="text-muted text-center mt-3">장바구니가 비어 있습니다.</p>

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

<script>


export default {
  data() {
    return {
      activeTab: 'general',
      generalItems: [
        {
          name: '월스 슈퍼클린 직수 정수기 (냉온정)',
          price: 15900,
          deliveryTime: '4시도착',
          image: 'https://rentalcdn.lghellovision.net/uploads/product/LGPseWmRNy.png',
          terms: [3, 6, 12],
          selectedTerm: 3,
          checked: true
        }
      ],
      packageGroups: [
        {
          name: '아이폰 스타터팩',
          checked: true,
          items: [
            {
              name: '월스 슈퍼클린 직수 정수기 (냉온정)',
              price: 15900,
              deliveryTime: '4시도착',
              image: 'https://rentalcdn.lghellovision.net/uploads/product/LGPseWmRNy.png',
              terms: [3, 6, 12],
              selectedTerm: 3
            },
            {
              name: '월스 슈퍼클린 직수 정수기 (냉온정)',
              price: 31000,
              deliveryTime: '4시도착',
              image: 'https://rentalcdn.lghellovision.net/uploads/product/LGPseWmRNy.png',
              terms: [3, 6, 12],
              selectedTerm: 6
            }
          ]
        }
      ]
    };
  },
  computed: {
    totalPrice() {
      // 일반 상품 합산
      const generalSum = this.generalItems.reduce((sum, item) => (item.checked ? sum + item.price : sum), 0);
      // 패키지 그룹이 선택된 경우에만 해당 그룹 내 모든 상품의 가격을 합산
      const packageSum = this.packageGroups.reduce((sum, group) => {
        return group.checked ? sum + group.items.reduce((s, item) => s + item.price, 0) : sum;
      }, 0);
      return generalSum + packageSum;
    },
    selectedCount() {
      // 일반 상품은 개별로 카운트
      const generalCount = this.generalItems.filter((item) => item.checked).length;
      // 패키지 그룹은 그룹 단위로 카운트
      const packageCount = this.packageGroups.filter((group) => group.checked).length;
      return generalCount + packageCount;
    }
  },
  methods: {
    removeItem(type, index) {
      if (type === 'general') this.generalItems.splice(index, 1);
    },
    removePackageGroup(index) {
      this.packageGroups.splice(index, 1);
    }
    ,
    goToPayment() {
      // Vue Router를 이용하여 결제 페이지로 이동
      this.$router.push({name: 'subscription'});
    }
  }
};
</script>

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
