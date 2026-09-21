/**
 * app.js — AccessQuiz: Jogo de Acessibilidade
 *
 * API externa: Open Trivia Database (https://opentdb.com)
 * - Endpoint: https://opentdb.com/api.php
 * - Categoria 18 = "Science: Computers" (inclui TI, web, boas práticas)
 * - Gratuita, sem chave de acesso
 *
 * Funcionalidades:
 * - Quiz com 10 perguntas por rodada
 * - Timer de 30s por pergunta
 * - Pontuação com bônus por velocidade
 * - Revisão completa das respostas
 * - Persistência de recorde no localStorage
 * - Alto contraste + ajuste de fonte (acessibilidade)
 */

/* ============================================================
   1. CONFIGURAÇÃO
   ============================================================ */

const CONFIG = {
  TOTAL_QUESTIONS: 10,
  TIMER_SECONDS:   30,

  /*
   * Banco de perguntas em português sobre acessibilidade web.
   * A API Open Trivia DB só tem perguntas em inglês,
   * por isso usamos este banco local como fonte principal.
   * A API ainda é consultada como bônus (fallback reverso),
   * mas o jogo funciona 100% offline com estas perguntas.
   *
   * Dificuldades: 'easy' | 'medium' | 'hard'
   */
  LOCAL_QUESTIONS: [

    /* ── FÁCEIS ─────────────────────────────────────── */
    {
      question: 'O que significa a sigla WCAG?',
      correct_answer: 'Diretrizes de Acessibilidade para Conteúdo Web',
      incorrect_answers: [
        'Guia de Código Web Acessível',
        'Grupo de Acesso a Conteúdo Mundial',
        'Objetivo de Conformidade e Acessibilidade Web',
      ],
      difficulty: 'easy',
    },
    {
      question: 'Para que serve o atributo "alt" em uma imagem HTML?',
      correct_answer: 'Descrever a imagem para leitores de tela e quando ela não carrega',
      incorrect_answers: [
        'Definir o tamanho da imagem',
        'Melhorar o carregamento da página',
        'Adicionar uma legenda visível abaixo da imagem',
      ],
      difficulty: 'easy',
    },
    {
      question: 'Qual elemento HTML identifica o conteúdo principal de uma página?',
      correct_answer: '<main>',
      incorrect_answers: ['<div id="conteudo">', '<section>', '<body>'],
      difficulty: 'easy',
    },
    {
      question: 'Para que serve o elemento <label> em formulários?',
      correct_answer: 'Associar um texto descritivo a um campo de formulário',
      incorrect_answers: [
        'Criar um campo de texto editável',
        'Agrupar vários campos relacionados',
        'Definir o valor padrão de um campo',
      ],
      difficulty: 'easy',
    },
    {
      question: 'Qual tag HTML define a área de navegação principal do site?',
      correct_answer: '<nav>',
      incorrect_answers: ['<menu>', '<header>', '<ul>'],
      difficulty: 'easy',
    },
    {
      question: 'O que é um leitor de tela?',
      correct_answer: 'Software que lê o conteúdo da tela em voz alta para pessoas com deficiência visual',
      incorrect_answers: [
        'Um programa que amplia o conteúdo da tela',
        'Um dispositivo que converte texto em Braille fisicamente',
        'Uma extensão que verifica erros de ortografia',
      ],
      difficulty: 'easy',
    },
    {
      question: 'O que é acessibilidade web?',
      correct_answer: 'Garantir que sites e aplicações possam ser usados por todas as pessoas, incluindo com deficiências',
      incorrect_answers: [
        'Tornar sites mais rápidos para conexões lentas',
        'Adaptar sites para dispositivos móveis',
        'Traduzir sites para diferentes idiomas',
      ],
      difficulty: 'easy',
    },
    {
      question: 'Qual elemento HTML agrupa campos de formulário relacionados e permite adicionar um título ao grupo?',
      correct_answer: '<fieldset> e <legend>',
      incorrect_answers: ['<div> e <h3>', '<section> e <h2>', '<form> e <title>'],
      difficulty: 'easy',
    },
    {
      question: 'Imagens decorativas (sem informação) devem ter o atributo alt com qual valor?',
      correct_answer: 'alt="" (string vazia)',
      incorrect_answers: ['alt="imagem"', 'alt="decorativo"', 'Sem o atributo alt'],
      difficulty: 'easy',
    },
    {
      question: 'Quais são os quatro princípios fundamentais do WCAG?',
      correct_answer: 'Perceptível, Operável, Compreensível e Robusto',
      incorrect_answers: [
        'Visível, Acessível, Navegável e Seguro',
        'Rápido, Bonito, Simples e Funcional',
        'Semântico, Responsivo, Inclusivo e Adaptável',
      ],
      difficulty: 'easy',
    },
    {
      question: 'O que é o "foco" em acessibilidade web?',
      correct_answer: 'O destaque visual que indica qual elemento está selecionado durante a navegação por teclado',
      incorrect_answers: [
        'O centro visual da página',
        'A área de maior destaque no layout',
        'O primeiro elemento carregado na página',
      ],
      difficulty: 'easy',
    },
    {
      question: 'Qual atributo ARIA informa ao leitor de tela o rótulo de um elemento sem texto visível?',
      correct_answer: 'aria-label',
      incorrect_answers: ['aria-title', 'aria-name', 'aria-text'],
      difficulty: 'easy',
    },
    {
      question: 'Por que é importante usar cores com contraste suficiente no texto?',
      correct_answer: 'Para que pessoas com baixa visão ou daltonismo consigam ler o conteúdo',
      incorrect_answers: [
        'Para deixar o site mais bonito visualmente',
        'Para melhorar o desempenho do site',
        'Para facilitar a indexação pelo Google',
      ],
      difficulty: 'easy',
    },
    {
      question: 'O que é um "skip link" (link de pulo)?',
      correct_answer: 'Um link que permite ao usuário de teclado ir direto ao conteúdo principal, pulando a navegação',
      incorrect_answers: [
        'Um link que abre em nova aba',
        'Um link que rola a página para o topo',
        'Um link que ignora validações de formulário',
      ],
      difficulty: 'easy',
    },
    {
      question: 'Qual tecla é universalmente usada para navegar entre elementos focáveis em uma página web?',
      correct_answer: 'Tab',
      incorrect_answers: ['Enter', 'Espaço', 'Seta para baixo'],
      difficulty: 'easy',
    },

    /* ── MÉDIAS ──────────────────────────────────────── */
    {
      question: 'Qual é a razão mínima de contraste de cor exigida pelo WCAG 2.1 nível AA para texto normal?',
      correct_answer: '4,5:1',
      incorrect_answers: ['3:1', '7:1', '2:1'],
      difficulty: 'medium',
    },
    {
      question: 'O atributo "tabindex=0" faz com que um elemento:',
      correct_answer: 'Seja incluído na ordem natural de foco do documento',
      incorrect_answers: [
        'Seja sempre o primeiro a receber foco',
        'Seja removido da ordem de foco',
        'Receba foco somente via JavaScript',
      ],
      difficulty: 'medium',
    },
    {
      question: 'Qual pseudo-classe CSS deve ser usada para estilizar o indicador de foco para usuários de teclado?',
      correct_answer: ':focus-visible',
      incorrect_answers: [':focus', ':active', ':hover'],
      difficulty: 'medium',
    },
    {
      question: 'O atributo HTML "aria-required=true" indica que:',
      correct_answer: 'O campo é obrigatório e leitores de tela devem anunciá-lo como tal',
      incorrect_answers: [
        'O campo não pode ser alterado pelo usuário',
        'O campo será validado automaticamente pelo navegador',
        'O campo só pode receber números',
      ],
      difficulty: 'medium',
    },
    {
      question: 'O que significa "tabindex=-1" em um elemento HTML?',
      correct_answer: 'O elemento pode receber foco via JavaScript mas não aparece na ordem de tabulação',
      incorrect_answers: [
        'O elemento não pode receber foco de forma alguma',
        'O elemento é o último na ordem de foco',
        'O elemento recebe foco antes de todos os outros',
      ],
      difficulty: 'medium',
    },
    {
      question: 'Qual atributo ARIA anuncia o estado aberto/fechado de um menu ou acordeão?',
      correct_answer: 'aria-expanded',
      incorrect_answers: ['aria-opened', 'aria-visible', 'aria-active'],
      difficulty: 'medium',
    },
    {
      question: 'O que é HTML semântico e por que é importante para acessibilidade?',
      correct_answer: 'Uso de elementos HTML com significado próprio (como <nav>, <main>, <article>) que ajudam leitores de tela a entender a estrutura',
      incorrect_answers: [
        'Código HTML com comentários detalhados para desenvolvedores',
        'HTML que segue regras rígidas de indentação',
        'HTML gerado automaticamente por ferramentas de design',
      ],
      difficulty: 'medium',
    },

    /* ── DIFÍCEIS ─────────────────────────────────────── */
    {
      question: 'Qual é o papel do atributo aria-live="assertive"?',
      correct_answer: 'Interrompe o leitor de tela imediatamente para anunciar a atualização de conteúdo dinâmico',
      incorrect_answers: [
        'Anuncia a atualização apenas quando o usuário para de interagir',
        'Oculta o conteúdo de leitores de tela',
        'Marca o elemento como de alta prioridade visualmente',
      ],
      difficulty: 'hard',
    },
    {
      question: 'Qual dos seguintes NÃO é um princípio do WCAG?',
      correct_answer: 'Adaptável',
      incorrect_answers: ['Perceptível', 'Operável', 'Compreensível'],
      difficulty: 'hard',
    },
    {
      question: 'Qual atributo ARIA deve ser usado para associar uma mensagem de erro a um campo de formulário?',
      correct_answer: 'aria-describedby',
      incorrect_answers: ['aria-errormessage', 'aria-label', 'aria-hint'],
      difficulty: 'hard',
    },
    {
      question: 'Qual nível do WCAG 2.1 exige que vídeos pré-gravados tenham audiodescrição?',
      correct_answer: 'AA',
      incorrect_answers: ['A', 'AAA', 'Nenhum nível exige'],
      difficulty: 'hard',
    },
    {
      question: 'O atributo "role=button" deve ser usado quando:',
      correct_answer: 'Um elemento não-interativo (como <div>) precisa se comportar como botão para leitores de tela',
      incorrect_answers: [
        'Substituir o elemento <button> nativo do HTML',
        'Adicionar estilo de botão a qualquer elemento',
        'Desabilitar o comportamento padrão de um botão',
      ],
      difficulty: 'hard',
    },
  ],
};

/* ============================================================
   2. ESTADO DO JOGO
   ============================================================ */

const state = {
  questions:       [],   // perguntas da rodada atual
  currentIndex:    0,    // índice da pergunta atual
  score:           0,    // pontuação acumulada
  correctCount:    0,    // acertos
  wrongCount:      0,    // erros
  answers:         [],   // histórico: { question, correct, chosen, wasCorrect }
  timerInterval:   null, // referência do setInterval do timer
  timeLeft:        CONFIG.TIMER_SECONDS,
  answered:        false,
  difficulty:      'medium',
};

/* ============================================================
   3. REFERÊNCIAS DOM
   ============================================================ */

const screens = {
  home:    document.getElementById('screen-home'),
  loading: document.getElementById('screen-loading'),
  quiz:    document.getElementById('screen-quiz'),
  result:  document.getElementById('screen-result'),
  error:   document.getElementById('screen-error'),
};

// Home
const bestScoreEl  = document.getElementById('best-score');
const totalGamesEl = document.getElementById('total-games');
const btnStart     = document.getElementById('btn-start');

// Quiz
const questionCounter   = document.getElementById('question-counter');
const progressBarTrack  = document.getElementById('progress-bar-track');
const progressBarFill   = document.getElementById('progress-bar-fill');
const currentScoreEl    = document.getElementById('current-score');
const timerValue        = document.getElementById('timer-value');
const questionCategory  = document.getElementById('question-category');
const questionText      = document.getElementById('question-heading');
const answersGrid       = document.getElementById('answers-grid');
const answerFeedback    = document.getElementById('answer-feedback');
const btnNext           = document.getElementById('btn-next');

// Resultado
const resultTrophy   = document.getElementById('result-trophy');
const resultTitle    = document.getElementById('result-title');
const resultMessage  = document.getElementById('result-message');
const resScore       = document.getElementById('res-score');
const resCorrect     = document.getElementById('res-correct');
const resWrong       = document.getElementById('res-wrong');
const resAccuracy    = document.getElementById('res-accuracy');
const reviewList     = document.getElementById('review-list');
const btnPlayAgain   = document.getElementById('btn-play-again');
const btnChangeDiff  = document.getElementById('btn-change-diff');

// Erro
const errorText  = document.getElementById('error-text');
const btnRetry   = document.getElementById('btn-retry');

// Acessibilidade
const btnContrast   = document.getElementById('btn-contrast');
const btnFontMinus  = document.getElementById('btn-font-minus');
const btnFontPlus   = document.getElementById('btn-font-plus');

/* ============================================================
   4. UTILITÁRIOS
   ============================================================ */

/** Mostra apenas a tela indicada */
function showScreen(name) {
  Object.entries(screens).forEach(([key, el]) => {
    if (key === name) el.classList.remove('hidden');
    else              el.classList.add('hidden');
  });
  // Foco acessível na nova tela
  requestAnimationFrame(() => {
    screens[name]?.focus?.();
    screens[name]?.querySelector('h1, h2, [tabindex="-1"]')?.focus?.();
  });
}

/** Decodifica entidades HTML da API (ex: &amp; → &) */
function decodeHtml(html) {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
}

/** Embaralha array in-place (Fisher-Yates) */
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** Calcula pontuação bônus por velocidade */
function calcScore(timeLeft, difficulty) {
  const base = { easy: 100, medium: 200, hard: 350 };
  const bonus = Math.floor(timeLeft * (difficulty === 'hard' ? 5 : difficulty === 'medium' ? 3 : 2));
  return (base[difficulty] ?? 200) + bonus;
}

/* ============================================================
   5. PERSISTÊNCIA (localStorage)
   ============================================================ */

function loadStats() {
  const best  = localStorage.getItem('aq_best_score');
  const games = parseInt(localStorage.getItem('aq_total_games') ?? '0', 10);
  bestScoreEl.textContent  = best !== null ? best : '—';
  totalGamesEl.textContent = games;
}

function saveStats(score) {
  const games = parseInt(localStorage.getItem('aq_total_games') ?? '0', 10) + 1;
  const best  = parseInt(localStorage.getItem('aq_best_score')  ?? '0', 10);
  localStorage.setItem('aq_total_games', games);
  if (score > best) localStorage.setItem('aq_best_score', score);
  loadStats();
}

/* ============================================================
   6. SELEÇÃO DE PERGUNTAS — banco local em português
   As perguntas são filtradas por dificuldade e embaralhadas.
   A Open Trivia DB retorna apenas inglês, então usamos o banco
   local como fonte principal para garantir português 100%.
   ============================================================ */

async function fetchQuestions(difficulty) {
  // Filtra pelo nível escolhido
  let pool = CONFIG.LOCAL_QUESTIONS.filter(q => q.difficulty === difficulty);

  // Se não tiver 10 perguntas no nível, completa com outros níveis
  if (pool.length < CONFIG.TOTAL_QUESTIONS) {
    const resto = CONFIG.LOCAL_QUESTIONS.filter(q => q.difficulty !== difficulty);
    pool = [...pool, ...shuffle([...resto])];
  }

  return shuffle([...pool])
    .slice(0, CONFIG.TOTAL_QUESTIONS)
    .map(q => ({ ...q, category: 'Acessibilidade Web' }));
}

/* ============================================================
   7. INÍCIO DO JOGO
   ============================================================ */

btnStart.addEventListener('click', startGame);

async function startGame() {
  // Lê dificuldade selecionada
  const diffInput = document.querySelector('input[name="difficulty"]:checked');
  state.difficulty = diffInput?.value ?? 'medium';

  // Reset do estado
  state.currentIndex = 0;
  state.score        = 0;
  state.correctCount = 0;
  state.wrongCount   = 0;
  state.answers      = [];
  clearTimer();

  showScreen('loading');

  // Pequeno delay para o loading aparecer antes de processar
  await new Promise(r => setTimeout(r, 400));

  const questions = await fetchQuestions(state.difficulty);
  state.questions = questions;
  showScreen('quiz');
  showQuestion();
}

/* ============================================================
   8. EXIBIÇÃO DE PERGUNTA
   ============================================================ */

function showQuestion() {
  const q = state.questions[state.currentIndex];
  if (!q) { endGame(); return; }

  state.answered = false;

  // Progresso
  const num = state.currentIndex + 1;
  questionCounter.textContent = `Pergunta ${num} de ${CONFIG.TOTAL_QUESTIONS}`;
  progressBarTrack.setAttribute('aria-valuenow', num);
  progressBarFill.style.width = `${(num / CONFIG.TOTAL_QUESTIONS) * 100}%`;

  // Pontuação
  currentScoreEl.textContent = state.score;

  // Categoria e pergunta
  questionCategory.textContent = q.category ?? 'Ciência da Computação';
  questionText.textContent = q.question;

  // Oculta feedback e botão próxima
  hide(answerFeedback);
  hide(btnNext);
  answerFeedback.className = 'answer-feedback hidden';

  // Monta alternativas embaralhadas
  const options = shuffle([q.correct_answer, ...q.incorrect_answers]);
  answersGrid.innerHTML = '';

  const labels = ['A', 'B', 'C', 'D'];
  options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'answer-btn';
    btn.type = 'button';
    btn.innerHTML = `<strong>${labels[i]})</strong> ${opt}`;
    btn.dataset.answer = opt;
    btn.setAttribute('aria-label', `Opção ${labels[i]}: ${opt}`);
    btn.addEventListener('click', () => handleAnswer(opt, btn, q));
    answersGrid.appendChild(btn);
  });

  // Inicia timer
  startTimer(q);

  // Foco na primeira alternativa (acessibilidade)
  requestAnimationFrame(() => answersGrid.querySelector('.answer-btn')?.focus());
}

/* ============================================================
   9. TIMER
   ============================================================ */

function startTimer(question) {
  clearTimer();
  state.timeLeft = CONFIG.TIMER_SECONDS;
  timerValue.textContent = state.timeLeft;
  timerValue.classList.remove('urgent');

  state.timerInterval = setInterval(() => {
    state.timeLeft--;
    timerValue.textContent = state.timeLeft;

    if (state.timeLeft <= 5) timerValue.classList.add('urgent');

    if (state.timeLeft <= 0) {
      clearTimer();
      handleTimeout(question);
    }
  }, 1000);
}

function clearTimer() {
  if (state.timerInterval) {
    clearInterval(state.timerInterval);
    state.timerInterval = null;
  }
}

/* ============================================================
   10. RESPOSTA DO USUÁRIO
   ============================================================ */

function handleAnswer(chosen, btn, question) {
  if (state.answered) return;
  state.answered = true;
  clearTimer();

  const isCorrect = chosen === question.correct_answer;

  // Registra no histórico
  state.answers.push({
    question: question.question,
    correct:  question.correct_answer,
    chosen,
    wasCorrect: isCorrect,
  });

  // Atualiza pontuação
  if (isCorrect) {
    state.score += calcScore(state.timeLeft, question.difficulty ?? state.difficulty);
    state.correctCount++;
    currentScoreEl.textContent = state.score;
  } else {
    state.wrongCount++;
  }

  // Marca visualmente as alternativas
  markAnswers(chosen, question.correct_answer);

  // Feedback textual acessível
  showFeedback(isCorrect, question.correct_answer);

  // Mostra botão "Próxima"
  show(btnNext);
  requestAnimationFrame(() => btnNext.focus());
}

function handleTimeout(question) {
  if (state.answered) return;
  state.answered = true;
  state.wrongCount++;

  state.answers.push({
    question: question.question,
    correct:  question.correct_answer,
    chosen:   null,
    wasCorrect: false,
  });

  // Desabilita alternativas
  answersGrid.querySelectorAll('.answer-btn').forEach(b => {
    b.disabled = true;
    if (b.dataset.answer === question.correct_answer) b.classList.add('correct');
  });

  // Feedback de tempo esgotado
  answerFeedback.className = 'answer-feedback feedback-timeout';
  answerFeedback.innerHTML = `<span aria-hidden="true">⏰</span> Tempo esgotado! A resposta correta era: <strong>${question.correct_answer}</strong>`;
  show(answerFeedback);

  show(btnNext);
  requestAnimationFrame(() => btnNext.focus());
}

function markAnswers(chosen, correct) {
  answersGrid.querySelectorAll('.answer-btn').forEach(btn => {
    btn.disabled = true;
    const val = btn.dataset.answer;
    if (val === correct) {
      btn.classList.add('correct');
      btn.setAttribute('aria-label', `${btn.getAttribute('aria-label')} — Resposta correta`);
    } else if (val === chosen) {
      btn.classList.add('wrong');
      btn.setAttribute('aria-label', `${btn.getAttribute('aria-label')} — Resposta errada`);
    }
  });
}

function showFeedback(isCorrect, correctAnswer) {
  if (isCorrect) {
    answerFeedback.className = 'answer-feedback feedback-correct';
    const points = calcScore(state.timeLeft, state.difficulty);
    answerFeedback.innerHTML = `<span aria-hidden="true">✅</span> Correto! +${points} pontos`;
  } else {
    answerFeedback.className = 'answer-feedback feedback-wrong';
    answerFeedback.innerHTML = `<span aria-hidden="true">❌</span> Errado. A resposta certa era: <strong>${correctAnswer}</strong>`;
  }
  show(answerFeedback);
}

function hide(el) { el.classList.add('hidden'); }
function show(el) { el.classList.remove('hidden'); }

/* ============================================================
   11. PRÓXIMA PERGUNTA
   ============================================================ */

btnNext.addEventListener('click', () => {
  state.currentIndex++;
  if (state.currentIndex >= state.questions.length) {
    endGame();
  } else {
    showQuestion();
  }
});

// Atalho de teclado: Enter/Espaço avança quando botão está visível
document.addEventListener('keydown', (e) => {
  if (!btnNext.classList.contains('hidden') && (e.key === 'Enter' || e.key === ' ') && document.activeElement !== btnNext) {
    // Não intercepta se o foco já está no botão (evita duplo disparo)
    if (document.activeElement?.classList.contains('answer-btn')) return;
    e.preventDefault();
    btnNext.click();
  }
});

/* ============================================================
   12. FIM DO JOGO
   ============================================================ */

function endGame() {
  clearTimer();
  saveStats(state.score);

  const total    = state.correctCount + state.wrongCount;
  const accuracy = total > 0 ? Math.round((state.correctCount / total) * 100) : 0;

  // Troféu e mensagem baseados no desempenho
  let trophy, title, message;
  if (accuracy >= 90) {
    trophy  = '🏆';
    title   = 'Mestre da Acessibilidade!';
    message = 'Incrível! Você domina acessibilidade web. Continue espalhando a inclusão!';
  } else if (accuracy >= 70) {
    trophy  = '🥈';
    title   = 'Muito Bem!';
    message = 'Ótimo desempenho! Revise os erros para chegar ao topo.';
  } else if (accuracy >= 50) {
    trophy  = '📚';
    title   = 'Bom Começo!';
    message = 'Você tem base. Aprenda mais sobre WCAG e ARIA para melhorar.';
  } else {
    trophy  = '🌱';
    title   = 'Continue Aprendendo!';
    message = 'Acessibilidade web é fundamental. Que tal estudar as diretrizes WCAG?';
  }

  resultTrophy.textContent  = trophy;
  resultTitle.textContent   = title;
  resultMessage.textContent = message;

  resScore.textContent    = state.score;
  resCorrect.textContent  = `${state.correctCount} ✅`;
  resWrong.textContent    = `${state.wrongCount} ❌`;
  resAccuracy.textContent = `${accuracy}%`;

  // Revisão das respostas
  reviewList.innerHTML = '';
  state.answers.forEach((item, i) => {
    const li = document.createElement('li');
    li.className = `review-item ${item.wasCorrect ? 'review-correct' : 'review-wrong'}`;
    li.style.animationDelay = `${i * 0.05}s`;
    li.setAttribute('aria-label',
      `Pergunta ${i + 1}: ${item.wasCorrect ? 'Acerto' : 'Erro'}. ${item.question}. Resposta correta: ${item.correct}.`
    );
    li.innerHTML = `
      <span class="review-icon" aria-hidden="true">${item.wasCorrect ? '✅' : '❌'}</span>
      <div class="review-content">
        <div class="review-question">${item.question}</div>
        <div class="review-answer">
          Resposta correta: <strong>${item.correct}</strong>
          ${!item.wasCorrect && item.chosen ? ` · Sua resposta: ${item.chosen}` : ''}
          ${!item.chosen ? ' · (tempo esgotado)' : ''}
        </div>
      </div>
    `;
    reviewList.appendChild(li);
  });

  showScreen('result');
}

/* ============================================================
   13. BOTÕES DA TELA DE RESULTADO
   ============================================================ */

btnPlayAgain.addEventListener('click', () => {
  startGame();
});

btnChangeDiff.addEventListener('click', () => {
  showScreen('home');
  loadStats();
});

btnRetry.addEventListener('click', () => {
  showScreen('home');
});

/* ============================================================
   14. ACESSIBILIDADE — SIMULAÇÃO DE VISÃO CROMÁTICA (DALTONISMO)
   Tipos suportados:
     • Protanopia   — ausência de fotorreceptores vermelhos (~1% homens)
     • Deuteranopia — ausência de fotorreceptores verdes   (~1% homens)
     • Tritanopia   — ausência de fotorreceptores azuis    (raro, ~0.003%)
   Os filtros SVG com feColorMatrix são aplicados via CSS no <body>.
   ============================================================ */

const VISION_MODES = {
  none:          { label: 'Normal',       cls: null,                      icon: '👁',  desc: 'Visão normal' },
  protanopia:    { label: 'Protanopia',   cls: 'vision-protanopia',       icon: '🔴',  desc: 'Sem cones vermelhos' },
  deuteranopia:  { label: 'Deuteranopia', cls: 'vision-deuteranopia',     icon: '🟢',  desc: 'Sem cones verdes' },
  tritanopia:    { label: 'Tritanopia',   cls: 'vision-tritanopia',       icon: '🔵',  desc: 'Sem cones azuis' },
};

// DOM
const btnVisionToggle  = document.getElementById('btn-vision-toggle');
const visionMenu       = document.getElementById('vision-menu');
const visionMenuWrapper= document.getElementById('vision-menu-wrapper');
const visionBanner     = document.getElementById('vision-banner');

let currentVision = localStorage.getItem('aq_vision') ?? 'none';

/** Aplica o modo de visão selecionado */
function applyVision(mode) {
  // Remove todas as classes de visão do body
  Object.values(VISION_MODES).forEach(m => {
    if (m.cls) document.body.classList.remove(m.cls);
  });

  // Aplica nova classe
  const modeData = VISION_MODES[mode];
  if (modeData?.cls) document.body.classList.add(modeData.cls);

  currentVision = mode;
  localStorage.setItem('aq_vision', mode);

  // Atualiza aria-checked nos itens do menu
  visionMenu.querySelectorAll('.vision-option').forEach(btn => {
    const isActive = btn.dataset.vision === mode;
    btn.setAttribute('aria-checked', String(isActive));
    btn.classList.toggle('vision-option--active', isActive);
  });

  // Atualiza botão disparador
  const isActive = mode !== 'none';
  btnVisionToggle.classList.toggle('vision-active', isActive);
  btnVisionToggle.setAttribute(
    'aria-label',
    isActive
      ? `Simulação ativa: ${modeData.label}. Clique para abrir menu de visão cromática`
      : 'Abrir menu de simulação de visão cromática'
  );

  // Banner informativo na home
  if (isActive) {
    visionBanner.innerHTML = `
      <span aria-hidden="true">${modeData.icon}</span>
      Modo de visão ativo: <strong>${modeData.label}</strong> — ${modeData.desc}.
      <button class="vision-banner__reset" aria-label="Desativar simulação de ${modeData.label}">Desativar</button>
    `;
    visionBanner.classList.remove('hidden');
    visionBanner.querySelector('.vision-banner__reset')?.addEventListener('click', () => {
      applyVision('none');
      closeVisionMenu();
    });
  } else {
    visionBanner.classList.add('hidden');
  }
}

/** Abre/fecha o menu */
function toggleVisionMenu() {
  const isOpen = !visionMenu.classList.contains('hidden');
  if (isOpen) closeVisionMenu();
  else         openVisionMenu();
}

function openVisionMenu() {
  visionMenu.classList.remove('hidden');
  btnVisionToggle.setAttribute('aria-expanded', 'true');
  // Foco na primeira opção
  requestAnimationFrame(() => visionMenu.querySelector('.vision-option')?.focus());
}

function closeVisionMenu() {
  visionMenu.classList.add('hidden');
  btnVisionToggle.setAttribute('aria-expanded', 'false');
}

// Clique no botão disparador
btnVisionToggle.addEventListener('click', (e) => {
  e.stopPropagation();
  toggleVisionMenu();
});

// Cliques nas opções do menu
visionMenu.addEventListener('click', (e) => {
  const btn = e.target.closest('.vision-option');
  if (!btn) return;
  applyVision(btn.dataset.vision);
  closeVisionMenu();
  btnVisionToggle.focus();
});

// Fecha menu ao clicar fora
document.addEventListener('click', (e) => {
  if (!visionMenuWrapper.contains(e.target)) closeVisionMenu();
});

// Navegação por teclado no menu (setas + Escape)
visionMenu.addEventListener('keydown', (e) => {
  const items = [...visionMenu.querySelectorAll('.vision-option')];
  const idx   = items.indexOf(document.activeElement);

  if (e.key === 'ArrowDown') {
    e.preventDefault();
    items[(idx + 1) % items.length]?.focus();
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    items[(idx - 1 + items.length) % items.length]?.focus();
  } else if (e.key === 'Escape') {
    closeVisionMenu();
    btnVisionToggle.focus();
  } else if (e.key === 'Tab') {
    // Tab fecha o menu para não prender o foco
    closeVisionMenu();
  }
});

// Restaura modo salvo ao carregar
applyVision(currentVision);

/* ============================================================
   15. ACESSIBILIDADE — ALTO CONTRASTE
   ============================================================ */

btnContrast.addEventListener('click', () => {
  const active = document.body.classList.toggle('high-contrast');
  btnContrast.setAttribute('aria-pressed', String(active));
  btnContrast.setAttribute('aria-label',
    active ? 'Desativar alto contraste' : 'Ativar modo de alto contraste'
  );
  localStorage.setItem('aq_high_contrast', active ? '1' : '0');
});

if (localStorage.getItem('aq_high_contrast') === '1') {
  document.body.classList.add('high-contrast');
  btnContrast.setAttribute('aria-pressed', 'true');
  btnContrast.setAttribute('aria-label', 'Desativar alto contraste');
}

/* ============================================================
   16. ACESSIBILIDADE — TAMANHO DE FONTE
   ============================================================ */

let fontScale = parseFloat(localStorage.getItem('aq_font_scale') ?? '1');

function applyFontScale() {
  document.documentElement.style.fontSize = `${fontScale * 16}px`;
  localStorage.setItem('aq_font_scale', fontScale);
}

btnFontPlus.addEventListener('click', () => {
  if (fontScale < 1.5) { fontScale = Math.min(1.5, fontScale + 0.1); applyFontScale(); }
});

btnFontMinus.addEventListener('click', () => {
  if (fontScale > 0.8) { fontScale = Math.max(0.8, fontScale - 0.1); applyFontScale(); }
});

// Aplica escala salva ao carregar
applyFontScale();

/* ============================================================
   17. INICIALIZAÇÃO
   ============================================================ */

loadStats();
showScreen('home');
