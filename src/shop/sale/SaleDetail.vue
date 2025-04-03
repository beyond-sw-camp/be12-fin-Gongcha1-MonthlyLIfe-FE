<template>
  <section id="electronics-detail-view" class="py-5 bg-light">
    <div class="container my-container">
      <div class="row g-5 align-items-start">
        <!-- 왼쪽: 제품 이미지 슬라이더 카드 -->
        <div class="col-lg-6">
          <div class="card shadow-sm">
            <div class="card-header bg-primary text-white">
              <h5 class="card-title mb-0">제품 이미지</h5>
            </div>
            <div class="card-body p-0">
              <div id="productCarousel" class="carousel slide" data-bs-ride="carousel">
                <!-- 슬라이드 인디케이터 -->
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
                <!-- 슬라이드 아이템 -->
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
                <!-- 좌우 컨트롤 버튼 -->
                <button
                    class="carousel-control-prev"
                    type="button"
                    data-bs-target="#productCarousel"
                    data-bs-slide="prev"
                    @click="prevSlide"
                >
                  <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                  <span class="visually-hidden">이전</span>
                </button>
                <button
                    class="carousel-control-next"
                    type="button"
                    data-bs-target="#productCarousel"
                    data-bs-slide="next"
                    @click="nextSlide"
                >
                  <span class="carousel-control-next-icon" aria-hidden="true"></span>
                  <span class="visually-hidden">다음</span>
                </button>
              </div>
            </div>
          </div>
          <!-- 제품 타입 및 색상 옵션 -->
          <div class="mt-3">
            <div class="row">
              <div class="col-auto">
                <div class="color-box" style="background-color: #fff;"></div>
              </div>
              <div class="col-auto">
                <div class="color-box" style="background-color: #f8b9b9;"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- 오른쪽: 제품 상세 정보 및 옵션 카드 -->
        <div class="col-lg-6">
          <div class="card shadow-sm">
            <div class="card-body">
              <div class="d-flex justify-content-between">
                <div>
                  <h2 class="card-title">{{ product.name }}</h2>
                  <p class="text-muted mb-0">렌탈 수 {{ product.rentalCount }}회</p>
                </div>
              </div>
              <div class="mt-3">
                <span class="badge bg-secondary me-1">#가장 인기 있는</span>
                <span class="badge bg-secondary">#가성비</span>
              </div>
              <hr />

              <!-- 약정기간 옵션 -->
              <div class="mb-3">
                <span class="fw-bold">약정기간:</span>
                <div class="btn-group btn-group-sm ms-2">
                  <button
                      v-for="term in terms"
                      :key="term"
                      type="button"
                      class="btn"
                      :class="{
                      'btn-primary': selectedTerm === term,
                      'btn-outline-secondary': selectedTerm !== term
                    }"
                      @click="selectedTerm = term"
                  >
                    {{ term }}개월
                  </button>
                </div>
              </div>
              <!-- 수량 조절 -->

              <!-- 장바구니 및 구독 버튼 -->
              <div class="mb-3">
                <button class="btn btn-danger me-2" @click="addToCart">장바구니</button>
                <button class="btn btn-warning" @click="subscribe">구독</button>
              </div>
            </div>
          </div>
        </div>
      </div> <!-- end row -->
    </div>
  </section>
</template>

<script>
export default {
  name: "ElectronicsDetailView",
  data() {
    return {
      product: {
        name: "쿠쿠 STEAM 100도씨 끓인물 정수기 (냉온정)",
        rentalCount: 207
      },
      images: [
        "https://image.ajd.kr/PRODUCT_CODE/630a9a0a-d5c6-4956-b96c-338ac28b8f9f",
        "https://image.ajd.kr/PRODUCT_CODE/df62ff5f-1b2b-46de-922d-52d519b90e05",
        "https://image.ajd.kr/PRODUCT_CODE/3aad6d67-300c-4330-8ad6-ff341d63d208"
      ],
      activeIndex: 0,
      paymentMethods: ["카카오페이", "신용카드", "계좌이체"],
      paymentMethod: "카카오페이",
      terms: [3, 6, 9],
      selectedTerm: 3,
      quantity: 1
    };
  },
  methods: {
    nextSlide() {
      this.activeIndex = (this.activeIndex + 1) % this.images.length;
    },
    prevSlide() {
      this.activeIndex = (this.activeIndex - 1 + this.images.length) % this.images.length;
    },
    increment() {
      this.quantity++;
    },
    decrement() {
      if (this.quantity > 1) this.quantity--;
    },
    addToCart() {
      alert("장바구니에 담았습니다!");
      // 추가 로직 구현
    },
    subscribe() {


      this.$router.push({name: 'subscription'});

    }
  }
};
</script>

<style scoped>
/* 컨테이너의 최대 너비를 조절해 가운데 공간이 덜 벌어지도록 함 */
.my-container {
  max-width: 1200px; /* 필요 시 1000px, 1100px 등으로 조절 */
}

/* 슬라이드 아이콘 더 잘 보이게 하기 */
.carousel-control-prev-icon,
.carousel-control-next-icon {
  filter: brightness(0.5);
}

.color-box {
  width: 40px;
  height: 40px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.card {
  height: 500px;
}


.carousel-inner {
  height: 400px;
}

.carousel-item img {
  object-fit: cover;
  height: 400px;
}
</style>
