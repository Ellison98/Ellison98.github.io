import * as THREE from 'three';

interface Post {
    id: number;
    title: string;
    content: string;
}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 1); // 검정 배경
document.getElementById('canvas-container')!.appendChild(renderer.domElement);

// 반응형 지원
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const colors = [0xff0000, 0x00ff00, 0x0000ff]; // 빨강, 초록, 파랑
let selectedColor = 0x00ff00; // 기본 색상은 초록

function createColorButtons() {
    const radius = 0.3; // 버튼 크기
    const buttonSpacing = 1.5; // 버튼 간격

    colors.forEach((color, index) => {
        const buttonGeometry = new THREE.CircleGeometry(radius, 32);
        const buttonMaterial = new THREE.MeshBasicMaterial({ color });
        const button = new THREE.Mesh(buttonGeometry, buttonMaterial);

        // 버튼 위치: X축에 나열, 약간 카메라 앞 위치
        button.position.set(index * buttonSpacing - ((colors.length - 1) * buttonSpacing) / 2, -3, 5);
        button.userData.color = color; // 버튼 색상 데이터를 저장

        scene.add(button); // 씬에 버튼 추가
    });
}

createColorButtons();

async function loadPosts() {
    const response = await fetch('/posts.json');
    if (!response.ok) throw new Error('Failed to load posts.json');
    const posts: Post[] = await response.json();

    const centerOffset = (posts.length - 1) * 2.5 / 2;

    posts.forEach((post, index) => {
        const geometry = new THREE.BoxGeometry(4, 2, 0.5);
        const material = new THREE.MeshBasicMaterial({
            color: selectedColor,
            side: THREE.DoubleSide,
            transparent: true,
            depthWrite: false,
            polygonOffset: true,
            polygonOffsetFactor: -0.1
        });
        const card = new THREE.Mesh(geometry, material);
        card.position.set(index * 5 - centerOffset, 0, 0);
        card.rotation.x = Math.PI / 4;
        card.rotation.z = Math.PI / 6;
        card.userData = { post }; // 게시글 데이터를 저장
        scene.add(card);
    });
}

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('click', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children);

    if (intersects.length > 0) {
        const clickedObject = intersects[0].object;

        if (clickedObject instanceof THREE.Mesh) {
            const geometry = clickedObject.geometry;

            if (geometry instanceof THREE.CircleGeometry) {
                selectedColor = clickedObject.userData.color;
                console.log(`Selected color: ${selectedColor.toString(16)}`); // 선택된 색상 확인

                // 모든 네모의 색상 변경
                scene.children.forEach((child) => {
                    if (child instanceof THREE.Mesh && child.geometry instanceof THREE.BoxGeometry) {
                        const material = child.material as THREE.MeshBasicMaterial;
                        material.color.set(selectedColor);
                    }
                });
            } else if (geometry instanceof THREE.BoxGeometry) {
                // 팝업 창 열기
                const post = clickedObject.userData.post as Post;
                document.getElementById('popup-title')!.innerText = post.title;
                document.getElementById('popup-content')!.innerText = post.content;
                document.getElementById('popup')!.style.display = 'block';
                document.getElementById('overlay')!.style.display = 'block';
            }
        }
    }
});

// 팝업 창 닫기
document.querySelector('.close-btn')!.addEventListener('click', () => {
    document.getElementById('popup')!.style.display = 'none';
    document.getElementById('overlay')!.style.display = 'none';
});

camera.position.z = 10;

function animate() {
    requestAnimationFrame(animate);

    scene.children.forEach((child) => {
        if (child instanceof THREE.Mesh && child.geometry instanceof THREE.BoxGeometry) {
            child.rotation.y += 0.01;
        }
    });

    renderer.render(scene, camera);
}

loadPosts().catch(error => console.error('LoadPosts error:', error));
animate();