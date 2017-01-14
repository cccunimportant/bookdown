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
  
  initDictionary('zh', zh);
  setLocale(localStorage.locale);
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
		alert(mt(r.responseText, localStorage.locale));
/*    
    if (r.status != 200) {
			alert("Fail: " + r.responseText);
		} else {
			alert("Success: " + r.responseText);
		}
*/    
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

function render() {
  var html = texRender(textBox.value);
  viewBox.innerHTML = fileRender(html);
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

// ====================== MT ====================================
var zh = {
  "menu":"選單",
  "edit":"編輯",
  "view":"檢視",
  "save":"存檔",
  "signup":"註冊",
  "login":"登入",
  "logout":"登出",
  "home":"首頁",
  "book":"書籍",
  "search":"搜尋",
  "locale":"語言",
  "bookdown":"易書網",
  "Create Book":"創建新書",
  "users":"使用者",
  "books":"書籍",
  "Contents":"內容",
  "# Error\nFile not found.\nYou may edit and save to create a new file !":"# 錯誤\n檔案不存在.\n你可以編輯後存檔以創建新檔案！",
  "Please login to save!":"請先登入後才能存檔！",
  "Save fail: You are not editor of the book !":"存檔失敗：你不是本書的編輯！",
  "Save Success!":"存檔成功",
  "Save Fail!":"存檔失敗",
  "Signup success!":"註冊成功",
  "Signup Fail: User name already taken by some others!":"註冊失敗:該名稱已被佔用！",
  "Login Success!":"登入成功！",
  "Login Fail!":"登入失敗！",
  "Logout Success!":"登出成功！",
  "Please login at first !":"請先登入！",
  "Create Book Success!":"創建書籍成功！",
  "Fail: Book already exist!":"登入失敗！",
  "Bookdown User Guide":"Bookdown 使用手冊",
  "Preface":"前言",
  "Syntax":"語法",
  "Table":"表格",
  "Math":"數學",
  "Object":"物件",
}

var dictionary = {}

function initDictionary(locale, dic) {
  var d = {}
  for (var e in dic) {
    d[e.toLowerCase()] = dic[e];
  }
  dictionary[locale] = d;
}

function setLocale(locale) {
  localStorage.locale = locale;
  var nodes = document.getElementsByClassName("mt");
  for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i];
    var e = node.getAttribute('data-mt');
    var eMt = mt(e, locale);
    node.innerHTML = eMt;
//    console.log("e=%s eMt=%s", e, eMt);
  }
}

function mt(msg, locale) {
  if (typeof locale === 'undefined') return msg;
  var d = dictionary[locale];
  if (typeof d === 'undefined') return msg;
  var msgMt = d[msg.toLowerCase()];
  return (typeof msgMt === 'undefined')?msg:msgMt;
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

  
/*  
  var html = markdownRender(textBox.value);
  viewBox.innerHTML = texRender(html);
*/  
