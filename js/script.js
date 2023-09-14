const inputText = document.querySelector("#text");
const inputLang = document.querySelector("#lang");
const inputTone = document.querySelector("#tone");
const inputSubmit = document.querySelector("#submit");
const resultBox = document.querySelector("#result-box");
const resultText = document.querySelector("#result-ai");

inputSubmit.addEventListener("click", async (e) => {
    e.preventDefault();
    if (!inputText || inputText.value.trim() == "") return;
    if (!inputLang || inputLang.value.trim() == "") return;
    if (!inputTone || inputTone.value.trim() == "") return;

    let texto = inputText.value;
    let lingua = inputLang.value;
    let tom = inputTone.value;

    let resposta = await askAi(texto, lingua, tom);
    renderizaResposta(resposta);
})

async function askAi(texto, lingua, tom) {

    const apiKey = "sk-*****************************";
    const messages = generatePrompt(texto, lingua, tom);

    iniciaCarregamento();
    const res = await fetch(
        'https://api.openai.com/v1/chat/completions', {
        method: "POST",
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo-16k",
            messages,
            temperature: 0.2,
            max_tokens: 500,
        }),
    });
    const json = await res.json();

    interrompeCarregamento();
    let response = json.choices[0].message;
    return response.role === 'assistant' ? response.content : null;
}

function generatePrompt(text, lang = "english", tone = "standart") {
    console.log(tone);
    return [
        { role: 'system', content: `You will be provided with words, statements or texts in any language, and your task is to traslate it and convert them to ${tone} ${lang}.` },
        { role: 'user', content: text },
    ];
}

function renderizaResposta(resposta) {
    resultText.innerHTML = resposta;
    resultBox.style.display = "block";
}

function copiaResposta() {
    navigator.clipboard.writeText(resultText.textContent);

    var tooltip = document.getElementById("myTooltip");
    tooltip.innerHTML = "Copiado!";
}

function outFunc() {
    var tooltip = document.getElementById("myTooltip");
    tooltip.innerHTML = "Copiar";
}

function renderizaSelects() {
    const linguas = [
        ["english", "Inglês"],
        ["spanish", "Espanhol"],
        ["portuguese", "Português"],
        ["french", "Francês"],
        ["german", "Alemão"],
        ["mandarin", "Mandarim"],
        ["arabic", "Árabe"]
    ];

    const tonalidade = ["standart"];

    linguas.forEach(lingua => {
        const opcaoLingua = document.createElement("option");
        opcaoLingua.value = lingua[0];
        opcaoLingua.innerText = lingua[1];
        inputLang.append(opcaoLingua);
    });

    tonalidade.forEach(tom => {
        const opcaoTom = document.createElement("option");
        opcaoTom.value = tom;
        opcaoTom.innerText = tom.charAt(0).toUpperCase() + tom.slice(1);
        inputTone.append(opcaoTom);
    });


}

renderizaSelects();


function iniciaCarregamento() {
    let deg = 0;
    const loadIcon = document.getElementById("loading");
    loadIcon.style.display = "block";
    setInterval(() => {
        loadIcon.style.transform = `rotate(${deg++}deg)`;
    }, 1)
}

function interrompeCarregamento() {
    const loadIcon = document.getElementById("loading");
    loadIcon.style.display = "none";
    clearInterval()
}