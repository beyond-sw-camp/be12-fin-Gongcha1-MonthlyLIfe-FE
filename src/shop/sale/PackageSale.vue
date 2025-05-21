<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useSaleStore } from '../../store/useSaleStore'

const router      = useRouter()
const saleStore   = useSaleStore()

// pagination state
const pageSize    = 9
const currentPage = ref(0)
const endReached  = ref(false)
const loading     = ref(false)
// accumulated list for display
const displayList = ref([])

// navigate to detail
function goToDetail(pkg) {
  router.push(`/sale/detail/${pkg.categoryIdx}/${pkg.saleIdx}`)
}

// collect all image URLs from package.productList
function getImages(pkg) {
  return pkg.productList.flatMap(p => p.imageUrls || [])
}

// pick lowest price option
function getMinPrice(pkg) {
  return pkg.priceList?.reduce(
    (min, p) => (p.price < min.price ? p : min),
    pkg.priceList[0]
  )
}

// badge color by condition
function conditionColorClass(cond) {
  switch (cond) {
    case 'S급': return 'bg-success'
    case 'A급': return 'bg-primary'
    case 'B급': return 'bg-warning text-dark'
    case 'C급': return 'bg-danger'
    default:    return 'bg-secondary'
  }
}

// fetch next slice and append
async function loadMore() {
  if (loading.value || endReached.value) return
  loading.value = true

  // call API
  await saleStore.fetchPackageSales(currentPage.value, pageSize)

  // unpack
  const slice = saleStore.packageList
  const items = slice.content || []

  if (currentPage.value === 0) {
    displayList.value = items
  } else {
    displayList.value.push(...items)
  }

  // detect end
  // Slice JSON has `last` boolean
  if (slice.last) {
    endReached.value = true
  } else {
    currentPage.value++
  }

  loading.value = false
}

// infinite‐scroll handler
function onScroll() {
  const scrollBottom = window.innerHeight + window.scrollY
  const docHeight    = document.documentElement.scrollHeight
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
</script>

<template>
  <section class="banner-section">
    <img
      src="https://rentalcdn.lghellovision.net/uploads/category/l2nml1EqiU.jpg"
      alt="배너 이미지"
      class="banner-image"
    />
    <div class="text-area">
      <div class="text02"><strong>더 알뜰하게, 더 편리하게</strong></div>
    </div>
  </section>

  <div class="container py-5">
    <h4 class="fw-bold mb-4">🎁 패키지 특가 상품</h4>

    <div v-if="displayList.length" class="row g-4">
      <div
        v-for="pkg in displayList"
        :key="pkg.saleIdx"
        class="col-md-4"
        @click="goToDetail(pkg)"
        style="cursor:pointer"
      >
        <div class="card h-100 shadow-sm">
          <!-- 이미지 래퍼 -->
          <!-- <div class="d-flex flex-wrap justify-content-center gap-2 p-2">
            <img
              v-for="(url, i) in getImages(pkg)"
              :key="i"
              :src="url || '/assets/images/placeholder.png'"
              class="img-thumbnail"
              style="width:120px; height:120px; object-fit:cover;"
            />
          </div> -->
          <div class="text-center p-2">
  <img
    :src="getImages(pkg)?.[0] || '/assets/images/placeholder.png'"
    class="img-thumbnail"
    style="width: 120px; height: 120px; object-fit: cover;"
  />
</div>
          <div class="card-body text-center">
            <h6 class="card-title fw-bold">
              {{ pkg.name }}
              <span
                v-if="pkg.productList[0]?.conditionName"
                class="badge ms-2"
                :class="conditionColorClass(pkg.productList[0].conditionName)"
              >
                {{ pkg.productList[0].conditionName }}
              </span>
            </h6>
            <p class="text-muted text-nowrap">{{ pkg.description }}</p>
            <p v-if="getMinPrice(pkg)" class="fw-bold mt-2 text-nowrap">
              월 {{ getMinPrice(pkg).price.toLocaleString() }}원 /
              {{ getMinPrice(pkg).period }}개월
            </p>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center text-muted py-5">
      등록된 상품이 없습니다.
    </div>

    <!-- Load More + Infinite Scroll -->
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
