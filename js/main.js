var csInterface = new CSInterface();

// Reloads extension panel
var menuXML = '<Menu> \
  <MenuItem Id="reloadPanel" Label="Reload Panel" Enabled="true" Checked="false"/> \
  <MenuItem Id="debugPanel" Label="Debug" Enabled="true" Checked="false"/> \
  <MenuItem Label="---" /> \
  <MenuItem Id="reference" Label="Script Reference" Enabled="true" Checked="false"/> \
</Menu>';

csInterface.setPanelFlyoutMenu(menuXML, flyoutMenuCallback);
csInterface.addEventListener("com.adobe.csxs.events.flyoutMenuClicked", flyoutMenuCallback);
var debugPanel = false;
function flyoutMenuCallback(event){
  if (event.type === "com.adobe.csxs.events.flyoutMenuClicked") {
    if(event.data.menuId == 'reloadPanel'){
      location.reload();
    }else if(event.data.menuId == 'debugPanel'){
      debugPanel = !debugPanel;
      csInterface.updatePanelMenuItem("Debug", true, debugPanel);
    }else if(event.data.menuId == 'reference'){
      window.cep.util.openURLInDefaultBrowser('http://yearbook.github.io/esdocs/#/Illustrator/Application');
    }
  }
}

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

function loadRemoteFile(url){
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'text';
  xhr.onload = function(e) {
    if (this.status == 200 || this.status == 304) {
      var response = this.response;
      // window.cep.fs.writeFile(downloadedFile, response);

      // var data = {
      //   'path': downloadedFile
      // }
      // var stringified = $.stringify(data);

      csInterface.evalScript("$.runScriptFromInput("+$.stringify(response)+")");
    }
  };
  xhr.send();
}
$('#load-script').on('click', function(e){
  var url = $.trim($('#remote-script-url').val());
  appendMessage(url);
  if(url.length > 0){
    loadRemoteFile(url);
  }
});

function init() {
  csInterface.addEventListener("List Folder Scripts", function(e) {
    var dataType = typeof(e.data);
    var str = '';
    if(dataType == "object"){
      if(e.data.type == 'listFolderScripts'){
        addScripts(e.data);
        str = JSON.stringify(e.data);
      }
    }else {
      str = e.data;
    }
    appendMessage(str)
  });

  function addScripts(data){
    if(data.folderPath){
      $('#folder-path').text('Folder Path: ' + data.folderPath);
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

  var folderCount = 0;
  var spacer = '&nbsp;&nbsp;&nbsp;&nbsp;'
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

init();