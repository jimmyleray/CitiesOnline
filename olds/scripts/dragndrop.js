// Explications complètes à cette adresse : http://goo.gl/8Ez57Y

// Fonction pour ajouter proprement un event :
// Exemple d'appel : addEvent(document.getElementById('bouton_click'),'click',onclick_page);
function addEvent(obj,event,fct)
{
	if(obj.attachEvent)
		obj.attachEvent('on' + event,fct);
	else
	obj.addEventListener(event,fct,true);
}

// Fonction pour rendre un objet d'une certaine classe sujet au drag & drop :
addEvent(document,'mousedown',function (event)
{
	// Permet de sélectionner ce qui est ciblé par la souris :
	var target = event.target || event.srcElement;

	var element = target;
	while(element)
	{
		if(element.className && element.className.match(/\bmap_global\b/g))
		{
			start_drag(element,event);
			element = false; // On stoppe la boucle pour ne pas sélectionner aussi les parents
		}
		else
			element = element.parentNode; // On remonte les parents
	}
});

// Lorsque dragged = null, il n'y a rien en cours de déplacement
var dragged = null; // dragged est l'élément en cours de drag
var dX, dY; // variables globales

// Fonction à appeler pour lancer le drag & drop sur l'objet :
function start_drag(objet,event)
{
	dragged = objet; // objet à déplacer
	
	if(dragged.id == 'map_container'){
		document.body.style.cursor = "url('/images/cursor_drag.png'), default";
	}

	// Deux lignes pour ne pas sélectionner de texte pendant le déplacement :
	event.returnValue = false;
	if(event.preventDefault ) event.preventDefault();

	// Prise en compte de l'emplacement de la souris :
	var x = event.clientX;
	var y = event.clientY;

	// Coordonnées de l'élément :
	var eX = dragged.offsetLeft;
	var eY = dragged.offsetTop;
	
	// Calcul du décallage :
	dX = x - eX;
	dY = y - eY;
}

// Fonction pour déplacer l'objet en drag & drop :
function drag_onmousemove(event) 
{
	if(dragged) // si aucun objet n'est sélectionné, fin de la fonction
	{
		// Prise en compte de la souris :
		var x = event.clientX;
		var y = event.clientY;

		// On applique le décalage
		x -= dX;
		y -= dY;
		
		// Vérification des décalages pour que la map ne puisse pas dépaser de l'écran :
		if(dragged.id == 'map_container'){
			if(x > -30){x = -30;}
			if(y > -15){y = -15;}
			var min_left = -100*30 + 30 + document.getElementById('game_map').clientWidth;
			var min_top = -100*15 + 15 + document.getElementById('game_map').clientHeight;
			if(x < min_left){x = min_left;}
			if(y < min_top){y = min_top;}
		}

		dragged.style.position = 'absolute';
		dragged.style.left = x + 'px';
		dragged.style.top = y + 'px';
	}
}

// Fonction pour déplacer la carte si besoin quand la fenêtre est redimensionnée :
window.onresize = function()
{
	var map = document.getElementById('map_container');
	if(map.offsetLeft>-30){map.style.left='-30px';}
	if(map.offsetTop>-15){map.style.top='-15px';}
	var min_left = -100*30 + 30 + document.getElementById('game_map').clientWidth;
	var min_top = -100*15 + 15 + document.getElementById('game_map').clientHeight;
	if(map.offsetLeft<min_left){map.style.left=min_left+'px';}
	if(map.offsetTop<min_top){map.style.top=min_top+'px';}
}

// Fonction pour arrêter le drag & drop quand le bouton de la souris est relaché :
function drag_onmouseup(event)
{
	// Retour au curseur de base :
	if(dragged != null){
		if(dragged.id == 'map_container'){
			document.body.style.cursor = null;
		}
	}
	dragged = null; // On arrête le drag & drop
}

// Appel des fonctions pour suivre les mouvements de la souris et arrêter le drag :
addEvent(document,'mousemove',drag_onmousemove);
addEvent(document,'mouseup',drag_onmouseup);