# Passo a passo para configuração de pacotes, execução dos códigos e tabelas do banco de dados

## 1. Instalação do Node.js
1.1 Primeiramente verificar se o Node.js e o NPM estão instalados:
    '''bash
    node -v
    npm -v
     '''

Caso seja necessário o download: https://nodejs.org/pt/download

## 2. Instalação do MySQL
 2.1 Acesse o MySQL via terminal:
   '''bash
   mysql -u root -p
   '''

2.2 Crie o banco de dados:
   '''sql
   CREATE DATABASE sys;

 ## 3. Configuração das tabelas no Banco de Dados

3.1 Acesse o MySQL e crie a tabela:
## Tabela de filmes e informações
'''sql
USE sys;
CREATE TABLE 'film' (
  'film_id' varchar(30) NOT NULL,
  'title' varchar(45) NOT NULL,
  'year' varchar(5) NOT NULL,
  'genre' varchar(45) NOT NULL,
  'director' varchar(45) NOT NULL,
  'plot' varchar(300) DEFAULT NULL,
  'cast' varchar(300) DEFAULT NULL,
  PRIMARY KEY ('film_id')
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
'''

## Tabela de usuários
'''sql
CREATE TABLE 'user' (
  'user_id' int NOT NULL AUTO_INCREMENT,
  'name' varchar(45) NOT NULL,
  'email' varchar(45) NOT NULL,
  PRIMARY KEY ('user_id')
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
'''
## Tabela de avaliações
'''sql
CREATE TABLE 'review' (
  'note_id' int NOT NULL AUTO_INCREMENT,
  'user_id' int NOT NULL,
  'rating' int NOT NULL,
  'comment' varchar(200) NOT NULL,
  'film_id' varchar(30) NOT NULL,
  'reviewer_name' varchar(45) NOT NULL,
  PRIMARY KEY ('note_id'),
  KEY 'user_id_idx' ('user_id'),
  KEY 'film_id_idx' ('film_id'),
  CONSTRAINT 'film_id' FOREIGN KEY ('film_id') REFERENCES 'film' ('film_id'),
  CONSTRAINT 'user_id' FOREIGN KEY ('user_id') REFERENCES 'user' ('user_id')
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
'''

## 4. Configuração do Projeto Node.js

4.1 Inicialize o projeto Node.js:
   '''bash
   npm init -y
   '''

Lembrando que será necessário criar o arquivo .env com as informações a seguir, de acordo com as suas credenciais do banco de dados.

DB_HOST=localhost
DB_USER=root ## Usuário padrão
DB_PASSWORD=xxxx ## Senha definida no download do MySql
DB_NAME=sys ## Nome do seu banco de dados criado
OMDB_API_KEY=xxxx ## Chave recebida através da API que foi fornecida para o teste

## 5. Testando automação

5.1 Função para atualizar e procurar filmes
## Para adicionar um novo filme no banco de dados, vá na function 'automate_updates' e edite a function 'search_save_film('NOME DO FILME')'

## Para atualizar um filme no banco de dados, vá na function 'automate_updates' e edite a function 'update_film('ID FILME IMDB', 'NOME DO FILME');'

## Para adicionar um novo comentário/avaliação no banco de dados, vá na function 'automate_updates' e edite a function 'create_review('ID DO FILME IMDB', 'EMAIL USUÁRIO', 'NOME DO USUÁRIO', NOTA, 'COMENTÁRIO');'
Obs.: O identificar do usuário é o email, permitindo a criação de um usuário novo a cada e-mail não encontrado no banco de dados.

const automate_updates = async () => {
    // Exemplo de busca e adição de filme
    await search_save_film('Inception');

    // Exemplo de adição de código ao filme
    await update_film('tt1375666', 'Inception');

    // Exemplo de adição de comentário para usuários já criados no banco de dados
    await create_review('tt1375666', 'joao@email.com', 'João', 9, 'Excelente filme!');
};

5.2 Função para executar automação e alterações
## No terminal, execute:
  ''' bash
   node server.js
   '''

## 6. Melhorias e propostas de evolução do projeto

Para uma melhor experiência do usuário, o próximo passo seria a criação de um servidor local host, para a implementação do Front-End.
Além disso, para a melhoria do código em si, seria fazer a busca do ID só com o nome do filme, facilitando a busca e registro da avaliação feita.
Aumentar a quantidade de dados recolhida do usuário, colocar o CPF como identificador único e permitir a criação de contas autenticadas, 
com a implementação de cadastros e atualizações de dados do próprio usuário.

