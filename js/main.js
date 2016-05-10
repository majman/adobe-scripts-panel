var csInterface = new CSInterface();
var hostEnv = csInterface.getHostEnvironment();
var appName = hostEnv.appName;

var refURLs = {
  'ILST' : 'http://yearbook.github.io/esdocs/#/Illustrator/Application',
  'PHXS' : 'http://yearbook.github.io/esdocs/#/Photoshop/Application',
  'PHSP' : 'http://yearbook.github.io/esdocs/#/Photoshop/Application',
  'AEFT' : 'http://www.adobe.com/devnet/aftereffects.html'
}

var refURL = refURLs[appName];

// Reloads extension panel
var menuXML = '<Menu> \
  <MenuItem Id="reloadPanel" Label="Reload Panel" Enabled="true" Checked="false"/> \
  <MenuItem Id="debugPanel" Label="Debug" Enabled="true" Checkable="true" Checked="false"/> \
  <MenuItem Label="---" /> \
  <MenuItem Id="reference" Label="Script Reference" Enabled="true" Checked="false"/> \
</Menu>';

csInterface.setPanelFlyoutMenu(menuXML, flyoutMenuCallback);
csInterface.addEventListener("com.adobe.csxs.events.flyoutMenuClicked", flyoutMenuCallback);
csInterface.setContextMenu(menuXML, flyoutMenuCallback);
csInterface.addEventListener("com.adobe.csxs.events.contextMenuClicked", flyoutMenuCallback);
var debugPanel = false;
function flyoutMenuCallback(event){
  var menuId = event.type && event.data ? event.data.menuId : event;

  if(menuId == 'reloadPanel'){
    location.reload();
  }else if(menuId == 'debugPanel'){
    toggleDebug();
  }else if(menuId == 'reference'){
    window.cep.util.openURLInDefaultBrowser(refURL);
  }

}

function toggleDebug(){
  debugPanel = !debugPanel;
  // context menu and flyout menu become out of sync, seems like a bug;
  csInterface.updateContextMenuItem("Debug", true, debugPanel);
  csInterface.updatePanelMenuItem("Debug", true, debugPanel);
}


// Load Remote Script
function loadRemoteScript(url) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'text';
  xhr.onload = function(e) {
    if (this.status == 200 || this.status == 304) {
      var response = this.response;
      // var downloadedFile = createTempFolder() + name + '.js';
      // window.cep.fs.writeFile(downloadedFile, response);
      csInterface.evalScript("$.runScriptFromInput("+$.stringify(response)+")");
    }
  };
  xhr.send();
};

$('#load-script').on('click', function(e){
  var url = $.trim($('#script-url').val());
  if(url.length > 0){
    loadRemoteScript(url);
  }
});
// Loads / executes a jsx file
function loadJSXFile(pPath) {
  var scriptPath = csInterface.getSystemPath(SystemPath.EXTENSION) + pPath;
  try {
    csInterface.evalScript('$._ext.evalFile("' + scriptPath + '")');
  }catch(e){
    alert('error '+e);
  }
}

// add message to panel output
function appendMessage(str){
  var m = 'Last Operation:';
  if(debugPanel){
    $("#output").html(m + "<br>" + str);
  }
}

// set script folder paths
function selectScriptFolderPath(){
  csInterface.evalScript("$.selectFolderPath()");
}
function setScriptFolderPath(folderPath){
  csInterface.evalScript("$.setFolderPath("+$.stringify(folderPath)+")");
}

$('#set-folder').on('click', selectScriptFolderPath);

function init() {
  csInterface.addEventListener("List Folder Scripts", function(e) {
    var dataType = typeof(e.data);
    var str = '';
    if(dataType == "object"){
      if(e.data.type == 'listFolderScripts'){
        addScripts(e.data);
        str = JSON.stringify(e.data);
      }else if(e.data.type == 'selectFolderPath'){
        if(e.data.folderPath){
          storeFolderPath(e.data.folderPath);
        }
      }
    }else {
      str = e.data;
    }
    appendMessage(str)
  });

  var folderCount = 0;
  var spacer = '&nbsp;&nbsp;&nbsp;&nbsp;'
  function addScripts(data){
    folderCount = 0;
    if(data.folderPath){
      $('#folder-path').text(data.folderPath);
      storeFolderPath(data.folderPath);
    }

    if(data.folderObjects) {
      var foHTML = addFolderScripts(data.folderObjects);
      $("#linked-scripts2").html('<ul>' + foHTML + '</ul>');
    }

    $('.linked-scripts').on('click', '.file-name', function(e){
      var fname = $(this).attr('data-fileName');
      csInterface.evalScript("$.runScriptFromFile("+$.stringify(fname)+")");
      return false;
    });
  }


  function addFolderScripts(folderObjects) {
    var fileSpacer = Array(folderCount).join(spacer);
    var foHTML = '';
    _.each(folderObjects, function(fob, fobName){
      folderCount ++;
      foHTML += '<li class="folder-group">';
      foHTML +=   '<input id="folder' + folderCount + '" type="checkbox" class="toggle-folder" checked />';
      foHTML +=   '<label for="folder' + folderCount + '">&nbsp;&nbsp;' + fileSpacer + '<span class="folder-name">' + fobName + '</span></label>'
      foHTML +=   '<ul class="file-list">';
      if(fob.files && fob.files.length > 0){
        _.each(fob.files, function(fobFile){
          foHTML +=  '<li class="file-name" data-fileName="'+fobFile+'">&nbsp;&nbsp;' + spacer + fileSpacer + fobFile + '</li>';
        });
      }
      if(fob.folders && _.size(fob.folders) > 0){
        foHTML += addFolderScripts(fob.folders);
      }
      foHTML +=   '</ul>';
      foHTML += '</li>';
    });
    return foHTML;
  }

  $('#run-input').on('click', function(){
    var scr = editor.getValue();
    csInterface.evalScript("$.runScriptFromInput("+$.stringify(scr)+")");
  });

  themeManager.init();
  loadJSXFile("/jsx/listFolderScripts.jsx");


  getLocalSettings();
}

jQuery.extend({
  stringify : function stringify(obj) {
    if ("JSON" in window) {
      return JSON.stringify(obj);
    }
    var t = typeof (obj);
    if (t != "object" || obj === null) {
      // simple data type
      if (t == "string") obj = '"' + obj + '"';
      return String(obj);
    } else {
      // recurse array or object
      var n, v, json = [], arr = (obj && obj.constructor == Array);

      for (n in obj) {
        v = obj[n];
        t = typeof(v);
        if (obj.hasOwnProperty(n)) {
          if (t == "string") v = '"' + v + '"'; else if (t == "object" && v !== null) v = jQuery.stringify(v);
          json.push((arr ? "" : '"' + n + '":') + String(v));
        }
      }
      return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
    }
  }
});


var editor = ace.edit("editor");
editor.setTheme("ace/theme/textmate");
editor.session.setMode("ace/mode/javascript");

function storeLocalSettings () {
    editor.resize();

    var toggled = {};
    _.each($('.toggle-input'), function(el){
        var id = el.id;
        if(el.checked == true){
            toggled[id] = true;
        }else {
            toggled[id] = false;
        }
    });
    localStorage.setItem (
      "com.majman.scriptsPanel.toggled",
      JSON.stringify(toggled)
    );
}
function storeFolderPath(folderPath){
  localStorage.setItem (
    "com.majman.scriptsPanel.folderPath",
    folderPath
  );
}
function getLocalSettings () {
  csInterface.evalScript("$.setAppName("+$.stringify(appName)+")");
  var toggled = localStorage.getItem("com.majman.scriptsPanel.toggled");
  if (toggled) {
    var toggledSettings = JSON.parse(toggled);
    _.each(toggledSettings, function(v, k){
        $('#'+k)[0].checked = v;
    });
  }
  var folderPath = localStorage.getItem("com.majman.scriptsPanel.folderPath");
  if(folderPath){
    setScriptFolderPath(folderPath);
  }
}

$('.toggle-input').on('change', storeLocalSettings);


init();