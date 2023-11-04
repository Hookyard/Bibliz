class Stars {
    constructor(scene) {
        this.scene = scene;
    }

    implementStars(x, y, z, texturePath, shape) {
        const material = new BABYLON.StandardMaterial("material", this.scene);
        material.diffuseTexture = new BABYLON.Texture(texturePath, this.scene);
        material.emissiveTexture = material.diffuseTexture;  // Utiliser la même texture pour l'émission
        material.emissiveColor = new BABYLON.Color3(10, 10, 10);
        
        material.emissiveIntensity = 10;  // Augmenter l'intensité de l'émission

        let starMesh;
        if (shape === "sphere") {
            starMesh = BABYLON.MeshBuilder.CreateSphere("sphere", {}, this.scene);
        }
        else {
            console.warn(`Shape ${shape} not recognized, defaulting to sphere.`);
            starMesh = BABYLON.MeshBuilder.CreateSphere("sphere", {}, this.scene);
        }

        starMesh.material = material;
        starMesh.position = new BABYLON.Vector3(x, y, z);

        return starMesh;
    }

}

export default Stars;