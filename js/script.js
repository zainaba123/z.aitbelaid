window.onload = main;

let canvas;
let ctx;
let niveauCourant = 1;
let etatJeu = "MenuPrincipal";
let chance = 4 ;
let scr=0;
let changelvl=false;
let newb =4 ;
// ici on va stocker les objets graphiques du jeu, ennemis, etc.
let tableauDesBalles = [];
let c=0;
let balleChercheuse;
let balleImage;
let assets;
let nombreBalesmulti;
let musiqueCourante = null;


// programme principal
function main() {
  console.log("Page chargée ! DOM ready ! Toutes les ressources de la page sont utilisables (vidéos, images, polices ...)");

  loadAssets(startGame);

}

function startGame(assetsLoaded) {

  assets = assetsLoaded;
  // On récupère grace à la "selector API" un pointeur sur le canvas
  canvas = document.querySelector("#myCanvas");
  
  // on ajoute des écouteurs souris/clavier sur le canvas
  canvas.onmousedown = traiteMouseDown;
  canvas.onmouseup = traiteMouseUp;
  canvas.onmousemove = traiteMouseMove;

  //canvas.addEventListener("mousedown", traiteMouseDown);
  //canvas.addEventListener("mousedown", traiteMouseDown2);

  // le canvas ne peut détecter les touches que si il a le focus (voir mooc)
  // c'est plus simple de mettre l'écouteur sur le document (la page)
  document.onkeydown = traiteKeyDown;
  document.onkeyup = traiteKeyUp;

  // pour dessiner, on a besoin de son "contexte graphique", un objet qui
  // va permettre de dessiner, ou de changer les propriétés du canvas
  // (largeur du trait, couleur, repère, etc.)

  ctx = canvas.getContext("2d");

  console.log(monstre.donneTonNom());

  creerDesBalles(newb);
  balleImage = new BalleImage(0,0,"");
  requestAnimationFrame(animationLoop);
 // setInterval(changePositionYeux, 300); // appelle la fonction changeCouleur toutes les n millisecondes
}


function creerDesBalles(nb) {
  let tabCouleurs = ["black", "black", "black", "black", "black"];
 let c=0 ;
  for (let i = 0; i < nb; i++) {
    let x = Math.random() * canvas.width;
    let y = Math.random() * canvas.height;
    let r = Math.random() * 30;
    let indexCouleur = Math.floor(Math.random() * tabCouleurs.length);
    let couleur = tabCouleurs[indexCouleur];
    let vx = -5 + Math.random() * 10;
    let vy = -5 + Math.random() * 10;

    let b = new BalleAvecVitesseXY(x, y, r, couleur, vx, vy);

    // on ajoute la balle au tableau
    tableauDesBalles.push(b);
  }

  // on ajoute une balle chercheuse dans le tableau
  balleChercheuse = new BalleChercheuse(100, 100, 40, "bleu", 0, 0);
  tableauDesBalles.push(balleChercheuse);
}
function afficheInfoJeu() {
  ctx.save();

 
  

  ctx.lineWidth = 2;
  ctx.strokeStyle = "red";


  
  ctx.restore();
}

// animation à 60 images/s
function animationLoop() {
  // 1 on efface le canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  afficheInfoJeu(); // scores, niveau etc.

  switch (etatJeu) {
    case "MenuPrincipal":
      afficheMenuPrincipal();
      break;
    case "JeuEnCours":
      updateJeu();
     // balleImage.draw(ctx);
      break;
    case "EcranChangementNiveau":
      afficheEcranChangementNiveau();
      break;
    case "GameOver":
      afficheEcranGameOver();
      
  }

  // 5 On demande au navigateur de rappeler la fonction
  // animationLoop dans 1/60ème de seconde
  requestAnimationFrame(animationLoop);
}
function afficheMenuPrincipal() {
  ctx.save();
  ctx.translate(0, 100);
  ctx.fillStyle = "Black";
  ctx.font = "40pt OCR A Std";
  ctx.fillText("MENU PRINCIPAL", 700, 20);

  ctx.fillText("Cliquez pour démarrer", 665, 70);
  changeson(assets.gameson);
  ctx.restore();
}

function afficheEcranChangementNiveau() {
  ctx.save();
  ctx.translate(0, 100);
  ctx.fillStyle = "white";
  ctx.font = "50pt Calibri";
  ctx.fillText("Bien joué", 500, 20);

  ctx.fillText("Cliquez pour niveau suivant", 465, 100);

  ctx.restore();
}

function afficheEcranGameOver() { 

    ctx.save();
  ctx.translate(0, 100);
  ctx.fillStyle = "black";
  ctx.font = "40pt OCR A Std";
  ctx.fillText("Game Over ", 350, 100);
  ctx.fillText("Cliquez pour rejouer", 325, 150);
  changeson(assets.fin)
  ctx.restore();
}

function niveauSuivant() {
  console.log("NIVEAU SUIVANT");
  niveauCourant++;
  c=0;
  tableauDesBalles = [];
  creerDesBalles(newb + niveauCourant );
  etatJeu = "JeuEnCours";
}
function replay() {
  console.log("Nouvelle partie");
  niveauCourant = 1;
  chance = 4;
  scr = 0;
  c=0;
  tableauDesBalles = [];
  creerDesBalles(newb + niveau / 10);

  etatJeu = "JeuEnCours";
}
function updateJeu() {
  monstre.draw(ctx);

  updateBalles();
  // 3 on déplace les objets
  monstre.move();
  //deplacerLesBalles();

  // 4 on peut faire autre chose (par ex: detecter des collisions,
  // ou prendre en compte le clavier, la souris, la manette de jeu)
  traiteCollisionsJoueurAvecBords();
  if (chance == 0) {

    etatJeu = "GameOver"
    
   // changeson(assets.gameover);
  }
 

  if (changelvl) {
    etatJeu = "EcranChangementNiveau";
    changelvl=false;
    

  }
}

/**function niveauFini() {
  return tableauDesBalles.length === 0;
}**/

function traiteCollisionBalleAvecMonstre(b) {
  if (
    circRectsOverlap(
      monstre.x,
      monstre.y,
      monstre.l,
      monstre.h,
      b.x,
      b.y,
      b.rayon
    )
  ) {
    if (b instanceof BalleChercheuse) {
      console.log("COLLISION AVEC BALLE CHERCHEUSE");
      
    }

    console.log("COLLISION....");
    // on cherche l'index de la balle dans le tableau des balles
    let index = tableauDesBalles.indexOf(b);
    if (
      b.couleur != "red"
    ) {
      scr += 10;
      
      changeson(assets.eat);
    }
    
    if (
      b.couleur == "red"
    ) {
      chance -= 1;
    
      etatJeu= "GameOver";
    }
    // pour supprimer un élément : on utilise la méthode splice(index, nbElementsASupprimer) sur le tableau
    tableauDesBalles.splice(index, 1);
    //b.couleur = "pink";
  }
}
function afficheInfoJeu() {
  ctx.save();
  ctx.fillStyle = "black";
  ctx.font = "20pt OCR A Std";
  ctx.fillText("Niveau : " + niveauCourant, 40, 60);
  ctx.font = "20pt OCR A Std";
  ctx.fillText("Score : " + scr, 40, 40);
  ctx.font = "20pt OCR A Std";
  ctx.fillText("chance : " + chance, 40, 80);

  ctx.restore();
}

function updateBalles() {
  let cpt=0 ;
  // utilisation d'un itérateur sur le tableau
  tableauDesBalles.forEach((b) => {
    b.draw(ctx);
    traiteCollisionsBalleAvecBords(b);
    traiteCollisionBalleAvecMonstre(b);

    b.move();
    if (
      b.couleur != "red"
    ) {
      cpt += 1;
    }
  })
  if (cpt== 0) {
    niveauSuivant();
  }
  
}
