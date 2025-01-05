// 모든 섹션 요소를 선택하여 sections 변수에 저장합니다.
const sections = document.querySelectorAll('.section');

// 모든 컨트롤 요소를 선택하여 sectBtns 변수에 저장합니다.
const sectBtns = document.querySelectorAll('.controlls');

// 모든 개별 컨트롤 버튼 요소를 선택하여 sectBtn 변수에 저장합니다.
const sectBtn = document.querySelectorAll('.control');

// 모든 메인 콘텐츠 요소를 선택하여 allSections 변수에 저장합니다.
const allSections = document.querySelectorAll('.main-content');

function PageTransitions() {
    // 각 컨트롤 버튼에 클릭 이벤트 리스너를 추가합니다.
    for (let i = 0; i < sectBtn.length; i++) {
        sectBtn[i].addEventListener('click', function() {
            // 현재 활성화된 버튼을 선택합니다.
            let currentBtn = document.querySelectorAll('.active-btn');
            
            // 활성화된 버튼이 존재하면, 해당 버튼의 클래스에서 'active-btn'을 제거합니다.
            if (currentBtn.length > 0) {
                currentBtn[0].className = currentBtn[0].className.replace('active-btn', '');
            }
            
            // 클릭된 버튼에 'active-btn' 클래스를 추가합니다.
            this.className += ' active-btn';
        });
    }
}

// 페이지 전환 기능을 초기화합니다.
PageTransitions();