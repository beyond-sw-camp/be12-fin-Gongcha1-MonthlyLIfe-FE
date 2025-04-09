<script setup>
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const categoryIdx = ref(route.params.categoryIdx)

// 카테고리별 상품 목록
const productMap = {
  1: [
    {
      id: 1,
      brand: "LG",
      name: "[사운드바 증정] 75인치 울트라HD/스마트TV(벽걸이형)",
      originalPrice: "47,900",
      price: "30,900",
      badge: "사운드 증정",
      image: '/assets/images/tv1.png',
    },
    {
      id: 2,
      brand: "LG",
      name: "[두카] 울트라 HD 스마트 TV 75인치",
      originalPrice: "24,900",
      price: "17,900",
      badge: "최다",
      image: '/assets/images/tv2.png',
    },
  ],
  2: [
    {
      id: 3,
      brand: "SAMSUNG",
      name: "그랑데 세탁기 + 건조기 패키지",
      originalPrice: "24,900",
      price: "17,900",
      badge: "특가",
      image: '/assets/images/pakage.png',
    },
  ],
  3: [] // 추가 가능
}

const products = ref(productMap[categoryIdx.value] || [])

watch(
  () => route.params.categoryIdx,
  (newVal) => {
    categoryIdx.value = newVal
    products.value = productMap[newVal] || []
  }
)

function goToDetail(productId) {
  router.push(`/sale/detail/${productId}`)
}
</script>

<template>
  <!-- 전체 컨테이너 -->
  <div class="container-fluid p-0">
    
    <!-- 상단 배너 섹션  -->
    <section class="banner-section">
      <img
        src="https://rentalcdn.lghellovision.net/uploads/category/l2nml1EqiU.jpg"
        alt="배너 이미지"
        class="banner-image"
      />
      <div class="text-area">
        <div class="text01">온 가족이 함께 더 생생한 화질로</div>
        <div class="text02"><strong>TV 렌탈&amp;구독</strong></div>
      </div>
    </section>
    
    <!-- 카테고리 탭 섹션 -->
    <div class="category-tabs bg-white border-bottom py-4">
      <div class="container d-flex gap-3">
        <button class="btn btn-danger">UHD TV 53</button>
        <button class="btn btn-light">LED TV 7</button>
        <button class="btn btn-light">디자인 TV 10</button>
      </div>
    </div>
    
    <!-- 고객 추천 상품 섹션 -->
    <div class="container py-5">
      <h4 class="fw-bold mb-3">많은 고객님들이 선택한 상품이에요</h4>
      <div class="position-relative">
        <div class="d-flex overflow-auto pb-3">
          <div
            v-for="(product, idx) in products"
            :key="idx"
            class="card me-3"
            style="min-width: 200px; flex: 0 0 auto;"
            @click="goToDetail(product.id)"
          >
            <img :src="product.image" class="card-img-top" alt="product image" />
            <div class="card-body">
              <h6 class="card-title fw-bold">{{ product.brand }}</h6>
              <p class="card-text small">{{ product.name }}</p>
              <p class="text-muted small"><del>{{ product.originalPrice }}원</del></p>
              <p class="fw-bold">{{ product.price }}원</p>
              <span v-if="product.badge" class="badge bg-primary">{{ product.badge }}</span>
            </div>
          </div>
        </div>
        <!-- 좌우 스크롤 버튼  -->
        <button class="btn btn-light position-absolute top-50 start-0 translate-middle-y shadow">&lt;</button>
        <button class="btn btn-light position-absolute top-50 end-0 translate-middle-y shadow">&gt;</button>
      </div>
    </div>
    
    <!-- 하단 고정 버튼 -->
    <div class="position-fixed bottom-0 end-0 p-3 d-flex flex-column align-items-center gap-2">
      <button class="btn btn-outline-secondary rounded-circle">🔍</button>
      <button class="btn btn-dark rounded-circle">TOP</button>
    </div>
    
  </div>
</template>

<style scoped>
/* 배너 섹션 */
.banner-section {
  position: relative;
  height: 300px; /* 배너 자체의 크기를 키웠습니다 */
  background-color: #c4c9c3;
  overflow: hidden;
}

/* 배너 이미지: 이미지 전체가 보이도록 */
.banner-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

/* 텍스트 영역: 배너 위에 오버레이 */
.text-area {
  position: absolute;
  top: 50%;
  left: 30px;
  transform: translateY(-50%);
  color: #000;
}

/* 부제 텍스트 */
.text01 {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

/* 메인 타이틀 */
.text02 {
  font-size: 2rem;
  font-weight: bold;
}

/* 상품 카드 이미지 크기 조정 */
.card img {
  height: 250px;
  object-fit: fit;
}
</style>