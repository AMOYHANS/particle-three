import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import '../style.css'
import * as THREE from 'three'
import vertexShaderSource from './shaders1/vertex.glsl'
import fragmentShaderSource from './shaders1/fragment.glsl'

const scene = new THREE.Scene()
scene.background = new THREE.Color(0x000000)

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(0, 5, 5)

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#webgl')
})
renderer.setSize(window.innerWidth, window.innerHeight)

const loader = new THREE.TextureLoader()
const texture = loader.load('flag.jpg')

const planeGeo = new THREE.PlaneGeometry(10, 10, 32, 32)
const count = planeGeo.getAttribute('position').count
const diff = new Float32Array(count)
for (let i = 0; i < count; i++) {
  diff[i] = Math.random();
}
const clock = new THREE.Clock()
let elapsedTime = clock.getElapsedTime()
planeGeo.setAttribute('aDiff', new THREE.BufferAttribute(diff, 1))
const planeMat = new THREE.RawShaderMaterial({
  vertexShader: vertexShaderSource,
  fragmentShader: fragmentShaderSource,
  side: THREE.DoubleSide,
  // wireframe: true,
  uniforms:{
    uTime: {value: elapsedTime},
    uTexture: {value: texture}
  },
  transparent: true
})
const plane = new THREE.Mesh(planeGeo, planeMat)
plane.scale.set(1, 0.6, 1)
// plane.rotation.x = Math.PI * 0.5
scene.add(plane)

const orbitControls = new OrbitControls(camera, renderer.domElement)
orbitControls.enableDamping = true



function animate() {
  requestAnimationFrame(animate)
  elapsedTime = clock.getElapsedTime()
  planeMat.uniforms.uTime.value = elapsedTime
  renderer.render(scene, camera)
  orbitControls.update()
}

animate()