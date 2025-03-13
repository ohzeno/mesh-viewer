# mesh-viewer

## 목차

1. [프로젝트 소개](#book-프로젝트-소개)
   1. [사이트 둘러보기](#house-사이트-둘러보기)
2. [주요 기능](#triangular_flag_on_post-주요-기능)
3. [기술 스택](#triangular_flag_on_post-기술-스택)
4. [프로젝트 기간](#triangular_flag_on_post-프로젝트-기간)
5. [기술적 구현 및 최적화](#triangular_flag_on_post-기술적-구현-및-최적화)

<br/>

## :book: 프로젝트 소개

[🏠 사이트 둘러보기 ](https://portfolio-meshviewer.com/)

이 프로젝트는 과제를 계속 개발한 프로젝트입니다. 기존 과제가 기능 구현에 집중되어 있기에 디자인이나 UI/UX는 좀 부족할 수 있습니다. 

대용량 파일은 로딩에 시간이 걸릴 수 있습니다.

<br />

## :triangular_flag_on_post: 주요 기능​

1. Mesh 업로드
   1. 드래그 앤 드롭으로 선택
2. MeshList에서 Mesh 선택 및 렌더링
   1. ply, stl, obj, off 지원
3. 3D 뷰 조작:
   1. ArcballControls를 이용한 회전
   2. 마우스 휠을 이용한 확대/축소
   3. Ctrl + 드래그로 평행이동
4. 렌더링 옵션 조절:
   1. 광택도 조절
   2. 금속성 조절
   3. 투명도 조절
5. 속성 초기화 기능
6. 뷰 초기화 기능

<br/>

## :triangular_flag_on_post: 기술 스택

### Front

| 카테고리   | 기술                                                    |
| ---------- | ------------------------------------------------------- |
| 프레임워크 | React.JS                                                |
| 언어       | TypeScript                                              |
| 상태 관리  | Recoil                                                  |
| 스타일링   | TailwindCSS                                             |
| 애니메이션 | Framer Motion                                           |
| 3D 렌더링  | Three.JS<br />@react-three/fiber<br />@react-three/drei |

<br/>

### Back

| 카테고리     | 기술/라이브러리   |
| ------------ | ----------------- |
| 프레임워크   | NestJS            |
| 언어         | TypeScript        |
| 데이터베이스 | MongoDB           |
| ODM          | Mongoose          |
| AWS S3 연동  | aws-sdk           |
| 요청 제한    | @nestjs/throttler |

<br/>

### Ops

| 카테고리                | 기술/서비스   | 환경                     |
| ----------------------- | ------------- | ------------------------ |
| 서버 호스팅             | AWS EC2       | 프로덕션                 |
| 데이터베이스 호스팅     | MongoDB Atlas | 프로덕션                 |
| 파일 스토리지           | AWS S3        | 프로덕션                 |
| 파일 스토리지           | MinIO         | 로컬 개발 환경 (S3 호환) |
| 웹 서버 / 리버스 프록시 | Nginx         | 프로덕션                 |

<br/>

## :triangular_flag_on_post: 프로젝트 기간

2024.08.07 ~ 2024.08.31 (24일)

<br/>

## :triangular_flag_on_post: 기술적 구현 및 최적화

- ### Front

  1. Mesh 캐시 매니저 구현
     1. 메쉬 캐싱으로 사용자 경험 향상
     2. 탭 메모리 사용량 모니터링 및 정리
  2. ArcballControls구현
  3. OFFLoader 구현
  4. 파일 유효성 검사
     1. 확장자 제한
     2. 크기 제한
  5. 드래그 앤 드롭 오버레이로 사용자 경험 향상
  6. 메시 목록 최신순 정렬
     1. 목록 많아지면 스크롤 적용
  7. React 최적화 기법(useCallback, useMemo, React.memo) 적용
  8. 다양한 custom hooks 구현으로 코드 재사용성 향상
  9. tailwind를 이용한 스타일링
     1. 슬라이드바, 스크롤바 디자인 변경
     2. 커스텀 색상, 글자 크기
  10. 환경 변수 관리
      1. 안전한 api관리

<br/>

- ### Back

  1. Mesh 캐시 매니저 구현
     1. 메쉬 캐싱으로 S3 다운로드 빈도 최소화
     2. 서버 메모리 사용량 모니터링 및 정리
  2. 데이터 접근 계층과 비즈니스 로직 분리를 통한 유지보수성 향상
     1. storageRepository에서 S3, MongoDB 통합 관리
  3. MongoDB로 메타데이터 관리
     1. 파일 정보 효율적 저장 및 조회
  4. S3로 대용량 파일 효율적 관리
  5. 트랜잭션 적용
     1. upload/download 요청 시 S3, MongoDB 일관성 보장
  6. 파일 유효성 검사
     1. 확장자, mimetype, 컨텐츠 양식 일부 확인
  7. contentHash를 이용한 효율적인 파일 중복 체크
     1. 파일 앞, 중간, 뒤에서 각각 샘플링하여 대용량 메쉬도 효율적으로 hash값 생성
  8. 압축전송으로 프론트 로드 요청부터 렌더링까지의 시간 약 4% 단축
  9. 파일 업로드에 multer 사용으로 메모리 사용 최소화
     1. 디스크에 임시로 파일 저장, S3에 업로드 후 삭제
  10. 파일 다운로드에 스트리밍 적용으로 메모리 사용 최소화
  11. Rate Limiting 적용
      1. ThrottlerGuard를 이용한 요청 제한으로 DDos 공격 대비
  12. 환경 변수 관리
      1. ConfigModule을 이용한 안전한 환경 변수 관리
  13. 예외 처리
      1. HttpExceptionFilter로 일관된 에러 응답
  14. 로깅 미들웨어
      1. 모든 http 요청에 대한 로깅으로 모니터링 용이
  15. CORS 설정
      1. 프론트엔드와의 안전한 통신을 위한 CORS 설정

<br/>

- ### Ops

  1. AWS S3 이용해 효율적으로 대용량 파일 관리
  2. AWS EC2를 이용해 배포
  3. Nginx
     1. 파일 업로드 크기 제한
     2. ssl적용으로 암호화 통신
     3. frontend, backend를 하나의 도메인에서 서빙
  4. 개발 과정에서 S3 대신 MinIO 사용하여 개발 가속



