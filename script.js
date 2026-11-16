// ==================================
// ENTRE LINHAS - CONEXÃO SUPABASE
// ==================================

const SUPABASE_URL = "https://tkqmtazapyfgdamsnbrk.supabase.co";

// Cole sua Publishable Key entre as aspas:
const SUPABASE_KEY = "sb_publishable_n_ZhqyoxENlKwFxCMw2Y6g_gAOUNByl";

const db = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

// ==================================
// NAVEGAÇÃO
// ==================================

window.entrar = function() {
  document.getElementById("paginaInicial").hidden = true;
  document.getElementById("paginaCadastro").hidden = false;
  document.getElementById("paginaDiario").hidden = true;
};

window.voltarInicio = function() {
  document.getElementById("paginaCadastro").hidden = true;
  document.getElementById("paginaDiario").hidden = true;
  document.getElementById("paginaInicial").hidden = false;
};

// ==================================
// CADASTRO REAL
// ==================================

document.getElementById("cadastroForm")
.addEventListener("submit", async function(event) {

  event.preventDefault();

  const apelido = document.getElementById("apelido").value.trim();
  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value;
  const confirmar = document.getElementById("confirmarSenha").value;

  const mensagem = document.getElementById("mensagem");
  const botao = this.querySelector('button[type="submit"]');

  if (apelido.length < 3 || apelido.length > 20) {
    mensagem.textContent = "O apelido deve ter entre 3 e 20 caracteres.";
    return;
  }

  if (senha.length < 8) {
    mensagem.textContent = "A senha precisa ter pelo menos 8 caracteres.";
    return;
  }

  if (senha !== confirmar) {
    mensagem.textContent = "As senhas não são iguais.";
    return;
  }

  if (!window.supabase) {
    mensagem.textContent = "A biblioteca do Supabase não carregou.";
    return;
  }

  botao.disabled = true;
  botao.textContent = "Criando seu espaço...";
  mensagem.textContent = "Estamos preparando seu diário...";

  try {

    const { data, error } = await db.auth.signUp({
      email: email,
      password: senha,
      options: {
        data: {
          nickname: apelido
        }
      }
    });

    if (error) {
      throw error;
    }

    mensagem.textContent =
      "Conta criada! Verifique seu e-mail para confirmar o cadastro. 💜";

    this.reset();

  } catch (error) {

    console.error("Erro no cadastro:", error);

    mensagem.textContent =
      "Não foi possível criar a conta. Verifique os dados e tente novamente.";

  } finally {

    botao.disabled = false;
    botao.textContent = "Criar meu espaço";

  }

});
