<script setup>
import { ref, computed, onMounted } from 'vue'
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

// 폼 데이터
const productName = ref('')
const condition = ref('')
const description = ref('')
const selectedProductCode = ref('')
const price3 = ref(0)
const price6 = ref(0)
const price12 = ref(0)
const saleName = ref('')


// 카테고리 UI용
const selectedMainCategory = ref(null)
const selectedSubCategory = ref(null)
const selectedSubSubCategory = ref(null)

const mainCategories = ref([
  '거실 가구', '침실 가구', '주방/식당 가구', '사무실 가구'
])

const subCategories = computed(() => {
  if (selectedMainCategory.value === '거실 가구') return ['소파', '책장', 'TV 스탠드']
  if (selectedMainCategory.value === '침실 가구') return ['침대', '서랍장', '행거']
  if (selectedMainCategory.value === '주방/식당 가구') return ['식탁', '식탁 의자', '미니 테이블']
  if (selectedMainCategory.value === '사무실 가구') return ['책상', '의자']
  return []
})

const subSubCategories = computed(() => {
  switch (selectedSubCategory.value) {
    case '소파': return ['2인용 소파', '3인용 소파', '코너 소파']
    case '책장': return ['벽걸이형 책장', '자유형 책장']
    case 'TV 스탠드': return ['벽걸이형', '독립형']
    case '침대': return ['싱글 침대', '더블 침대', '퀸 침대']
    case '서랍장': return ['2단 서랍장', '3단 서랍장']
    case '행거': return ['일반 행거', '상부장 행거']
    case '식탁': return ['4인용', '6인용', '8인용']
    case '식탁 의자': return ['패브릭 의자', '가죽 의자']
    case '미니 테이블': return ['원형 미니', '사각 미니']
    case '책상': return ['일반 책상', '코너 책상']
    case '의자': return ['메쉬 의자', '인체공학 의자']
    default: return []
  }
})

const conditionNameToIdx = {
  'S (새 상품)': 1,
  'A (사용감 없음)': 2,
  'B (사용감 조금)': 3,
  'C (사용감 많음)': 4
}

const selectMainCategory = (val) => {
  selectedMainCategory.value = val
  selectedSubCategory.value = null
  selectedSubSubCategory.value = null
}
const selectSubCategory = (val) => {
  selectedSubCategory.value = val
  selectedSubSubCategory.value = null
}
const selectSubSubCategory = (val) => {
  selectedSubSubCategory.value = val
}

// 등록 처리
const handleRegister = async () => {
  const category = categoryStore.categories.find(c => c.name === selectedSubSubCategory.value)

  if (!saleName.value || !condition.value || !description.value || !selectedProductCode.value || !category) {
    alert('❗ 모든 항목을 입력해주세요.')
    return
  }

  const dto = {
    name: saleName.value,
    description: description.value,
    categoryIdx: category.idx,
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
            <input type="text" class="form-control" v-model="saleName"
              placeholder="판매용 이름을 입력해주세요 (ex. 삼성TV 3개월 패키지)" />
          </div>
        </div>

        <!-- 카테고리 -->
        <div class="row mb-4 border-top pt-3">
          <label class="col-3 col-form-label fw-bold">카테고리 선택</label>
          <div class="col-9">
            <div class="row">
              <!-- 메인 -->
              <div class="col">
                <div class="card p-3">
                  <strong>메인 카테고리</strong>
                  <div class="list-group mt-2">
                    <button v-for="main in mainCategories" :key="main" @click="selectMainCategory(main)"
                      class="list-group-item list-group-item-action" :class="{ active: selectedMainCategory === main }">
                      {{ main }}
                    </button>
                  </div>
                </div>
              </div>

              <!-- 서브 -->
              <div class="col" v-if="selectedMainCategory">
                <div class="card p-3">
                  <strong>서브 카테고리</strong>
                  <div class="list-group mt-2">
                    <button v-for="sub in subCategories" :key="sub" @click="selectSubCategory(sub)"
                      class="list-group-item list-group-item-action" :class="{ active: selectedSubCategory === sub }">
                      {{ sub }}
                    </button>
                  </div>
                </div>
              </div>

              <!-- 세부 -->
              <div class="col" v-if="selectedSubCategory">
                <div class="card p-3">
                  <strong>세부 카테고리</strong>
                  <div class="list-group mt-2">
                    <button v-for="ss in subSubCategories" :key="ss" @click="selectSubSubCategory(ss)"
                      class="list-group-item list-group-item-action" :class="{ active: selectedSubSubCategory === ss }">
                      {{ ss }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div class="mt-3">
              <strong class="text-danger">선택됨:</strong>
              {{ selectedMainCategory }} > {{ selectedSubCategory }} > {{ selectedSubSubCategory }}
            </div>
          </div>
        </div>

        <!-- 상품 선택 -->
        <div class="row mb-4 border-top pt-3">
          <label class="col-3 col-form-label fw-bold">상품 선택</label>
          <div class="col-9">
            <select class="form-select" v-model="selectedProductCode">
              <option disabled value="">상품을 선택해주세요</option>
              <option v-for="p in productStore.products" :key="p.code" :value="p.code">
                {{ p.name }} ({{ p.code }})
              </option>
            </select>
          </div>
        </div>

        <!-- 상태 -->
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
            <textarea v-model="description" rows="4" class="form-control"
              placeholder="브랜드, 모델명, 구매 시기 등을 입력해주세요."></textarea>
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
