import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as particle from '/Player/particleEffect.js';
import * as THREE from 'three';
//player keyboard input for movement
const yMovementBounds = 16;
const xMovementBounds = 16;
let playerMoving = false;
export let playerBoundingBox;
let speed = 0.5;
//user input for player movement
const keys = new Map();
document.onkeydown = function(e) {
	playerMoving = true;
	keys.set(e.which, true);
};

document.onkeyup = function(e) {
	playerMoving = false;
	keys.delete(e.which);
};
/* Player */
//load models
const loader = new GLTFLoader();

export function addPlayerToScene(scene, firstPersonCam) {
	loader.load('Assets/playerTextures/StarSparrow.glb',
		//we have to set up player in here for now
		function(player) {
			player.scene.name = "player";
			player.scene.receiveShadow = true;
			//player.scene.castShadow = true;
			player.scene.traverse(function (node){
				if(node.isMesh)
					node.castShadow = true;
			});

			player.scene.rotation.y = Math.PI;
			player.scene.children[0].geometry.computeBoundingBox();
			playerBoundingBox = new THREE.Box3().setFromObject(player.scene);

			// this is to make a bounding box visible but does not work with collision detection
			// playerBoundingBox = new THREE.BoxHelper(player.scene, 0xff0000);
			// scene.add(playerBoundingBox);

			scene.add(player.scene);
		});
}

//keyboard movements
export function keyboardMoveObject(scene, firstPersonCamera) {
	const object = scene.getObjectByName("player");
	if (object == undefined)
		return;
	object.children[0].geometry.computeBoundingBox();
	playerBoundingBox.setFromObject(object);

	// update box helper to follow player object
	// playerBoundingBox.update();
	let tiltAngleZ = 0 ;
	let tiltAngleX = 0;
	if (playerMoving) {
		keys.forEach((_, key) => {
			if (key == 37) {
				object.position.x -= object.position.x > -xMovementBounds ? speed : 0;
				tiltAngleZ = -Math.PI / 8; // Adjust the angle as needed
				object.rotation.z = tiltAngleZ;
			}
			else if (key == 38) {
				object.position.y += object.position.y < yMovementBounds ? speed : 0;
				tiltAngleX = Math.PI / 8; // Adjust the angle as needed
				object.rotation.x = tiltAngleX;
			}
			else if (key == 39) {
				object.position.x += object.position.x < xMovementBounds ? speed : 0;
				tiltAngleZ = Math.PI / 8; // Adjust the angle as needed
				object.rotation.z = tiltAngleZ;
			}
			else if (key == 40) {
				object.position.y -= object.position.y > -yMovementBounds ? speed : 0;
				tiltAngleX = -Math.PI / 8; // Adjust the angle as needed
				object.rotation.x = tiltAngleX;
			}
		});
	}
	else {
		tiltAngleZ = 0;
		tiltAngleX = 0;
		object.rotation.z = tiltAngleZ;
		object.rotation.x = tiltAngleX;

		if (object.position.x != 0 || object.position.y != 0) {
			if (object.position.x > 0) {
				object.position.x -= speed / 2;
			} else if (object.position.x < 0) {
				object.position.x += speed / 2;
			}
			if (object.position.y > 0) {
				object.position.y -= speed / 2;
			} else if (object.position.y < 0) {
				object.position.y += speed / 2;
			}
		}
	}
	firstPersonCamera.position.x = object.position.x;
	firstPersonCamera.position.y = object.position.y;
	firstPersonCamera.position.z = object.position.z - 6;

};

//on player death delete the player and spawn particles
export function onDeath(scene) {
	if(scene.getObjectByName("player") == undefined) return;
	let player = scene.getObjectByName("player");

	particle.createNewParticleSystem(player.position.x, player.position.y, player.position.z, scene);

	scene.remove(scene.getObjectByName("player"));
	scene.remove(playerBoundingBox);
}

export function setPlayerSpeed(newSpeed){
	speed = newSpeed;
}
