# ai-specs
Panel for playing around with scripts in Illustrator  
![image](https://cloud.githubusercontent.com/assets/444309/14994614/cd6770dc-113e-11e6-9da0-140dae6d94e8.png)

## Installation
Adobe doesn't make this very straightforward, and I've never had much success packaging and signing extensions. 

#### 1. Download repo, unzip and move folder into the extensions folder
[Download](https://github.com/majman/ai-scripts-panel/archive/master.zip)

**Win:** `C:\Program Files (x86)\Common Files\Adobe\CEP\extensions`  
**Mac:** `/Library/Application Support/Adobe/CEP/extensions`

or

**Win:** `C:\<username>\AppData\Roaming\Adobe\CEP\extensions`  
**Mac:** `~/Library/Application Support/Adobe/CEP/extensions`

*you may have to create folder if it doesn't already exist*

#### 2. Set PlayerDebugMode to 1

**Win:** regedit > HKEY_CURRENT_USER/Software/Adobe/CSXS.6, then add a new entry PlayerDebugMode of type "string" with the value of "1".  
**Mac:** In the terminal, type: defaults write com.adobe.CSXS.6 PlayerDebugMode 1  
(The plist is also located at /Users/USERNAME/Library/Preferences/com.adobe.CSXS.6.plist)

**May require restart or log-out/in**

[More info here: Adobe CEP Cookbok Repo](https://github.com/Adobe-CEP/CEP-Resources/wiki/CEP-6-HTML-Extension-Cookbook-for-CC-2015#where-are-the-extensions)


## Adding Scripts
- Update `SCRIPTS_FOLDER_PATH` in `jsx/listFolderScripts.jsx` to any folder with .js or .jsx files
- Refresh the panel from the flyout menu