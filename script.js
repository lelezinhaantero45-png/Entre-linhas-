
// ==================================
// ENTRE LINHAS - SUPABASE
// ==================================

const SUPABASE_URL = "https://tkqmtazapyfgdamsnbrk.supabase.co";

const SUPABASE_KEY = "sb_publishable_n_ZhqyoxENlKwFxCMw2Y6g_gAOUNByl";

const db = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

// ==================================
// NAVEGAÇÃO
// ==================================

window.abrirLogin = function() {
  document.getElementById("paginaInicial").hidden = true;
  document.getElementById("paginaCadastro").hidden = true;
  document.getElementById("paginaLogin").hidden = false;
  document.getElementById("paginaDiario").hidden = true;
};

window.abrirCadastro = function() {
  document.getElementById("paginaInicial").hidden = true;
  document.getElementById("paginaLogin").hidden = true;
  document.getElementById("paginaCadastro").hidden = false;
  document.getElementById("paginaDiario").hidden = true;
};

window.voltarInicio = function() {
  document.getElementById("paginaCadastro").hidden = true;
  document.getElementById("paginaLogin").hidden = true;
  document.getElementById("paginaDiario").hidden = true;
  document.getElementById("paginaInicial").hidden = false;
};

// ==================================
// CADASTRO
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

  botao.disabled = true;
  botao.textContent = "Criando seu espaço...";
  mensagem.textContent = "Estamos preparando seu diário...";

  try {

    const { error } = await db.auth.signUp({
      email: email,
      password: senha,
      options: {
        emailRedirectTo: "https://lelezinhaantero45-png.github.io/Entre-linhas-/",

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

// ==================================
// LOGIN
// ==================================

document.getElementById("loginForm")
.addEventListener("submit", async function(event) {

  event.preventDefault();

  const email = document.getElementById("loginEmail").value.trim();
  const senha = document.getElementById("loginSenha").value;

  const mensagem = document.getElementById("mensagemLogin");
  const botao = this.querySelector('button[type="submit"]');

  botao.disabled = true;
  botao.textContent = "Entrando...";
  mensagem.textContent = "Preparando seu diário...";

  try {

    const { data, error } = await db.auth.signInWithPassword({
      email: email,
      password: senha
    });

    if (error) {
      throw error;
    }

    const { data: perfil, error: perfilError } = await db
      .from("profiles")
      .select("nickname")
      .eq("id", data.user.id)
      .single();

    if (perfilError) {
      console.error("Erro ao buscar perfil:", perfilError);
    }

    document.getElementById("paginaInicial").hidden = true;
    document.getElementById("paginaCadastro").hidden = true;
    document.getElementById("paginaLogin").hidden = true;
    document.getElementById("paginaDiario").hidden = false;

    document.getElementById("nomeUsuario").textContent =
      perfil?.nickname || "visitante";

    mensagem.textContent = "";

    this.reset();

  } catch (error) {

    console.error("Erro no login:", error);

    mensagem.textContent =
      "Não foi possível entrar. Confira seu e-mail e senha.";

  } finally {

    botao.disabled = false;
    botao.textContent = "Entrar no meu diário";

  }

});

// ==================================
// SAIR DA CONTA
// ==================================

window.sairDiario = async function() {

  const { error } = await db.auth.signOut();

  if (error) {
    alert("Não foi possível sair da conta.");
    return;
  }

  voltarInicio();

};

// ==================================
// SALVAR ANOTAÇÃO NO SUPABASE
// ==================================

window.salvarTexto = async function() {

  const texto = document.getElementById("textoDiario").value.trim();

  if (!texto) {
    alert("Escreva alguma coisa antes de guardar. 💜");
    return;
  }

  const { data: usuarioData, error: usuarioError } =
    await db.auth.getUser();

  if (usuarioError || !usuarioData.user) {
    alert("Você precisa entrar na sua conta novamente.");
    return;
  }

  const botao = document.querySelector("#paginaDiario .bloco-diario button");

  botao.disabled = true;
  botao.textContent = "Guardando...";

  try {

    const { error } = await db
      .from("entries")
      .insert({
        user_id: usuarioData.user.id,
        content: texto,
        visibility: "private"
      });

    if (error) {
      throw error;
    }

    document.getElementById("textoDiario").value = "";

    alert("Sua anotação foi guardada com carinho. 💜");

  } catch (error) {

    console.error("Erro ao salvar:", error);

    alert("Não foi possível guardar sua anotação. Tente novamente.");

  } finally {

    botao.disabled = false;
    botao.textContent = "Guardar no meu diário";

  }

};

