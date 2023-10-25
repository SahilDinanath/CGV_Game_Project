import * as bosses from '/Bosses/bosses.js';
import * as obstacles from '/Obstacles/obstacles.js';
import * as THREE from 'three';
import * as player from '/Player/player_exports.js';
import * as ui from '/UI/ui_exports.js'; //TODO: add import for sky box 
import * as earth from '../Planets/worldGenerator.js';
import * as skybox from '../Background/daySkyBox.js';

export function levelThree(scene, renderer, camera) {
	//sets up lighting 
	const ambientLighting = new THREE.AmbientLight("white", 2);
	scene.add(ambientLighting);

	//sets up objects in scene
	player.addPlayerToScene(scene);
	player.setPlayerSpeed(0.7);
	ui.addMiniMapToScene(scene);
	
	//sets up boss in scene
	bosses.bossTwo(camera, scene, renderer);
	let bossTwo = scene.getObjectByName("bossTwo");
	bossTwo.position.setY(25);
	bossTwo.scale.set(7,7,7);

	obstacles.animateObstacles(renderer, camera, scene);

	skybox.initSky(scene, renderer, camera);

	//adds earth to scene with lighting with respect to the sun
	let earthTexture = '../Assets/earthTextures/GroundGrassGreen002/GroundGrassGreen002_COL_2K.jpg';
	earth.addSphereToScene(scene, earthTexture);
	addSunLightingToScene(scene);
}



//lighting 
export function updateDirectionalLighting(scene) {

	const object = scene.getObjectByName("sun");
	if (object == undefined)
		return;
	object.position.y -= 0.02;
}

//adds directional lighting to scene
function addSunLightingToScene(scene) {
	const dl = new THREE.DirectionalLight(0xffffff, 3);
	dl.castShadow = true;
	dl.position.set(0, 100, -300);
	dl.name = "sun";
	scene.add(dl);
}

