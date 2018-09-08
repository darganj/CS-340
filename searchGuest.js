function searchGuestsByName() {
	var name_search_string = document.getElementById('name_search_string').value;

	window.location = '/guests/search/' + encodeURI(name_search_string);
}
