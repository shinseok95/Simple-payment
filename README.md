## 소개

### 프로젝트 소개
  
- 한국인터넷진흥원에서 진행한 핀테크 서비스 개발 기초 과정에서 진행한 토이 프로젝트<br>
  - 금융결제원에서 제공하는 오픈 API를 이용하여 간편 결제 웹 서비스를 제작<br>
  
### 기능 소개

  - 1. 금융결제원에서 사용자 인증을 하고, 사용자의 통장 정보를 받아온다. <br>
  - 2. 각 통장마다 고유의 QR 코드를 제공하며, 이를 통해 간편 결제를 할 수 있다.<br>
  - 3. 오픈 뱅킹 API를 통해 각 통장의 잔액과 결제 내역을 확인할 수 있다. <br>
  
## 사용 기술


### Front-end

- EJS

### Back-end

- nodeJS

### Database

- MySql

### Language

- JavaScript

### Tools

- Visual Studio code
- Window 10
- Git


## 스크린샷

### 로그인

<img src="https://user-images.githubusercontent.com/48644958/110317258-3d0d8500-804f-11eb-8408-b6a0c23f69be.png" height="40%" width="40%"></img>

- DB에 저장된 사용자 인증 Token을 받아와서, 오픈 뱅킹 서비스를 제공합니다. <br>

### 회원가입

<div>
<img src="https://user-images.githubusercontent.com/48644958/110317292-48f94700-804f-11eb-9747-926233f42b51.png" height="40%" width="40%"></img>
<img src="https://user-images.githubusercontent.com/48644958/110317297-4ac30a80-804f-11eb-9521-3df903b2a982.png" height="40%" width="40%"></img>
</div>

- 금융결제원에서 받은 사용자 인증 Token을 회원가입시 DB에 저장시킵니다.<br>

### 메인 화면

<img src="https://user-images.githubusercontent.com/48644958/110317302-4dbdfb00-804f-11eb-87b0-7475bb532925.png" height="40%" width="40%"></img>

- 사용자가 등록한 통장 목록을 보여줍니다.<br>
- 각 통장마다 QR 코드를 제공하며, 이를 리더기에 입력시 간편 결제가 가능합니다.<br>

### 잔액 조회

<img src="https://user-images.githubusercontent.com/48644958/110317313-4f87be80-804f-11eb-8450-3ca4c052a9bd.png" height="40%" width="40%"></img>

- 통장의 잔액과 결제 내역을 보여줍니다.<br>
