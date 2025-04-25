<script setup>
import { ref, onMounted } from 'vue'

const postalCode = ref('')
const address1 = ref('')
const address2 = ref('')

const openDaumPostcode = () => {
  new window.daum.Postcode({
    oncomplete: function (data) {
      postalCode.value = data.zonecode
      address1.value = data.roadAddress

      // 상세주소로 포커스 이동
      setTimeout(() => {
        document.getElementById('address2')?.focus()
      }, 0)
    }
  }).open()
}

onMounted(() => {
  const script = document.createElement('script')
  script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'
  script.async = true
  document.body.appendChild(script)
})

defineExpose({
  postalCode,
  address1,
  address2
})
</script>

<template>
  <div class="container text-nowrap">
    <div class="mb-3 row">
      <small class="text-start d-block no-padding">우편번호</small>
      <div class="d-flex no-padding">
        <input type="text" v-model="postalCode" readonly class="underline-input">
        <button class="btn btn-dark text-nowrap btn-sm" @click="openDaumPostcode" style="font-size: 10px">검색</button>
      </div>
    </div>

    <div class="mb-3 row">
      <small class="text-start d-block no-padding">주소</small>
      <input type="text" v-model="address1" readonly class="underline-input">
    </div>

    <div class="mb-3 row">
      <small class="text-start d-block no-padding">상세주소</small>
      <input type="text" v-model="address2" class="underline-input">
    </div>
  </div>
</template>

<style scoped>
.underline-input {
  border: none;
  border-bottom: 1px solid #000; /* 밑줄 스타일 */
  outline: none; /* 클릭 시 파란 테두리 제거 */
  width: 100%; /* 입력창 너비 조절 */
  padding: 5px 0; /* 위아래 여백 조절 */
  background: transparent; /* 배경 제거 */
  font-size: 16px;
}
.no-padding {
  padding: 0 !important;
  margin: 0 !important;
}
</style>
