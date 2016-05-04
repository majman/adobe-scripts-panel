#include "underscore.js";
#include "json2.js";

var SCRIPTS_FOLDER_PATH = '~/Dropbox/SharedAdobeScripts';
var folderObjects = {};
var listData = listFolderScripts();

// load xLib
try {
  var xLib = new ExternalObject("lib:\PlugPlugExternalObject");
} catch (e) {
  alert(e);
}

function dispatchCEPEvent(_type, _data) {
  if (xLib) {
    var eventObj = new CSXSEvent();
    eventObj.type = _type;
    eventObj.data = _data;
    eventObj.dispatch();
  }
}

function listFolderScripts(){
  var ob = {type: 'listFolderScripts'};
  var str = '';
  if(SCRIPTS_FOLDER_PATH != null){
    var scriptFolder = Folder(SCRIPTS_FOLDER_PATH);
    if(scriptFolder.exists){
      str = decodeURI(scriptFolder);
      addScriptFiles(scriptFolder);
    }
  }
  ob.folderPath = SCRIPTS_FOLDER_PATH;
  ob.folderObjects = folderObjects;
  ob = JSON.stringify(ob);
  return ob;
}

function addScriptFiles(scriptFolder, parent){
  var parent = parent || folderObjects;

  // top level
  if(parent[scriptFolder.name] == undefined){
    parent[scriptFolder.name] = {
      'files': [],
      'folders': {}
    }
  }
  var currentFolder = parent[scriptFolder.name];
  // only get subfolders and js(x) files
  var tempFolderFiles = scriptFolder.getFiles(function(f){
    return f instanceof Folder || (f instanceof File && f.name.match(/(\.js$|\.jsx$)/));
  });
  _.each(tempFolderFiles, function(tempItem){
    if(tempItem instanceof File == true){
      var n = decodeURI(tempItem.name);
      currentFolder.files.push(n);
    }else {
       var childFolder = Folder(tempItem);
       addScriptFiles(childFolder, currentFolder.folders);
    }
   });
}


$.runScriptFromFile = function(options) {
  runScriptFromFile(SCRIPTS_FOLDER_PATH+'/'+options);
  dispatchCEPEvent("List Folder Scripts", 'runScriptFromFile');
  return "complete";
}

function runScriptFromFile(file){
  var sf = file;

  if(!(file instanceof File)){
    sf = File(file);
  }
  if(!sf.exists){
    alert("Sorry, it appears that this script file cannot be located at '"+decodeURI(sf.toString())+"'");
    return;
  }
  sf.open('r');
  var scriptString = sf.read().replace("#target illustrator",'');
  sf.close();

  // Thanks to: https://forums.adobe.com/thread/287506?tstart=0
  var pathToScript = "var ScriptPanel_MyLocation = '"+sf.fsName+"';";
  var script = "var scp ='" + bridgeTalkEncode(pathToScript+"\r"+scriptString) + "'";

  script += ";\nvar scpDecoded = decodeURI( scp );\n";
  script += "eval( scpDecoded );";

  var bt = new BridgeTalk();
  bt.target = 'illustrator';
  bt.body = script;
  bt.onError = function(errObj){
    alert(errObj.body);
  }
  bt.send();
}


// Live Input
$.runScriptFromInput = function(options) {
  runScriptFromInput(options);
  dispatchCEPEvent("List Folder Scripts", 'runScriptFromInput');
  return "complete";
}

function runScriptFromInput(str){
  var script = bridgeTalkEncode(str);
  var scriptDecoded = decodeURI(script);
  eval(scriptDecoded);
}

function bridgeTalkEncode( txt ) {
  txt = encodeURIComponent( txt );
  txt = txt.replace( /\r/, "%0d" );
  txt = txt.replace( /\n/, "%0a" );
  txt = txt.replace( /\\/, "%5c" );
  txt = txt.replace(/'/g, "%27");
  return txt.replace(/"/g, "%22");
}

dispatchCEPEvent("List Folder Scripts", listData);