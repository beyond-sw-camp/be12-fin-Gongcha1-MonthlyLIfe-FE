<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../../store/useUserStore'

const router    = useRouter()
const userStore = useUserStore()

// 검색 드롭다운 열림/닫힘 상태
const searchOpen = ref(false)
// 검색어 모델
const q = ref('')

// 드롭다운 토글
const toggleSearch = () => {
  searchOpen.value = !searchOpen.value
}
// 닫기
const close = () => {
  searchOpen.value = false
}
// 검색어 초기화
const clear = () => {
  q.value = ''
}
// 검색 실행
const submit = () => {
  const keyword = q.value.trim()
  if (keyword) {
    router.push({ path: '/sale/list', query: { keyword } })
  }
  close()
}

// 네비게이션 함수들
const goLogin  = () => router.push('/auth/login')
const goSignup = () => router.push('/auth/signup/identify')
const goAdmin  = () => router.push('/admin')
const goCart   = () => router.push('/cart')
const logout   = async () => { await userStore.getLogout(); router.go(0) }
</script>

<template>
  <header>
    <!-- 상단 바 -->
    <div class="py-1 bg-white border-bottom">
      <div class="container d-flex justify-content-between align-items-center">
        <!-- 왼쪽: 로고 + 관리자 버튼 -->
        <div class="d-flex align-items-center">

          <button class="btn btn-sm btn-dark ms-3" @click="goAdmin">
            관리자
          </button>
        </div>

        <!-- 오른쪽: 메뉴 아이템 -->
        <div class="d-flex align-items-center small flex-nowrap text-nowrap">
          <div v-if="userStore.isLogin" class="me-3"><router-link to="/user/detail" class="nav-link" >마이페이지</router-link></div>
          
          <font-awesome-icon
            icon="magnifying-glass"
            class="me-2 py-1"
            style="cursor: pointer"
            @click="toggleSearch"
          />
          <font-awesome-icon
            :icon="['fas','cart-shopping']"
            class="ms-2"
            style="cursor: pointer"
            @click="goCart"
          />
          <div v-if="!userStore.isLogin" class="ms-3">
            <button class="btn btn-sm btn-outline-dark me-1" @click="goLogin">로그인</button>
            <button class="btn btn-sm btn-outline-dark" @click="goSignup">회원가입</button>
          </div>
          <div v-else class="ms-3">
            <button class="btn btn-sm btn-outline-dark" @click="logout">로그아웃</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 하단 메뉴 -->
    <nav class="custom-nav bg-white border-bottom w-100">
      <div class="container d-flex justify-content-between align-items-center py-3">
        <router-link to="/" class="d-flex align-items-center text-decoration-none">
          <img src="/assets/ml_logo.png" style="width: 4rem" alt="로고" />
          <h4 class="text-black m-3">월정액인생</h4>
        </router-link>
        <ul class="nav flex-row mb-0 flex-nowrap">
          <li class="nav-item">
            <router-link to="/sale/list" class="nav-link text-dark fw-semibold">전체 렌탈 상품</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/sale/best" class="nav-link text-dark fw-semibold">베스트 상품</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/sale/package" class="nav-link text-dark fw-semibold">패키지 특가</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/guide" class="nav-link text-dark fw-semibold">구매 가이드</router-link>
          </li>
        </ul>
      </div>
    </nav>

    <!-- 검색 드롭다운 (헤더 바로 아래) -->
    <transition name="slide-down">
      <div v-show="searchOpen" class="search-dropdown">
        <div class="container py-3 d-flex align-items-center">
          <input
            v-model="q"
            @keyup.enter="submit"
            type="text"
            class="form-control me-2"
            placeholder="찾으시는 검색어를 입력하세요."
            autofocus
          />
          <button class="btn btn-outline-secondary me-2 d-flex align-items-center text-nowrap" @click="clear">
            <font-awesome-icon :icon="['fas','rotate-right']" class="me-1 " />
            초기화
          </button>
          <font-awesome-icon
            icon="magnifying-glass"
            class="me-2"
            style="cursor: pointer"
            @click="submit"
          />
          <button class="btn-close ms-auto" @click="close"></button>
        </div>
      </div>
    </transition>
  </header>
</template>

<style scoped>
/* 헤더와 배너 붙이기 */
header {
  position: relative;
  margin-bottom: 0;
}

/* slide-down transition */
.slide-down-enter-active { transition: all .25s ease-out; }
.slide-down-leave-active { transition: all .2s ease-in; }
.slide-down-enter-from,
.slide-down-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

/* 검색 드롭다운만 오버레이 */
.search-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: #f8f9fa;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  z-index: 2000;
}
</style>
