import * as THREE from 'three';
import { Mesh, MeshStandardMaterial, RingGeometry, SphereGeometry } from 'three';
import { Moon, Planet } from '../interfaces/SolarSystemInterface.ts';
import { moonMaterial, sphereGeometry, planetRingsMaterial } from '../script.ts';

export const createPlanet = (planet: Planet): Mesh<SphereGeometry,  THREE.MeshStandardMaterial> => {
	const planetMesh = new THREE.Mesh(
		sphereGeometry,
		planet.material,
	);
	planetMesh.scale.setScalar(planet.radius);
	planetMesh.position.x = planet.distance;
	planetMesh.rotateY(180);
	return planetMesh;
};

export const createMoon = (moon: Moon):Mesh<SphereGeometry, MeshStandardMaterial> | Mesh<RingGeometry, MeshStandardMaterial> => {
	let moonMesh;
	if (moon.name === 'saturnRings') {
		moonMesh = createRings(moon);
		moonMesh.rotation.x = Math.PI / 1.5;
	} else {
		moonMesh = new THREE.Mesh(
			sphereGeometry,
			moonMaterial,
		);
	}
	moonMesh.scale.setScalar(moon.radius);
	moonMesh.position.x = moon.distance - 2;
	return moonMesh;
};

export const createRings = (moon: Moon): Mesh<RingGeometry, MeshStandardMaterial> => {
	const ringMesh = new THREE.Mesh(
		new THREE.RingGeometry(
			moon.radius + 17,
			moon.radius + 23,
			32,
			1,
		),
		planetRingsMaterial,
	);
	planetRingsMaterial.side = THREE.DoubleSide;
	ringMesh.position.x = moon.distance;
	return ringMesh;
};