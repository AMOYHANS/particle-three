import './style.css'
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js' 
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'

const gui = new GUI()
const debugObj = {
  envMapIntensity: 1
}

let gltfScene = null

const scene = new THREE.Scene();
scene.background = new THREE.Color('black');

const cubeLoader = new THREE.CubeTextureLoader()
const cubetexture = cubeLoader.load([
  'cube/px.png',
  'cube/nx.png',
  'cube/py.png',
  'cube/ny.png',
  'cube/pz.png',
  'cube/nz.png'
])
scene.background = cubetexture

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 5)

const control = new OrbitControls(camera, document.querySelector('#webgl'))

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#webgl')
})
renderer.setSize(window.innerWidth, window.innerHeight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.position.set(0, 5, 5)
directionalLight.castShadow = true
directionalLight.shadow.camera.far = 15
directionalLight.shadow.mapSize.set(1024, 1024)
scene.add(new THREE.CameraHelper(directionalLight.shadow.camera))
scene.add(directionalLight)

const gltfLoader = new GLTFLoader();
// 解码器，有的gltf文件通过draco算法压缩过
const dracoLoader = new DRACOLoader();
// 先从three/jsm/libs/下将draco文件夹复制到public下,然后设置解码器路径
dracoLoader.setDecoderPath('draco/');
gltfLoader.setDRACOLoader(dracoLoader);
gltfLoader.load('flightHelmet/glTF/FlightHelmet.gltf', (gltf) => {
    gltfScene = gltf.scene 
    gltf.scene.scale.set(10, 10, 10)
    gltf.scene.position.set(0, -4, 0)
    scene.add(gltf.scene) 
    updateAllMaterails(gltf.scene, 1)
})

const mouse = new THREE.Vector2()
const mouseRay = new THREE.Raycaster()
window.addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
  mouseRay.setFromCamera(mouse, camera)
})

// 自动为每个场景内的物体添加环境贴图
scene.environment = cubetexture

function updateAllMaterails(scene, envMapIntensity) {
  scene.traverse((child) => {
    // 判断是Mesh并且材料是可以感光的
    if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
      child.material.envMapIntensity = envMapIntensity
      child.castShadow = true
      child.receiveShadow = true
    }
  })
}

function animate(){
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
  control.update()
}

gui.add(directionalLight.position, 'x').min(-5).max(5).step(0.01).name('x轴方向光位置')
gui.add(directionalLight.position, 'y').min(-5).max(5).step(0.01).name('y轴方向光位置')
gui.add(directionalLight.position, 'z').min(-5).max(5).step(0.01).name('z轴方向光位置')
gui.add(directionalLight, 'intensity').min(0).max(10).step(0.01).name('方向光强度')
gui.add(debugObj, 'envMapIntensity').min(0).max(5).step(0.01).name('环境贴图强度').onChange((val) => updateAllMaterails(gltfScene, val))
gui.add(renderer, 'toneMapping', {
  No: THREE.NoToneMapping,
  Linear: THREE.LinearToneMapping,
  Reinhard: THREE.ReinhardToneMapping,
  Cineon: THREE.CineonToneMapping,
  ACESFilmic: THREE.ACESFilmicToneMapping
})

renderer.physicallyCorrectLights = true
// 开启sRGB编码 默认是线性的颜色 而人眼是sRGB 还有gamma编码, sRGB相当于gamma值2.2
renderer.outputEncoding = THREE.sRGBEncoding
// hdr映射为ldr 色域映射，不同的映射方式会有不同的质感
// 下面的映射有胶片质感
renderer.toneMapping = THREE.ACESFilmicToneMapping
// 曝光度
renderer.toneMappingExposure = 2
// 允许阴影贴图
renderer.shadowMap.enabled = true
// 阴影贴图类型
renderer.shadowMap.type = THREE.PCFSoftShadowMap

window.addEventListener('resize', () => {
  const heigth = window.innerHeight
  const width = window.innerWidth
  camera.aspect = width / heigth
  camera.updateProjectionMatrix()
  renderer.setSize(width, heigth)
  renderer.setPixelRatio(window.devicePixelRatio)
})

animate()