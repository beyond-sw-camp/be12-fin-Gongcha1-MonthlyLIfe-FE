<script setup>
import { ref, computed } from "vue";

// 폼 데이터
const productName = ref("");
const condition = ref("");
const description = ref("");
const price = ref(0);
const images = ref([]);


// 카테고리 데이터 (소형가구 렌탈샵)
const mainCategories = ref([
  "거실 가구",
  "침실 가구",
  "주방/식당 가구",
  "사무실 가구"
]);

// 선택된 메인 카테고리에 따라 서브 카테고리 목록 설정
const subCategories = computed(() => {
  if (selectedMainCategory.value === "거실 가구") return ["소파", "커피 테이블", "TV 스탠드", "책장"];
  if (selectedMainCategory.value === "침실 가구") return ["침대", "옷장", "서랍장"];
  if (selectedMainCategory.value === "주방/식당 가구") return ["식탁", "식당 의자", "바 테이블"];
  if (selectedMainCategory.value === "사무실 가구") return ["책상", "사무용 의자", "서류함"];
  return [];
});

// 선택된 서브 카테고리에 따라 세부 카테고리 목록 설정
const subSubCategories = computed(() => {
  switch (selectedSubCategory.value) {
    case "소파":
      return ["2인용 소파", "3인용 소파", "코너 소파"];
    case "커피 테이블":
      return ["유리 테이블", "원목 테이블"];
    case "TV 스탠드":
      return ["벽걸이형", "독립형"];
    case "책장":
      return ["벽걸이형 책장", "자유형 책장"];
    case "침대":
      return ["싱글 침대", "더블 침대", "퀸 침대"];
    case "옷장":
      return ["슬라이딩 도어", "스윙 도어"];
    case "서랍장":
      return ["2단 서랍장", "3단 서랍장"];
    case "식탁":
      return ["4인용", "6인용", "8인용"];
    case "식당 의자":
      return ["패브릭 의자", "가죽 의자"];
    case "바 테이블":
      return ["원목 바 테이블", "메탈 바 테이블"];
    case "책상":
      return ["일반 책상", "코너 책상"];
    case "사무용 의자":
      return ["인체공학적 의자", "메쉬 의자"];
    case "서류함":
      return ["서랍형", "캐비닛형"];
    default:
      return [];
  }
});

// 선택된 카테고리
const selectedMainCategory = ref(null);
const selectedSubCategory = ref(null);
const selectedSubSubCategory = ref(null);

// 카테고리 선택 로직
const selectMainCategory = (category) => {
  selectedMainCategory.value = category;
  selectedSubCategory.value = null;
  selectedSubSubCategory.value = null;
};

const selectSubCategory = (subCategory) => {
  selectedSubCategory.value = subCategory;
  selectedSubSubCategory.value = null;
};

const selectSubSubCategory = (subSubCategory) => {
  selectedSubSubCategory.value = subSubCategory;
};

// 등록 버튼 클릭 시 처리
const handleRegister = () => {
  console.log("상품명:", productName.value);
  console.log("카테고리:", selectedMainCategory.value, selectedSubCategory.value, selectedSubSubCategory.value);
  console.log("상태:", condition.value);
  console.log("설명:", description.value);
  console.log("가격:", price.value);
  console.log("이미지 수:", images.value.length);
  alert("등록 버튼이 눌렸습니다. (실제 등록은 안 됩니다)");
};
</script>

<template>
  <div class="border rounded p-4 bg-light test1">
    <div class="bg-white py-5">
      <div class="container">
        <h2 class="mb-4 text-center">판매 상품 정보</h2>

        <!-- 상품명 -->
        <div class="row mb-4 border-top pt-3">
          <label class="col-3 col-form-label fw-bold">상품명</label>
          <div class="col-9 position-relative">
            <input type="text" class="form-control pe-5" v-model="productName" placeholder="상품명을 입력해 주세요." />
            <a href="https://help.bunjang.co.kr/faq/2/220" target="_blank"
              class="position-absolute top-50 end-0 translate-middle-y me-3 text-danger small">
              거래금지 품목 보기
            </a>
          </div>
        </div>

        <!-- 카테고리 선택 -->
        <div class="row mb-4 border-top pt-3">
          <label class="col-3 col-form-label fw-bold">카테고리 선택</label>
          <div class="col-9">
            <div class="row">
              <!-- 메인 카테고리 -->
              <div class="col">
                <div class="card p-3">
                  <strong>메인 카테고리</strong>
                  <div class="list-group mt-2">
                    <button v-for="category in mainCategories" :key="category" @click="selectMainCategory(category)"
                      class="list-group-item list-group-item-action"
                      :class="{ active: selectedMainCategory === category }">
                      {{ category }}
                    </button>
                  </div>
                </div>
              </div>

              <!-- 서브 카테고리 (메인 카테고리 선택 시 표시) -->
              <div class="col" v-if="selectedMainCategory">
                <div class="card p-3">
                  <strong>서브 카테고리</strong>
                  <div class="list-group mt-2">
                    <button v-for="subCategory in subCategories" :key="subCategory"
                      @click="selectSubCategory(subCategory)" class="list-group-item list-group-item-action"
                      :class="{ active: selectedSubCategory === subCategory }">
                      {{ subCategory }}
                    </button>
                  </div>
                </div>
              </div>

              <!-- 세부 카테고리 (서브 카테고리 선택 시 표시) -->
              <div class="col" v-if="selectedSubCategory">
                <div class="card p-3">
                  <strong>세부 카테고리</strong>
                  <div class="list-group mt-2">
                    <button v-for="subSubCategory in subSubCategories" :key="subSubCategory"
                      @click="selectSubSubCategory(subSubCategory)" class="list-group-item list-group-item-action"
                      :class="{ active: selectedSubSubCategory === subSubCategory }">
                      {{ subSubCategory }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div class="mt-3">
              <strong class="text-danger">선택된 카테고리:</strong>
              <strong class="ms-2">{{ selectedMainCategory }}</strong>
              <strong v-if="selectedSubCategory"> > {{ selectedSubCategory }}</strong>
              <strong v-if="selectedSubSubCategory"> > {{ selectedSubSubCategory }}</strong>
            </div>
          </div>
        </div>

        <!-- 상품 상태 -->
        <div class="row mb-4 border-top pt-3">
          <label class="col-3 col-form-label fw-bold">상품 상태</label>
          <div class="col-9">
            <div class="form-check mb-1" v-for="option in ['S (새 상품)', 'A (사용감 없음)', 'B (사용감 조금)', 'C (사용감 많음)']"
              :key="option">
              <input class="form-check-input" type="radio" :value="option" v-model="condition" :id="option"
                name="condition" />
              <label class="form-check-label ms-1" :for="option">{{ option }}</label>
            </div>
          </div>
        </div>


        <!-- 설명 -->
        <div class="row mb-4 border-top pt-3">
          <label class="col-3 col-form-label fw-bold" for="description">설명</label>
          <div class="col-9">
            <textarea id="description" v-model="description" rows="4" class="form-control"
              placeholder="브랜드, 모델명, 구매 시기 등을 입력해주세요."></textarea>
          </div>
        </div>

        <!-- 가격 -->
        <div class="row mb-4 border-top pt-3">
          <label class="col-3 col-form-label fw-bold">가격</label>
          <div class="col-9">
            <div class="input-group" style="max-width: 200px;">
              <input type="number" class="form-control" v-model="price" placeholder="가격 입력" />
              <span class="input-group-text">원</span>
            </div>
          </div>
        </div>

        <!-- 등록 버튼 -->
        <div class="text-end">
          <button class="btn btn-primary px-4" @click="handleRegister">등록하기</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.test1 {
  width: 990.4px;
}

/* 선택된 버튼 강조 */
.list-group-item.active {
  background-color: #ffecec;
  border-color: #ffcccc;
  color: #d63333;
  font-weight: bold;
  border-radius: 4px;
}
</style>
