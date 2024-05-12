import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Moon, Planet } from './interfaces/SolarSystemInterface.ts';
import { createMoon, createPlanet } from './helper-functions/helper.ts';
import { Pane } from 'tweakpane';

const audio = new Audio('/audio/audio.mp3');
audio.loop = true;
audio.volume = 0.5; // Adjust the volume (0 to 1)
const playAudio = async() => {
	await audio.play();
};

document.addEventListener('click', playAudio);

const pane = new Pane();

// init scene
const scene = new THREE.Scene();

// add texture loader
const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();
cubeTextureLoader.setPath('/textures/cube-map/');

// add textures
const sunTexture = textureLoader.load('/textures/sun.jpg');
const mercuryTexture = textureLoader.load('/textures/mercury.jpg');
const venusTexture = textureLoader.load('/textures/venus.jpg');
const earthTexture = textureLoader.load('/textures/earth.jpg');
const moonTexture = textureLoader.load('/textures/moon.jpg');
const marsTexture = textureLoader.load('/textures/mars.jpg');
const jupiterTexture = textureLoader.load('/textures/jupiter.jpg');
const saturnTexture = textureLoader.load('/textures/saturn.jpg');
const uranusTexture = textureLoader.load('/textures/uranus.jpg');
const neptuneTexture = textureLoader.load('/textures/neptune.jpg');
const planetRingsTexture = textureLoader.load('/textures/planet_rings.jpg');


// add cube map
const backgroundCubeMap = cubeTextureLoader.load([
	'px.png',
	'nx.png',
	'py.png',
	'ny.png',
	'pz.png',
	'nz.png',
]);

backgroundCubeMap.generateMipmaps = true;
backgroundCubeMap.magFilter = THREE.LinearFilter;
backgroundCubeMap.minFilter = THREE.LinearMipmapLinearFilter;

// add background
scene.background = backgroundCubeMap;

// add materials
export const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);

const mercuryMaterial = new THREE.MeshStandardMaterial({
	map: mercuryTexture,
});

const venusMaterial = new THREE.MeshStandardMaterial({
	map: venusTexture,
});

const earthMaterial = new THREE.MeshStandardMaterial({
	map: earthTexture,
});

const marsMaterial = new THREE.MeshStandardMaterial({
	map: marsTexture,
});

const jupiterMaterial = new THREE.MeshStandardMaterial({
	map: jupiterTexture,
});

const saturnMaterial = new THREE.MeshStandardMaterial({
	map: saturnTexture,
});

const uranusMaterial = new THREE.MeshStandardMaterial({
	map: uranusTexture,
});

const neptuneMaterial = new THREE.MeshStandardMaterial({
	map: neptuneTexture,
});

export const planetRingsMaterial = new THREE.MeshStandardMaterial({
	map: planetRingsTexture,
});

export const moonMaterial = new THREE.MeshStandardMaterial({
	map: moonTexture,
});

const sunMaterial = new THREE.MeshBasicMaterial({
	map: sunTexture,
});
const sun = new THREE.Mesh(sphereGeometry, sunMaterial);
sun.scale.setScalar(1000);
scene.add(sun);

const earthOrbitalPeriod = 3650; // seconds
const earthAngularSpeed = (2 * Math.PI) / earthOrbitalPeriod; // radians per second

// planets are scaled up by 10x to make them look bigger
const planets: Planet[] = [
	{
		name: 'Mercury',
		radius: 34.96,
		distance: 4163,
		speed: earthAngularSpeed * (365 / 87.97),
		material: mercuryMaterial,
		moons: [],
	},
	{
		name: 'Venus',
		radius: 86.97,
		distance: 7767,
		speed: earthAngularSpeed * (365 / 224.7),
		material: venusMaterial,
		moons: [],
	},
	{
		name: 'Earth',
		radius: 91.54,
		distance: 10750,
		speed: earthAngularSpeed,
		material: earthMaterial,
		moons: [
			{
				name: 'Moon',
				radius: 0.3,
				distance: 3,
				speed: 24 * earthAngularSpeed,
			},
		],
	},
	{
		name: 'Mars',
		radius: 48.57,
		distance: 16370,
		speed: earthAngularSpeed * (365.25 / 687),
		material: marsMaterial,
		moons: [
			{
				name: 'Phobos',
				radius: 0.1,
				distance: 2,
				speed: 0.02,
			},
			{
				name: 'Deimos',
				radius: 0.24,
				distance: 3,
				speed: 0.015,
			},
		],
	},
	{
		name: 'Jupiter',
		radius: 1027,
		distance: 55900,
		speed: earthAngularSpeed * (365.25 / 4332.59),
		material: jupiterMaterial,
		moons: [],
	},
	{
		name: 'Saturn',
		radius: 836.5,
		distance: 102500,
		speed: earthAngularSpeed * (365.25 / 10759.22),
		material: saturnMaterial,
		moons: [
			{
				name: 'saturnRings',
				radius: 0.1,
				distance: 2,
				speed: 0.02,
			},
		],
	},
	{
		name: 'Uranus',
		radius: 337.2,
		distance: 206200,
		speed: earthAngularSpeed * (365.25 / 30688.5),
		material: uranusMaterial,
		moons: [],
	},
	{
		name: 'Neptune',
		radius: 326.4,
		distance: 323300,
		speed: earthAngularSpeed * (365.25 / 60182),
		material: neptuneMaterial,
		moons: [],
	},
];


const planetMeshes = planets.map((planet: Planet) => {
	const planetMesh = createPlanet(planet);
	scene.add(planetMesh);
	planet.moons.forEach((moon: Moon) => {
		const moonMesh = createMoon(moon);
		planetMesh.add(moonMesh);
	});
	return planetMesh;
});

// add lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 100);
pointLight.position.set(0, 1, 0);
scene.add(pointLight);

// add camera
const camera = new THREE.PerspectiveCamera(
	35,
	window.innerWidth / window.innerHeight,
	0.1,
	800000,
);
camera.position.z = -50000;
camera.position.x = 10000;
camera.position.y = 10000;

// add the renderer
const canvas = document.querySelector('canvas.threejs') as HTMLCanvasElement;
const renderer = new THREE.WebGLRenderer({
	canvas,
	antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// add controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.maxDistance = 600000;
controls.minDistance = 0.5;

// add resize listener
window.addEventListener('resize', () => {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
});

// Add TweakPane controls
planets.map(planet => {
	const folder = pane.addFolder({
		title: planet.name,
		expanded: false,
	});
	folder.addBinding(planet, 'distance', {
		label: 'Distance',
		input: 'range',
		min: 0,
		max: 1000000,
		step: 10000,

	});
	folder.addBinding(planet, 'speed', {
		label: 'Speed',
		min: 0,
		max: 100,
		step: 0.00001,
	});
	folder.addBinding(planet, 'radius', {
		label: 'Radius',
		min: 0,
		max: 10000,
		step: 10,
	});
	return folder;
});


// Event listeners for changes
pane.on('change', (): void => {
	// Update the scene based on TweakPane changes
	planetMeshes.forEach((planetMesh, planetIndex) => {
		planetMesh.scale.setScalar(planets[planetIndex].radius);
		planetMesh.position.x = Math.sin(planetMesh.rotation.y) * planets[planetIndex].distance;
		planetMesh.position.z = Math.cos(planetMesh.rotation.y) * planets[planetIndex].distance;
		planetMesh.rotation.y += planets[planetIndex].speed;
	});
});

// Render loop
const render = (): void => {
	sun.rotation.y += 0.001;
	planetMeshes.forEach((planetMesh, planetIndex): void => {
		planetMesh.position.x = Math.sin(planetMesh.rotation.y) * planets[planetIndex].distance;
		planetMesh.position.z = Math.cos(planetMesh.rotation.y) * planets[planetIndex].distance;
		planetMesh.rotation.y += planets[planetIndex].speed;
		planetMesh.children.forEach((moon, moonIndex): void => {
			if (planetIndex !== 5) {
				moon.rotation.y += planets[planetIndex].moons[moonIndex].speed;
				moon.position.x = Math.sin(moon.rotation.y) * planets[planetIndex].moons[moonIndex].distance;
				moon.position.z = Math.cos(moon.rotation.y) * planets[planetIndex].moons[moonIndex].distance;
			}
		});
	});
	controls.update();
	renderer.render(scene, camera);
	requestAnimationFrame(render);
};
render();