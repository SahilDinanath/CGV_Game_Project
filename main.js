import * as THREE from 'three';
import * as player from '/Player/player.js';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as ui from '/UI/start_screen.js'
import * as minimap from '/UI/minimap.js'
import * as music from '/Music/musicController.js';
import * as particle from '/Player/particleEffect.js';
import { disableButtons } from "/UI/start_screen.js";
import * as world from "/Levels/Level_1.js";
const scene = new THREE.Scene();
//sets up renderer/screen
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


//adds initial camera to scene to show starfield
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.name = "mainCamera";
camera.position.z = 30;
camera.position.y = 2;
scene.add(camera);

//sets up sound, sound needs to be set up before the world is setup as it runs during the login page
music.setInGameSound()

//Add orbit control
// var controls = new OrbitControls(camera, renderer.domElement);

var level1 = false;
var level2 = false;
var level3 = false;

// Define a variable to track the animation state
let isPaused = false;

// Your animation code here
function animate() {
	if (!isPaused) {
		requestAnimationFrame(animate);
		player.keyboardMoveObject(scene);
		particle.updateParticleSystem();

		checkGameCondition(scene);
		minimap.updateMiniMap(scene);

		renderer.render(scene, camera);
	}

}

function checkGameCondition(scene) {
	if (scene.getObjectByName('minimap_icon') == undefined)
		return;
	//TODO:
	//on player collision, show death screen and pause game
	if (scene.getObjectByName('minimap_icon').position.x > 20) {
		ui.enableWinScreen();
	}

}


//when window is resized, update everything
window.addEventListener('resize',onWindowResize);
function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);

	renderer.render();
}
// Function to pause the animation
function pauseAnimation() {
	isPaused = true;
	ui.enablePauseScreen();
}

// Function to resume the animation
function resumeAnimation() {
	if (isPaused) {
		isPaused = false;
		ui.disableButtons();
		animate();
	}
}

// Listen for the space key press event to pause or resume game
document.addEventListener('keydown', function(event) {
	if (event.key === ' ') { // ' ' represents the space key
		if (isPaused) {
			resumeAnimation();
		} else {
			pauseAnimation();
		}
	}
});

//music.enableSound();

// Define a function to clear the scene
function clearScene() {
	// Remove all objects from the scene
	while (scene.children.length > 0) {
		scene.remove(scene.children[0]);
	}

}

//spawn level depending on button click 
animate();
ui.levelOneButton.onclick = function() {
	level1 = true;
	/*sound can only play if user clicks somewhere on the screen, 
	 * this is a design by google/firefox, this plays the song in case the user never clicked anywhere on screen*/
	music.enableSound();
	ui.disableStartScreen();
	world.levelOne(scene, renderer, camera);
	animate();
}

ui.levelTwoButton.onclick = function() {
	level2 = true;
	ui.disableStartScreen();
	world.levelOne();
	animate();
}

ui.levelThreeButton.onclick = function() {
	level3 = true;
	ui.disableStartScreen();
	world.levelOne();
	animate();
}

ui.nextButton.onclick = function() {
	clearScene();
	disableButtons();
	if (level1) {
		level1 = false;
		world.levelOne();   //change to level2
		animate();
	}
	if (level2) {
		level2 = false;
		world.levelOne(); // change to level3
		animate();
	}
}

ui.resumeButton.onclick = function() {
	//TODO: resume game on keyboard pause
}

ui.returnButton.onclick = function() {

	window.location.reload(); // This will reload the page
}

ui.restartButton.onclick = function() {
	clearScene();
	disableButtons();
	if (level1) {
		world.levelOne();
	}
	if (level2) {
		world.levelOne(); // change to level2
	}
	if (level3) {
		world.levelOne(); // change to level3
	}
}




