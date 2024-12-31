// Importando informações
const axios = require('axios');
const db = require('./server');
require('dotenv').config();

// Função para buscar e salvar filme no banco de dados
const fetchAndSaveFilm = async (title) => {
    try {
        const response = await axios.get(`http://www.omdbapi.com/?t=${title}&apikey=${process.env.OMDB_API_KEY}`);
        const film = response.data;

        if (film.Response === 'False') {
            console.log('Filme não encontrado.');
            return;
        }

        const query = `
            INSERT INTO film (film_id, title, year, genre, director) 
            VALUES (?, ?, ?, ?, ?) 
            ON DUPLICATE KEY UPDATE title = VALUES(title), year = VALUES(year), genre = VALUES(genre), director = VALUES(director)
        `;
        const values = [film.imdbID, film.Title, film.Year, film.Genre, film.Director];

        db.query(query, values, (err) => {
            if (err) {
                console.error('Erro ao inserir no banco:', err);
                return;
            }
            console.log(`Filme "${film.Title}" salvo ou atualizado com sucesso!`);
        });
    } catch (error) {
        console.error('Erro ao buscar na OMDb API:', error);
    }
};

// Função para atualizar informações de um filme
const updateFilmInfo = async (filmId, title) => {
    try {
        const response = await axios.get(`http://www.omdbapi.com/?t=${title}&apikey=${process.env.OMDB_API_KEY}`);
        const film = response.data;

        if (film.Response === 'False') {
            console.log('Filme não encontrado.');
            return;
        }

        const query = 'UPDATE film SET plot = ?, cast = ? WHERE film_id = ?';
        const values = [film.Plot, film.Actors, filmId];

        db.query(query, values, (err) => {
            if (err) {
                console.error('Erro ao atualizar informações do filme:', err);
                return;
            }
            console.log(`Informações do filme "${film.Title}" atualizadas com sucesso!`);
        });
    } catch (error) {
        console.error('Erro ao buscar na OMDb API:', error);
    }
};

// Função para encontrar um e-mail caso exista ou criar ele sozinho
const findOrCreateUser = async (email, name) => {
    return new Promise((resolve, reject) => {
        const findQuery = 'SELECT user_id FROM user WHERE email = ?';
        db.query(findQuery, [email], (err, results) => {
            if (err) {
                return reject(err);
            }

            if (results.length > 0) {
                // Usuário encontrado
                resolve(results[0].user_id);
            } else {
                // Inserir novo usuário
                const insertQuery = 'INSERT INTO user (name, email) VALUES (?, ?)';
                db.query(insertQuery, [name, email], (err, result) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(result.insertId);
                });
            }
        });
    });
};

// Função para inserir nova avaliação no filme
const addReview = async (filmId, email, name, rating, comment) => {
    try {
        const userId = await findOrCreateUser(email, name);

        const query = `
            INSERT INTO review (film_id, user_id, reviewer_name, rating, comment)
            VALUES (?, ?, ?, ?, ?)
        `;
        const values = [filmId, userId, name, rating, comment];

        db.query(query, values, (err) => {
            if (err) {
                console.error('Erro ao inserir avaliação:', err);
                return;
            }
            console.log('Avaliação inserida com sucesso!');
        });
    } catch (error) {
        console.error('Erro ao processar avaliação:', error.message);
    }
};

// Função para automatizar as requisições
const automateUpdates = async () => {
    // Exemplo de busca e adição de filme
    await fetchAndSaveFilm('Inception');

    // Exemplo de adição de código ao filme
    await updateFilmInfo('tt1375666', 'Inception');

    // Exemplo de adição de comentário para usuários já criados no banco de dados
    await addReview('tt1375666', 'joao@email.com', 'João', 9, 'Excelente filme!');
};

// Função para automatizar as atualizações de informações de filmes e avaliações
automateUpdates();
