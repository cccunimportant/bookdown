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
  render();
//  viewBox.innerHTML = texRender(viewBox.innerHTML);
	
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
  return text.replace(/(```\n[\s\S]*\n```)|(`[^`\n]*`)|(\$\$\s*\n\s*([^$]+)\s*\n\s*\$\$)|(\$\$([^$\n]+)\$\$)/gmi, function(match, p1, p2, p3, p4, p5, p6, offset, str) {
    if (typeof p1 !== 'undefined') {
      return match;
    } else if (typeof p2 !== 'undefined') {
      console.log("` match=%s", match);
      return match;
    } else if (typeof p3 !== 'undefined') {
      return katex.renderToString(p4, { displayMode: true });      
    } else if (typeof p5 !== 'undefined') {
      return katex.renderToString(p6);
    }
  });
}

function ajaxGet(path, getResponse) {
  var r = new XMLHttpRequest();
  r.open("GET", path, true);
  r.onreadystatechange = function () {
		if (r.readyState != 4) return;
//		getResponse(r.status, JSON.parse(r.responseText));
		getResponse(r.status, r.responseText);
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

function fileRender(text) {
  if (file.endsWith(".html"))
    return text;
  else {
    var md = text;
    if (file.endsWith(".json"))
      md = '```json\n'+text+'\n```';
    else if (file.endsWith(".mdo"))
      md = '```mdo\n'+text+'\n```';
    return converter.makeHtml(md);
  }
}

/*
function markdownRender(md) {
  md = md.trim();
	if (md.startsWith("<")) // html
		return md;
	else {
    if (md.startsWith("{"))
      md = '```json\n'+md+'\n```';
		return converter.makeHtml(md);    
  }
}
*/
function render() {
  var html = texRender(textBox.value);
  viewBox.innerHTML = fileRender(html);
  
/*  
  var html = markdownRender(textBox.value);
  viewBox.innerHTML = texRender(html);
*/  
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
  ajaxGet('/search?key='+key+'', function(status, msg) {
    var obj = JSON.parse(msg);
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

/*

function texRender(text) {
  if (!katexLoaded && text.indexOf("$$")>=0) {
    katexLoaded = true;
  }
//  text = text.replace('\n', '__newline__');
//  console.log("text=", text);

  var tex1 = text.replace(/\s*\$\$\s*\n\s*([^$]+)\s*\n\s*\$\$\s/gmi, function(flag,match,end){
    console.log("match=%s", match);
    return katex.renderToString(match, { displayMode: true });
  });
  var tex2 = tex1.replace(/\$\$([^$]+)\$\$/gmi, function(flag,match,end){
    return katex.renderToString(match);
  });
  
  var tex1 = text.replace(/[^`>\s]\s*\$\$\s*\n\s*([^$]+)\s*\n\s*\$\$\s/gmi, function(flag,match,end) {
    console.log("tex1:match=%s", match);
//    return match;
    return katex.renderToString(match, { displayMode: true });
  });
  var tex2 = tex1.replace(/[^`>\s]\s*\$\$([^$]+)\$\$/gmi, function(flag,match,end) {
    console.log("tex2:match=%s", match);
//    return match;
    return katex.renderToString(match);
  });

  return tex2.replace('__newline__', '\n');
  return tex2;
}
*/  
/*
function texRender(text) {
  if (!katexLoaded && text.indexOf("$$")>=0) {
    katexLoaded = true;
  }
  var tex1 = text.replace(/\$\$\s*\n\s*([^$]+)\s*\n\s*\$\$\s/gmi, function(match, p1, offset, str) {
    if (str.substr(offset-2,2).indexOf('`')>=0) {
      console.log("tex1: ``` match=%s p1=%s m=%s", match, p1, str.substr(offset, 10));
      return match;
    } else {
      console.log("tex1: katex match=%s p1=%s m=%s", match, p1, str.substr(offset, 10));
      return katex.renderToString(p1, { displayMode: true });      
    }
  });
  var tex2 = tex1.replace(/\$\$([^$\n]+)\$\$/gmi, function(match, p1, offset, str) {
    if (str.charAt(offset-1)==='`') {
      console.log("tex2: ``` match=%s p1=%s m=%s", match, p1, str.substr(offset, 10));
      return match;
    } else {
      console.log("tex2: katex match=%s p1=%s m=%s", match, p1, str.substr(offset, 10));
      return katex.renderToString(p1);      
    }
  });
  return tex2;
}

function texRender(text) {
  if (!katexLoaded && text.indexOf("$$")>=0) {
    katexLoaded = true;
  }
  var tex1 = text.replace(/(```)?\s*\$\$\s*\n\s*([^$]+)\s*\n\s*\$\$\s/gmi, function(match, p1, p2, offset, str) {
    if (typeof p1 !== 'undefined') {
      console.log("tex1: ``` match=%s p1=%s m=%s", match, p1, p2, str.substr(offset, 10));
      return match;
    } else {
      console.log("tex1: katex match=%s p1=%s m=%s", match, p1, p2, str.substr(offset, 10));
      return katex.renderToString(p2, { displayMode: true });      
    }
  });
  var tex2 = tex1.replace(/(`)?\$\$([^$\n]+)\$\$/gmi, function(match, p1, p2, offset, str) {
    if (typeof p1!=='undefined') {
      console.log("tex2: ``` match=%s p1=%s m=%s", match, p1, p2, str.substr(offset, 10));
      return match;
    } else {
      console.log("tex2: katex match=%s p1=%s m=%s", match, p1, p2, str.substr(offset, 10));
      return katex.renderToString(p2);
    }
  });
  return tex2;
}
*/