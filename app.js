    import Stars from './stars.js';
    import starPositions from './starPositions.json';
    import './style.css';
    import StarInfoDisplay from './starInfoDisplay';




    const canvas = document.getElementById('renderCanvas');
    const engine = new BABYLON.Engine(canvas, true);
    const scaleDistance = 50; // Un facteur d'échelle pour augmenter les distances apparentes
    let stars;

    // Fonctions d'aide pour la conversion des données en attributs visuels
    function lumToSize(luminosity) {
        const baseSize = 1; // Taille de base pour une étoile de luminosité 1
        // Utiliser la racine carrée pour une plus grande sensibilité aux changements de luminosité
        let size = Math.exp(luminosity / 10) * baseSize;
        // Plafonner la taille maximale à 2 et plancher la taille minimale à 0.2 pour la visibilité
        size = Math.min(Math.max(size, 0.2), 20);
        return size;
    }

    function absmagToBrightness(absmag) {
        return Math.max(0.1, (15 - absmag) / 15);
    }

    function updateSceneWithFilteredStars(filteredStars) {
        // Nettoyer les étoiles existantes
        stars.clear(); // Vous devrez implémenter cette méthode dans votre classe Stars

        // Ajouter de nouvelles étoiles basées sur les étoiles filtrées
        filteredStars.forEach(starData => {
            const { x, y, z, lum, absmag, con, proper } = starData;
            const scaledX = x * scaleDistance;
            const scaledY = y * scaleDistance;
            const scaledZ = z * scaleDistance;
            const size = lumToSize(lum);
            const brightness = absmagToBrightness(absmag);
            const name = proper || starData.bf || starData.hr;

            // Utilisez votre fonction existante pour ajouter les étoiles à la scène
            stars.implementStars(scaledX, scaledY, scaledZ, "https://i.imgur.com/lCmwJRT.jpg", "sphere", {
                heat: starData.vx,
                size,
                brightness,
                constellation: con,
                name
            });
        });

        // Rendre la scène à nouveau
        scene.render();
    }

    function filterStars(criteria, point = {x: 0, y: 0, z: 0}) {

        let filteredStarPositions;

        function calculateDistance(a, b) {
            return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2) + Math.pow(a.z - b.z, 2));
        }
    
        switch(criteria) {
            case 'hottest':
            filteredStarPositions = starPositions.sort((a, b) => b.heat - a.heat).slice(0, 50);
            break;
            case 'brightest':
            filteredStarPositions = starPositions.sort((a, b) => b.brightness - a.brightness).slice(0, 50);
            break;
            case 'biggest':
            filteredStarPositions = starPositions.sort((a, b) => b.size - a.size).slice(0, 50);
            break;
            case 'closest':
            filteredStarPositions = starPositions.sort((a, b) => calculateDistance(a, point) - calculateDistance(b, point)).slice(0, 50);
            break;
            case 'number':
            const numberToDisplay = parseInt(point, 10); // Renommez la variable pour plus de clarté
            filteredStarPositions = starPositions.slice(0, numberToDisplay);
            break;
            
            default:
            filteredStarPositions = starPositions;
            break;
        }
        updateSceneWithFilteredStars(filteredStarPositions);
    }

    const createScene = (starPositions) => {
        var scene = new BABYLON.Scene(engine);
        scene.clearColor = BABYLON.Color3.Black();  // Changer la couleur de fond à noir

        var camera = new BABYLON.UniversalCamera("camera1", new BABYLON.Vector3(0, 0, 0), scene);
        camera.attachControl(canvas, true);

        var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
        light.intensity = 10;

        const starInfoDisplay = new StarInfoDisplay();


        stars = new Stars(scene, starInfoDisplay);
        const glowLayer = new BABYLON.GlowLayer("glow", scene);
        glowLayer.intensity = 2;
        
        if (!Array.isArray(starPositions)) {
            console.error('starPositions is not an array:', starPositions);
            return;
        }

        starPositions.forEach(position => {

            const { x, y, z, lum, absmag, con, proper } = position;
            const name = proper || position.bf || position.hr;
            const size = lumToSize(lum);
            const brightness = absmagToBrightness(absmag);

            const scaledX = x * scaleDistance;
            const scaledY = y * scaleDistance;
            const scaledZ = z * scaleDistance;

            stars.implementStars(scaledX, scaledY, scaledZ, "https://i.imgur.com/lCmwJRT.jpg", "sphere", {
                heat: position.vx, // Utilisation d'une donnée représentative pour 'heat'
                size,
                brightness,
                constellation: con,
                name
            });

            // ... Ajout de pointLight et d'autres configurations si nécessaire
        });


        return scene;
    };

    document.getElementById('hottest').addEventListener('click', () => filterStars('hottest'));
    document.getElementById('brightest').addEventListener('click', () => filterStars('brightest'));
    document.getElementById('biggest').addEventListener('click', () => filterStars('biggest'));
    document.getElementById('closest').addEventListener('click', () => filterStars('closest', {x: 0, y: 0, z: 0})); // Ajout de cet événement
    document.getElementById('showStars').addEventListener('click', () => {
        const numberOfStars = document.getElementById('numberInput').value;
        filterStars('number', numberOfStars); // Utilisez 'number' comme critère et passez le nombre d'étoiles
    });
    const firstFiftyStarPositions = starPositions.slice(0, 500);
    const scene = createScene(firstFiftyStarPositions);
    engine.runRenderLoop(() => scene.render());
    window.addEventListener('resize', () => engine.resize());