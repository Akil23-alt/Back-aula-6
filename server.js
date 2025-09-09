const express = require('express');
const cors = require("cors");
const axios = require('axios');

const app = express();
const PORT = 3000;
 app.use(cors());

const YOUTUBE_API_KEY = 'AIzaSyBiswKA7eKbdMMrJCLQNN71nKRZ3YCnnLY';

 
//ViaCep
async function getCep(cep) {
  const url = `https://viacep.com.br/ws/${cep}/json/`;
 
  const response = await axios.get(url);
 
  return response.data;
}
 
app.get('/cep', async (req, res) => {
  const { cep } = req.query;
 
  if (!cep) return res.status(400).json({ error: 'Informe um CEP' });
 
  try {
    const data = await getCep(cep);
 
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao consultar CEP' });
  }
});

//Pokemon
async function getPokemon(name) {
  const url = `https://pokeapi.co/api/v2/pokemon/${name}`;
 
  const response = await axios.get(url);
 
  return response.data;
}
 
app.get('/pokemon', async (req, res) => {
  const { name } = req.query;
 
  if (!name) return res.status(400).json({ error: 'Informe o nome do Pokémon' });
 
  try {
    const data = await getPokemon(name.toLowerCase());
 
    res.json({
      name: data.name,                           // Nome do Pokémon
      id: data.id,                               // ID do Pokémon
      height: data.height,                       // Altura
      weight: data.weight,                       // Peso
      types: data.types.map(t => t.type.name)    // Tipos do Pokémon (array de strings)
    });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao consultar Pokémon' });
  }
});
 
//Youtube
async function searchByKeyword(keyword) {
    // O endpoint da API do YouTube para buscas
    const url = 'https://www.googleapis.com/youtube/v3/search';

    // Os parâmetros de consulta obrigatórios.
    // 'part=snippet' retorna os metadados do vídeo (título, descrição, etc.).
    // 'q' é a palavra-chave de busca.
    // 'key' é a sua chave da API.
    const params = {
        key: YOUTUBE_API_KEY,
        q: keyword,
        part: 'snippet',
        maxResults: 10 // Opcional: Define o número máximo de resultados.
    };

    // Faz a chamada à API usando o axios.
    try {
        const response = await axios.get(url, { params });
        return response.data;
    } catch (error) {
        // Lida com erros da API, como chave inválida ou cota excedida.
        console.error('Erro ao chamar a API do YouTube:', error.response ? error.response.data : error.message);
        throw new Error('Erro ao consultar a API do YouTube');
    }
}

app.get('/video', async (req, res) => {
    // Pega a palavra-chave da consulta 'q' (em vez de 'video' para ser mais claro).
    const { q } = req.query;

    if (!q) {
        return res.status(400).json({ error: 'Informe uma palavra-chave para a busca usando ?q=palavrachave' });
    }

    try {
        // Chama a função de busca com a palavra-chave
        const data = await searchByKeyword(q);

        res.json(data);
    } catch (err) {
        // Lida com erros de servidor ou da API
        res.status(500).json({ error: 'Erro ao consultar a pesquisa de vídeos' });
    }
});

app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
