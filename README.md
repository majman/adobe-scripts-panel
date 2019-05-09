# Adobe CC Scripts Panel
Panel for playing around with scripts in After Effects, Illustrator, and Photoshop.
Easily load local & remote script files:

![image](https://cloud.githubusercontent.com/assets/444309/15153395/1bc01028-16a7-11e6-99d5-ce4f1cff2ee1.png)

#### Some Amazing Illustrator scripts & resources:
[Hiroyuki Sato's illustrator scripts](https://github.com/shspage/illustrator-scripts)
[johnwun's js4ai](https://github.com/johnwun/js4ai)
[Illustrator Praxis](http://illustrator.hilfdirselbst.ch/dokuwiki/en/skripte/javascript/uebersicht)

#### Some Amazing Photoshop scripts & resources:
[Kamil Khadeyev](http://blog.darkwark.com/tags/Scripts/)
[Jeff Tranberry's Photoshop Scripting using JavaScript](http://www.tranberry.com/photoshop/photoshop_scripting/)
[Photoshop Dom Hierarchy](http://objjob.phrogz.net/pshop/hierarchy)

#### One Amazing After Effects resource (know of any more?):
[Dan Ebberts' AE Expressions and Scripting Resource](http://www.motionscript.com/)

## Installation
Adobe doesn't make this very straightforward, and I've not had much success packaging and signing extensions.

#### 1. Download repo, unzip and move folder into the extensions folder
[Download](https://github.com/majman/ai-scripts-panel/archive/master.zip)

**Win:** `C:\Program Files (x86)\Common Files\Adobe\CEP\extensions`
**Mac:** `/Library/Application Support/Adobe/CEP/extensions`

or

**Win:** `C:\<username>\AppData\Roaming\Adobe\CEP\extensions`
**Mac:** `~/Library/Application Support/Adobe/CEP/extensions`

*you may have to create folder if it doesn't already exist*

#### 2. Set PlayerDebugMode to 1

**Win:** `regedit > HKEY_CURRENT_USER/Software/Adobe/CSXS.9`, (CSXS.8 for CC 2018)
then add a new entry PlayerDebugMode of type "string" with the value of "1".

**Mac:** In the terminal, type: `defaults write com.adobe.CSXS.9 PlayerDebugMode 1` (CSXS.8 for CC 2018)
(The plist is also located at /Users/USERNAME/Library/Preferences/com.adobe.CSXS.9.plist)

**May require restart or log-out/in**

[More info here: Adobe CEP Cookbok Resources](https://github.com/Adobe-CEP/CEP-Resources/blob/master/CEP_8.x/Documentation/CEP%208.0%20HTML%20Extension%20Cookbook.md)


## Adding Local Scripts
- Click 'set' on panel and select directory where your .js / .jsx scripts are
