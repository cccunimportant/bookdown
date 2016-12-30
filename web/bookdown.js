var searchQuery, viewBox, editBox, textBox, searchBox;
var formEdit, converter, book, file, searchTemplate;
var katexLoaded = false;

function load(pBook, pFile) {
  book    = pBook;
  file    = pFile;
  searchQuery = document.getElementById("searchQuery");
  searchBox = document.getElementById("searchBox");
  viewBox = document.getElementById("viewBox");
  editBox = document.getElementById("editBox");
  textBox = document.getElementById("editText");
  formEdit= document.getElementById("formEdit");
	
  window.onhashchange();
  converter = new showdown.Converter();
  converter.setOption('tables', true);
  viewBox.innerHTML = texRender(viewBox.innerHTML);
	
	searchQuery.addEventListener("keyup", function(event) {
		event.preventDefault();
		if (event.keyCode == 13) {
			var key = searchQuery.value;
			window.location.hash = '#'+key;
			showBox(searchBox);
		}
	});
}

window.onhashchange = function() {
	if (window.location.hash.trim() === '')
		showBox(viewBox);
	else
		search(window.location.hash.substring(1));
}

window.onpopstate = function(event) {}

function showBox(box) {
  searchBox.style.display = 'none';
  viewBox.style.display = 'none';
  editBox.style.display = 'none';
  box.style.display = 'block';
}

function texRender(text) {
  if (!katexLoaded && text.indexOf("$$")>=0) {
    katexLoaded = true;
  }

  var tex1 = text.replace(/\$\$\s*\n\s*([^$]+)\s*\n\s*\$\$/gi, function(flag,match,end){
    return katex.renderToString(match, { displayMode: true });
  });
  var tex2 = tex1.replace(/\$\$([^$]+)\$\$/gi, function(flag,match,end){
    return katex.renderToString(match);
  });
  return tex2;
}

function ajaxGet(path, getResponse) {
  var r = new XMLHttpRequest();
  r.open("GET", path, true);
  r.onreadystatechange = function () {
		if (r.readyState != 4) return;
		getResponse(r.status, JSON.parse(r.responseText));
  };
	r.send(null);
}

function ajaxPost(path, obj) {
  var r = new XMLHttpRequest();
  r.open("POST", path, true);
  r.onreadystatechange = function () {
		if (r.readyState != 4) return;
    if (r.status != 200) {
			alert("Fail: " + r.responseText);
		} else {
			alert("Success: " + r.responseText);
		}
  };
  r.send(JSON.stringify(obj));
}

function markdownRender(md) {
	if (md.trim().startsWith("<")) // html
		return md;
	else
		return converter.makeHtml(md);
}

function render() {
  var html = markdownRender(textBox.value);
  viewBox.innerHTML = texRender(html);
}

function view() {
  showBox(viewBox);
  render();
}

function edit() {
  showBox(editBox);
}

function save() {
  ajaxPost('/save/'+book+'/'+file, {text:textBox.value});
}

function search(key) {
  ajaxGet('/search?key='+key+'', function(status, obj) {
		var results = obj;
		var lines = [];
    for (var i=0; i<results.length; i++) {
			lines.push('<h3><a href="/view/'+results[i].path+'">'+results[i].path+'</a></h3>');
			var obj = results[i].md || results[i].json;
			var text = JSON.stringify(obj);
			lines.push("<p>"+text.replace(/\n/gi, '')+"</p>");
		}
		searchBox.innerHTML = lines.join("\n");
		showBox(searchBox);
	});
}

function logout() {
  ajaxPost("/logout", {});
}
