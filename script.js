// Base de dados real - sem localStorage
let usuarios = [];
let tarefas = [];

// Atualiza o <select> com os usuários cadastrados
function atualizarUsuarioSelect() {
  fetch("http://localhost:3000/usuarios")
    .then(res => res.json())
    .then(data => {
      usuarios = data;
      const select = document.getElementById("usuarioSelect");
      select.innerHTML = "";
      usuarios.forEach(usuario => {
        const option = document.createElement("option");
        option.value = usuario.id;
        option.textContent = `${usuario.nome} (${usuario.email})`;
        select.appendChild(option);
      });
    });
}

// Cadastra um novo usuário no banco
function cadastrarUsuario() {
  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;

  if (!nome || !email) return alert("Preencha todos os campos!");

  fetch("http://localhost:3000/usuarios", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, email })
  })
    .then(res => res.json())
    .then(() => {
      atualizarUsuarioSelect();
      document.getElementById("nome").value = "";
      document.getElementById("email").value = "";
    });
}

// Cadastra uma nova tarefa no banco
function cadastrarTarefa() {
  const usuarioId = document.getElementById("usuarioSelect").value;
  const setor = document.getElementById("setor").value;
  const descricao = document.getElementById("descricao").value;
  const prioridade = document.getElementById("prioridade").value;
  const status = document.getElementById("status").value;

  if (!setor || !descricao) return alert("Preencha todos os campos da tarefa!");

  const novaTarefa = {
    usuario_id: parseInt(usuarioId),
    setor,
    descricao,
    prioridade,
    status
  };

  fetch("http://localhost:3000/tarefas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(novaTarefa)
  })
    .then(res => res.json())
    .then(() => {
      mostrarTarefas();
      document.getElementById("setor").value = "";
      document.getElementById("descricao").value = "";
    });
}

// Busca tarefas do banco e exibe na tela
function mostrarTarefas() {
  fetch("http://localhost:3000/tarefas")
    .then(res => res.json())
    .then(data => {
      tarefas = data;
      const container = document.getElementById("tarefas");
      container.innerHTML = "";

      tarefas.forEach(tarefa => {
        const usuario = usuarios.find(u => u.id === tarefa.usuario_id);

        const div = document.createElement("div");
        div.className = "tarefa";
        div.innerHTML = `
          <strong>${tarefa.descricao}</strong><br>
          👤 ${usuario ? usuario.nome : "Usuário removido"}<br>
          🏭 Setor: ${tarefa.setor}<br>
          🔥 Prioridade: ${tarefa.prioridade}<br>
          📅 Data: ${new Date(tarefa.data_cadastro).toLocaleDateString()}<br>
          ✅ Status: ${tarefa.status}<br>
          <button onclick="excluirTarefa(${tarefa.id})">🗑️ Excluir</button>
        `;
        container.appendChild(div);
      });
    });
}

// Exclui uma tarefa do banco
function excluirTarefa(id) {
  if (confirm("Deseja excluir esta tarefa?")) {
    fetch(`http://localhost:3000/tarefas/${id}`, {
      method: "DELETE"
    })
      .then(res => res.json())
      .then(() => {
        mostrarTarefas();
      });
  }
}

// Inicializa a aplicação
atualizarUsuarioSelect();
mostrarTarefas();

