// Criação do servidor HTTP para fazer requisição
const express = require('express');
const axios = require('axios');
const db = require('./db');
require('dotenv').config();

const app = express();
app.use(express.json());

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

app.get('/movies/:title', async (req, res) => {
    const { title } = req.params;

    try {
        // Buscando informações na API fornecida para o teste
        const response = await axios.get(`http://www.omdbapi.com/?t=${title}&apikey=${process.env.OMDB_API_KEY}`);
        const movie = response.data;

        if (movie.Response === 'False') {
            return res.status(404).json({ message: 'Filme não encontrado.' });
        }

        // Consultando o Banco de Dados e inserindo informações
        const query = 'INSERT INTO movies (title, year, genre, director) VALUES (?, ?, ?, ?)';
        const values = [movie.Title, movie.Year, movie.Genre, movie.Director];

        db.query(query, values, (err) => {
            if (err) {
                console.error('Erro ao inserir no banco:', err);
                return res.status(500).json({ message: 'Erro ao salvar no banco.' });
            }
            res.status(200).json({ message: 'Filme salvo com sucesso!', movie });
        });

    } catch (error) {
        console.error('Erro ao buscar na OMDb API:', error);
        res.status(500).json({ message: 'Erro ao buscar filme.' });
    }
});
