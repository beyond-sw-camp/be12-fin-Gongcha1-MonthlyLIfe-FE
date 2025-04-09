<template>
  <div class="container py-5 checkout-container">
    <div class="row g-5">
      <!-- 장바구니 요약 컬럼 -->
      <div class="col-md-5 col-lg-4 order-md-last">
        <h4 class="d-flex justify-content-between align-items-center mb-3">
          <span class="text-primary fw-bold">장바구니</span>
          <span class="badge bg-primary rounded-pill">{{ cartItems.length }}</span>
        </h4>
        <ul class="list-group mb-3">
          <li
              v-for="(item, index) in cartItems"
              :key="index"
              class="list-group-item d-flex justify-content-between lh-sm"
          >
            <div>
              <h6 class="my-0">{{ item.name }}</h6>
              <small class="text-muted">{{ item.description }}</small>
            </div>
            <span class="text-muted">₩{{ item.price }}</span>
          </li>
          <li class="list-group-item d-flex justify-content-between">
            <span>총 합계</span>
            <strong>₩{{ totalPrice }}</strong>
          </li>
        </ul>

      </div>

      <!-- 청구 주소 및 결제 컬럼 -->
      <div class="col-md-7 col-lg-8">
        <h4 class="mb-3 fw-bold">청구 주소</h4>
        <form class="needs-validation" novalidate @submit.prevent="submitCheckout">
          <div class="row g-3">
            <div class="col-12">
              <label for="username" class="form-label">사용자 이름</label>
              <div class="input-group has-validation">
                <input
                    type="text"
                    class="form-control"
                    id="username"
                    v-model="billing.username"
                    placeholder="사용자 이름"
                    required
                />
                <div class="invalid-feedback">사용자 이름은 필수입니다.</div>
              </div>
            </div>
            <div class="col-12">
              <label for="email" class="form-label">
                이메일
              </label>
              <input
                  type="email"
                  class="form-control"
                  id="email"
                  v-model="billing.email"
                  placeholder="you@example.com"
              />
              <div class="invalid-feedback">
                배송 업데이트를 위해 유효한 이메일을 입력해 주세요.
              </div>
            </div>
            <!-- 받는사람정보 테이블 영역 -->
            <div class="mb-4">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <h5 class="fw-bold mb-0">받는사람정보</h5>
                <button class="btn btn-sm btn-outline-secondary" @click="changeAddress">
                  배송지 변경
                </button>
              </div>
              <div class="table-responsive">
                <table class="table table-borderless align-middle">
                  <tbody>
                  <tr>
                    <th class="text-muted" style="width: 120px;">이름</th>
                    <td>
                      <input
                          type="text"
                          class="form-control"
                          v-model="receiver.name"
                          placeholder="예) 이유정 (기본배송지)"
                      />
                    </td>
                  </tr>
                  <tr>
                    <th class="text-muted">배송주소</th>
                    <td>
                      <input
                          type="text"
                          class="form-control mb-2"
                          v-model="receiver.address"
                          placeholder="예) 서울시 강남구 ..."
                      />
                      <input
                          type="text"
                          class="form-control"
                          v-model="receiver.address2"
                          placeholder="아파트, 동, 호수 등 (선택)"
                      />
                    </td>
                  </tr>
                  <tr>
                    <th class="text-muted">연락처</th>
                    <td>
                      <input
                          type="text"
                          class="form-control"
                          v-model="receiver.phone"
                          placeholder="010-1234-5678"
                      />
                    </td>
                  </tr>
                  <tr>
                    <th class="text-muted">메모</th>
                    <td>
                        <textarea
                            class="form-control"
                            rows="2"
                            placeholder="배송 시 요청사항"
                            v-model="receiver.memo"
                        ></textarea>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>


          <!--  결제   -->
          <div>
            <!-- 결제정보 타이틀 -->
            <h4 class="fw-bold mb-3">결제정보</h4>

            <!-- 결제정보 테이블 -->
            <table class="table table-bordered align-middle">
              <tbody>
              <!-- 총상품가격 -->
              <tr>
                <th class="text-muted" style="width: 150px;">총상품가격</th>
                <td>{{ formatCurrency(totalPrice) }}</td>
              </tr>

              <!-- 즉시할인 -->
              <tr>
                <th class="text-muted">즉시할인</th>
                <td>-{{ formatCurrency(discount) }}</td>
              </tr>


              <!-- 배송비 -->
              <tr>
                <th class="text-muted">배송비</th>
                <td>{{ formatCurrency(shippingCost) }}</td>
              </tr>


              <!-- 총결제금액 -->
              <tr>
                <th class="text-muted">총결제금액</th>
                <td>{{ formatCurrency(finalPrice) }}</td>
              </tr>

              <!-- 결제방식 -->
              <tr>
                <th class="text-muted">결제방식</th>
                <td>
                  <!-- 결제방식 라디오 그룹 -->
                  <div class="d-flex flex-wrap">
                    <div class="form-check me-3">
                      <input
                          type="radio"
                          name="paymentMethod"
                          id="bank"
                          value="bank"
                          v-model="paymentMethod"
                          class="form-check-input"
                      />
                      <label for="bank" class="form-check-label">계좌이체</label>
                    </div>

                    <div class="form-check me-3">
                      <input
                          type="radio"
                          name="paymentMethod"
                          id="kakaopay"
                          value="kakaopay"
                          v-model="paymentMethod"
                          class="form-check-input"
                      />
                      <label for="kakaopay" class="form-check-label">카카오페이</label>
                    </div>

                    <div class="form-check me-3">
                      <input
                          type="radio"
                          name="paymentMethod"
                          id="credit"
                          value="credit"
                          v-model="paymentMethod"
                          class="form-check-input"
                      />
                      <label for="credit" class="form-check-label">신용카드</label>
                    </div>


                    <div class="form-check me-3">
                      <input
                          type="radio"
                          name="paymentMethod"
                          id="wire"
                          value="wire"
                          v-model="paymentMethod"
                          class="form-check-input"
                      />
                      <label for="wire" class="form-check-label">무통장입금</label>
                    </div>
                  </div>

                  <!-- 계좌이체 선택 시 노출되는 영역 -->
                  <div v-if="paymentMethod === 'bank'" class="border mt-3 p-3">
                    <div class="mb-2">
                      <label class="form-label me-2">은행 선택:</label>
                      <select class="form-select d-inline-block w-auto" v-model="bankName">
                        <option value="nh">농협은행</option>
                        <option value="kb">국민은행</option>
                        <option value="sh">신한은행</option>
                      </select>
                    </div>
                    <div class="mb-2">
                      <label class="form-label me-2">계좌번호:</label>
                      <input
                          type="text"
                          class="form-control d-inline-block w-auto"
                          v-model="accountNumber"
                          placeholder="******185"
                      />
                    </div>
                  </div>

                  <!-- 신용/체크카드 선택 시 노출되는 영역 -->
                  <div
                      v-if="paymentMethod === 'credit' || paymentMethod === 'debit'"
                      class="border mt-3 p-3"
                  >
                    <div class="row g-2">
                      <div class="col-md-6">
                        <label class="form-label">카드에 표시된 이름</label>
                        <input
                            type="text"
                            class="form-control"
                            v-model="card.name"
                            placeholder="홍길동"
                        />
                        <small class="text-muted">카드에 표시된 전체 이름</small>
                      </div>
                      <div class="col-md-6">
                        <label class="form-label">카드 번호</label>
                        <input
                            type="text"
                            class="form-control"
                            v-model="card.number"
                            placeholder="0000-0000-0000-0000"
                        />
                      </div>
                      <div class="col-md-3">
                        <label class="form-label">유효기간</label>
                        <input
                            type="text"
                            class="form-control"
                            v-model="card.expiration"
                            placeholder="MM/YY"
                        />
                      </div>
                      <div class="col-md-3">
                        <label class="form-label">CVV</label>
                        <input
                            type="text"
                            class="form-control"
                            v-model="card.cvv"
                            placeholder="123"
                        />
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
              </tbody>
            </table>

            <!-- 기본 결제 수단으로 저장 체크박스 (선택사항) -->
            <div class="form-check mt-2">
              <input
                  type="checkbox"
                  class="form-check-input"
                  id="defaultPayment"
                  v-model="saveDefaultPayment"
              />
              <label class="form-check-label" for="defaultPayment">
                기본 결제 수단으로 저장
              </label>


            </div>
          </div>


          <hr class="my-4"/>

          <button class="w-100 btn btn-primary btn-lg" type="submit">
            결제 진행
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CheckoutPage",
  data() {
    return {
      cartItems: [
        {name: "상품명", description: "간단한 설명", price: 12},
        {name: "두 번째 상품", description: "간단한 설명", price: 8},
        {name: "세 번째 상품", description: "간단한 설명", price: 5}
      ],
      promoCode: "EXAMPLECODE",
      promoDiscount: 5,
      promoInput: "",
      billing: {
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        address: "",
        address2: "",
        country: "",
        state: "",
        zip: "",
        sameAddress: false,
        saveInfo: false
      },
      paymentMethod: "credit",
      card: {
        name: "",
        number: "",
        expiration: "",
        cvv: ""
      },
      receiver: {
        name: "",
        address: "",
        address2: "",
        phone: "",
        memo: ""
      }
    };
  },
  computed: {
    totalPrice() {
      let subtotal = this.cartItems.reduce((acc, item) => acc + item.price, 0);
      return subtotal - this.promoDiscount;
    }
  },
  methods: {
    redeemPromo() {
      alert("프로모션 코드 적용됨: " + this.promoInput);
    },
    submitCheckout() {

      alert("주문이 접수되었습니다!");
      this.$router.push('/');

    },
    changeAddress() {
      alert("배송지 변경 로직 구현!");
    }
    , formatCurrency(amount) {
      if (amount === undefined || amount === null) {
        return "0원"; // 또는 원하는 기본값을 반환
      }
      return amount.toLocaleString() + "원";
    }
  }
};
</script>

<style scoped>
.checkout-container {
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 1rem;
}

.checkout-container h4,
.checkout-container h3 {
  font-weight: bold;
}

/* 리스트 항목 커스텀 스타일 */
.list-group-item {
  border: none;
  border-bottom: 1px solid #e9ecef;
}

.list-group-item:last-child {
  border-bottom: none;
}

/* 버튼에 강렬한 그라데이션 효과 */
button.btn-primary.btn-lg {
  background-image: linear-gradient(45deg, #2a5ae8, #008cf6); /* 밝은 파랑 → 시원한 블루 */
  border: none;
  color: #ffffff;
}

button.btn-primary.btn-lg:hover {
  background-image: linear-gradient(45deg, #008cf6, #2a5ae8); /* 반전 */
}


.table-borderless th {
  width: 100px;
  white-space: nowrap;
}

.table th {
  background-color: #f8f9fa;
  vertical-align: middle;
}

.container.py-5 {
  width: 1200px;
  margin: 0 auto;
}

</style>
