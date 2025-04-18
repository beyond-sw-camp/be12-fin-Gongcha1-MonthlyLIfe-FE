
<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useSubscribeStore } from '../../store/useSubcribeStore.js'

const route = useRoute()
const store = useSubscribeStore()

const fallbackImg = 'https://via.placeholder.com/300x200?text=No+Image'
const returnDate = ref('')
const note = ref('')

onMounted(() => {
  const detailIdx = route.params.detailIdx
  store.fetchSubscribeDetail(detailIdx)
})

const submitReturn = () => {
  console.log('반납 신청 데이터:', {
    subscribeDetailIdx: store.detail?.subscribeDetailIdx,
    returnDate: returnDate.value,
    note: note.value,
  })
  alert('반납 신청이 완료되었습니다!')
}
</script>

<template>
  <div class="container py-5">
    <div v-if="store.loading" class="text-center">로딩 중...</div>
    <div v-else-if="store.error" class="alert alert-danger text-center">{{ store.error }}</div>
    <div v-else-if="store.detail" class="fade-in">
      <!-- 제품 이미지 -->
      <div class="text-center mb-4">
        <img
            :src="store.detail.imageUrl"
            @error="e => e.target.src = fallbackImg"
            alt="제품 이미지"
            class="img-fluid rounded shadow-sm"
            style="max-height: 300px;"
        />
      </div>

      <!-- 폼 카드 -->
      <div class="card shadow-lg return_card border-0">
        <div class="card-body p-4">
          <!-- 렌탈 정보 -->
          <div class="mb-3">
            <label class="form-label fw-bold">렌탈 상품명</label>
            <input type="text" class="form-control" :value="store.detail.salename" readonly />
          </div>

          <!-- 고객명 -->
          <div class="mb-3">
            <label class="form-label fw-bold">고객명</label>
            <input type="text" class="form-control" value="이우진" readonly />
          </div>

          <!-- 구독 기간 -->
          <div class="mb-3">
            <label class="form-label fw-bold">구독 기간</label>
            <input type="text" class="form-control" :value="`${store.detail.period}개월`" readonly />
          </div>

          <!-- 가격 -->
          <div class="mb-3">
            <label class="form-label fw-bold">가격</label>
            <input type="text" class="form-control" :value="`${store.detail.price.toLocaleString()}원`" readonly />
          </div>

          <!-- 반납 예정일 -->
          <div class="mb-3">
            <label class="form-label fw-bold">반납 예정일</label>
            <input type="date" class="form-control" v-model="returnDate" />
          </div>

          <!-- 참고사항 -->
          <div class="mb-4">
            <label class="form-label fw-bold">제품 상태 및 참고사항</label>
            <textarea class="form-control" rows="3" v-model="note" placeholder="제품 상태 및 반납 시 참고사항을 입력하세요"></textarea>
          </div>

          <!-- 버튼 -->
          <div class="text-end">
            <button class="btn btn-outline-primary btn-lg" @click="submitReturn">반납 신청</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>



<style scoped>
.return_card {
  width: 800px;
  margin: auto;
  border-radius: 16px;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.05);
}

.fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>