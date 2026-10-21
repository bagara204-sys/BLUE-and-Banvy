function cadastro() {
const usuario = prompt("Crie seu usuário:");
const senha = prompt("Crie sua senha:");

if (!usuario || !senha) {
    alert("Preencha seu usuário e sua senha.");
    return;
}

localStorage.setItem("usuario", usuario);
localStorage.setItem("senha", senha);

alert("Cadastro realizado!");

}

function login() {
const usuario = document.getElementById("usuario").value;
const senha = document.getElementById("senha").value;

if (
    usuario === localStorage.getItem("usuario") &&
    senha === localStorage.getItem("senha")
) {
    window.location.href = "home.html";
} else {
    alert("Usuário ou senha incorretos.");
}

}

function logout() {
window.location.href = "index.html";
}

/* TRANSCRIÇÃO DA AULA */

let recognition = null;

function iniciarGravacao() {
const SpeechRecognition =
window.SpeechRecognition ||
window.webkitSpeechRecognition;

if (!SpeechRecognition) {
    alert("Seu navegador não oferece suporte à transcrição por voz. Tente usar o Chrome.");
    return;
}

if (recognition) {
    recognition.stop();
}

recognition = new SpeechRecognition();
recognition.lang = "pt-BR";
recognition.continuous = true;
recognition.interimResults = true;

recognition.onresult = function (event) {
    let textoFinal = "";
    let textoParcial = "";

    for (let i = 0; i < event.results.length; i++) {
        const transcricao = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
            textoFinal += transcricao + " ";
        } else {
            textoParcial += transcricao;
        }
    }

    const campo = document.getElementById("textoAula");

    campo.value = textoFinal + textoParcial;
};

recognition.onerror = function () {
    alert("Não foi possível continuar a transcrição. Verifique a permissão do microfone.");
};

recognition.start();

}

function pararGravacao() {
if (recognition) {
recognition.stop();
recognition = null;
}
}

/* AGENTE BLUE */

/*
A API será conectada pelo servidor.
Não coloque a chave secreta da API neste arquivo.
*/

async function gerarEstudo() {
const campo = document.getElementById("textoAula");
const resultado = document.getElementById("resultado");
const botao = document.getElementById("btnGerar");

const texto = campo.value.trim();

if (!texto) {
    resultado.textContent =
        "Primeiro, grave a aula ou insira uma transcrição.";
    return;
}

botao.disabled = true;
botao.textContent = "⏳ Preparando seu material...";
resultado.textContent = "O BLUE está preparando o resumo e o mapa mental.";

try {
    /*
    IMPORTANTE:
    O servidor precisa estar publicado para esta função funcionar.
    Substituiremos este endereço pelo endereço real na próxima etapa.
    */

    const ENDERECO_SERVIDOR =
        "https://SEU-SERVIDOR-AINDA-NAO-CONFIGURADO";

    const resposta = await fetch(
        ENDERECO_SERVIDOR + "/gerar-estudo",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                texto: texto
            })
        }
    );

    const dados = await resposta.json();

    if (!resposta.ok) {
        throw new Error(
            dados.erro || "Não foi possível gerar o material."
        );
    }

    exibirEstudo(dados.resultado);

} catch (erro) {
    resultado.textContent =
        "A conexão com a inteligência artificial ainda não está configurada. Vamos concluir a instalação do servidor na próxima etapa.";
} finally {
    botao.disabled = false;
    botao.textContent = "✨ Gerar resumo e mapa mental";
}

}

/* EXIBIR RESUMO E MAPA MENTAL */

function exibirEstudo(texto) {
const resultado = document.getElementById("resultado");

resultado.replaceChildren();

const titulo = document.createElement("h2");
titulo.textContent = "📚 Material de estudo";
resultado.appendChild(titulo);

const conteudo = document.createElement("pre");
conteudo.textContent = texto;
conteudo.style.whiteSpace = "pre-wrap";
conteudo.style.overflowWrap = "anywhere";

resultado.appendChild(conteudo);

}

/* MAPA MENTAL LOCAL DE DEMONSTRAÇÃO */

function gerarMapa() {
const campo = document.getElementById("textoAula");
const resultado = document.getElementById("resultado");
const texto = campo.value.trim();

if (!texto) {
    resultado.textContent = "Primeiro, insira uma transcrição.";
    return;
}

resultado.replaceChildren();

const titulo = document.createElement("h3");
titulo.textContent = "🧠 Mapa mental da transcrição";
resultado.appendChild(titulo);

const centro = document.createElement("div");
centro.className = "centro";
centro.textContent = "Tema principal";
resultado.appendChild(centro);

const frases = texto
    .split(/[.!?]+/)
    .map(frase => frase.trim())
    .filter(Boolean)
    .slice(0, 15);

frases.forEach(frase => {
    const ramo = document.createElement("div");
    ramo.className = "ramo";

    const caixa = document.createElement("div");
    caixa.className = "caixa";
    caixa.textContent = frase;

    ramo.appendChild(caixa);
    resultado.appendChild(ramo);
});

}

/* EXPORTAR PDF */

function gerarPDF() {
if (!window.jspdf) {
alert("Não foi possível carregar a ferramenta de PDF.");
return;
}

const { jsPDF } = window.jspdf;
const doc = new jsPDF();

const texto = document.getElementById("resultado").innerText;

if (!texto.trim()) {
    alert("Gere o material antes de exportar.");
    return;
}

const linhas = doc.splitTextToSize(texto, 180);
let y = 20;

linhas.forEach(linha => {
    if (y > 275) {
        doc.addPage();
        y = 20;
    }

    doc.text(linha, 10, y);
    y += 7;
});

doc.save("Material_de_Estudo_BLUE.pdf");

}
