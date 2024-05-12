import * as THREE from 'three';
export interface Planet {
	name: string;
	radius: number;
	distance: number;
	speed: number;
	material: THREE.MeshStandardMaterial;
	moons: Moon[];
}

export interface Moon {
	name: string;
	radius: number;
	distance: number;
	speed: number;
}