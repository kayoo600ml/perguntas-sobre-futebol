let perguntas = [
  {
    pergunta: "qual e o pais de origem o futbol moderno?",
    opcoes: [
      "Brasil",
      "Inglatera",
      "Espanha",
      "Italia"
    ],
    correta: 2
  },
  {
    pergunta: "Quantos jogadores cada equipe tem em campo durante uma partida de futbol?",
    opcoes: [
      "9",
      "10",
      "11",
      "12"
    ],
    correta: 3
  },
  {
    pergunta: "Qual é o principal objetivo em um jogo de futbol?",
    opcoes: [
      "Marcar mais gols que o adiversario",
      "Defender a propria meta",
      "Manter o passe de bola o tempo todo",
      "Evitar falta"
    ],
    correta: 1
  },
  {
    pergunta: "Qual é o nome da competição mais famosa de clubes de futebol do mundo?",
    opcoes: [
      "Copa América",
      "Liga do campeões da UEFA",
      "Copa do mundo",
      "Copa libertadores"
    ],
    correta: 2
  },
  {
    pergunta: "Quem e considerado um dos maiores jogadores de futebol de todos os tempos’?",
    opcoes: [
      "Pele",
      "Messi",
      "Maradona",
      "Todas as alternativas"
    ],
    correta: 4
  }
];

let perguntaAtual = 0;
let selecionado = -1;
let proxima = false;
let pontuacao = 0;
let tempo = 15;
let tempoInicio;
let nomeJogador = "";
let estado = "inicio";
let somAcerto, somErro;
let offset = 0;

function preload() {
  somAcerto = loadSound("acerto.mp3");
  somErro = loadSound("erro1.mp3");
}

function setup() {
  createCanvas(750, 500);
  textSize(18);
  textAlign(LEFT, TOP);
}

function draw() {
  desenharFundoAnimado();

  if (estado === "inicio") {
    fill(0);
    textSize(24);
    text("Digite seu nome para começar:", 180, 200);
    textSize(20);
    text(nomeJogador, 180, 240);
  } else if (estado === "jogo") {
    jogarQuiz();
  } else if (estado === "fim") {
    mostrarResultado();
  }
}

function desenharFundoAnimado() {
  background(135, 206, 250);

  fill(255, 223, 0);
  ellipse(80, 80, 80);

  noStroke();
  fill(34, 139, 34);
  ellipse(200, 500, 600, 300);
  ellipse(550, 500, 700, 400);

  fill(100);
  rect(600, 300, 40, 200);
  rect(650, 270, 30, 230);
  rect(700, 320, 50, 180);

  fill(255, 204, 153);
  rect(100, 300, 80, 80);
  fill(150, 75, 0);
  triangle(90, 300, 140, 250, 190, 300);

  offset += 0.05;
  for (let i = 0; i < 10; i++) {
    let x = 50 + i * 70;
    let y = 120 + sin(offset + i) * 10;
    fill((i * 40) % 255, 100, 200);
    triangle(x, y, x + 15, y + 20, x - 15, y + 20);
  }
}

function jogarQuiz() {
  if (perguntaAtual < perguntas.length) {
    let q = perguntas[perguntaAtual];

    let tempoRestante = tempo - int((millis() - tempoInicio) / 1000);
    tempoRestante = max(tempoRestante, 0);

    fill(255, 100, 100);
    let largura = map(tempoRestante, 0, tempo, 0, width - 100);
    rect(50, 30, largura, 20);
    fill(0);
    text("Tempo: " + tempoRestante + "s", 50, 5);
    text("Pontuação: " + pontuacao, 600, 5);
    text("Jogador: " + nomeJogador, 50, 60);

    if (tempoRestante === 0 && !proxima) {
      proxima = true;
      somErro.play();
    }

    text(q.pergunta, 50, 100, 650);
    for (let i = 0; i < q.opcoes.length; i++) {
      if (selecionado === i) {
        fill(i === q.correta ? color(0, 200, 0) : color(200, 0, 0));
      } else {
        fill(255);
      }
      stroke(0);
      rect(50, 170 + i * 50, 650, 40);
      fill(0);
      text(q.opcoes[i], 60, 180 + i * 50);
    }

    if (proxima) {
      fill(0);
      text("Clique para continuar...", 50, 430);
    }
  } else {
    estado = "fim";
  }
}

function mostrarResultado() {
  background(210);
  textAlign(CENTER, CENTER);
  textSize(24);
  fill(0, 100, 0);
  text(`Parabéns, ${nomeJogador}!`, width / 2, 150);
  text("Você terminou o quiz!", width / 2, 190);
  text("Pontuação final: " + pontuacao + " pontos 🎉", width / 2, 230);
  textSize(18);
  text("Clique para baixar seu resultado.", width / 2, 290);
}

function keyPressed() {
  if (estado === "inicio") {
    if (keyCode === ENTER) {
      if (nomeJogador.trim() !== "") {
        estado = "jogo";
        tempoInicio = millis();
      }
    } else if (keyCode === BACKSPACE) {
      nomeJogador = nomeJogador.slice(0, -1);
    } else {
      nomeJogador += key;
    }
  }
}

function mousePressed() {
  if (estado === "jogo") {
    if (proxima) {
      perguntaAtual++;
      selecionado = -1;
      proxima = false;
      tempoInicio = millis();
    } else {
      for (let i = 0; i < 4; i++) {
        if (mouseY > 170 + i * 50 && mouseY < 210 + i * 50) {
          selecionado = i;
          if (i === perguntas[perguntaAtual].correta) {
            pontuacao += 10;
            somAcerto.play();
          } else {
            somErro.play();
          }
          proxima = true;
        }
      }
    }
  } else if (estado === "fim") {
    salvarResultado();
  }
}

function salvarResultado() {
  let texto = `Jogador: ${nomeJogador}\nPontuação final: ${pontuacao} pontos\nConexão Campo-Cidade - Quiz`;
  saveStrings([texto], "resultado_quiz.txt");
}
