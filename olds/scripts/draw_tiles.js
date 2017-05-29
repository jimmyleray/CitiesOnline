// Fonction pour lancer le dessin des cases une fois la page chargée :
function draw_all_tiles()
{
  var elements = document.getElementsByClassName('map_tiles_canvas');
  for(var i = 0; i < elements.length; i++)
  {
    draw_tile(elements.item(i));
  }
}

// Fonction pour dessiner les canvas des cases :
function draw_tile(objet)
{
	// Attribution d'une couleur différente selon la position sur la grille :
	var randNumMin = 0;
	var randNumMax = 9;
	var randInt = (Math.floor(Math.random() * (randNumMax - randNumMin + 1)) + randNumMin);
	var tile_color = '#7BA' + randInt + '5B';

	var canvas = objet;
	canvas.width = 60;
	canvas.height = 30;
	var ctx=canvas.getContext('2d');
	ctx.fillStyle = tile_color;
	ctx.beginPath(); // Ouverture du chemin
	ctx.moveTo(30,0);
	ctx.lineTo(60,15);
	ctx.lineTo(30,30);
	ctx.lineTo(0,15);
	ctx.closePath(); // Fermeture du chemin
	ctx.fill(); // Remplissage du dernier chemin tracé
	ctx.strokeStyle = '#568203'; // Définition de la couleur de contour
	ctx.lineWidth = 1; // Définition de la largeur de ligne
	ctx.lineJoin = 'round';
	ctx.lineCap = 'miter';
	ctx.stroke(); // Dessin des contours
	//img = new Image();
	//img.src = '/images/Grass_SD.png';
	//img.onload = function(){
	//ctx.drawImage(img,0,0,60,30);};
}