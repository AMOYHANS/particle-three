import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
// import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
// import { FontLoader } from 'three/addons/loaders/FontLoader.js';

import './style.css'

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x888888);

const cubeLoader = new THREE.CubeTextureLoader()
const textureCube = cubeLoader.load([
  '/pics/px.png',
  '/pics/nx.png',
  '/pics/py.png',
  '/pics/ny.png',
  '/pics/pz.png',
  '/pics/nz.png'
])
textureCube.mapping = THREE.CubeReflectionMapping;
scene.background = textureCube;

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

 const dracoLoader = new DRACOLoader();
 dracoLoader.setDecoderPath('./public/draco/');
 const gltfLoader = new GLTFLoader();
 gltfLoader.setDRACOLoader(dracoLoader);
 gltfLoader.load('cake.glb', (gltf) => {
   scene.add(gltf.scene);
 })

 const audio = new Audio('birthday.mp3');
 audio.loop = true;
 audio.play();
 const audio2 = new Audio('mysound.m4a');
 audio2.loop = true;
 audio2.play()

 const ambientLight = new THREE.AmbientLight(0xffffff, 2);
 scene.add(ambientLight);

 const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
 scene.add(directionalLight);

 window.addEventListener('resize', () => {
   camera.aspect = window.innerWidth / window.innerHeight
   camera.updateProjectionMatrix()
   renderer.setSize(window.innerWidth, window.innerHeight)
   renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
 })

//  // 文本几何体属性
// const myProps = {
// 	font: null,
// 	size: 0.5,
// 	height: 0.4,
// 	curveSegments: 2,
// 	bevelEnabled: true,
// 	bevelThickness: 0.02,
// 	bevelSize: 0.03,
// 	bevelSegments: 1,
// 	words: '祝妈妈生日快乐~',
// 	color: new THREE.Color('coral'),
// 	dynamicColor: true
// }

// //加载字体
// const loader = new FontLoader();
// loader.load( 'sans.json', function ( font ) {
// 	myProps.font = font;
// 	const textGeometry = new TextGeometry( myProps.words, myProps);
//   const material = new THREE.MeshBasicMaterial( { color: myProps.color, envMap: textureCube} );
//   const textGoeMesh = new THREE.Mesh( textGeometry,  material);
//   textGoeMesh.position.set(0, -2, 0);
//   textGoeMesh.rotation.x = -Math.PI / 4;
//   textGoeMesh.geometry.center(new THREE.Vector3());
//   scene.add( textGoeMesh );
// } );


 
 function animate(){
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
  orbitControls.update()
 }

 animate()
