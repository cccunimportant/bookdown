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
	
	searchQuery.addEventListener("keyup", function(event) {
		event.preventDefault();
		if (event.keyCode == 13) {
			var key = searchQuery.value;
			window.location.hash = '#'+key;
			showBox(searchBox);
		}
	});
  
  initDictionary('zh', zh);
  pageToLocale();
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
  return text.replace(/(```\w*\n([\s\S]*?)\n```)|(`[^`\n]*`)|(\$\$\s*\n\s*([^$]+)\s*\n\s*\$\$)|(\$\$([^$\n]+)\$\$)/gmi, function(match, p1, p2, p3, p4, p5, p6, p7, offset, str) {
//    console.log("match=%s p5=%s p7=%s", match, p5, p7);
    try {
      if (typeof p1 !== 'undefined') {
        return match;
//          return hljs.highlightBlock(p2);
      } else if (typeof p3 !== 'undefined') {
        return match;
      } else if (typeof p4 !== 'undefined') {
        return katex.renderToString(p5, { displayMode: true });      
      } else if (typeof p6 !== 'undefined') {
        return katex.renderToString(p7);
      }
    } catch (err) {}
  });
}

function ajaxGet(path, getResponse) {
  var r = new XMLHttpRequest();
  r.open("GET", path, true);
  r.onreadystatechange = function () {
		if (r.readyState != 4) return;
		getResponse(r.status, r.responseText);
  };
	r.send(null);
}

function ajaxPost(path, obj, callback) {
  var r = new XMLHttpRequest();
  r.open("POST", path, true);
  r.onreadystatechange = function () {
		if (r.readyState != 4) return;
		alert(mt(r.responseText, localStorage.locale));
    if (typeof callback !== 'undefined') callback(r);
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

function codeHighlight() {
  var codes = document.querySelectorAll('pre code');
  for (var i=0; i<codes.length; i++) {
    hljs.highlightBlock(codes[i]);
  }
}

function render() {
  var html = texRender(textBox.value);
  viewBox.innerHTML = fileRender(html);
  codeHighlight();
}

function view() {
  showBox(viewBox);
  render();
  pageToLocale();
}

function edit() {
  showBox(editBox);
}

function save() {
  ajaxPost('/save/'+book+'/'+file, {text:textBox.value}, function(r) {
    if (r.status !== 200)
      location.href="/view/system/login.html";
  });
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
  ajaxPost("/logout", {}, function(r) {
    location.reload();
  });
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
  "Create Book":"創建新書",
  "users":"使用者",
  "books":"書籍",
  "Contents":"內容",
  "GoBack":"回前頁",
  "User":"使用者",
  "Author":"作者",
  "Password":"密碼",
  "Me":"私人",
  "MyArea":"專區",
  "System":"系統",
  "Create Book":"寫書",
  "Error: Signup=false in Setting.mdo !":"錯誤:設定檔的 signup=false !", 
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
  "Welcome to Bookdown":"歡迎來到 Bookdown",
  "Bookdown is a book writing system for Markdown.":"Bookdown 是一個採用 Markdown 語法的書籍撰寫系統。",
  "Login and create your books !":"請登入後開始創建新書！",
}

var dictionary = {}

function initDictionary(locale, dic) {
  var d = {}
  for (var e in dic) {
    d[e.toLowerCase()] = dic[e];
  }
  dictionary[locale] = d;
}

function pageToLocale(locale) {
  if (typeof locale === 'undefined') 
    locale = localStorage.locale;
  else
    localStorage.locale = locale;
  var nodes = document.getElementsByClassName("mt");
  for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i];
    var e = node.getAttribute('data-mt');
    var eMt = mt(e, locale);
    node.innerHTML = eMt;
  }
}

function mt(msg, locale) {
  var d = dictionary[locale];
  if (typeof locale === 'undefined' || typeof d==='undefined') return msg;
  var msgMt = d[msg.toLowerCase()];
  return (typeof msgMt === 'undefined')?msg:msgMt;
}

/*
  "# Error\nFile not found.\nYou may edit and save to create a new file !":"# 錯誤\n檔案不存在.\n你可以編輯後存檔以創建新檔案！",
  "Error:Book not found. You may create a new book!":"錯誤:書籍不存在，您可以創建新書 !",
*/
