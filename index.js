import axios from 'axios';
import fs from 'fs';

const JSONWrite = (filePath, data, encoding = 'utf-8') => {
  const promiseCallback = (resolve, reject) => {
    fs.writeFile(filePath, JSON.stringify(data, null, 2), encoding, (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(true);
    });
  };
  return new Promise(promiseCallback);
};

const start = async () => {
  const response = await axios.get('https://pokeapi.co/api/v2/pokemon?offset=0&limit=151');
  const data = response.data.results;

  const fileData = [];

  for (const item of data) {
    const { data } = await axios.get(item.url);

    const pokemon = {
      id: data.id,
      name: data.name,
      order: data.order,
      base_experience: data.base_experience,
      weight: data.weight,
      height: data.height,
      image: `https://raw.githubusercontent.com/emersonbroga/api.pokedex.react.dev.br/main/public/images/original/${data.id}.png`,
    };

    pokemon.types = data.types.map((item) => {
      return { slot: item.slot, type_name: item.type.name };
    });

    fileData.push(pokemon);
  }

  await JSONWrite('./pokemon-list.json', fileData);
  console.log('Done!');
};

start();
