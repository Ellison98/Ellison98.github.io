## [Visit the website](https://ellison98.github.io/)




### 개발과정

1. Vite 파일 생성
    - .을 사용해서 현재 디렉토리에 프로젝트를 생성
    - 현재 디렉토리에 생성하는 이유는 GitHub Pages가 정적 파일을 호스팅하기 때문에, 프로젝트 파일을 루트 디렉토리에 두어야 한다.
    - npm create vite@latest . -- --template vanilla-ts

2. 의존성 설치
    - npm install

3. Dev 서버 실행 테스트
    - npm run dev

4. TypeError: crypto$2.getRandomValues is not a function 오류가 뜨는 경우
    - Node.js 버전 확인 : node -v
    - curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
    - source ~/.zshrc  # macOS에서 zsh 사용
    - nvm install --lts
    - nvm use --lts

    - node -v 로 최신버전확인

5. vite 사용시 깃허브 상시 활성화를 위한 빌드하기
    - npm run build
    
    * dist 폴더 확인 및 dist 내용을 저장소 루트에 복사
        - ls -la dist

        - cp -r dist/* .
        - git add .
        - git commit -m "Add Vite build files"
        - git push origin main