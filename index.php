<!DOCTYPE html>
<html lang="fr">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
		<title>Cities Online Alpha</title>
		<link rel="icon" href="/images/site-icon.png" type="image/png">
		<meta name="description" content="Jeu multijoueur de simulation urbaine gratuit, dans lequel vous incarnez le maire d'une ville en définissant sa politique.">
		<meta name="keywords" content="jeu vidéo, simulation urbaine, gratuit, online, multijoueur, amis, cities, city builder, politique, maire">
		<meta name="author" content="Jimmy Leray">
		<link rel="stylesheet" type="text/css" href="style.css">
		<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>
	</head>
	
	<body>
		<div id="main_container">
			<div id="game_container">	
				<div id="game_map">
					<div id="map_container" class="map_global map_elements"></div>
				</div>
			</div>
			
			<div id="interface_container">
				<div id="interface_tool_tree" onclick="changeTool('tree')"><img src="./images/icon_tree.png" title="Ajoute des arbres" alt="icone,tree" width="30" height="30"></div>
				<div id="interface_tool_road" onclick="changeTool('road')"><img src="./images/icon_road.png" title="Construit des routes" alt="icone,route" width="30" height="30"></div>
				<div id="interface_tool_home" onclick="changeTool('home')"><img src="./images/icon_home.png" title="Délimite une zone résidentielle" alt="icone,home" width="30" height="30"></div>
				<!--<div id="interface_tool_store" onclick="changeTool('store')"><img src="./images/icon_store.png" title="Délimite une zone commerciale" alt="icone,store" width="30" height="30"></div>-->
				<div id="interface_tool_office" onclick="changeTool('office')"><img src="./images/icon_office.png" title="Délimite une zone commerciale" alt="icone,office" width="30" height="30"></div>
				<div id="interface_tool_industry" onclick="changeTool('industry')"><img src="./images/icon_industry.png" title="Délimite une zone industrielle" alt="icone,industry" width="30" height="30"></div>
				<div id="interface_tool_delete" onclick="changeTool('delete')"><img src="./images/icon_delete.png" title="Détruit des éléments" alt="icone,delete" width="30" height="30"></div>
			</div>
			
			<div id="interface_minimap">
				<canvas id="minimap_background"></canvas>
				<canvas id="minimap_selector"></canvas>
			</div>
			
			<div id="ressources_bar">
				<div id="ressources_level">
					<img src="./images/icon_star_blue.png" alt="fullscreen" width="20" height="20">
					<span id="level_current">1</span>
				</div>
				<div id="ressources_money">
					<img src="./images/icon_money.png" alt="fullscreen" width="20" height="20">
					<span id="money_current">0€</span>
					<!--<span id="money_variation">(+0)</span>-->
				</div>
				<div id="ressources_population">
					<img src="./images/icon_population.png" alt="fullscreen" width="20" height="20">
					<span id="population_current">0</span>
				</div>
				<!--<div id="ressources_rubis">
					<img src="/images/icon_rubis.png" alt="fullscreen" width="20" height="20">
					<span id="rubis_current">0</span>
				</div>-->
			</div>
			
			<div id="menu_bar">
				<div id="fullscreen_icon" onclick="changeScreenMode(document.body)">
					<img src="./images/icon_fullscreen.png" title="Utilisez F11 pour basculer en mode plein écran" alt="fullscreen" width="23" height="19">
				</div>
				<div id="options_icon" onclick="switchVisibility(document.getElementById('options_menu'))">
					<img src="./images/icon-option.png" title="Options" alt="options" width="20" height="20">
				</div>
				<div id="volume_icon" onclick="changeVolume()">
					<img src="./images/audio_volume_3.png" id="volume_level_img" title="Cliquez pour ajuster le volume du jeu" alt="volume" width="25" height="20">
				</div>
			</div>
			
			<div id="options_menu">
				<span>Réglages à venir</span>
				<!--<form>
					<input id="options_minimap" type="checkbox" name="options" value="minimap" checked onchange="checkOptions()">Afficher la minimap<br>
				</form>-->
			</div>
		</div>
		
		<div id="preload_img" style="display:none;">
			<img src="./images/tree0.png" class="preload_img_tree" id="preload_img_tree-0-21-45" alt="tree" width="40" height="53">
			<img src="./images/tree0grey.png" class="preload_img_tree" id="preload_img_tree_grey-0-21-45" alt="tree" width="40" height="53">
			<img src="./images/tree0red.png" class="preload_img_tree" id="preload_img_tree_red-0-21-45" alt="tree" width="40" height="53">
		
			<img src="./images/roads/road.png" class="preload_img_road" id="preload_img_road" alt="road" width="90" height="1600">
			<img src="./images/roads/road_grey.png" class="preload_img_road" id="preload_img_road_grey" alt="road" width="90" height="1600">
			<img src="./images/roads/road_red.png" class="preload_img_road" id="preload_img_road_red" alt="road" width="90" height="1600">
		</div>
		
		<div id="audio_lecteur"></div>

		<script type="text/javascript" src="./scripts.js"></script>
	</body>
</html>