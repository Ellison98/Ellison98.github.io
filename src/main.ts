import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

interface Post {
    id: number;
    title: string;
    content: string;
    date: string;
    type: string;
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

async function loadPosts() {
    const response = await fetch('/posts.json');
    const posts: Post[] = await response.json();

    const centerOffset = (posts.length - 1) * 2.5 / 2;

    posts.forEach((post, index) => {
        const geometry = new THREE.BoxGeometry(4, 2, 0.5);
        const material = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
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
        scene.add(card);

        const loader = new FontLoader();
        loader.load('/fonts/helvetiker_regular.typeface.json', (font) => {
            const textGeometry = new TextGeometry(post.title, {
                font: font,
                size: 0.2,
                curveSegments: 12,
                bevelEnabled: false,
            });

            textGeometry.computeBoundingBox();
            textGeometry.center();

            // 텍스트 메시를 렌더링하지 않음
            // const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
            // const textMesh = new THREE.Mesh(textGeometry, textMaterial);
            // textMesh.position.set(card.position.x - 1, 0, 0.3);
            // scene.add(textMesh);
        });
    });
}

camera.position.z = 10;

function animate() {
    requestAnimationFrame(animate);
    scene.children.forEach((child) => {
        if (child instanceof THREE.Mesh) {
            child.rotation.y += 0.01;
        }
    });
    renderer.render(scene, camera);
}

loadPosts();
animate();