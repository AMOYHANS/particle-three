import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import '../style.css'
import * as THREE from 'three'
import vertexShaderSource from './shaders3/vertex.glsl'
import fragmentShaderSource from './shaders3/fragment.glsl'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'

const scene = new THREE.Scene()
scene.background = new THREE.Color(0x000000)

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(0, 8, 8)

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#webgl')
})
renderer.setSize(window.innerWidth, window.innerHeight)

const planeGeo = new THREE.PlaneGeometry(10, 10, 32, 32)

const debugObj = {
  uHighColor: new THREE.Color(0x652f2f),
  uLowColor: new THREE.Color(0x27232f),
}

const planeMat = new THREE.ShaderMaterial({
  vertexShader: vertexShaderSource,
  fragmentShader: fragmentShaderSource,
  side: THREE.DoubleSide,
  uniforms: {
    uElevation: {
      value: 0.2,
    },
    uFreqX: {
      value: 2.0,
    },
    uFreqZ: {
      value: 2.0,
    },
    uTime:{
      value: 0
    },
    uHighColor:{
      value: debugObj.uHighColor
    },
    uLowColor:{
      value: debugObj.uLowColor
    }
  },
  transparent: true
})


const gui = new GUI()
gui.add(planeMat.uniforms.uElevation, 'value', 0, 5, 0.01).name('峰值')
gui.add(planeMat.uniforms.uFreqX, 'value', 0, 10, 0.01).name("X频率")
gui.add(planeMat.uniforms.uFreqZ, 'value', 0, 10, 0.01).name('Y频率')
gui.addColor(debugObj, 'uHighColor').name('高光颜色').onChange(() => {
  planeMat.uniforms.uHighColor.value.set(new THREE.Color(debugObj.uHighColor))
})
gui.addColor(debugObj, 'uLowColor').name('低光颜色').onChange(() => {
  planeMat.uniforms.uLowColor.value.set(new THREE.Color(debugObj.uLowColor))
})
const plane = new THREE.Mesh(planeGeo, planeMat)
plane.rotation.x = Math.PI * -0.5
scene.add(plane)

const orbitControls = new OrbitControls(camera, renderer.domElement)
orbitControls.enableDamping = true

const clock = new THREE.Clock()
function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
  orbitControls.update()
  planeMat.uniforms.uTime.value = clock.getElapsedTime()
}

animate()