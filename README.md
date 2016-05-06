# Illustrator Scripts Panel
Illustrator Panel for playing around with scripts, and easily loading local script files:

![image](https://cloud.githubusercontent.com/assets/444309/15078439/3aeb4df6-1381-11e6-810d-6662ba3e477d.png)

#### Some Amazing scripts:
[Hiroyuki Sato's illustrator scripts](https://github.com/shspage/illustrator-scripts)  
[johnwun's js4ai](https://github.com/johnwun/js4ai)

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


## Adding Local Scripts
- Click 'set' on panel and select directory where your .js / .jsx scripts are