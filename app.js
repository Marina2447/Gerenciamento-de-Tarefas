const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Conexão com o banco de dados
const db = mysql.createConnection({
  host: "localhost",   // Se estiver usando o MySQL local
  user: "root",        // Usuário do MySQL
  password: "admin",        // Senha do MySQL (deixe vazio se não tiver senha)
  database: "tarefas_industria" // O banco de dados que criamos
});

db.connect(err => {
  if (err) {
    console.error('Erro ao conectar no MySQL:', err);
    throw err;
  }
  console.log("Conectado ao MySQL!");
});

// Rota para listar usuários
app.get("/usuarios", (req, res) => {
  db.query("SELECT * FROM usuarios", (err, result) => {
    if (err) {
      console.error("Erro ao listar usuários:", err);
      return res.status(500).json({ error: "Erro ao listar usuários" });
    }
    res.json(result);
  });
});

// Rota para cadastrar usuário
app.post("/usuarios", (req, res) => {
  const { nome, email } = req.body;
  db.query("INSERT INTO usuarios (nome, email) VALUES (?, ?)", [nome, email], (err) => {
    if (err) {
      console.error("Erro ao cadastrar usuário:", err);
      return res.status(500).json({ error: "Erro ao cadastrar usuário" });
    }
    res.json({ success: true });
  });
});

// Rota para listar tarefas
app.get("/tarefas", (req, res) => {
  db.query("SELECT * FROM tarefas", (err, result) => {
    if (err) {
      console.error("Erro ao listar tarefas:", err);
      return res.status(500).json({ error: "Erro ao listar tarefas" });
    }
    res.json(result);
  });
});

// Rota para cadastrar tarefa
app.post("/tarefas", (req, res) => {
  const { usuario_id, setor, descricao, prioridade, status } = req.body;
  const dataCadastro = new Date().toISOString().split("T")[0];  // Formato de data: YYYY-MM-DD
  db.query("INSERT INTO tarefas (usuario_id, setor, descricao, prioridade, status, data_cadastro) VALUES (?, ?, ?, ?, ?, ?)",
    [usuario_id, setor, descricao, prioridade, status, dataCadastro],
    (err) => {
      if (err) {
        console.error("Erro ao cadastrar tarefa:", err);
        return res.status(500).json({ error: "Erro ao cadastrar tarefa" });
      }
      res.json({ success: true });
    }
  );
});

// Rota para excluir tarefa
app.delete("/tarefas/:id", (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM tarefas WHERE id = ?", [id], (err) => {
    if (err) {
      console.error("Erro ao excluir tarefa:", err);
      return res.status(500).json({ error: "Erro ao excluir tarefa" });
    }
    res.json({ success: true });
  });
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

