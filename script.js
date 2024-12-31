// Importando informações
const axios = require('axios');
const db = require('./server');
require('dotenv').config();

// Função para buscar e salvar filme no banco de dados
const search_save_film = async (title) => {
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
const update_film = async (filmId, title) => {
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
const create_review = async (filmId, email, name, rating, comment) => {
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
const automate_updates = async () => {

    // Exemplo de adição de código ao filme
    await update_film('tt0100270', 'Nosferatu');

    // Exemplo de adição de comentário para usuários já criados no banco de dados
    await create_review('tt0100270', 'iris@email.com', 'Iris', 1, 'Curti não!');
};

// Função para salvar as requisições
const save_film = async () => {
    // Exemplo de busca e adição de filme
    await search_save_film('Nosferatu');
};

save_film();

// Função para automatizar as atualizações de informações de filmes e avaliações
//automate_updates();
