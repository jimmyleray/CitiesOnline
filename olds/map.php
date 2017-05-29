<?php
// Initialisation des paramètres de la carte :
$map_width_nb_tiles = 100;
$map_height_nb_tiles = 100;
$nb_tiles = ceil($map_width_nb_tiles*$map_height_nb_tiles*0.5);

// Boucle de dessin de la grille :
for($i = 1; $i <= $nb_tiles; $i++){tile_draw($i,$map_width_nb_tiles,$map_height_nb_tiles);}

// Fonction de dessin d'une case de la carte :
function tile_draw($tile_id,$map_width_nb_tiles,$map_height_nb_tiles)
{
//Initialisation des paramètres des cases :
$tile_width = 60;
$tile_height = 30;
$tile_width_2 = 0.5*$tile_width;
$tile_height_2 = 0.5*$tile_height;

// Calcul du décalage pour remettre la case en haut à gauche :
$offset_initial_top = ($tile_id-1)*-$tile_height;

// Calcul du numéro de la colonne et de la ligne de la case :
$tile_groupe_lignes = floor(($tile_id-1)/$map_width_nb_tiles)+1;
$tile_pos_groupe_lignes = $tile_id-($tile_groupe_lignes-1)*$map_width_nb_tiles;
if($tile_pos_groupe_lignes>ceil($map_width_nb_tiles/2)){$tile_ligne = ($tile_groupe_lignes)*2;}
else{$tile_ligne = ($tile_groupe_lignes)*2-1;}

$tile_id_normalise = $tile_id-($tile_groupe_lignes-1)*$map_width_nb_tiles;
if($tile_ligne%2==0){$tile_colonne=2*($tile_id_normalise-ceil($map_width_nb_tiles/2));}
else{$tile_colonne = 2*$tile_id_normalise-1;}

// Calcul des décalages pour afficher la case à sa place dans la grille :
$offset_top = $offset_initial_top+($tile_ligne-1)*$tile_height_2;
$offset_left = ($tile_colonne-1)*$tile_width_2;

// Ecriture des canvas décrivant les cases à dessiner :
$tile_name = $tile_ligne."-".$tile_colonne;

//echo 
//"<div class='map_tiles' id='tile".$tile_name."' style='height:".$tile_height."px;width:".$tile_width."px;top:".$offset_top."px;left:".$offset_left."px;'>
//	<canvas id='canvas".$tile_name."' class='map_tiles_canvas'></canvas>
//</div>";
}
?>