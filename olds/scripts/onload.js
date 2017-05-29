window.onload = function()
{
	// Dessine toutes les cases de la carte :
	draw_all_tiles();
	
	// Rend visible la page une fois que tout est chargé :
	document.getElementById('main_container').style.visibility = 'visible';
}