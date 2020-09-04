const fs = require('fs');
const glob = require('glob');

const localizationFileCleaned = 'scripts/localizations-cleaned.json';
const localizationFileCleaned_fr = 'scripts/localizations-cleaned_fr.json';
const localizationFileCleaned_de = 'scripts/localizations-cleaned_de.json';

// regular expressions for patterns of not explicit used localization keys (dynamic created keys, error keys from rest calls)
// new patterns have to be added here
const patterns = ['account.login..*.message', '.*.?error..*'];
const regEx = new RegExp(patterns.join('|'), 'i');

var cachedFiles = {};
var localizationsFound = {};
var localizationsFoundOrdered = {};

// store localizations from localization file in an object
var localizations = JSON.parse(fs.readFileSync('src/assets/i18n/en_US.json', 'utf8'));
var localizations_fr = JSON.parse(fs.readFileSync('src/assets/i18n/fr_FR.json', 'utf8'));
var localizations_de = JSON.parse(fs.readFileSync('src/assets/i18n/de_DE.json', 'utf8'));

// go through directory recursively and save files to object
glob.sync('{src,projects}/**/!(*.spec).{ts,html}').forEach(filePath => {
  const fileContent = fs.readFileSync(filePath);
  cachedFiles[filePath] = fileContent;
});

// add not explicit used localization keys
Object.keys(localizations)
  .filter(v => v.match(regEx))
  .map(localizationKey => {
    localizationsFound[localizationKey] = localizations[localizationKey];
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

// sort found localizations
Object.keys(localizationsFound)
  .sort()
  .forEach(function (key) {
    localizationsFoundOrdered[key] = localizationsFound[key];
  });

// write found localizations into file
fs.writeFileSync(localizationFileCleaned, JSON.stringify(localizationsFoundOrdered, null, 2));

// create cleaned localization files for other languages
Object.keys(localizationsFoundOrdered).forEach(localizationKey => {
  localizationsFoundOrdered[localizationKey] = localizations_fr[localizationKey];
  localizationsFoundOrdered[localizationKey] = localizations_de[localizationKey];
});
fs.writeFileSync(localizationFileCleaned_fr, JSON.stringify(localizationsFoundOrdered, null, 2));
fs.writeFileSync(localizationFileCleaned_de, JSON.stringify(localizationsFoundOrdered, null, 2));
