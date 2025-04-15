<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSaleStore } from '../../store/useSaleStore'
import { useProductStore } from '../../store/useProductStore'

const route = useRoute()
const router = useRouter()
const saleStore = useSaleStore()
const productStore = useProductStore()

const categoryIdx = ref(route.params.categoryIdx)

onMounted(() => {
  saleStore.fetchSaleListByCategory(categoryIdx.value)
  productStore.fetchProductList()
})

watch(() => route.params.categoryIdx, (newVal) => {
  categoryIdx.value = newVal
  saleStore.fetchSaleListByCategory(newVal)
})

// 상세 페이지 이동
function goToDetail(productCode) {
  router.push(`/sale/detail/${productCode}`)
}

// 상품 이미지 가져오기
function getProductImage(productCode) {
  const product = productStore.products.find(p => p.code === productCode)
  return product?.productImages?.[0]?.productImgUrl || '/assets/images/placeholder.png'
}

// 등급에 따라 색상 클래스 반환(S급은 초록색, A급은 파랑, B급은 노랑, C급은 빨강)
function conditionColorClass(condition) {
  switch (condition) {
    case 'S급':
      return 'bg-success'
    case 'A급':
      return 'bg-primary'
    case 'B급':
      return 'bg-warning text-dark'
    case 'C급':
      return 'bg-danger'
    default:
      return 'bg-secondary'
  }
}

// 최저 가격 구하기
function getMinPrice(sale) {
  if (!sale.priceList || sale.priceList.length === 0) return null
  const sorted = [...sale.priceList].sort((a, b) => a.price - b.price)
  return sorted[0]
}

</script>

<template>
  <div class="container-fluid p-0">
    <!-- 배너 -->
    <section class="banner-section">
      <img src="https://rentalcdn.lghellovision.net/uploads/category/l2nml1EqiU.jpg" alt="배너 이미지"
        class="banner-image" />
      <div class="text-area">
        <div class="text01">온 가족이 함께 더 생생한 화질로</div>
        <div class="text02"><strong>TV 렌탈&amp;구독</strong></div>
      </div>
    </section>

    <!-- 카테고리 탭 -->
    <div class="category-tabs bg-white border-bottom py-4">
      <div class="container d-flex gap-3">
        <button class="btn btn-primary">UHD TV</button>
        <button class="btn btn-light">LED TV</button>
        <button class="btn btn-light">디자인 TV</button>
      </div>
    </div>

    <!-- 추천 상품 -->
    <div class="container py-5">
      <h4 class="fw-bold mb-3">많은 고객님들이 선택한 상품이에요</h4>
      <div v-if="saleStore.saleList.length > 0" class="row g-4">
        <div v-for="(sale, idx) in saleStore.saleList" :key="idx" class="col-md-4"
          @click="goToDetail(sale.productList[0]?.productCode)" style="cursor: pointer">
          <!-- 카드 내부 이미지 출력 부분 수정 -->
          <div class="card h-100 shadow-sm">
            <!-- 여러 이미지 출력 -->
            <div class="d-flex flex-nowrap justify-content-center gap-2 flex-wrap p-2">
              <img v-for="(product, pIdx) in sale.productList" :key="pIdx" :src="getProductImage(product.productCode)"
                class="img-thumbnail" style="width: 120px; height: 120px; object-fit: cover;" />
            </div>

            <div class="card-body text-center">
              <h6 class="card-title fw-bold d-flex justify-content-center align-items-center">
                {{ sale.name }}
                <span v-if="sale.productList[0]?.conditionName" class="badge ms-2"
                  :class="conditionColorClass(sale.productList[0].conditionName)">
                  {{ sale.productList[0].conditionName }}
                </span>
              </h6>

              <p class="card-text text-muted">{{ sale.description }}</p>

              <p v-if="getMinPrice(sale)" class="fw-bold mt-2">
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
    </div>

    <!-- 하단 버튼 -->
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
