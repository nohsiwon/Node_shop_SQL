## 환경변수
- RDS_ID
- RDS_PW
- RDS_URL
- JWT_KEY

<br>

## API 명세서
https://docs.google.com/spreadsheets/d/1EbJCL2qQPC4GuS-bvu_xHXDoWoJr9iRohaDF9Fkg074/edit#gid=0

<br>

## ERD URL
https://www.erdcloud.com/d/wTFT7SdHzt3ApmZ3R

<br>

## 더 고민해 보기
1. 암호화 방식
- hash화한 값은 복호화하는게 아닌 `compare`를 사용해 비교하기 때문에 원본을 찾을 수 없어 단반향입니다.
- DB가 해킹당했을 때 사용자들의 비밀번호를 hash화 함으로서 보안에 좋다

<br>

2. 인증 방식
- 토큰 변조 및 위조가 가능하고 jwt는 decode가 되기 때문에 민감한 정보가 있을 시 문제가 된다
- 토큰의 유효시간을 짧게 하거나 불필요한 권한을 줄여 피해를 줄일 수 있다

<br>

3. 인증과 인가
- 인증 : 아이디나 비밀번호 등으로 자신이 어떤 사용자인지 확인 검증
- 인가 : 인증된 사용자가 권한이 있는지 접근 허가, 불가를 판가름

<br>

4. Http Status Code
- 200 : 요청 성공

- 400 : 잘못된 요청
- 401 : 인증받지 못함
- 403 : 접근할 권리가 없음
- 404 : 존재하지 않음
- 409 : 리소스 충돌
- 412 : 적절하지 않은 요청

<br>

5. 리팩토링
- findAll같은 메서드의 변화가 조금 있고 model 속성이 다르고 migrate로 table을 만들어 사용하는게 가장 많이 변한거 같습니다
- ERD를 사전에 작성하여 DB 구조를 잡고 ORM으로 migrate를 활용하여 쉽게 Table 수정 가능

<br>

6. 서버 장애 복구
- pm2 startup
- 배포 실패로 사용은 하지 못함

<br>

7. 개발 환경
- nodemon은 코드 변경을 감지하여 자동으로 서버를 재시작해주는 패키지이고 사용했을 때 코드 변경 후 저장 시 바로 서버 시작이 되어 빠르게 테스트할 수 있었다
- npm 설치방법
  1. 일반
  - `npm install 패키지명`으로 설치
  - node_module, package.json, package-lock.json에 설치되며 해당 프로젝트에 사용

  <br>

  2. 글로벌
  - `npm install -g 패키지명`으로 설치
  - 시스템 전체에 사용된다. 여러 프로젝트에서 활용되는 패키지 설치 시 사용
 
  <br>
 
  3. 개발용
  - `npm install -D 패키지명`으로 설치
  - 개발환경에서만 사용하는 경우 사용

<br>

## 문제점
- 상품 생성 시에 `userId`를 저장하는 조건에 `products` 모델에 `userId`를 생성하여 저장해서 Table의 JOIN 미활용, 어떻게 사용해야할지 감이 안잡힘.. 
- EC2와 RDS의 연결 실패
- HTTP Status, 예외 처리에 대한 확신이 없음
- 인증 미들웨어(auth.js)을 사용은 했지만 확실한 이해 X
