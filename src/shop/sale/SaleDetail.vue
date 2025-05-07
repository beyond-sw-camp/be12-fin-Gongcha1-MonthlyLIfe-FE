<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute,useRouter } from 'vue-router'
import { useSaleStore } from '../../store/useSaleStore'
import { useProductStore } from '../../store/useProductStore'
import { useSubscribeStore } from '../../store/useSubcribeStore'
const router = useRouter()
const route = useRoute()
const saleStore = useSaleStore()
const productStore = useProductStore()
const subscribeStore = useSubscribeStore()

const categoryIdx = Number(route.params.categoryIdx)
const saleIdx = Number(route.params.saleIdx)

const activeIndex = ref(0)
const selectedTerm = ref(3)

const images = computed(() =>
  saleStore.saleDetail.productList.map(p => {
    const prod = productStore.products.find(prod => prod.code === p.productCode)
    return prod?.productImages?.[0]?.productImgUrl || '/assets/images/placeholder.png'
  })
)

const terms = computed(() => saleStore.saleDetail.priceList.map(p => p.period))

const priceMap = computed(() =>
  Object.fromEntries(saleStore.saleDetail.priceList.map(p => [p.period, p.price]))
)

const currentProduct = computed(() => {
  const code = saleStore.saleDetail.productList?.[0]?.productCode
  return productStore.products.find(p => p.code === code) || {}
})

// 설명 이미지 URL
const descriptionImage = computed(() => currentProduct.value.descriptionImageUrl)

onMounted(async () => {
  await productStore.fetchProductList()
  await saleStore.fetchSaleDetail(categoryIdx, saleIdx)
})

const nextSlide = () => {
  activeIndex.value = (activeIndex.value + 1) % images.value.length
}
const prevSlide = () => {
  activeIndex.value = (activeIndex.value - 1 + images.value.length) % images.value.length
}

const addToCart = () => {
  // 1) 선택된 기간의 price 객체 찾기
  const sel = saleStore.saleDetail.priceList
    .find(p => p.period === selectedTerm.value)

  if (!sel?.salePriceIdx) {
    return alert('잘못된 상품 정보입니다.')
  }

  // 2) 액션 호출 후 결과에 따라 알림
  subscribeStore.addCartItem(sel.salePriceIdx)

    .then(ok => {
      if (ok) alert('장바구니에 담았습니다!')
      else   alert(`장바구니 추가 실패: ${subscribeStore.cartError || ''}`)
    })
}



const subscribe = () => {
  // 1) 선택된 기간(개월) 찾아서
  const sel = saleStore.saleDetail.priceList.find(p => p.period === selectedTerm.value)
  if (!sel?.salePriceIdx) {
    return alert('잘못된 상품 정보입니다.')
  }

  const payload = [{
    saleIdx:      parseInt(route.params.saleIdx,10),  // 판매 상품 ID
    salePriceIdx: sel.salePriceIdx,              // 선택된 옵션의 PK
    period:       sel.period,                    // 개월 수
    price:        sel.price,                     // 월 가격
  }]

  router.push({
    name: 'subscription',
    query: {
      items: encodeURIComponent(JSON.stringify(payload))
    }
  })
}

</script>

<template>
  <section id="electronics-detail-view" class="py-5 bg-light">
    <div class="container my-container">
      <div class="row g-5 align-items-start">
        <!-- 왼쪽: 제품 이미지 -->
        <div class="col-lg-6">
          <div class="card shadow-sm carousel-card">
            <div class="card-header bg-primary text-white">
              <h5 class="card-title mb-0">제품 이미지</h5>
            </div>
            <div class="card-body p-0">
              <div id="productCarousel" class="carousel slide" data-bs-ride="carousel">
                <div class="carousel-indicators">
                  <button
                    v-for="(img, index) in images"
                    :key="index"
                    type="button"
                    data-bs-target="#productCarousel"
                    :data-bs-slide-to="index"
                    :class="{ active: index === activeIndex }"
                    :aria-current="index === activeIndex ? 'true' : null"
                    :aria-label="'Slide ' + (index + 1)"
                  ></button>
                </div>
                <div class="carousel-inner">
                  <div
                    v-for="(img, index) in images"
                    :key="index"
                    class="carousel-item"
                    :class="{ active: index === activeIndex }"
                  >
                    <img :src="img" class="d-block w-100" alt="제품 이미지" />
                  </div>
                </div>
                <button class="carousel-control-prev" type="button" @click="prevSlide">
                  <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                  <span class="visually-hidden">이전</span>
                </button>
                <button class="carousel-control-next" type="button" @click="nextSlide">
                  <span class="carousel-control-next-icon" aria-hidden="true"></span>
                  <span class="visually-hidden">다음</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 오른쪽: 정보 -->
        <div class="col-lg-6">
          <div class="card shadow-sm info-card">
            <div class="card-body">
              <h2 class="card-title">{{ saleStore.saleDetail.name }}</h2>
              <div class="mt-3">
                <span class="badge bg-secondary me-1">#가장 인기 있는</span>
                <span class="badge bg-secondary">#가성비</span>
              </div>
              <hr />
              <div class="mb-3">
                <span class="fw-bold">약정기간:</span>
                <div class="btn-group btn-group-sm ms-2">
                  <button
                    v-for="term in terms"
                    :key="term"
                    type="button"
                    class="btn"
                    :class="{ 'btn-primary': selectedTerm === term, 'btn-outline-secondary': selectedTerm !== term }"
                    @click="selectedTerm = term"
                  >
                    {{ term }}개월
                  </button>
                </div>
              </div>
              <p class="fw-bold mt-3">
                월 {{ priceMap[selectedTerm]?.toLocaleString() || 0 }}원 / {{ selectedTerm }}개월
              </p>
              <div class="mb-3">
                <button class="btn btn-danger me-2" @click="addToCart">장바구니</button>
                <button class="btn btn-warning" @click="subscribe">구독</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 2행: 상품 설명 -->
      <div class="row mt-4">
        <div class="col-12">
          <div class="card shadow-sm description-card">
            <div class="card-body">
              <h4 class="mb-3">상품 설명</h4>
              <p>{{ currentProduct.description }}</p>
              <div v-if="descriptionImage" class="mt-3">
                <img
                  :src="descriptionImage"
                  alt="상품 설명 이미지"
                  class="w-100 description-image"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.my-container {
  max-width: 1200px;
}

.carousel-control-prev-icon,
.carousel-control-next-icon {
  filter: brightness(0.5);
}

/* carousel-card: 고정 높이 */
.carousel-card {
  height: 500px;
}
.carousel-card .carousel-inner {
  height: 400px;
}
.carousel-card .carousel-item img {
  object-fit: cover;
  height: 400px;
  width: 100%;
}

/* info-card: carousel-card 와 동일 높이, 스크롤 */
.info-card {
  height: 500px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.info-card .card-body {
  overflow-y: auto;
}

/* 설명 이미지 스타일 */
.description-image {
  width: 100%;
  height: auto;
  display: block;
}
</style>
