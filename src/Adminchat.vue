<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import axios from 'axios'


const nickname = 'admin'

// 프로토콜 및 호스트 기반으로 WebSocket URL 동적 생성
const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws'
const host = window.location.host
const SOCKET_URL = `${protocol}://${host}/api/ws/adminchat?nickname=${nickname}`

const activeUsers = ref([])
const selectedUser = ref(null)
const input = ref('')
const userMessages = ref(new Map())
const messages = ref([])
const connected = ref(false)
let socket = null
const chatBoxRef = ref(null)
const unreadCounts = ref(new Map())

// 유저 목록 초기 로딩
const fetchActiveUsers = async () => {
  try {
    const { data } = await axios.get('/api/chat/active-users')
    activeUsers.value = data
  } catch (e) {
    console.warn('❌ 유저 목록 조회 실패:', e)
  }
}

// 스크롤 하단 이동
const scrollToBottom = () => {
  nextTick(() => {
    chatBoxRef.value?.scrollTo({ top: chatBoxRef.value.scrollHeight, behavior: 'smooth' })
  })
}
const connectToAdmin = () => {
  if (socket) socket.close()
  socket = new WebSocket(SOCKET_URL)

  socket.onopen = () => {
    connected.value = true
    console.log('✅ 관리자 WebSocket 연결됨')
  }

  socket.onmessage = (event) => {
    const msg = JSON.parse(event.data)
    if (!msg.from || !msg.text) return

    // 시스템 메시지는 별도 처리
    if (msg.from === 'system') {
      messages.value.push({ from: 'system', text: msg.text })
      scrollToBottom()
      return
    }

    // 유저 목록에 없으면 추가
    if (!activeUsers.value.includes(msg.from)) {
      activeUsers.value.push(msg.from)
    }

    // 메시지 저장
    if (!userMessages.value.has(msg.from)) {
      userMessages.value.set(msg.from, [])
    }
    userMessages.value.get(msg.from).push(msg)

    // 현재 선택 중인 유저가 아니면 unread +1
    if (msg.from !== selectedUser.value) {
      const current = unreadCounts.value.get(msg.from) || 0
      unreadCounts.value.set(msg.from, current + 1)
    }

    // 유저 자동 선택 (처음일 경우만)
    if (!selectedUser.value) {
      selectedUser.value = msg.from
      unreadCounts.value.set(msg.from, 0)
    }

    // 현재 선택된 유저 메시지면 렌더링
    if (msg.from === selectedUser.value) {
      messages.value = [...userMessages.value.get(msg.from)]
      scrollToBottom()
    }
  }

  socket.onclose = () => {
    console.warn('❌ WebSocket 연결 종료')
    connected.value = false
  }

  socket.onerror = (err) => {
    console.error('WebSocket 에러:', err)
  }
}

// 유저 채팅창 선택
const connectToUser = (nickname) => {
  if (!connected.value) return alert('🔌 먼저 관리자 WebSocket 연결을 해주세요')
  selectedUser.value = nickname

  // 미확인 메시지 수 초기화
  unreadCounts.value.set(nickname, 0)

  messages.value = userMessages.value.get(nickname) || []
  scrollToBottom()
}
// 메시지 전송
const sendMessage = () => {
  if (!socket || !selectedUser.value || socket.readyState !== WebSocket.OPEN || !input.value.trim()) return

  const msg = {from: nickname, to: selectedUser.value, text: input.value}
  socket.send(JSON.stringify(msg))

  if (!userMessages.value.has(selectedUser.value)) {
    userMessages.value.set(selectedUser.value, [])
  }

  userMessages.value.get(selectedUser.value).push(msg)
  messages.value = [...userMessages.value.get(selectedUser.value)]
  input.value = ''
  scrollToBottom()
}

onMounted(fetchActiveUsers)
onUnmounted(() => socket?.close())
</script>

<template>
  <div class="admin-chat-wrapper">
    <div class="user-list">
      <h5>접속 중 유저</h5>
      <button @click="connectToAdmin" :disabled="connected" class="btn btn-sm btn-primary mb-2">
        {{ connected ? '✅ 관리자 접속 완료' : '🔌 관리자 접속' }}
      </button>
      <ul>
        <li
            v-for="user in activeUsers"
            :key="user"
            @click="connectToUser(user)"
            :class="{ selected: user === selectedUser }"
        >
          {{ user }}
          <span v-if="unreadCounts.get(user) > 0" class="badge">
            {{ unreadCounts.get(user) }}
          </span>
        </li>
      </ul>
    </div>

    <div class="chat-area" v-if="selectedUser">
      <h6>💬 {{ selectedUser }} 님과 대화 중</h6>
      <div class="chat-box" ref="chatBoxRef">
        <div
            v-for="(msg, idx) in messages"
            :key="idx"
            :class="[
            'msg',
            msg.from === nickname ? 'me' :
            msg.from === 'system' ? 'system' :
            'other'
          ]"
        >
          <template v-if="msg.from === 'system'">
            <span class="system-label">[알림]</span> {{ msg.text }}
          </template>
          <template v-else>
            <span class="from">{{ msg.from }}:</span> {{ msg.text }}
          </template>
        </div>
      </div>
      <div class="chat-input">
        <input v-model="input" @keyup.enter="sendMessage"/>
        <button @click="sendMessage">전송</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-chat-wrapper {
  display: flex;
  gap: 20px;
}

.user-list {
  width: 200px;
  border-right: 1px solid #ddd;
}

.user-list ul {
  list-style: none;
  padding: 0;
}

.user-list li {
  padding: 10px;
  cursor: pointer;
}

.user-list li.selected {
  background: #007bff;
  color: white;
}

.chat-area {
  flex: 1;
}

.chat-box {
  height: 300px;
  overflow-y: auto;
  background: #f5f5f5;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 8px;
}

.msg {
  margin-bottom: 8px;
}

.msg.me {
  text-align: right;
  color: blue;
}

.msg.other {
  text-align: left;
  color: black;
}

.msg.system {
  text-align: center;
  color: #ff4d4f;
  font-weight: bold;
  background-color: #fff3f3;
  padding: 6px 10px;
  border-radius: 6px;
  margin: 10px 0;
}

.from {
  font-weight: bold;
  margin-right: 5px;
}

.system-label {
  color: #d90000;
  margin-right: 6px;
}

.chat-input {
  display: flex;
  gap: 10px;
}

.chat-input input {
  flex: 1;
  padding: 8px;
}

.badge {
  background: red;
  color: white;
  border-radius: 12px;
  padding: 2px 8px;
  font-size: 12px;
  margin-left: 8px;
}
</style>