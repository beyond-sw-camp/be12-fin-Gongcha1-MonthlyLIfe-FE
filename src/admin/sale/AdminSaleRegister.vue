<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useCategoryStore } from '../../store/useCategoryStore'
import { useSaleStore } from '../../store/useSaleStore'
import { useProductStore } from '../../store/useProductStore'

const categoryStore = useCategoryStore()
const saleStore = useSaleStore()
const productStore = useProductStore()

onMounted(() => {
  categoryStore.fetchCategoryList()
  productStore.fetchProductList()
})

// 선택된 카테고리 상태
const selectedMainCategoryIdx = ref(null)
const selectedSubCategoryIdx = ref(null)
const selectedSubSubCategoryIdx = ref(null)

const mainCategories = computed(() =>
  categoryStore.categories.filter(c => c.parentIdx === null || c.parentIdx === 0)
)
const subCategories = computed(() =>
  categoryStore.categories.filter(c => c.parentIdx === selectedMainCategoryIdx.value)
)
const subSubCategories = computed(() =>
  categoryStore.categories.filter(c => c.parentIdx === selectedSubCategoryIdx.value)
)

const selectMainCategory = (idx) => {
  selectedMainCategoryIdx.value = idx
  selectedSubCategoryIdx.value = null
  selectedSubSubCategoryIdx.value = null
}
const selectSubCategory = (idx) => {
  selectedSubCategoryIdx.value = idx
  selectedSubSubCategoryIdx.value = null
}
const selectSubSubCategory = (idx) => {
  selectedSubSubCategoryIdx.value = idx
}

const getCategoryName = (idx) =>
  categoryStore.categories.find(c => c.idx === idx)?.name || ''

const conditionNameToIdx = {
  'S (새 상품)': 1,
  'A (사용감 없음)': 2,
  'B (사용감 조금)': 3,
  'C (사용감 많음)': 4
}

const saleName = ref('')
const condition = ref('')
const description = ref('')
const selectedProductCode = ref('')
const price3 = ref(0)
const price6 = ref(0)
const price12 = ref(0)

const handleRegister = async () => {
  if (
    !saleName.value ||
    !condition.value ||
    !description.value ||
    !selectedProductCode.value ||
    !selectedSubSubCategoryIdx.value
  ) {
    alert('❗ 모든 항목을 입력해주세요.')
    return
  }

  const dto = {
    name: saleName.value,
    description: description.value,
    categoryIdx: selectedSubSubCategoryIdx.value,
    saleProducts: [
      {
        productCode: selectedProductCode.value,
        conditionIdx: conditionNameToIdx[condition.value]
      }
    ],
    salePrices: [
      { period: 3, price: price3.value },
      { period: 6, price: price6.value },
      { period: 12, price: price12.value }
    ]
  }

  try {
    await saleStore.registerSale(dto)
    alert('등록 완료')
  } catch (e) {
    alert('등록 실패')
  }
}

watch(selectedSubSubCategoryIdx, async (idx) => {
  if (idx) {
    await saleStore.fetchSaleListByCategory(idx)
  } else {
    saleStore.saleList = { content: [], totalPages: 0 }
  }
})
</script>

<template>
  <div class="border rounded p-4 bg-light test1">
    <div class="bg-white py-5">
      <div class="container">
        <h2 class="mb-4 text-center">판매 상품 정보</h2>

        <!-- 판매 상품명 -->
        <div class="row mb-4 border-top pt-3">
          <label class="col-3 col-form-label fw-bold">판매 상품명</label>
          <div class="col-9">
            <input type="text" class="form-control" v-model="saleName" placeholder="판매용 이름을 입력해주세요" />
          </div>
        </div>

        <!-- 카테고리 선택 -->
        <div class="row mb-4 border-top pt-3">
          <label class="col-3 col-form-label fw-bold">카테고리 선택</label>
          <div class="col-9">
            <div class="row">
              <div class="col">
                <div class="card p-3">
                  <strong>메인 카테고리</strong>
                  <div class="list-group mt-2">
                    <button v-for="main in mainCategories" :key="main.idx" @click="selectMainCategory(main.idx)"
                      :class="{ active: selectedMainCategoryIdx === main.idx }" class="list-group-item list-group-item-action">
                      {{ main.name }}
                    </button>
                  </div>
                </div>
              </div>
              <div class="col" v-if="selectedMainCategoryIdx">
                <div class="card p-3">
                  <strong>서브 카테고리</strong>
                  <div class="list-group mt-2">
                    <button v-for="sub in subCategories" :key="sub.idx" @click="selectSubCategory(sub.idx)"
                      :class="{ active: selectedSubCategoryIdx === sub.idx }" class="list-group-item list-group-item-action">
                      {{ sub.name }}
                    </button>
                  </div>
                </div>
              </div>
              <div class="col" v-if="selectedSubCategoryIdx">
                <div class="card p-3">
                  <strong>세부 카테고리</strong>
                  <div class="list-group mt-2">
                    <button v-for="ss in subSubCategories" :key="ss.idx" @click="selectSubSubCategory(ss.idx)"
                      :class="{ active: selectedSubSubCategoryIdx === ss.idx }" class="list-group-item list-group-item-action">
                      {{ ss.name }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div class="mt-3">
              <strong class="text-danger">선택됨:</strong>
              {{ getCategoryName(selectedMainCategoryIdx) }}
              <span v-if="selectedSubCategoryIdx"> > {{ getCategoryName(selectedSubCategoryIdx) }}</span>
              <span v-if="selectedSubSubCategoryIdx"> > {{ getCategoryName(selectedSubSubCategoryIdx) }}</span>
            </div>
          </div>
        </div>

        <!-- 상품 코드 직접 입력 -->
        <div class="row mb-4 border-top pt-3">
          <label class="col-3 col-form-label fw-bold">상품 코드</label>
          <div class="col-9">
            <input type="text" class="form-control" v-model="selectedProductCode" placeholder="상품 코드를 입력해주세요" />
          </div>
        </div>

        <!-- 상품 상태 -->
        <div class="row mb-4 border-top pt-3">
          <label class="col-3 col-form-label fw-bold">상품 상태</label>
          <div class="col-9">
            <div class="form-check mb-1" v-for="option in Object.keys(conditionNameToIdx)" :key="option">
              <input class="form-check-input" type="radio" :value="option" v-model="condition" :id="option" />
              <label class="form-check-label ms-1" :for="option">{{ option }}</label>
            </div>
          </div>
        </div>

        <!-- 설명 -->
        <div class="row mb-4 border-top pt-3">
          <label class="col-3 col-form-label fw-bold">설명</label>
          <div class="col-9">
            <textarea v-model="description" rows="4" class="form-control" placeholder="브랜드, 모델명, 구매 시기 등을 입력해주세요."></textarea>
          </div>
        </div>

        <!-- 가격 -->
        <div class="row mb-4 border-top pt-3">
          <label class="col-3 col-form-label fw-bold">가격</label>
          <div class="col-9">
            <div class="input-group mb-2" style="max-width: 250px;">
              <span class="input-group-text">3개월</span>
              <input type="number" class="form-control" v-model="price3" />
              <span class="input-group-text">원</span>
            </div>
            <div class="input-group mb-2" style="max-width: 250px;">
              <span class="input-group-text">6개월</span>
              <input type="number" class="form-control" v-model="price6" />
              <span class="input-group-text">원</span>
            </div>
            <div class="input-group" style="max-width: 250px;">
              <span class="input-group-text">12개월</span>
              <input type="number" class="form-control" v-model="price12" />
              <span class="input-group-text">원</span>
            </div>
          </div>
        </div>

        <!-- 등록 -->
        <div class="text-end">
          <button class="btn btn-primary px-4" @click="handleRegister">등록하기</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.test1 {
  width: 100%;
}

.list-group-item.active {
  background-color: #ffecec;
  border-color: #ffcccc;
  color: #d63333;
  font-weight: bold;
  border-radius: 4px;
}
</style>