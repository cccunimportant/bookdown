var searchQuery, viewBox, editBox, textBox, searchBox, localeNode;
var formEdit, converter, book, file, searchTemplate;
var katexLoaded = false;
var dictionary = {}

function load(pBook, pFile) {
  book    = pBook;
  file    = pFile;
  viewBox = document.getElementById("viewBox");
  editBox = document.getElementById("editBox");
  textBox = document.getElementById("editText");
  formEdit= document.getElementById("formEdit");
  searchBox = document.getElementById("searchBox");
  searchQuery = document.getElementById("searchQuery");
  localeNode = document.getElementById("locale");
  if (defaultLocale === '')
    defaultLocale = "Global";
  window.onhashchange();
//  converter = new showdown.Converter();
//  converter.setOption('tables', true);
  converter = window.markdownit(); // markdown-it
  searchQuery.addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode == 13) {
      var key = searchQuery.value;
      window.location.hash = '#'+key;
      showBox(searchBox);
    }
  });
  addToDictionary('tw', tw);
  loadScript('/chinese.js', function() {
    pageToLocale();    
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
    alert(mt(r.responseText));
    if (typeof callback !== 'undefined') callback(r);
  };
  r.send(JSON.stringify(obj));
}

var scriptLoaded = {}

function loadScript(url, onload) {
  var urlLoaded = scriptLoaded[url];
  if (typeof urlLoaded !== 'undefined') {
    if (typeof onload !== 'undefined') onload();
    return;
  }
  var script = document.createElement('script');
  script.onload = onload;
  script.src = url;
  document.getElementsByTagName('head')[0].appendChild(script);
  scriptLoaded[url] = true;
}

function texApply(text) {
  return text.replace(/(```\w*\n([\s\S]*?)\n```)|(`[^`\n]*`)|(\$\$\s*\n\s*([^$]+)\s*\n\s*\$\$)|(\$\$([^$\n]+)\$\$)/gmi, function(match, p1, p2, p3, p4, p5, p6, p7, offset, str) {
    try {
      if (typeof p1 !== 'undefined') {
        return match;
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

function texRender(text, callback) {
  if (text.indexOf("$$")>=0) {
    loadScript(katexJsUrl, function() {
      text = texApply(text);
      callback(text);
    });
  } else {
    callback(text);
  }
}

function map(s, s2t) {
  var t = s2t[s];
  return (typeof t === 'undefined')?s:t;
}

function locale() {
  return (localStorage.locale || defaultLocale);
}

function localeChinese() {
  return ["tw", "cn"].indexOf(locale())>=0;
}

function chineseMt(text) {
  var toText = [];
  var s2t = (locale() === 'tw')?cn2tw
           :(locale() === 'cn')?tw2cn:{};
  for (var i=0; i<text.length; i++) {
    toText[i] = map(text[i], s2t);
  }
  return toText.join('');
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
    else {
      var mdParts = md.split(/\nchinese:\n/mi);
      if (mdParts.length >= 2) {
        if (localeChinese()) {
          md = mdParts[1];
        } else
          md = mdParts[0];
      }
      if (localeChinese())
        md = chineseMt(md);
    }
//    return converter.makeHtml(md); // showdown.js
    return converter.render(md); // markdown-it
  }
}

function codeHighlight() {
  var codes = document.querySelectorAll('pre code');
  if (codes.length > 0) {
    loadScript(highlightJsUrl, function() {
      for (var i=0; i<codes.length; i++) {
        hljs.highlightBlock(codes[i]);
      }
    });
  }
}

var localeFull={
  "":"Global",
  tw:"繁體中文",
  cn:"简体中文",
  en:"English",
}

function render() {
  var html = fileRender(textBox.value);
  texRender(html, function(texHtml) {
    viewBox.innerHTML = texHtml;
    menuToLocale();
    codeHighlight();
    searchBox.innerHTML = chineseMt(searchHtml);
    if (typeof localStorage.locale !== 'undefined')
      localeNode.innerHTML = localeFull[localStorage.locale];
  });
}

/*

function render() {
//  texRender(textBox.value, function(text) {
    viewBox.innerHTML = fileRender(text);
    menuToLocale();
    codeHighlight();
    searchBox.innerHTML = chineseMt(searchHtml);
    if (typeof localStorage.locale !== 'undefined')
      localeNode.innerHTML = localeFull[localStorage.locale];
//  });
}*/

function view() {
  showBox(viewBox);
  render();
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

var searchHtml = "";

function search(key) {
  ajaxGet('/search?key='+key+'', function(status, msg) {
    var obj = JSON.parse(msg);
//    console.log("obj=%j", obj);
    var results = obj;
    var lines = [];
    for (var i=0; i<results.length; i++) {
      lines.push('<h3><a href="/view/'+results[i].path+'">'+results[i].path+'</a></h3>');
      var robj = results[i].text || results[i].json;
      var text = JSON.stringify(robj);
      lines.push("<p>"+text.replace(/\n/gi, '')+"</p>");
    }
    searchBox.innerHTML = searchHtml = lines.join("\n");
    showBox(searchBox);
  });
}

function logout() {
  ajaxPost("/logout", {}, function(r) {
    location.reload();
  });
}

// ====================== MT ====================================
var tw = {
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
  "user":"使用者",
  "locale":"語言",
  "NewBook":"寫書",
  "users":"使用者",
  "books":"書籍",
  "Contents":"內容",
  "GoBack":"回前頁",
  "User":"使用者",
  "Author":"作者",
  "Password":"密碼",
  "Profile":"私人",
  "System":"系統",
  "Global":"全球",
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
}

function addToDictionary(locale, dic) {
  var d = dictionary[locale] || {}
  for (var e in dic) {
    d[e.toLowerCase()] = dic[e];
  }
  dictionary[locale] = d;
}

function pageToLocale(locale) {
  if (typeof locale !== 'undefined') 
    localStorage.locale = locale;
  render();
}

function menuToLocale() {
  var nodes = document.getElementsByClassName("mt");
  for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i];
    var e = node.getAttribute('data-mt');
    var eMt = mt(e);
    node.innerHTML = eMt;
  }
}

function mt(msg) {
  var d = (localeChinese())?dictionary["tw"]:{};
  var toMsg = d[msg.toLowerCase()];
  msg = (typeof toMsg === 'undefined')?msg:toMsg;
  if (msg.indexOf("=")>=0) {
    var tokens = msg.split("=");
    msg = (localeChinese())?tokens[1]:tokens[0];
  }
  return (localeChinese())?chineseMt(msg):msg;
}

/*

function mt(msg) {
  var d = (localeChinese())?dictionary["tw"]:undefined;
  if (typeof d !== 'undefined') {
    var toMsg = d[msg.toLowerCase()];
    msg = (typeof toMsg === 'undefined')?msg:toMsg;
  }
  if (msg.indexOf("=")>=0) {
    var tokens = msg.split("=");
    msg = (localeChinese())?tokens[1]:tokens[0];
  }
  return (localeChinese())?chineseMt(msg):msg;
}

*/