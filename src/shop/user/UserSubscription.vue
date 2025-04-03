<template>
  <div class="container py-4">
    <!-- 구독 목록 카드 -->
    <div class="card shadow-sm mb-4">
      <div class="card-header bg-white d-flex justify-content-between align-items-center">
        <h5 class="mb-0">구독 목록</h5>
        <!-- 필터 (최근 6개월, 연도 선택 등) -->
        <div>
          <button class="btn btn-outline-secondary btn-sm me-2">최근 6개월</button>
          <button class="btn btn-outline-secondary btn-sm">2025</button>
          <!-- 필요하면 2024, 2023... 버튼 추가 -->
        </div>
      </div>
      <!-- 검색 -->
      <div class="card-body">
        <input
            type="text"
            class="form-control mb-3"
            placeholder="주문한 상품을 검색할 수 있어요!"
        />

        <!-- 첫 번째 구독 (구독 중) -->
        <div class="mb-4 border p-3 rounded">
          <h6 class="fw-bold text-lg-start">2025. 4. 1 구독</h6>
          <div class="border p-3 rounded">
            <div class="mb-2 text-muted text-lg-start fw-bolder">
              구독 중 · 다음 결제일 5/1
            </div>
            <div class="d-flex align-items-center">
              <img
                  src="https://thumbnail.coupangcdn.com/thumbnails/remote/96x96ex/image/vendor_inventory/673d/52094cc6f98f5c0416362543630cc3a7628188e20ff36179a6c3f0563ae2.jpg"
                  alt="상품이미지"
                  width="64"
                  height="64"
                  class="me-3"
              />
              <div>
                <p class="mb-1 fw-bold">웰스 슈퍼쿨링 직수 정수기 (냉온정)</p>
                <small class="text-muted">월 결재액 17,500원  기간:  3/6개월</small>
              </div>
              <div class="ms-auto d-flex flex-column">
                <button class="btn btn-outline-primary btn-sm mb-2">구독 중</button>
                <button class="btn btn-outline-primary btn-sm">교환,반품 신청</button>
              </div>
            </div>
          </div>
        </div>

        <!-- 두 번째 구독 (구독 해지) -->
        <div class="mb-4 border p-3 rounded" >
          <h6 class="fw-bold text-lg-start">2025.3.31 구독 해지</h6>
          <div class="border p-3 rounded">
          <div class="mb-2 text-muted text-lg-start fw-bolder">

          구독 종료</div>
            <div class="d-flex align-items-center">
              <img
                  src="https://thumbnail.coupangcdn.com/thumbnails/remote/96x96ex/image/retail/images/2024/05/09/12/3/7019a503-42f4-4964-bcaa-fbeafa27f727.jpg"
                  alt="상품이미지"
                  width="64"
                  height="64"
                  class="me-3"
              />
              <div>
                <p class="mb-1 fw-bold">웰스 슈퍼쿨링 직수 정수기 (냉온정)</p>
                <small class="text-muted">월 결재액 17,500원  기간:  3/3개월</small>
              </div>
              <div class="ms-auto d-flex flex-column">
                <button class="btn btn-outline-primary btn-sm mb-2">구독하기</button>
              </div>
            </div>
          </div>
        </div>

        <!-- 더보기 버튼 -->
        <div class="text-end">
          <button class="btn btn-outline-secondary btn-sm">더보기</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SubscriptionList",
  mounted() {
    // 필요하면 쿠팡 템플릿 헬퍼 등 로직 추가
    // ...
  },
};
</script>

<style scoped>
/* 부트스트랩 기본 스타일 외에 추가 커스텀 스타일이 필요하다면 여기에 작성 */
</style>
