const admin = require('firebase-admin');
const fs = require('fs');

// Vous devez télécharger votre fichier de configuration de service Firebase personnel
// et le référencer ici.
const serviceAccount = require('/Users/strippolijules/Documents/test/Bibliz/bibliz-f9be0-firebase-adminsdk-ezhqw-553403baa5.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function exportStarPositions() {
  const starPositions = [];
  const snapshot = await db.collection('stars').get();
  
  snapshot.forEach(doc => {
    starPositions.push(doc.data());
  });

  fs.writeFileSync('starPositions.json', JSON.stringify(starPositions, null, 2));
}

exportStarPositions();