

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useSaleStore } from '../../store/useSaleStore'

const router = useRouter()
const route = useRoute()
const saleStore = useSaleStore()

// 한 번에 불러올 개수
const pageSize = 9
const currentPage = ref(0)
const endReached = ref(false)
const loading = ref(false)
const keyword = ref(route.query.keyword || '')
const displayList = ref([])

// 상세 페이지 이동
const goToDetail = (sale) => {
  router.push(`/sale/detail/${sale.categoryIdx}/${sale.idx}`)
}

// 각 상품의 모든 이미지 URL 배열을 반환
function getImages(sale) {
  return sale.productList.flatMap(p => p.imageUrls || [])
}

// 최소가 찾아서 반환
function getMinPrice(sale) {
  return sale.priceList?.reduce(
    (min, p) => (p.price < min.price ? p : min),
    sale.priceList[0]
  )
}

// 등급에 따른 배지 색
function conditionColorClass(cond) {
  switch (cond) {
    case 'S급': return 'bg-success'
    case 'A급': return 'bg-primary'
    case 'B급': return 'bg-warning text-dark'
    case 'C급': return 'bg-danger'
    default:    return 'bg-secondary'
  }
}

// 다음 페이지 로드
async function loadMore() {
  if (loading.value || endReached.value) return
  loading.value = true

  // 1) API 호출
  if (keyword.value) {
    await saleStore.fetchSalesByKeyword(currentPage.value, pageSize, keyword.value)
  } else {
    await saleStore.fetchAllSales(currentPage.value, pageSize)
  }

  // 2) 결과 누적
  const { content, last } = saleStore.saleList
  if (currentPage.value === 0) {
    displayList.value = [...content]
  } else {
    displayList.value.push(...content)
  }

  // 3) 마지막 페이지인지 판단
  if (last) {
    endReached.value = true
  } else {
    currentPage.value++
  }

  loading.value = false
}


// 스크롤 바닥 감지
const onScroll = () => {
  const scrollBottom = window.innerHeight + window.scrollY
  const docHeight = document.documentElement.scrollHeight
  if (scrollBottom >= docHeight - 200) {
    loadMore()
  }
}

onMounted(() => {
  loadMore()
  window.addEventListener('scroll', onScroll)
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
})

// 검색어 변화 감지해서 다시 로드
watch(() => route.query.keyword, async (newKeyword, oldKeyword) => {
  if (newKeyword !== oldKeyword) {
    keyword.value = newKeyword
    currentPage.value = 0
    endReached.value = false
    displayList.value = []
    await loadMore()
  }
})

</script>

<template>
  <section class="banner-section">
    <img
      src="https://rentalcdn.lghellovision.net/uploads/category/l2nml1EqiU.jpg"
      alt="배너 이미지"
      class="banner-image"
    />
    <div class="text-area">
      <div class="text02"><strong>원하는 모든 제품, 렌탈로 쉽게</strong></div>
    </div>
  </section>

  <div class="container py-5">
    <h4 class="fw-bold mb-3">
      {{ keyword ? `"${keyword}" 검색 결과` : '모든 상품을 한눈에' }}
    </h4>

    <div v-if="displayList.length" class="row g-4">
      <div
        v-for="sale in displayList"
        :key="sale.idx"
        class="col-md-4"
        @click="goToDetail(sale)"
        style="cursor:pointer"
      >
        <div class="card h-100 shadow-sm">
          <div class="d-flex flex-wrap justify-content-center gap-2 p-2">
            <img
              v-for="(url, i) in getImages(sale)"
              :key="i"
              :src="url || '/assets/images/placeholder.png'"
              class="img-thumbnail"
              style="width:120px; height:120px; object-fit:cover;"
            />
          </div>
          <div class="card-body text-center">
            <h6 class="card-title fw-bold">
              {{ sale.name }}
              <span
                v-if="sale.productList[0]?.conditionName"
                class="badge ms-2"
                :class="conditionColorClass(sale.productList[0].conditionName)"
              >
                {{ sale.productList[0].conditionName }}
              </span>
            </h6>
            <p class="text-muted text-nowrap">{{ sale.description }}</p>
            <p v-if="getMinPrice(sale)" class="fw-bold mt-2 text-nowrap">
              월 {{ getMinPrice(sale).price.toLocaleString() }}원 /
              {{ getMinPrice(sale).period }}개월
            </p>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center text-muted py-5">
      등록된 상품이 없습니다.
    </div>

    <div class="text-center mt-4">
      <button
        v-if="!endReached && !loading"
        class="btn btn-primary"
        @click="loadMore"
      >
        더 보기
      </button>
      <div v-if="loading" class="text-center py-2">로딩 중...</div>
      <div v-else-if="endReached" class="text-center text-secondary py-2">
        더 이상 상품이 존재하지 않습니다.
      </div>
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

.text02 {
  font-size: 2rem;
  font-weight: bold;
}

.card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  z-index: 1;
}

.card:hover {
  transform: scale(1.03) translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  z-index: 2;
}
</style>
