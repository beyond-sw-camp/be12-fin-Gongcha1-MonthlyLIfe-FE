<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSaleStore } from '../../store/useSaleStore'
import { useProductStore } from '../../store/useProductStore'
import { useCategoryStore } from '../../store/useCategoryStore'

const route = useRoute()
const router = useRouter()
const saleStore = useSaleStore()
const productStore = useProductStore()
const categoryStore = useCategoryStore()

const currentPage = ref(0)
const pageSize = 3
const categoryIdx = ref(Number(route.params.categoryIdx))
const selectedDetailCategory = ref(null)

onMounted(() => {
  categoryStore.fetchCategoryList()
  productStore.fetchProductList()
  saleStore.fetchSaleProductList()
  fetchPageData(categoryIdx.value)
})

watch(() => route.params.categoryIdx, (newVal) => {
  categoryIdx.value = Number(newVal)
  selectedDetailCategory.value = null
  currentPage.value = 0
  fetchPageData(categoryIdx.value)
})

watch(selectedDetailCategory, (cat) => {
  if (cat) {
    currentPage.value = 0
    fetchPageData(cat.idx)
  }
})

function fetchPageData(catId) {
  saleStore.fetchSaleListByCategory(catId, currentPage.value, pageSize)
}

const detailCategories = computed(() =>
  categoryStore.categories.filter(c => Number(c.parentIdx) === Number(categoryIdx.value))
)

const saleContent = computed(() => saleStore.saleList.content || [])
const totalPages = computed(() => saleStore.saleList.totalPages || 0)

function changePage(page) {
  currentPage.value = page
  const id = selectedDetailCategory.value?.idx || categoryIdx.value
  fetchPageData(id)
}

function goToDetail(sale) {
  console.log(sale)
  const catId = sale.categoryIdx ?? categoryIdx.value
  const saleId = sale.idx 

  router.push(`/sale/detail/${catId}/${saleId}`)

}

function getProductImage(productCode) {
  const product = productStore.products.find(p => p.code === productCode)
  return product?.productImages?.[0]?.productImgUrl || '/assets/images/placeholder.png'
}

function conditionColorClass(condition) {
  switch (condition) {
    case 'S급': return 'bg-success'
    case 'A급': return 'bg-primary'
    case 'B급': return 'bg-warning text-dark'
    case 'C급': return 'bg-danger'
    default: return 'bg-secondary'
  }
}

function findProductByCode(productCode) {
  return productStore.products.find(p => p.code === productCode)
}

function getMinPrice(sale) {
  if (!sale.priceList || sale.priceList.length === 0) return null
  const sorted = [...sale.priceList].sort((a, b) => a.price - b.price)
  return sorted[0]
}
</script>

<template>
  <div class="container-fluid p-0">
    <section class="banner-section">
      <img src="https://rentalcdn.lghellovision.net/uploads/category/l2nml1EqiU.jpg" alt="배너 이미지"
        class="banner-image" />
      <div class="text-area">
        <div class="text01">온 가족이 함께 더 생생한 화질로</div>
        <div class="text02"><strong>TV 렌탈&amp;구독</strong></div>
      </div>
    </section>

    <div class="category-tabs bg-white border-bottom py-4" v-if="detailCategories.length > 0">
      <div class="container d-flex gap-3 flex-wrap">
        <button v-for="cat in detailCategories" :key="cat.idx" @click="selectedDetailCategory = cat" class="btn"
          :class="{ 'btn-primary': selectedDetailCategory?.idx === cat.idx, 'btn-light': selectedDetailCategory?.idx !== cat.idx }">
          {{ cat.name }}
        </button>
      </div>
    </div>

    <div class="container py-5">
      <h4 class="fw-bold mb-3">많은 고객님들이 선택한 상품이에요</h4>

      <div v-if="saleContent.length > 0" class="row g-4">
        <div v-for="sale in saleContent" :key="sale.saleIdx" @click="goToDetail(sale)" style="cursor:pointer">
          <div class="card h-100 shadow-sm">
            <div class="d-flex flex-nowrap justify-content-center gap-2 flex-wrap p-2">
              <img v-for="(product, pIdx) in sale.productList" :key="pIdx"
                :src="findProductByCode(product.productCode)?.productImages?.[0]?.productImgUrl || '/assets/images/placeholder.png'"
                class="img-thumbnail" style="width: 120px; height: 120px; object-fit: cover;" />
            </div>
            <div class="card-body text-center">
              <h6 class="card-title fw-bold d-flex justify-content-center align-items-center text-nowrap">
                {{ sale.name }}
                <span v-if="findProductByCode(sale.productList[0]?.productCode)?.condition" class="badge ms-2"
                  :class="conditionColorClass(findProductByCode(sale.productList[0]?.productCode)?.condition)">
                  {{ findProductByCode(sale.productList[0]?.productCode)?.condition }}
                </span>
              </h6>
              <p class="card-text text-muted text-nowrap">{{ sale.description }}</p>
              <p v-if="getMinPrice(sale)" class="fw-bold mt-2 text-nowrap">
                월 {{ getMinPrice(sale).price.toLocaleString() }}원 /
                {{ getMinPrice(sale).period }}개월
              </p>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center text-muted py-5">
        해당 카테고리에 등록된 상품이 없습니다.
      </div>

      <div class="text-center mt-4" v-if="totalPages > 1">
        <button v-for="n in totalPages" :key="n" class="btn btn-outline-secondary mx-1"
          :class="{ 'btn-dark': n - 1 === currentPage }" @click="changePage(n - 1)">
          {{ n }}
        </button>
      </div>
    </div>

    <div class="position-fixed bottom-0 end-0 p-3 d-flex flex-column align-items-center gap-2">
      <button class="btn btn-outline-secondary rounded-circle">🔍</button>
      <button class="btn btn-dark rounded-circle">TOP</button>
    </div>
  </div>
</template>

<style scoped>
.banner-section {
  position: relative;
  height: 300px;
  background-color: #c4c9c3;
  overflow: hidden;
}

.banner-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

.text-area {
  position: absolute;
  top: 50%;
  left: 30px;
  transform: translateY(-50%);
  color: #000;
}

.text01 {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.text02 {
  font-size: 2rem;
  font-weight: bold;
}

.card img {
  height: 250px;
  object-fit: contain;
}
</style>
