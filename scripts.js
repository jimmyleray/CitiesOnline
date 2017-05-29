// ----------------------------------- //
// Récapitulatif des fonctions du jeu  //
// ----------------------------------- //

// I) Initialsation des paramètres globaux

	// - Ensemble des constantes et variables utiles au jeu

	
// II) Gestion des évènements

	// - window.onload - Fonction se lançant dès la fin du chargement de la page
	// - addEvent - Fonction pour ajouter proprement un event
	// - via addEvent - Appels pour suivre les fonctions de la souris
	// - mouseClick - Fonction effectuée lorsque l'utilisateur clique avec sa souris
	// - mouseDown - Fonction lancée lorsque l'utilisateur enfonce l'un des boutons de sa souris
	// - dragStart - Fonction à appeler pour lancer le drag & drop sur l'objet
	// - dragMove - Fonction pour déplacer un objet en drag & drop
	// - window.onresize - Fonction pour déplacer la carte si besoin quand la fenêtre est redimensionnée
	// - map_limit - Fonction pour limiter les déplacements de la carte à ses bords
	// - dragStop - Fonction pour arrêter le drag & drop quand le bouton de la souris est relaché

	
// III) Interface du jeu

	// - map_focus - Fonction pour centrer la vision du joueur sur un point de la carte
	// - tileCoord_fromId_onClick - Fonction pour obtenir les coordonnées d'une case cliquée
	// - changeTool - Fonction pour changer l'outil actif du joueur
	// - switchVisibility - Fonction pour afficher ou cacher un élément

	
// IV) Gestion du jeu

	// - loadMap - Fonction pour charger la carte de la ville
	// - addElement - Fonction pour ajouter un élément sur la carte

	
// V) Dessin / Draw

	// - chunksInit - Fonction pour initialiser les chunks et les canvas associés
	// - tileCoord_fromId - Fonction pour obtenir la ligne et la colonne d'une case
	// - tileId_fromCoord - Fonction pour obtenir l'ID d'une case avec ses coordonnées
	// - chunkId_fromTileId - Fonction pour obtenir l'ID du chunk avec l'ID d'une de ses cases
	// - chunkCoord_fromTileId - Fonction pour obtenir les coordonnées d'un chunk avec l'ID d'une case
	// - chunkCoord_fromId - Fonction pour obtenir les coordonnées d'un chunk avec son ID
	// - chunkId_fromCoord - Fonction pour obtenir l'ID d'un chunk avec ses coordonnées
	// - tilesDraw - Fonction pour dessiner le fond de la carte
	// - tileBackgroundDraw - Fonction pour dessiner une case de la carte
	// - elementsTilesDraw - Fonction pour dessiner tous les éléments de la carte
	// - elementsChunkDraw - Fonction pour dessiner tous les élements d'un chunk
	// - elementTileDraw - Fonction pour dessiner l'élément d'une case
	// - minimapDraw - Fonction à appeler pour dessiner la minimap
	// - minimapBackgroundDraw - Fonction pour dessiner le fond de la minimap
	// - minimapSelectorDraw - Fonction pour dessiner le sélecteur de la minimap


// VI) Gestion du son / audio
	// - addSound - Fonction pour jouer un son
	// - deleteSound - Fonction pour supprimer un son
	// - changeVolume - Fonction pour changer le volume principal du jeu
	// - updateVolume - Fonction pour changer le volume des sons actifs

// VII) Divers / Autres
	// - changeScreenMode - Fonction pour basculer en mode plein ecran
	// - enterFullscreen - Fonction pour entrer dans le mode plein ecran
	// - exitFullscreen - Fonction pour sortir du mode plein écran
	// - randInt - Fonction rendant un entier aléatoire entre randNumMin et randNumMax



// -----------------------------------------------------------------------------
// -------------------------------------------------------------------------------
// INITIALISATION DES PARAMETRES GLOBAUX
// -------------------------------------------------------------------------------
// -----------------------------------------------------------------------------

	// Largeur et hauteur par défaut d'une case :
	var map_tile_width = 60;
	var map_tile_height = 30;
	
	// Nombre de chunks horizontalement et verticalement :
	const map_width_nb_chunks = 6;
	const map_height_nb_chunks = 6;
	
	// Marge sur les bords des chunk :
	const map_chunk_padding = map_tile_width;
	
	// Nombre de cases par chunk, horizontalement et verticalement :
	// (doit impérativement être deux entiers pairs !!)
	const map_width_nbTiles_perChunks = 30;	
	const map_height_nbTiles_perChunks = 30;
	
	// Nombre de colonnes et de lignes de cases :
	const map_width_nb_tiles = map_width_nbTiles_perChunks*map_width_nb_chunks;
	const map_height_nb_tiles = map_height_nbTiles_perChunks*map_height_nb_chunks;
	
	// Nombre total de chunks et de cases :
	const map_nb_chunks = map_width_nb_chunks*map_height_nb_chunks;
	const map_nb_tiles = Math.ceil(map_width_nb_tiles*map_height_nb_tiles/2);

	// Matrice contenant les informations des éléments de la carte :
	var game_map_elements = new Array(map_width_nb_tiles);
	
	// Variable contenant l'outil actif :
	var interface_active_tool = null;
	
	// Variables globales utiles pour le drag&drop :
	// Lorsque dragged = null, il n'y a rien en cours de déplacement
	var dragged = null; // dragged est l'élément en cours de drag
	var drag_dX, drag_dY;
	
	// Niveau zoom :
	var zoomMap = 100;
	
// -----------------------------------------------------------------------------
// -------------------------------------------------------------------------------
// FIN DE L'INITIALISATION DES PARAMETRES GLOBAUX
// -------------------------------------------------------------------------------
// -----------------------------------------------------------------------------





// -----------------------------------------------------------------------------
// -------------------------------------------------------------------------------
// PARTIE GESTION DES EVENEMENTS :
// -------------------------------------------------------------------------------
// -----------------------------------------------------------------------------

// Fonction se lançant dès la fin du chargement de la page :
window.onload = function()
{
	// Charge la matrice de la carte :
	loadMap();
	
	// Initialise les chunks et les canvas associés :
	chunksInit();
	
	// Dessine toutes les cases de la carte :
	tilesDraw();
	elementsTilesDraw();
	
	// Centre la carte et dessine la minimap :
	map_focus(0.5,0.5);
	
	// Empeche le clic droit d'ouvrir un menu contextuel :
	//document.oncontextmenu = new Function("return false"); // très important !
	
	// Rend visible la page (hidden précédemment) une fois que tout est chargé :
	document.getElementById('main_container').style.visibility = 'visible';
	
	// Lance le son d'ambiance du jeu :
	addSound('./audio/birds.mp3',0.2,true);
}

// Explications complètes du drag&drop à cette adresse : http://goo.gl/8Ez57Y
// Fonction pour ajouter proprement un event :
// Exemple d'appel : addEvent(document.getElementById('bouton_click'),'click',onclick_page);
function addEvent(obj,event,fct)
{
	if(obj.attachEvent)
		obj.attachEvent('on' + event,fct);
	else
	obj.addEventListener(event,fct,true);
}

// Appel des fonctions pour suivre les mouvements de la souris et arrêter le drag&drop :
addEvent(document,'mousemove',dragMove);
addEvent(document,'mouseup',dragStop);
addEvent(document,'mousedown',mouseDown);
addEvent(document,'click',mouseClick);
addEvent(document,'mousewheel',mouseScroll);
addEvent(document,'DOMMouseScroll',mouseScroll);

// Fonction effectuée lorsque l'utilisateur utilise la roulette de sa souris :
function mouseScroll(e)
{
	// cross-browser wheel delta
	var e = window.event || e;
	var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
	zoomMap += delta;
	return false;
}

// Fonction effectuée lorsque l'utilisateur clique avec sa souris :
function mouseClick(event)
{
	// Permet de sélectionner ce qui est ciblé par la souris :
	var target = event.target || event.srcElement;
	var element = target;
	
	if(event.which == 1) // Clic gauche
	{
		while(element)
		{
			if(element.className && element.className.match(/\bmap_global\b/g))
			{
				// On récupère les coordonnées de la case cliquée :
				var tile_coord = tileCoord_fromId_onClick(event);
				
				// Fonctions à appeler si la souris à cliquer sur un élement de la carte :
				if(interface_active_tool=='delete')
				{
					addElement(tile_coord.width,tile_coord.height,0);
				}
				else if(interface_active_tool=='road')
				{
					addElement(tile_coord.width,tile_coord.height,1);
				}
				else if(interface_active_tool=='tree')
				{
					addElement(tile_coord.width,tile_coord.height,2);
				}
				element = false; // On stoppe la boucle pour ne pas sélectionner aussi les parents
			}
			else
				element = element.parentNode; // On remonte les parents
		}
	}
};

// Fonction lancée lorsque l'utilisateur enfonce l'un des boutons de sa souris :
// Sert également ici pour rendre un objet d'une certaine classe sujet au drag & drop
function mouseDown(event)
{
	// Permet de sélectionner ce qui est ciblé par la souris :
	var target = event.target || event.srcElement;

	var element = target;
	
	if(event.which == 3) // Clic droit
	{
		while(element)
		{
			if(element.className && element.className.match(/\bmap_global\b/g))
			{
				dragStart(element,event);
				element = false; // On stoppe la boucle pour ne pas sélectionner aussi les parents
			}
			else
				element = element.parentNode; // On remonte les parents
		}
	}
};

// Fonction à appeler pour lancer le drag & drop sur l'objet :
function dragStart(objet,event)
{
	dragged = objet; // objet à déplacer
	
	if(dragged.id == 'map_container'){
		document.body.style.cursor = "url('./images/cursor_drag.png'), default";
	}

	// Deux lignes pour ne pas sélectionner de texte pendant le déplacement :
	event.returnValue = false;
	if(event.preventDefault) event.preventDefault();

	// Prise en compte de l'emplacement de la souris :
	var x = event.clientX;
	var y = event.clientY;

	// Coordonnées de l'élément :
	var eX = dragged.offsetLeft;
	var eY = dragged.offsetTop;
	
	// Calcul du décallage :
	drag_dX = x - eX;
	drag_dY = y - eY;
}

// Fonction pour déplacer un objet en drag & drop :
function dragMove(event) 
{
	if(dragged) // si aucun objet n'est sélectionné, fin de la fonction
	{
		// Prise en compte de la souris :
		var x = event.clientX;
		var y = event.clientY;

		// On applique le décalage
		x -= drag_dX;
		y -= drag_dY;
		
		//dragged.style.position = 'absolute';
		dragged.style.left = x + 'px';
		dragged.style.top = y + 'px';
		
		// Vérification des décalages pour que la map ne puisse pas dépaser de l'écran :
		if(dragged.id == 'map_container')
		{
			// Bloquer la map sur les limites :
			map_limit();
			
			// Mise à jour de la minimap :
			minimapDraw();
		}
	}
}

// Fonction pour déplacer la carte si besoin quand la fenêtre est redimensionnée :
window.onresize = function()
{
	// Bloquer la map sur les limites :
	map_limit()
	
	// Mise à jour de la minimap :
	minimapDraw();
}

// Fonction pour bloquer la map à ses limites :
function map_limit()
{
	var map = document.getElementById('map_container');
	
	if(map.offsetLeft>-0.5*map_tile_width){map.style.left = -0.5*map_tile_width + 'px';}
	if(map.offsetTop>-0.5*map_tile_height){map.style.top = -0.5*map_tile_height + 'px';}
	
	var min_left = -map_width_nb_tiles*0.5*map_tile_width + 0.5*map_tile_width + document.getElementById('game_map').clientWidth;
	var min_top = -map_height_nb_tiles*0.5*map_tile_height + 0.5*map_tile_height + document.getElementById('game_map').clientHeight;
	if(map.offsetLeft<min_left){map.style.left = min_left +'px';}
	if(map.offsetTop<min_top){map.style.top = min_top +'px';}
}


// Fonction pour arrêter le drag & drop quand le bouton de la souris est relaché :
function dragStop(event)
{
	// Retour au curseur de base :
	if(dragged != null){
		if(dragged.id == 'map_container'){
			document.body.style.cursor = null;
		}
	}
	dragged = null; // On arrête le drag & drop
}

// -----------------------------------------------------------------------------
// -------------------------------------------------------------------------------
// FIN DE LA PARTIE GESTION DES EVENEMENTS
// -------------------------------------------------------------------------------
// -----------------------------------------------------------------------------





// -----------------------------------------------------------------------------
// -------------------------------------------------------------------------------
// PARTIE GESTION DE L'INTERFACE DU JEU :
// -------------------------------------------------------------------------------
// -----------------------------------------------------------------------------

function map_focus(left,top)
{
	map = document.getElementById('map_container');
	container = document.getElementById('game_map');
	
	var left_offset = left*0.5*map_width_nb_tiles*map_tile_width;
	var top_offset = top*0.5*map_height_nb_tiles*map_tile_height;
	
	map.style.left = (-left_offset + 0.5*container.offsetWidth) + 'px';
	map.style.top = (-top_offset + 0.5*container.offsetHeight) + 'px';
	
	// Mise à jour de la minimap et vérification des limites :
	map_limit();
	minimapDraw();
}


function tileCoord_fromId_onClick(event)
{
	var map = document.getElementById('map_container');
	
	// Calcul de la position de la souris / au coin supérieur gauche de la map :
	var clickX = event.clientX - map.offsetLeft;
	var clickY = event.clientY - map.offsetTop - 30; // 30, décalage top de base de la map
	
	// Calcul de la position du "carré cliqué" :
	var tile_width_click = 2*Math.floor(clickX/map_tile_width)+1;
	var tile_height_click = 2*Math.floor(clickY/map_tile_height)+1;
	
	// Calcul de la position du clic dans le carré cliqué :
	var tileX = clickX%map_tile_width;
	var tileY = clickY%map_tile_height;
	
	// Mise à jour des coordonnées de la case effectivement cliquée :
	if(tileY <= map_tile_height*(0.5-(tileX/map_tile_width)))
	{
		tile_width_click-=1;
		tile_height_click-=1;
	}
	else if(tileY >= map_tile_height*(1.5-(tileX/map_tile_width)))
	{
		tile_width_click+=1;
		tile_height_click+=1;
	}
	else if(tileY <= map_tile_height*((tileX/map_tile_width)-0.5))
	{
		tile_width_click+=1;
		tile_height_click-=1;
	}
	else if(tileY >= map_tile_height*((tileX/map_tile_width)+0.5))
	{
		tile_width_click-=1;
		tile_height_click+=1;
	}
	
	return{width: tile_width_click, height: tile_height_click};
}


function changeTool(tool_name)
{
	// Change la variable globale définissant l'outil actif :
	if(interface_active_tool == tool_name) // l'utilisateur a clique sur l'outil deja actif
	{
		interface_active_tool = null; // On desactive l'outil actif
		
		// On enleve la mise en evidence de la case de l'outil :
		document.getElementById('interface_tool_' + tool_name).removeAttribute('style');
	}
	else if(interface_active_tool == null) // l'utilisateur n'avait pas d'outil actif
	{
		interface_active_tool = tool_name; // On active l'outil qu'il a sélectionné
		
		// Rend le fond de l'outil actif "coloré" :
		document.getElementById('interface_tool_' + tool_name).style.backgroundColor = '#cacaca';
	}
	else // l'utilisateur a cliqué sur un outil différent de l'outil actif
	{
		// On enleve la mise en evidence de l'ancien outil :
		document.getElementById('interface_tool_' + interface_active_tool).removeAttribute('style');
		
		// Rend le fond du nouvel outil actif "coloré" :
		document.getElementById('interface_tool_' + tool_name).style.backgroundColor = '#cacaca';
		
		interface_active_tool = tool_name; // On change l'outil actif
	}
}

// Fonction pour afficher ou cacher un élément :
function switchVisibility(objet)
{
	// Switch la visibilite de l'objet selon si il est deja visible ou non :
	if(objet.style.visibility == 'visible'){objet.style.visibility = 'hidden';}
	else{objet.style.visibility = 'visible';}
	
	// Si l'objet est le menu des options, garde le fond colore quand le menu est actif :
	if(objet.id == 'options_menu')
	{
		if(document.getElementById('options_menu').style.visibility == 'visible')
			{document.getElementById('options_icon').style.backgroundColor = '#cacaca';}
		else{document.getElementById('options_icon').style.backgroundColor = null;}
	}
}

// -----------------------------------------------------------------------------
// -------------------------------------------------------------------------------
// FIN DE LA PARTIE GESTION DE L'INTERFACE DU JEU
// -------------------------------------------------------------------------------
// -----------------------------------------------------------------------------





// -----------------------------------------------------------------------------
// -------------------------------------------------------------------------------
// PARTIE GESTION DU GAME :
// -------------------------------------------------------------------------------
// -----------------------------------------------------------------------------

// Fonction pour charger la carte de la ville :
function loadMap()
{
	for(var i = 1; i <= map_width_nb_tiles; i++)
	{
		game_map_elements[i] = new Array(map_height_nb_tiles);
		for(var j = 1; j <= map_height_nb_tiles; j++)
		{
			if(Math.random()<0.25)
			{
				// Attribution d'une espèce d'arbe au hasard :
				//var randNumMin = 1;
				//var randNumMax = 6;
				//var randInt = (Math.floor(Math.random() * (randNumMax - randNumMin + 1)) + randNumMin);
				var randInt = 0;
				game_map_elements[i][j] = 2+randInt*0.1;
			}
			else{game_map_elements[i][j] = 0;}
		}
	}
}

// Fonction pour ajouter un element sur la map :
// (peut aussi servir a effacer un element en appelant l'element_id = 0)
function addElement(tile_colonne,tile_ligne,element_id)
{
	// Construction :
	if(game_map_elements[tile_colonne][tile_ligne]==0)
	{
		if(game_map_elements[tile_colonne][tile_ligne]!=element_id)
		{
			// Lance le son de construction d'une route s'il s'agit d'une route :
			if(element_id == 1){addSound('./audio/construction_road.mp3',0.4,false);}
		
			// On modifie la matrice des éléments :
			game_map_elements[tile_colonne][tile_ligne] = element_id;
			
			// On dessine le chunk de la case et les chunks adjacents :
			var chunk_ligne = chunkCoord_fromId(tileId_fromCoord(tile_colonne,tile_ligne)).chunk_ligne;
			var chunk_colonne = chunkCoord_fromId(tileId_fromCoord(tile_colonne,tile_ligne)).chunk_colonne;
			draw_chunks_adjacents(chunk_ligne,chunk_colonne);
		}
	}
	else // Destruction :
	{
		if(element_id==0)
		{
			// Lance le son d'un chantier de destruction :
			if(game_map_elements[tile_colonne][tile_ligne] == 1 && element_id == 0){addSound('./audio/destruction.mp3',0.4,false);}
		
			// Lance le son d'une découpe de bois :
			if(Math.floor(game_map_elements[tile_colonne][tile_ligne]) == 2 && element_id == 0){addSound('./audio/charpentier.mp3',0.4,false);}
		
			// On modifie la matrice des éléments :
			game_map_elements[tile_colonne][tile_ligne] = element_id;
			
			// On dessine le chunk de la case et les chunks adjacents :
			var chunk_ligne = chunkCoord_fromId(tileId_fromCoord(tile_colonne,tile_ligne)).chunk_ligne;
			var chunk_colonne = chunkCoord_fromId(tileId_fromCoord(tile_colonne,tile_ligne)).chunk_colonne;
			draw_chunks_adjacents(chunk_ligne,chunk_colonne);
		}
	}
}

// Fonction pour dessiner un chunk et les chunks adjacents :
function draw_chunks_adjacents(chunk_ligne,chunk_colonne)
{
	var chunkId = chunkId_fromTileId(tileId_fromCoord(tile_colonne,tile_ligne));
	var chunk_ligne = chunkCoord_fromId(chunkId).chunk_ligne;
	var chunk_colonne = chunkCoord_fromId(chunkId).chunk_colonne;
	
	var chunkId_top_left = chunkId_fromCoord(chunk_ligne-1,chunk_colonne-1);
	var chunkId_top = chunkId_fromCoord(chunk_ligne-1,chunk_colonne);
	var chunkId_top_right = chunkId_fromCoord(chunk_ligne-1,chunk_colonne+1);
	var chunkId_left = chunkId_fromCoord(chunk_ligne,chunk_colonne-1);
	var chunkId_right = chunkId_fromCoord(chunk_ligne,chunk_colonne+1);
	var chunkId_bottom_left = chunkId_fromCoord(chunk_ligne+1,chunk_colonne-1);
	var chunkId_bottom = chunkId_fromCoord(chunk_ligne+1,chunk_colonne);
	var chunkId_bottom_right = chunkId_fromCoord(chunk_ligne+1,chunk_colonne+1);
	
	if(chunk_ligne > 1)
	{
		if(chunk_colonne > 1){elementsChunkDraw(chunkId_top_left);}
		elementsChunkDraw(chunkId_top);
		if(chunk_colonne < map_width_nb_chunks){elementsChunkDraw(chunkId_top_right);}
	}
	
	if(chunk_colonne > 1){elementsChunkDraw(chunkId_left);}
	elementsChunkDraw(chunkId);
	if(chunk_colonne < map_width_nb_chunks){elementsChunkDraw(chunkId_right);}
	
	if(chunk_ligne < map_height_nb_chunks)
	{
		if(chunk_colonne > 1){elementsChunkDraw(chunkId_bottom_left);}
		elementsChunkDraw(chunkId_bottom);
		if(chunk_colonne < map_width_nb_chunks){elementsChunkDraw(chunkId_bottom_right);}
	}
}

// -----------------------------------------------------------------------------
// -------------------------------------------------------------------------------
// FIN DE LA PARTIE GESTION DU GAME :
// -------------------------------------------------------------------------------
// -----------------------------------------------------------------------------





// -----------------------------------------------------------------------------
// -------------------------------------------------------------------------------
// PARTIE DRAW / DESSIN SUR CANVAS :
// -------------------------------------------------------------------------------
// -----------------------------------------------------------------------------

// Fonction pour initialiser les chunks et les canvas associés :
function chunksInit()
{
	// Canvas de fond :
	for(var i = 1; i <= map_nb_chunks; i++)
	{
		var chunk = document.createElement('canvas');
		var map = document.getElementById('map_container');
		map.appendChild(chunk);
		chunk.id = 'chunk' + i;
		chunk.className = 'chunks'
		chunk.style.left = 0.5*((i-1)%map_width_nb_chunks)*map_tile_width*map_width_nbTiles_perChunks - map_chunk_padding + 'px';
		chunk.style.top = 0.5*Math.floor((i-1)/map_width_nb_chunks)*map_tile_height*map_height_nbTiles_perChunks - map_chunk_padding + 'px';
		chunk.width = 0.5*map_tile_width*(map_width_nbTiles_perChunks+1)+2*map_chunk_padding;
		chunk.height = 0.5*map_tile_height*(map_height_nbTiles_perChunks+1)+2*map_chunk_padding;
	}
	
	// Canvas d'éléments :
	for(var i = 1; i <= map_nb_chunks; i++)
	{
		var chunk = document.createElement('canvas');
		var map = document.getElementById('map_container');
		map.appendChild(chunk);
		chunk.id = 'chunk_elements' + i;
		chunk.className = 'chunks_elements'
		chunk.style.left = 0.5*((i-1)%map_width_nb_chunks)*map_tile_width*map_width_nbTiles_perChunks - map_chunk_padding + 'px';
		chunk.style.top = 0.5*Math.floor((i-1)/map_width_nb_chunks)*map_tile_height*map_height_nbTiles_perChunks - map_chunk_padding + 'px';
		chunk.width = 0.5*map_tile_width*(map_width_nbTiles_perChunks+1)+2*map_chunk_padding;
		chunk.height = 0.5*map_tile_height*(map_height_nbTiles_perChunks+1)+2*map_chunk_padding;
	}
	
	// Canvas de prévisualisation :
	for(var i = 1; i <= map_nb_chunks; i++)
	{
		var chunk = document.createElement('canvas');
		var map = document.getElementById('map_container');
		map.appendChild(chunk);
		chunk.id = 'chunk_elements_previsual' + i;
		chunk.className = 'chunks_elements_previsual'
		chunk.style.left = 0.5*((i-1)%map_width_nb_chunks)*map_tile_width*map_width_nbTiles_perChunks - map_chunk_padding + 'px';
		chunk.style.top = 0.5*Math.floor((i-1)/map_width_nb_chunks)*map_tile_height*map_height_nbTiles_perChunks - map_chunk_padding + 'px';
		chunk.width = 0.5*map_tile_width*(map_width_nbTiles_perChunks+1)+2*map_chunk_padding;
		chunk.height = 0.5*map_tile_height*(map_height_nbTiles_perChunks+1)+2*map_chunk_padding;
	}
}

// Fonction pour obtenir la ligne et la colonne d'une case :
function tileCoord_fromId(tile_id)
{
	// Calcul du numéro de la colonne et de la ligne de la case :
	var tile_groupe_lignes = Math.floor((tile_id-1)/map_width_nb_tiles)+1;
	var tile_pos_groupe_lignes = tile_id - (tile_groupe_lignes-1)*map_width_nb_tiles;
	if(tile_pos_groupe_lignes > Math.ceil(map_width_nb_tiles/2)){tile_ligne = (tile_groupe_lignes)*2;}
	else{tile_ligne = (tile_groupe_lignes)*2-1;}

	var tile_id_normalise = tile_id - (tile_groupe_lignes-1)*map_width_nb_tiles;
	if(tile_ligne%2 == 0){tile_colonne = 2*(tile_id_normalise - Math.ceil(map_width_nb_tiles/2));}
	else{tile_colonne = 2*tile_id_normalise-1;}
	
	return{tile_colonne: tile_colonne,tile_ligne: tile_ligne};
}

// Fonction pour obtenir l'id d'une case dont on connait les coordonnées :
function tileId_fromCoord(tile_colonne,tile_ligne)
{
	var tileID = Math.floor((tile_ligne-1)/2)*map_width_nb_tiles;
	
	if(tile_ligne%2 == 0){tileID += (Math.floor(0.5*(map_width_nb_tiles + 1)) + tile_colonne*0.5);}
	else{tileID += Math.ceil(tile_colonne/2);}

	return tileID;
}

// Fonction pour obtenir l'id du chunk avec l'id d'une case :
function chunkId_fromTileId(tile_id)
{
	var chunkId = (chunkCoord_fromTileId(tile_id).chunk_ligne-1)*map_width_nb_chunks + chunkCoord_fromTileId(tile_id).chunk_colonne;
	
	return chunkId;
}

// Fonction pour obtenir les coordonnées d'un chunk avec l'id d'une case :
function chunkCoord_fromTileId(tile_id)
{
	var tile_ligne = tileCoord_fromId(tile_id).tile_ligne;
	var tile_colonne = tileCoord_fromId(tile_id).tile_colonne;

	var chunk_ligne = Math.ceil(tile_ligne/map_height_nbTiles_perChunks);
	var chunk_colonne = Math.ceil(tile_colonne/map_width_nbTiles_perChunks);
	
	return{chunk_ligne: chunk_ligne,chunk_colonne: chunk_colonne};
}

// Fonction pour obtenir les coordonnées d'un chunk avec son id :
function chunkCoord_fromId(chunkId)
{
	var chunk_ligne = Math.floor((chunkId-1)/map_width_nb_chunks)+1;
	var chunk_colonne = ((chunkId-1)%map_width_nb_chunks)+1;
	
	return{chunk_ligne: chunk_ligne,chunk_colonne: chunk_colonne};
}

// Fonction pour obtenir l'id d'un chunk avec ses coordonnées :
function chunkId_fromCoord(chunk_ligne,chunk_colonne)
{
	var chunkId = map_width_nb_chunks*(chunk_ligne-1)+chunk_colonne;
	
	return chunkId;
}

// Fonction pour dessiner tout l'ensemble du canvas représentant la map à l'écran :
function tilesDraw()
{	
	for(var i = 1; i <= map_nb_tiles; i++)
	{
		tileBackgroundDraw(i);
	}
}

// Fonction pour dessiner une case dans le canvas de la map :
function tileBackgroundDraw(tile_id)
{
	var tile_ligne = tileCoord_fromId(tile_id).tile_ligne;
	var tile_colonne = tileCoord_fromId(tile_id).tile_colonne;
	
	// Calcul des décalages dus aux chunks :
	var top_chunk = 0.5*(chunkCoord_fromTileId(tile_id).chunk_ligne - 1)*map_tile_height*map_height_nbTiles_perChunks;
	var left_chunk = 0.5*(chunkCoord_fromTileId(tile_id).chunk_colonne - 1)*map_tile_width*map_width_nbTiles_perChunks;
	
	// Calcul des décalages pour afficher la case à sa place dans la grille :
	var offset_top = (tile_ligne-1)*0.5*map_tile_height - top_chunk + map_chunk_padding;
	var offset_left = (tile_colonne-1)*0.5*map_tile_width - left_chunk + map_chunk_padding;
	
	// Attribution d'une couleur différente selon la position sur la grille :
	var tile_color = '#7BA' + randInt(0,9) + '5B';

	// Dessin de la case :
	var chunkId = chunkId_fromTileId(tile_id);
	var ctx = document.getElementById('chunk' + chunkId).getContext('2d');
	ctx.fillStyle = tile_color;
	ctx.beginPath(); // Ouverture du chemin
	ctx.moveTo((map_tile_width/2) + offset_left,0 + offset_top);
	ctx.lineTo(map_tile_width + offset_left,(map_tile_height/2) + offset_top);
	ctx.lineTo((map_tile_width/2) + offset_left,map_tile_height + offset_top);
	ctx.lineTo(0 + offset_left,(map_tile_height/2) + offset_top);
	ctx.closePath(); // Fermeture du chemin
	ctx.fill(); // Remplissage du dernier chemin tracé
	ctx.strokeStyle = '#568203'; // Définition de la couleur de contour
	ctx.lineWidth = 1; // Définition de la largeur de ligne
	ctx.stroke(); // Dessin des contours
}

// Fonction pour dessiner l'ensemble des éléments de la map :
function elementsTilesDraw()
{		
	// Dessin des éléments :
	for(var i = 1; i <= map_nb_chunks; i++)
	{
		elementsChunkDraw(i);
	}
}

// Fonction pour dessiner les éléments d'un chunk :
function elementsChunkDraw(chunkId)
{
	var chunk_ligne = chunkCoord_fromId(chunkId).chunk_ligne
	var chunk_colonne = chunkCoord_fromId(chunkId).chunk_colonne
	
	// Nettoyage du canvas :
	var canvas = document.getElementById('chunk_elements' + chunkId)
	canvas.width = canvas.width;
	canvas.height = canvas.height;
	
	// Dessin des éléments présents sur le chunk uniquement :
	for(var j = ((chunk_ligne-1)*map_height_nbTiles_perChunks)+1; j <= chunk_ligne*map_height_nbTiles_perChunks; j++)
	{
		if(j%2 == 0) // on est sur une ligne pair
		{
			for(var i = ((chunk_colonne-1)*map_width_nbTiles_perChunks)+2; i <= chunk_colonne*map_width_nbTiles_perChunks; i+=2)
			{
				elementTileDraw(tileId_fromCoord(i,j),false);
			}
		}
		else // on est sur une ligne impaire
		{
			for(var i = ((chunk_colonne-1)*map_width_nbTiles_perChunks)+1; i <= chunk_colonne*map_width_nbTiles_perChunks; i+=2)
			{
				elementTileDraw(tileId_fromCoord(i,j),false);
			}
		}
	}
}

// Fonction pour dessiner un élement sur une case :
function elementTileDraw(tile_id,previsualisation)
{
	var tile_colonne = tileCoord_fromId(tile_id).tile_colonne;
	var tile_ligne = tileCoord_fromId(tile_id).tile_ligne;
	
	// Calcul des décalages dus aux chunks :
	var top_chunk = 0.5*(chunkCoord_fromTileId(tile_id).chunk_ligne - 1)*map_tile_height*map_height_nbTiles_perChunks;
	var left_chunk = 0.5*(chunkCoord_fromTileId(tile_id).chunk_colonne - 1)*map_tile_width*map_width_nbTiles_perChunks;
	
	// Calcul des décalages pour afficher la case à sa place dans la grille :
	var offset_top = (tile_ligne-1)*0.5*map_tile_height - top_chunk + map_chunk_padding;
	var offset_left = (tile_colonne-1)*0.5*map_tile_width - left_chunk + map_chunk_padding;
	
	var chunkId = chunkId_fromTileId(tile_id);
	
	if(previsualisation)
	{
		// Nettoyage des canvas :
		var chunks = document.getElementsByClassName('chunks_elements_previsual');
		for( var i = 0; i < chunks.length; i++)
		{
			chunks[i].width = chunks[i].width;
			chunks[i].height = chunks[i].height;
		}
		
		var canvas = document.getElementById('chunk_elements_previsual' + chunkId);
		var ctx = canvas.getContext('2d');
		
		// Dessin de l'élément :
		if(interface_active_tool == "road") // équivaut à une route
		{
			// Vérification de la configuration des routes autour de la case :
			var tile_ligne = tileCoord_fromId(tile_id).tile_ligne;
			var tile_colonne = tileCoord_fromId(tile_id).tile_colonne;
		
			var tile_top_left = Math.floor(game_map_elements[tile_colonne-1][tile_ligne-1]);
			var tile_top_right = Math.floor(game_map_elements[tile_colonne+1][tile_ligne-1]);
			var tile_bottom_left = Math.floor(game_map_elements[tile_colonne-1][tile_ligne+1]);
			var tile_bottom_right = Math.floor(game_map_elements[tile_colonne+1][tile_ligne+1]);
		
			if(tile_top_left != 1){tile_top_left=0;}
			if(tile_top_right != 1){tile_top_right=0;}
			if(tile_bottom_left != 1){tile_bottom_left=0;}
			if(tile_bottom_right != 1){tile_bottom_right=0;}
		
			var road_combinaison = Math.floor(tile_top_left*1000+tile_top_right*100+tile_bottom_left*10+tile_bottom_right);
		
			// Dessin de la case selon la configuration routière :
			if(game_map_elements[tile_colonne][tile_ligne]==0)
			{
				var img = document.getElementById('preload_img_road_grey');
			}
			else
			{
				var img = document.getElementById('preload_img_road_red');
			}

			var sy;
			if(road_combinaison==0){sy = 0;}
			else if(road_combinaison==1000){sy = 800;}
			else if(road_combinaison==100){sy = 400;}
			else if(road_combinaison==10){sy = 200;}
			else if(road_combinaison==1){sy = 100;}
			else if(road_combinaison==1100){sy = 1200;}
			else if(road_combinaison==1010){sy = 1000;}
			else if(road_combinaison==1001){sy = 900;}
			else if(road_combinaison==110){sy = 600;}
			else if(road_combinaison==101){sy = 500;}
			else if(road_combinaison==11){sy = 300;}
			else if(road_combinaison==1110){sy = 1400;}
			else if(road_combinaison==1101){sy = 1300;}
			else if(road_combinaison==111){sy = 700;}
			else if(road_combinaison==1011){sy = 1100;}
			else if(road_combinaison==1111){sy = 1500;}
			
			ctx.drawImage(img,0,sy,90,90,offset_left,offset_top,map_tile_width,map_tile_height);
		}
		else if(interface_active_tool == "tree") // équivaut à un arbre
		{
			if(game_map_elements[tile_colonne][tile_ligne]==0)
			{
				var images = document.getElementById('preload_img_tree_grey-0-21-45');
			}
			else
			{
				var images = document.getElementById('preload_img_tree_red-0-21-45');
			}
			
			var decalage_left = images.id.split('-')[2];
			var decalage_top = images.id.split('-')[3];
			ctx.drawImage(images,offset_left-decalage_left+0.5*map_tile_width,offset_top-decalage_top+0.5*map_tile_height,images.width,images.height);
		}
	}
	else
	{
		var ctx = document.getElementById('chunk_elements' + chunkId).getContext('2d');

		// Dessin de l'élément :
		if(Math.floor(game_map_elements[tile_colonne][tile_ligne])==1) // équivaut à une route
		{
			// Vérification de la configuration des routes autour de la case :
			var tile_ligne = tileCoord_fromId(tile_id).tile_ligne;
			var tile_colonne = tileCoord_fromId(tile_id).tile_colonne;
		
			var tile_top_left = Math.floor(game_map_elements[tile_colonne-1][tile_ligne-1]);
			var tile_top_right = Math.floor(game_map_elements[tile_colonne+1][tile_ligne-1]);
			var tile_bottom_left = Math.floor(game_map_elements[tile_colonne-1][tile_ligne+1]);
			var tile_bottom_right = Math.floor(game_map_elements[tile_colonne+1][tile_ligne+1]);
		
			if(tile_top_left != 1){tile_top_left=0;}
			if(tile_top_right != 1){tile_top_right=0;}
			if(tile_bottom_left != 1){tile_bottom_left=0;}
			if(tile_bottom_right != 1){tile_bottom_right=0;}
		
			var road_combinaison = Math.floor(tile_top_left*1000+tile_top_right*100+tile_bottom_left*10+tile_bottom_right);
		
			// Dessin de la case selon la configuration routière :
			var img = document.getElementById('preload_img_road');
		
			var sy;
			if(road_combinaison==0){sy = 0;}
			else if(road_combinaison==1000){sy = 800;}
			else if(road_combinaison==100){sy = 400;}
			else if(road_combinaison==10){sy = 200;}
			else if(road_combinaison==1){sy = 100;}
			else if(road_combinaison==1100){sy = 1200;}
			else if(road_combinaison==1010){sy = 1000;}
			else if(road_combinaison==1001){sy = 900;}
			else if(road_combinaison==110){sy = 600;}
			else if(road_combinaison==101){sy = 500;}
			else if(road_combinaison==11){sy = 300;}
			else if(road_combinaison==1110){sy = 1400;}
			else if(road_combinaison==1101){sy = 1300;}
			else if(road_combinaison==111){sy = 700;}
			else if(road_combinaison==1011){sy = 1100;}
			else if(road_combinaison==1111){sy = 1500;}
			
			ctx.drawImage(img,0,sy,90,90,offset_left,offset_top,map_tile_width,map_tile_height);
		}
		else if(Math.floor(game_map_elements[tile_colonne][tile_ligne])==2) // équivaut à un arbre
		{
			var images = document.getElementById('preload_img_tree-0-21-45')
			var decalage_left = images.id.split('-')[2];
			var decalage_top = images.id.split('-')[3];
			ctx.drawImage(images,offset_left-decalage_left+0.5*map_tile_width,offset_top-decalage_top+0.5*map_tile_height,images.width,images.height);
		}
	}
}

// PARTIE MINIMAP :
var minimap_width = 174, minimap_height = 174;

// Fonction pour dessiner la minimap :
function minimapDraw()
{
	// Dessine le fond de la minimap, correspondant au terrain :
	minimapBackgroundDraw();
	
	// Dessine le selecteur de la minimap :
	minimapSelectorDraw();
}

// Fonction pour dessiner le fond de la minimap :
function minimapBackgroundDraw()
{
	// Dessin du fond :
	var color = '#7BA45B'; // vert
	var canvas = document.getElementById('minimap_background');
	canvas.width = minimap_width;
	canvas.height = minimap_height;
	var ctx=canvas.getContext('2d');
	ctx.beginPath();
	ctx.fillStyle = color;
	ctx.fillRect(0,0,minimap_width,minimap_height);
}

// Fonction pour dessiner le selecteur de la minimap :
function minimapSelectorDraw()
{
	// Calcul des coordonnées du sélecteur :
	var clientX = window.innerWidth;
	var clientY = window.innerHeight-30; // décalage haut du conteneur
	
	var canvas_map = document.getElementById('chunk1');
	var mapX = (2*canvas_map.width-4*map_chunk_padding-map_tile_width)*(map_width_nb_chunks);
	var mapY = (2*canvas_map.height-4*map_chunk_padding-map_tile_height)*(map_height_nb_chunks);
	
	var map = document.getElementById('map_container');
	var offset_left = -map.offsetLeft - 0.5*map_tile_width;
	var offset_top = -map.offsetTop - 0.5*map_tile_height;
	
	var dx = 2*Math.ceil(minimap_width*clientX/mapX);
	var dy = 2*Math.ceil(minimap_height*clientY/mapY);
	
	var x = 2*Math.ceil(minimap_width*offset_left/mapX);
	var y = 2*Math.ceil(minimap_height*offset_top/mapY);

	// Dessin du cadre du selecteur :
	var color_contour = 'rgba(250, 50, 50, 1)'; // rouge
	var color_fond = 'rgba(250, 50, 50, 0.2)';
	var canvas = document.getElementById('minimap_selector');
	canvas.width = minimap_width;
	canvas.height = minimap_height;
	var ctx=canvas.getContext('2d');
	//ctx.clearRect (0,0,canvas.width,canvas.height);
	ctx.beginPath();
	ctx.fillStyle = color_fond;
	ctx.fillRect(x,y,dx,dy);
	ctx.strokeStyle = color_contour;
	ctx.rect(x,y,dx,dy);
	ctx.stroke();
}

// Appel des fonctions pour suivre les mouvements de la souris et prévisualiser selon l'outil :
addEvent(document,'mousemove',function(event)
{
	if(interface_active_tool != null)
	{
		var tileWidth = tileCoord_fromId_onClick(event).width;
		var tileHeight = tileCoord_fromId_onClick(event).height;
		var tileId = tileId_fromCoord(tileWidth,tileHeight);
	
		elementTileDraw(tileId,true)
	}
});

// -----------------------------------------------------------------------------
// -------------------------------------------------------------------------------
// FIN DE LA PARTIE DRAW / DESSIN SUR CANVAS :
// -------------------------------------------------------------------------------
// -----------------------------------------------------------------------------





// -----------------------------------------------------------------------------
// -------------------------------------------------------------------------------
// PARTIE GESTION DE l'AUDIO :
// -------------------------------------------------------------------------------
// -----------------------------------------------------------------------------

var audio_mainVolume = 0.75;

function addSound(url,volume,loop)
{
	var sound = document.createElement('audio');
	var lecteur = document.getElementById('audio_lecteur');
	lecteur.appendChild(sound);
	sound.className = 'audio_currentTracks' + ' ' + volume;
	sound.src = url;
	sound.load();
	sound.volume = volume*audio_mainVolume;
	sound.loop = loop;
	sound.play();
	
	// Détruit la piste audio à la fin de sa lecture :
	if(loop == false){setTimeout(function(){deleteSound(sound)},5000);}
}

function deleteSound(track)
{
	var lecteur = document.getElementById('audio_lecteur');
	lecteur.removeChild(track);
}

function changeVolume()
{
	audio_mainVolume += 0.25;
	if(audio_mainVolume>1){audio_mainVolume = 0;}
	updateVolume();
	
	switch(audio_mainVolume)
	{
		case 0:
			document.getElementById('volume_level_img').src = './images/audio_volume_0.png';
			break;
		case 0.25:
			document.getElementById('volume_level_img').src = './images/audio_volume_1.png';
			break;
		case 0.5:
			document.getElementById('volume_level_img').src = './images/audio_volume_2.png';
			break;
		case 0.75:
			document.getElementById('volume_level_img').src = './images/audio_volume_3.png';
			break;
		case 1:
			document.getElementById('volume_level_img').src = './images/audio_volume_4.png';
			break;
		default:
			document.getElementById('volume_level_img').src = './images/audio_volume_3.png';
			audio_mainVolume = 0.75;
	}
}

function updateVolume()
{
	var tracks = document.getElementsByClassName('audio_currentTracks');
	for( var i = 0; i < tracks.length; i++)
	{
		var classNameTab = tracks[i].className.split(' ');
		tracks[i].volume = parseFloat(classNameTab[1])*audio_mainVolume;
	}
}

// -----------------------------------------------------------------------------
// -------------------------------------------------------------------------------
// FIN DE LA PARTIE GESTION DE l'AUDIO :
// -------------------------------------------------------------------------------
// -----------------------------------------------------------------------------





// -----------------------------------------------------------------------------
// -------------------------------------------------------------------------------
// DIVERS / AUTRES :
// -------------------------------------------------------------------------------
// -----------------------------------------------------------------------------

// PARTIE POUR BASCULER EN PLEIN ECRAN :
// Explications complètes : http://html5professor.com/tutoriels-18.html

// Fonction pour sélectionner dans quel sens basculer le mode plein ecran selon l'etat actuel :
function changeScreenMode(element)
{
	// Fonction désactiver le temps de corriger les bugs des différents navigateurs :
	//if(document.webkitIsFullScreen || document.mozFullscreen){exitFullscreen();}
	//else{enterFullscreen(element);}
}

// Fonction pour entrer dans le mode plein ecran :
function enterFullscreen(element)
{
	if(element.requestFullScreen)
	{
		//fonction officielle du w3c
		element.requestFullScreen();
	}
	else if(element.webkitRequestFullScreen)
	{
		//fonction pour Google Chrome (on lui passe un argument pour autoriser le plein écran lors d'une pression sur le clavier)
		element.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
	}
	else if(element.mozRequestFullScreen)
	{
		//fonction pour Firefox
		element.mozRequestFullScreen();
	}
	else
	{
		alert('Votre navigateur n\'autorise pas le passage en plein écran. Essayer en utilisant la touche F11 ou mettez à jour votre logiciel.');
	}
 }
 
 // Fonction pour sortir du mode plein écran :
 function exitFullscreen()
 {
	if(document.cancelFullScreen)
	{
		//fonction officielle du w3c
		document.cancelFullScreen();
	}
	else if(document.webkitCancelFullScreen)
	{
		//fonction pour Google Chrome
		document.webkitCancelFullScreen();
	}
	else if(document.mozCancelFullScreen)
	{
		//fonction pour Firefox
		document.mozCancelFullScreen();
	}
 }
 
 // Fonction rendant un entier aléatoire entre randNumMin et randNumMax
 function randInt(randNumMin,randNumMax)
{
	return (Math.floor(Math.random()*(randNumMax-randNumMin+1))+randNumMin);
}

// -----------------------------------------------------------------------------
// -------------------------------------------------------------------------------
// FIN DES DIVERS / AUTRES
// -------------------------------------------------------------------------------
// -----------------------------------------------------------------------------