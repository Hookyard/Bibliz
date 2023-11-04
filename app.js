import Stars from './stars.js';

const canvas = document.getElementById('renderCanvas');
const engine = new BABYLON.Engine(canvas, true);

const createScene = () => {
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = BABYLON.Color3.Black();  // Changer la couleur de fond à noir

    var camera = new BABYLON.UniversalCamera("camera1", new BABYLON.Vector3(0, 0, 0), scene);
    camera.attachControl(canvas, true);

    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 10;

    const stars = new Stars(scene);
    const glowLayer = new BABYLON.GlowLayer("glow", scene);
    glowLayer.intensity = 2;
    for (var i = 0; i < 100; i++) {
        var x = Math.random() * 200 - 100;
        var y = Math.random() * 200 - 100;
        var z = Math.random() * 200 - 100;
        var color = `#${Math.floor(Math.random()*16777215).toString(16)}`;  // Générer une couleur hexadécimale aléatoire
        stars.implementStars(x, y, z, "https://i.imgur.com/lCmwJRT.jpg", "sphere");

        const pointLight = new BABYLON.PointLight("pointLight", new BABYLON.Vector3(x, y, z), scene);
        pointLight.intensity = 100;  // Ajustez l'intensité pour obtenir l'effet désiré
        pointLight.range = 50;
    }

    return scene;
};

const scene = createScene();
engine.runRenderLoop(() => scene.render());
window.addEventListener('resize', () => engine.resize());