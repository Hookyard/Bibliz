import FirebaseInit from './firebaseInit.js';
import Stars from './stars.js';

const firebaseInit = new FirebaseInit();

const canvas = document.getElementById('renderCanvas');
const engine = new BABYLON.Engine(canvas, true);

const createScene = (starPositions) => {
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = BABYLON.Color3.Black();  // Changer la couleur de fond à noir

    var camera = new BABYLON.UniversalCamera("camera1", new BABYLON.Vector3(0, 0, 0), scene);
    camera.attachControl(canvas, true);

    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 10;

    const stars = new Stars(scene);
    const glowLayer = new BABYLON.GlowLayer("glow", scene);
    glowLayer.intensity = 2;
    
    if (!Array.isArray(starPositions)) {
        console.error('starPositions is not an array:', starPositions);
        return;
    }
    starPositions.forEach(position => {
        const { x, y, z } = position;
        var color = `#${Math.floor(Math.random()*16777215).toString(16)}`;  // Générer une couleur hexadécimale aléatoire
        stars.implementStars(x, y, z, "https://i.imgur.com/lCmwJRT.jpg", "sphere");

        const pointLight = new BABYLON.PointLight("pointLight", new BABYLON.Vector3(x, y, z), scene);
        pointLight.intensity = 100;  // Ajustez l'intensité pour obtenir l'effet désiré
        pointLight.range = 50;
    });

    return scene;
};

firebaseInit.getStarPositions().then(starPositions => {
    const limitedStarPositions = starPositions.slice(0, 50);  // Limitez à 200 étoiles
    const scene = createScene(limitedStarPositions);
    engine.runRenderLoop(() => scene.render());
    window.addEventListener('resize', () => engine.resize());
});