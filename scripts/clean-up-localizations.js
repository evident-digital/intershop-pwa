const fs = require('fs');
const path = require('path');

const extensionsToBeSearched = ['.ts', '.html'];
const dirsToBeSearched = ['projects', 'src'];

const localizationFileCleaned = 'scripts/localizations-cleaned.json';
const localizationFileCleaned_fr = 'scripts/localizations-cleaned_fr.json';
const localizationFileCleaned_de = 'scripts/localizations-cleaned_de.json';

const dynamicLocalizationsFile = 'src/assets/i18n/dynamic_localizations_en_US.json';
const dynamicLocalizations = JSON.parse(fs.readFileSync(dynamicLocalizationsFile, 'utf8'));

var cachedFiles = {};
var localizationsFound = {};
var localizationsFoundOrdered = {};

// store localizations from localization file in an object
var localizations = JSON.parse(fs.readFileSync('src/assets/i18n/en_US.json', 'utf8'));
var localizations_fr = JSON.parse(fs.readFileSync('src/assets/i18n/fr_FR.json', 'utf8'));
var localizations_de = JSON.parse(fs.readFileSync('src/assets/i18n/de_DE.json', 'utf8'));

// go through directory recursively and execute callback function for files
function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

// store files to be searched in an object
dirsToBeSearched.forEach(dir => {
  walkDir(dir, function (filePath) {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    if (extensionsToBeSearched.indexOf(path.extname(filePath)) > -1) {
      cachedFiles[filePath] = fileContent;
    }
  });
});

// loop over localization keys
Object.keys(localizations).forEach(localizationKey => {
  //loop over file contents of files to be searched
  for (var filePath in cachedFiles) {
    if (cachedFiles[filePath].indexOf(localizationKey) > -1) {
      // store found localizations
      localizationsFound[localizationKey] = localizations[localizationKey];
      break;
    }
  }
});

// merge not explicit used localizations
localizationsFound = { ...localizationsFound, ...dynamicLocalizations };

// sort found localizations
Object.keys(localizationsFound)
  .sort()
  .forEach(function (key) {
    localizationsFoundOrdered[key] = localizationsFound[key];
  });

// write found localizations into file
fs.writeFileSync(localizationFileCleaned, JSON.stringify(localizationsFoundOrdered, null, 2));

// create cleaned localization files for other languages
Object.keys(localizationsFound).forEach(localizationKey => {
  localizationsFound[localizationKey] = localizations_fr[localizationKey];
  localizationsFound[localizationKey] = localizations_de[localizationKey];
});
fs.writeFileSync(localizationFileCleaned_fr, JSON.stringify(localizationsFound, null, 2));
fs.writeFileSync(localizationFileCleaned_de, JSON.stringify(localizationsFound, null, 2));
