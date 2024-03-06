import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import '../style.css'
import * as THREE from 'three'
import vertexShaderSource from './shaders2/vertex.glsl'
import fragmentShaderSource from './shaders2/fragment.glsl'

const scene = new THREE.Scene()
scene.background = new THREE.Color(0x000000)

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(0, 5, 5)

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#webgl')
})
renderer.setSize(window.innerWidth, window.innerHeight)

const planeGeo = new THREE.PlaneGeometry(10, 10, 32, 32)

const planeMat = new THREE.RawShaderMaterial({
  vertexShader: vertexShaderSource,
  fragmentShader: fragmentShaderSource,
  side: THREE.DoubleSide,
  transparent: true
})
const plane = new THREE.Mesh(planeGeo, planeMat)
scene.add(plane)

const orbitControls = new OrbitControls(camera, renderer.domElement)
orbitControls.enableDamping = true



function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
  orbitControls.update()
}

animate()