import './style.css'
import * as THREE from 'three';
// import {GUI} from 'three/addons/libs/lil-gui.module.min.js';
import gsap from 'gsap';

const scene = new THREE.Scene();

// 定义全局参数
const size = {
  width: window.innerWidth,
  height: window.innerHeight,
  posX: 0, // 鼠标在屏幕坐标系的归一化值
  posY: 0,
  distance: 4, // three世界物体之间的距离
  scrollY: 0, // 鼠标滚轮滚动的值
}

const camera = new THREE.PerspectiveCamera(75, size.width / size.height, 0.1, 1000);
camera.position.set(0, 3.5, 3.5)

// const gui = new GUI()
const debugProps = {
  starNum: 1500,
  starSize: 0.2,
  cubeSize: 8,
  autoRotate: true,
}

const loader = new THREE.TextureLoader();
const texture = loader.load('star.png')
const normTexture = loader.load('norm1.png')
normTexture.magFilter = THREE.NearestFilter;

const geometry = new THREE.BufferGeometry();
const material = new THREE.PointsMaterial({
  size: debugProps.starSize,
  map: texture,
  transparent: true, // 开启这个才能开启alphaMap
  alphaMap: texture, 
  depthWrite: false, // 不将粒子深度信息写入，多数情况下的解决方案
  // alphaTest: 0.001, // 开启alphaMap后，设置一个阈值，只有大于这个阈值的像素点才会被渲染
  // depthTest: true, // 关闭深度测试，开启后，粒子会遮挡其他物体
  sizeAttenuation: true, // 粒子是否根据距离进行衰减（占据更少像素）
  blending: THREE.AdditiveBlending, // 加性重叠混合
  vertexColors: true // 开启顶点颜色，使用自定义的color数组
})
const positions = []
const colors = []

function generateStar() {
  for(let i = 0; i < debugProps.starNum; i++){
    positions.push((Math.random() - 0.5) * (debugProps.cubeSize + 8))
    positions.push((Math.random() - 0.5) * (debugProps.cubeSize + 8))
    positions.push((Math.random() - 0.5) * debugProps.cubeSize)
    colors.push(Math.random())
    colors.push(Math.random())
    colors.push(Math.random())
  }
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
}
generateStar()
const mesh = new THREE.Points(geometry, material)
mesh.position.y = - debugProps.cubeSize / 2
scene.add(mesh)

// function updateStar() {
//   positions.splice(0, positions.length)
//   colors.splice(0, colors.length)
//   generateStar()
// }
// gui.add(debugProps, 'starNum', 520, 2000).step(100).onFinishChange(updateStar)
// gui.add(debugProps, 'starSize', 0.1, 0.5).step(0.05).onChange(() => {
//   material.size = debugProps.starSize
// })


const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#webgl'),
  alpha:true
});
renderer.setSize(size.width, size.height);

const isMobile = window.innerWidth < 768

const torusGeo = new THREE.TorusGeometry(1, 0.4, 16, 100)
const basicMat = new THREE.MeshToonMaterial({ 
  normalMap: normTexture,
})
// gui.addColor(basicMat, 'color')
const torusMesh = new THREE.Mesh(torusGeo, basicMat)
const coneGeo = new THREE.ConeGeometry(1, 2, 32)
const coneMesh = new THREE.Mesh(coneGeo, basicMat)
coneMesh.position.y = - size.distance
const torusKnotGeo = new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16)
const torusKnotMesh = new THREE.Mesh(torusKnotGeo, basicMat)
torusKnotMesh.position.y = - size.distance * 2
scene.add(torusMesh,torusKnotMesh,coneMesh)
if(!isMobile){
  torusMesh.position.x = 2
  coneMesh.position.x = -2
  torusKnotMesh.position.x = 2
}

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
directionalLight.position.set(2, 4, 2)
scene.add(directionalLight)
const sectionMeshes = [torusMesh, coneMesh, torusKnotMesh]

const clock = new THREE.Clock()
const onsectionLength = Math.floor(document.body.scrollHeight / 3)
let currentSection = 0
let oldTime = clock.getElapsedTime()

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  // orbitControls.update()
  // material.size += (Math.random() * 0.01) * (Math.random() - 0.5)
  mesh.rotation.y += clock.getDelta() * Math.PI / 64
  // 摄像机每帧加上当前位置到要去的位置之间距离的20分之1，最终位置接近目标位置，过程更平滑
  camera.position.x += (size.posX - camera.position.x) / 20 
  camera.position.y += (size.posY - camera.position.y) / 20
  const deltaTime = clock.getElapsedTime() - oldTime
  oldTime = clock.getElapsedTime()
  for(let meshItem of sectionMeshes){
    meshItem.rotation.x += deltaTime
    meshItem.rotation.y += deltaTime
  }
  camera.position.y = -(size.distance) * (size.scrollY / onsectionLength)
  const newSection = Math.floor((size.scrollY + document.body.scrollHeight / 6) / onsectionLength)
  if(currentSection !== newSection){
    currentSection = newSection
    gsap.to(
      sectionMeshes[currentSection].rotation,
      {
        duration: 1.5,
        x: '+=6',
        y: '+=6',
        z: '+=6',
      })
  }
}

window.addEventListener('mousemove', (event) => {
  const { clientX, clientY } = event
  size.posX = clientX / size.width - 0.5
  size.posY = -(clientY / size.height) + 0.5
})

window.addEventListener('scroll', () => {
  size.scrollY = window.scrollY
})

animate()