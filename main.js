import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import GUI from 'three/examples/jsm/libs/lil-gui.module.min'

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(0, 5, 5)

const renderer = new THREE.WebGLRenderer({ 
  antialias: true,
  canvas: document.querySelector('#webgl')
 })
renderer.setSize(window.innerWidth, window.innerHeight)

const orbitControls = new OrbitControls(camera, renderer.domElement)
orbitControls.enableDamping = true

const textureLoader = new THREE.TextureLoader()
const texture = textureLoader.load('star.png')

const pointGeo = new THREE.BufferGeometry()
const count = 10000
const pointsArray = new Float32Array(count * 3)
const colors = new Float32Array(count * 3)

const debugObj = {
  maxLength: 5,
  diffAngle: 0.2,
  diffuse: 1.5
}

function generatedPoints(){
  for(let i = 0; i < count; i++){
    const length = Math.random() * debugObj.maxLength * 2
    const diffAngle = length * Math.PI / 6 * debugObj.diffAngle
    if(i % 3 === 0){
      pointsArray[3 * i] = Math.cos(diffAngle) *length + Math.pow(Math.random(), 2.5) * debugObj.diffuse * (Math.random() - 0.5)
      pointsArray[3 * i + 1] = Math.pow(Math.random(), 2.5) * debugObj.diffuse * (Math.random() - 0.5)
      pointsArray[3 * i + 2] = Math.sin(diffAngle) *length + Math.pow(Math.random(), 2.5) * debugObj.diffuse * (Math.random() - 0.5)
    }
    else if(i % 3 === 1){
      pointsArray[3 * i] = Math.cos(Math.PI * 2 / 3 + diffAngle) * length + Math.pow(Math.random(), 2.5) * debugObj.diffuse * (Math.random() - 0.5)
      pointsArray[3 * i + 1] = Math.pow(Math.random(), 2.5) * debugObj.diffuse * (Math.random() - 0.5)
      pointsArray[3 * i + 2] = Math.sin(Math.PI * 2 / 3 + diffAngle) * length + Math.pow(Math.random(), 2.5) * debugObj.diffuse * (Math.random() - 0.5)
    }else if(i % 3 === 2){
      pointsArray[3 * i] = Math.cos(Math.PI * 4 / 3 + diffAngle) * length + Math.pow(Math.random(), 2.5) * debugObj.diffuse * (Math.random() - 0.5)
      pointsArray[3 * i + 1] = Math.pow(Math.random(), 2.5) * debugObj.diffuse * (Math.random() - 0.5)
      pointsArray[3 * i + 2] = Math.sin(Math.PI * 4 / 3 + diffAngle) * length + Math.pow(Math.random(), 2.5) * debugObj.diffuse * (Math.random() - 0.5)
    }

    colors[3*i + 0] = Math.random()
    colors[3*i + 1] = Math.random()
    colors[3*i + 2] = Math.random()
  }
  pointGeo.setAttribute('position', new THREE.BufferAttribute(pointsArray, 3))
  pointGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
}

generatedPoints()
const pointMat = new THREE.PointsMaterial({
  color: 0x8ED6FF,
  map: texture,
  size: 0.05,
  transparent: true,
  alphaMap: texture,
  blending: THREE.AdditiveBlending,
  alphaTest: 0.1
})
const pointMesh = new THREE.Points(pointGeo, pointMat)
scene.add(pointMesh)

const gui = new GUI()
gui.add(pointMat, 'size').min(0.05).max(0.2)
gui.add(debugObj, 'maxLength').min(1).max(10).step(0.5).onChange(() => generatedPoints())
gui.add(debugObj, 'diffAngle').min(0.01).max(0.3).step(0.01).onChange(() => generatedPoints())
gui.add(debugObj, 'diffuse').min(0.5).max(4).step(0.01).onChange(() => generatedPoints())

function animate(){
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
  orbitControls.update()
}

animate()