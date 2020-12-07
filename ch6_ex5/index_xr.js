import * as THREE from '../ch5_ex4/modules/three.module.js';
import {VRButton} from './VRButton.js';

var gl, cube, sphere, light, camera, scene, canvas, glContext;
init();
animate();

function init() {
    // create context
    gl = new THREE.WebGLRenderer({antialias: true});
    gl.setPixelRatio(window.devicePixelRatio);
    gl.setSize(window.innerWidth, window.innerHeight);
    gl.outputEncoding = THREE.sRGBEncoding;
    gl.xr.enabled = true;
    document.body.appendChild(gl.domElement);
    document.body.appendChild(VRButton.createButton(gl));


    // create camera
    const angleOfView = 55;
    const aspectRatio = window.innerWidth / window.innerHeight;
    const nearPlane = 0.1;
    const farPlane = 1000;
    camera = new THREE.PerspectiveCamera(
        angleOfView,
        aspectRatio,
        nearPlane,
        farPlane
    );
    camera.position.set(0, 8, 30);

    // create the scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0.3, 0.5, 0.8);
    const fog = new THREE.Fog("grey", 1,90);
    scene.fog = fog;

    // GEOMETRY
    // create the cube
    const cubeSize = 4;
    const cubeGeometry = new THREE.BoxGeometry(
        cubeSize,
        cubeSize,
        cubeSize
    );  

    // Create the Sphere
    const sphereRadius = 3;
    const sphereWidthSegments = 32;
    const sphereHeightSegments = 16;
    const sphereGeometry = new THREE.SphereGeometry(
        sphereRadius,
        sphereWidthSegments,
        sphereHeightSegments
    );

    // Create the upright plane
    const planeWidth = 256;
    const planeHeight =  128;
    const planeGeometry = new THREE.PlaneGeometry(
        planeWidth,
        planeHeight
    );

    // MATERIALS
    const textureLoader = new THREE.TextureLoader();

    const cubeMaterial = new THREE.MeshPhongMaterial({
        color: 'pink'
    });

    const sphereNormalMap = textureLoader.load('textures/sphere_normal.png');
    sphereNormalMap.wrapS = THREE.RepeatWrapping;
    sphereNormalMap.wrapT = THREE.RepeatWrapping;
    const sphereMaterial = new THREE.MeshStandardMaterial({
        color: 'tan',
        normalMap: sphereNormalMap
    });

    
    const planeTextureMap = textureLoader.load('textures/pebbles.png');
    planeTextureMap.wrapS = THREE.RepeatWrapping;
    planeTextureMap.wrapT = THREE.RepeatWrapping;
    planeTextureMap.repeat.set(16, 16);
    //planeTextureMap.magFilter = THREE.NearestFilter;
    planeTextureMap.minFilter = THREE.NearestFilter;
    planeTextureMap.anisotropy = gl.getMaxAnisotropy();
    const planeNorm = textureLoader.load('textures/pebbles_normal.png');
    planeNorm.wrapS = THREE.RepeatWrapping;
    planeNorm.wrapT = THREE.RepeatWrapping;
    planeNorm.minFilter = THREE.NearestFilter;
    planeNorm.repeat.set(16, 16);
    const planeMaterial = new THREE.MeshStandardMaterial({
        map: planeTextureMap,
        side: THREE.DoubleSide,
        normalMap: planeNorm 
    });

    // MESHES
    cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(cubeSize + 1, cubeSize + 1, 0);
    scene.add(cube);

    sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(-sphereRadius - 1, sphereRadius + 2, 0);
    scene.add(sphere);

    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = Math.PI / 2;
    //scene.add(plane);

    //LIGHTS
    const color = 0xffffff;
    const intensity = .7;
    light = new THREE.DirectionalLight(color, intensity);
    light.target = plane;
    light.position.set(0, 30, 30);
    scene.add(light);
    scene.add(light.target);

    const ambientColor = 0xffffff;
    const ambientIntensity = 0.2;
    const ambientLight = new THREE.AmbientLight(ambientColor, ambientIntensity);
    scene.add(ambientLight);

}

function animate() {
    // replaces requestAnimationFrame()
    gl.setAnimationLoop(draw);
}

// Renamed from render(time)
function draw(time) {
    time *= 0.001;

    if (resizeDisplay) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    }
    
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    cube.rotation.z += 0.01;

    sphere.rotation.x += 0.01;
    sphere.rotation.y += 0.01;
    sphere.rotation.y += 0.01;

    light.position.x = 20*Math.cos(time);
    light.position.y = 20*Math.sin(time);
    gl.render(scene, camera);
}


// UPDATE RESIZE
function resizeDisplay() {
    const canvas = gl.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width != width || canvas.height != height;
    if (needResize) {
        gl.setSize(width, height, false);
    }
    return needResize;
}