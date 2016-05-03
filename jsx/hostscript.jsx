// Full debug mode
$.level = 2;

$._ext = (function () {
    'use strict';
    var ext = {};
    var destFolder;

    ext.selectDestination = function() {
        destFolder = Folder.selectDialog("Select Destination");
        if(destFolder) return destFolder.absoluteURI;
        else return "";
    }

    //Evaluate a file and catch the exception.
    ext.evalFile = function (path) {
        try {
            $.evalFile(path);
        } catch (e) {
            alert("Exception:" + e);
        }
    };

    // Evaluate all the files in the given folder
    ext.evalFiles = function (jsxFolderPath) {
        var folder = new Folder(jsxFolderPath);
        if (folder.exists) {
            var jsxFiles = folder.getFiles("*.jsx");
            var i;
            for (i = 0; i < jsxFiles.length; i++) {
                var jsxFile = jsxFiles[i];
                $._ext.evalFile(jsxFile);
            }
        }
    };

    return ext;

}());
