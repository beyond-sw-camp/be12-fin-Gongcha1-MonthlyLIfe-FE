# be12-fin-Gongcha1-MonthlyLife


## 프로젝트 주제

### 월정액 인생: 1인 가구를 위한 렌탈 구독 서비스

1인 가구 증가와 합리적인 소비 트렌드에 맞춰 개발된 "월정액 인생"은 가전제품부터 생활용품까지 필요한 물품을 월정액으로 간편하게 구독하고 관리할 수 있는 서비스입니다. 기존의 단순 렌탈 개념을 넘어 다양한 제품을 맞춤형 구독 방식으로 제공하여 사용자의 편의성과 경제성을 극대화합니다.

### 프로젝트 목표

- 다양한 상품을 간편히 구독 및 관리할 수 있는 백엔드 시스템 구축
- ?
- ?




<br>


## TEAM

<div align="center">
  <img src="./assets/images/월정액%20인생.gif" alt="팀 이미지" />
</div>


##  월 정 액 인 생
<div style="display: flex; justify-content: center;">
  <table align="center">
    <tbody>
      <tr>
        <td align="center">
          <a href="https://github.com/museongkim0" style="text-decoration: none; color: lightgray;">
            <img src="https://mblogthumb-phinf.pstatic.net/MjAxNzA0MTNfMTQ2/MDAxNDkyMDg4OTU0NzU2.X-Ise8QGLx6BeA7f6y1lStSFaxdMRMNieJK_sB2sdokg.ll6BBI3GcX8hmiVP10LOy9b2rAZ2hHKnZFncXmzexsgg.JPEG.swhyun98/downloadfile.jpg?type=w420" width="100px;" height="120px;" background-size="cover;" alt=""/><br />
            <sub><b>  김경준</b></sub>
          </a><br />
        </td>
        <td align="center">
          <a href="https://github.com/kuj7882" style="text-decoration: none; color: lightgray;">
            <img src="https://i.namu.wiki/i/8wUNYOFiU0KQem2XbLBTkTmgGg4knQ1_xAxhTh2Yl6E0OUbwJKCNXuO32wS48LTPfXT1U3hzEmclYUhu0kOg3GBu7VFfhN-larrInwpPz2Bc6OIplUQSvQy2sMz4gMUmPxcxCsZZ_XFaOLpXsp363Q.webp" height="120px" width="100px;" alt=""/><br />
            <sub><b>  신지현</b></sub>
          </a><br />
        </td>
        <td align="center">
          <a href="https://github.com/leewoojin12" style="text-decoration: none; color: lightgray;">
            <img src="https://i.namu.wiki/i/OOrcrlumPF7y0fWMNwJGrUw29c5kJ9qtpPbLsKlKOV2OVBH3Y3j3hg9FWPNy3kCvTUMgHD68wTF2k3OscKuTtw.webp"  height="120px" width="100px;" alt=""/><br />
            <sub><b>  이우진</b></sub>
          </a><br />
        </td>
        <td align="center">
          <a href="https://github.com/gunha0405" style="text-decoration: none; color: lightgray;">
            <img src="https://i.namu.wiki/i/GlPkp9Dy4UIg4_LiRXKtZ2g5V-NsjY3LZi8k6WT6N3lQIHIKz8EaNESQLfZfV7lDi4E7k-VloLwSHDr21bQxVg.webp" height="120px" width="100px;" alt=""/><br />
            <sub><b>  김재구</b></sub>
          </a><br />
        </td>
      </tr>
    </tbody>
  </table>
</div>


## ⭐ 접속 주소

**서비스 접속 주소**
- 백엔드

- 프론트 엔드 https://monthlylife.kro.kr

    - 사용자: test01
    - 관리자:  admin1
    - 비밀번호: qwer1234

<br>


<br>

<br>


<br>

## 기술 스택

프론트엔드  
![Vue.js](https://img.shields.io/badge/vue.js-%2335495e.svg?style=for-the-badge&logo=vuedotjs&logoColor=%234FC08D)


백엔드  
![](https://img.shields.io/badge/Spring%20Boot-6DB33F?style=for-the-badge&logo=Spring-Boot&logoColor=white) ![](https://img.shields.io/badge/Spring_Security-6DB33F?style=for-the-badge&logo=Spring-Security&logoColor=white) ![JWT](https://img.shields.io/badge/JWT-%232F7D32.svg?style=for-the-badge&logo=json-web-tokens&logoColor=white)

DB<br>
![MariaDB](https://img.shields.io/badge/MariaDB-003545?style=for-the-badge&logo=mariadb&logoColor=white)

협업 툴

![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)

<br>


<br>

<br>


<br>

## 🖥️ 시스템 아키텍처

### 🛠️ ① CI/CD 파이프라인 (Jenkins 기반)

- GitHub 저장소에서 소스코드 관리.

    - 개발자가 GitHub에 코드를 push하면, Webhook을 통해 Jenkins가 자동으로 빌드 실행.

    - Jenkins Master 노드는 작업을 두 가지 Agent로 나누어 처리:

    - 빌드 에이전트: GitHub에서 클론, Docker 이미지 빌드, DockerHub에 푸시.

    - 배포 에이전트: 빌드된 이미지를 Kubernetes 클러스터에 배포.



### 📦 Kubernetes 클러스터
- 서비스 영역	세부 구성 및 역할

    - Ingress (Nginx)	Load Balancer를 통해 외부 클라이언트 요청을 받아 내부 서비스(Spring Boot    앱)로 라우팅

    - Spring Boot 애플리케이션	Cluster IP 서비스로 내부 네트워크를 통해 접근 가능하며, 다중    Pod로 - 구성되어 안정성과 확장성 확보

    - MariaDB (Master-Slave)	데이터베이스 클러스터로 Master와 Slave를 구성하여 고가용성 및   안정성 - 보장

    - Persistent Volume (PV)	MariaDB 데이터의 영속성을 보장하며 Longhorn 기반으로 스토리지   관리

    - Longhorn	Persistent Volume 관리 및 데이터 복제, 자동 백업 등 데이터 안전성을 제공

<br>


<br>

<br>


<br>


## 👩‍💻 소프트웨어 아키텍처


- 뭐 적죵
<!-- - 효율적이고 독립적인 마이크로서비스 설계
- GPT API를 연동한 챗봇 기능 구현(MCP 서버 적용) -->

## 📃 API 명세서

API 명세서 준비중
- Swagger https://monthlylife.kro.kr/api/swagger-ui/index.html

## 🚀 향후 계획

- AI 챗봇 기능 고도화 및 자연어 처리(NLP) 성능 향상
- 구독 상품 확대 및 추천 알고리즘 개발
- 서비스 안정성 및 성능 개선







#📦 서비스 기능 개요
-
## ✅ 회원가입 및 로그인

- 일반 회원가입 가능
  
- 마이페이지에서 비밀번호 변경, 아이디/비밀번호 찾기 가능
  
- 로그인 및 로그아웃 기능 제공
  
## 👤 마이페이지 기능

- 내 기기 정보: 등록된 구독 상품 조회
  
- 구독 상품 수리 신청 및 반납 신청 기능
  
## 🛍 제품 기능

- 전체 제품 목록 조회
  
- 카테고리별 상세 조회 기능
  
- 상세 페이지에서 제품 정보 확인 가능
  
##  🛒 장바구니 기능

- 제품 상세/목록에서 장바구니 추가 가능
  
- 장바구니 목록 조회
  
- 장바구니 항목 삭제 기능
  
## 💳 구매 기능
- 
- 장바구니 내 제품을 즉시 구매 가능
  
- 결제 성공 시 재고 차감, 실패 시 롤백 처리
  
- 결제 검증 및 사용자 배송 정보 저장
- 
##  🗣 채팅 기능

-  관리자와 유저 간 1:1 실시간 채팅 기능 (휘발성)

-   -> 채팅 관리자 접속되어 있어야 채팅 가능합니다 ㅠ 끊겨있을시
-   -> /adminchat
  
- 🔍 추천 기능
  
- [미구현] 개인화 추천 및 유사 상품 비교 기능
  
## 📊 관리자 기능 (대시보드 및 운영)
  
- 전체 구독 조회 (결제 및 연체 관리)
  
- 반납/배송 스케줄 관리
- 
- 월간/분기별 통계 리포트 제공
  
- 상품 목록 및 상태 관리, 상품 등록/수정/삭제 기능
  
- 사용자 관리: 회원 정보, 주문/렌탈 내역, 연체 내역 확인
  
- 수리/분실 신고 목록 관리 및 처리 상태 변경
  
- 홈페이지 카테고리 추가/수정/삭제 가능

