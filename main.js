import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import './style.css'
import fireflyVertexGlsl from './shaders/firefly/vertex.glsl'
import fireflyFragmentGlsl from './shaders/firefly/fragment.glsl'
import portalVertexGlsl from './shaders/portal/vertex.glsl'
import portalFragmentGlsl from './shaders/portal/fragment.glsl'

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x888888);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(2.5, 2.5, 2);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ 
  antialias: true,
  canvas: document.getElementById('webgl')
 });
 renderer.setSize(window.innerWidth, window.innerHeight)

 const orbitControls = new OrbitControls(camera, renderer.domElement);
 orbitControls.enableDamping = true;
 orbitControls.autoRotate = true;
 orbitControls.autoRotateSpeed = 0.8;

 const loader = new THREE.TextureLoader();
 const bgMat = loader.load('baked.jpg');
 bgMat.flipY = false
 const mat = new THREE.MeshBasicMaterial({ map: bgMat });
 bgMat.colorSpace = THREE.SRGBColorSpace;
 renderer.outputEncoding = THREE.sRGBEncoding;

 const spaceMat = new THREE.ShaderMaterial({
   vertexShader: portalVertexGlsl,
   fragmentShader: portalFragmentGlsl,
   uniforms: {
    uTime: { value: 0 },
  }
  });
 const poleMat = new THREE.MeshBasicMaterial({ 
  color: 0xffffff,
  side: THREE.DoubleSide,
  color: 0xeeeeee
 });

 const pointGeo = new THREE.BufferGeometry()
 const count = 30
 const positions = new Float32Array(count * 3)
 const randoms = new Float32Array(count)
 for(let i = 0; i < count; i++){
  let i3 = i * 3
  positions[i3 + 0] = (Math.random() - 0.5) * 5
  positions[i3 + 1] = Math.random() * 2.5
  positions[i3 + 2] = (Math.random() - 0.48) * 4
  randoms[i] = Math.random()
 }
 pointGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
 pointGeo.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1))
 const pointMat = new THREE.ShaderMaterial({ 
  transparent: true,
  vertexShader: fireflyVertexGlsl,
  fragmentShader: fireflyFragmentGlsl,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
  uniforms: {
    uTime: { value: 0 },
  }
 })
 const points = new THREE.Points(pointGeo, pointMat)
 scene.add(points)
 

 const gltfLoader = new GLTFLoader();
 gltfLoader.load('portal.glb', (gltf) => {
   scene.add(gltf.scene);
   gltf.scene.children.forEach((child) => {
    if(child.name === 'poleLightA' || child.name === 'poleLightB'){
      child.material = poleMat
    }else if(child.name === 'spaceLight'){
      child.material = spaceMat
    }else{
      child.material = mat
    }
   })
 })

 window.addEventListener('resize', () => {
   camera.aspect = window.innerWidth / window.innerHeight
   camera.updateProjectionMatrix()
   renderer.setSize(window.innerWidth, window.innerHeight)
   renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
 })
 
 const clock = new THREE.Clock()

 function animate(){
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
  orbitControls.update()
  pointMat.uniforms.uTime.value = clock.getElapsedTime()
  spaceMat.uniforms.uTime.value = clock.getElapsedTime()
 }

 animate()
