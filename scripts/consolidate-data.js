
const _ = require('lodash');

const YAML = require('js-yaml');
const fs = require('fs');

const ROOT_FILE = 'src/assets/data/root.yml';
const CHANGELOG_FILE = 'src/assets/data/changelog.yml';
const BOSSGUIDE_FOLDER = 'src/assets/data/bossguides';
const SHOP_FOLDER = 'src/assets/data/shops';
const STAMPS_FOLDER = 'src/assets/data/stamps';

const data = fs.readFileSync(ROOT_FILE, 'utf-8');
const changelogData = fs.readFileSync(CHANGELOG_FILE, 'utf-8');

const root = YAML.safeLoad(data);
const changelog = YAML.safeLoad(changelogData);

const { classes, weapons, accessories } = root;

const allItems = _.flattenDeep(weapons.concat(accessories).map(({ id }) => {
  const path = id === 'all' ? `accessory/all` : `weapon/${id}`;

  const datagl = fs.readFileSync(`src/assets/data/item/${path}.yml`, 'utf-8');
  const itemsgl = YAML.safeLoad(datagl);
  
  const datajp = fs.readFileSync(`src/assets/data/item/${path}.jp.yml`, 'utf-8');
  const itemsjp = YAML.safeLoad(datajp);

  const items = itemsgl.concat(itemsjp);

  items.forEach(item => {
    item.type = id === 'all' ? 'accessory' : 'weapon';
    item.subtype = id;
  });

  return items;
}));

const allCharacters = _.flattenDeep(classes.map(charClass => {
  const datagl = fs.readFileSync(`src/assets/data/character/${charClass.toLowerCase()}.yml`, 'utf-8');
  const charactersgl = YAML.safeLoad(datagl);

  const datajp = fs.readFileSync(`src/assets/data/character/${charClass.toLowerCase()}.jp.yml`, 'utf-8');
  const charactersjp = YAML.safeLoad(datajp);

  const characters = charactersgl.concat(charactersjp);

  characters.forEach(char => char.type = charClass.toLowerCase());

  return characters;
}));

const allGuides = _.flattenDeep(fs.readdirSync(BOSSGUIDE_FOLDER).map(file => {
  const data = fs.readFileSync(`${BOSSGUIDE_FOLDER}/${file}`, 'utf-8');
  const bossguides = YAML.safeLoad(data);

  return bossguides;
}));

const allShops = _.flattenDeep(fs.readdirSync(SHOP_FOLDER).map(file => {
  const data = fs.readFileSync(`${SHOP_FOLDER}/${file}`, 'utf-8');
  const shops = YAML.safeLoad(data);

  return shops;
}));

const allStamps = _.flattenDeep(fs.readdirSync(STAMPS_FOLDER).map(file => {
  const data = fs.readFileSync(`${STAMPS_FOLDER}/${file}`, 'utf-8');
  const stamps = YAML.safeLoad(data);

  return stamps;
}));

const fullData = {
  root,
  changelog,
  allCharacters,
  allItems,
  allGuides,
  allShops,
  allStamps
};

fs.writeFileSync('src/assets/data.json', JSON.stringify(fullData));

