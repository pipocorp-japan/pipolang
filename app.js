import phrases from "./phrases.js"; // フレーズをインポート

const learnModeBtn = document.getElementById("learnModeBtn");
const dictionaryBtn = document.getElementById("dictionaryBtn");
const grammarBtn = document.getElementById("grammarBtn");
const learnMode = document.getElementById("learnMode");
const dictionary = document.getElementById("dictionary");
const grammar = document.getElementById("grammar");
const resultPage = document.getElementById("resultPage");
const retryBtn = document.getElementById("retry")

const jpPhrase = document.getElementById("jpPhrase");
const pipoInput = document.getElementById("pipoInput");
const checkAnswerBtn = document.getElementById("checkAnswerBtn");
const feedback = document.getElementById("feedback");
const remainingQuestions = document.getElementById("remainingQuestions");
const correctAnswersText = document.getElementById("correctAnswers");

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const searchResult = document.getElementById("searchResult");

// 進捗メーター要素
const progressMeter = document.getElementById("progressMeter");

// 間違えた問題を保存する配列
let wrongQuestions = [];
let allQuestions = Object.keys(phrases); // すべての問題リスト

let currentQuestion = 0;
let correctAnswers = 0;

const normalizeInput = (input) => {
  return input.replace(/\s+/g, "").toLowerCase().trim();
};

// 学習モードに切り替え
learnModeBtn.addEventListener("click", () => {
  learnMode.classList.remove("hidden");
  grammar.classList.add("hidden");
  dictionary.classList.add("hidden");
  resultPage.classList.add("hidden");
  resetQuiz();
});
retryBtn.addEventListener("click", () => {
  learnMode.classList.remove("hidden");
  grammar.classList.add("hidden");
  dictionary.classList.add("hidden");
  resultPage.classList.add("hidden");
  resetQuiz();
});
// 辞書モードに切り替え
dictionaryBtn.addEventListener("click", () => {
  dictionary.classList.remove("hidden");
  grammar.classList.add("hidden");
  learnMode.classList.add("hidden");
  resultPage.classList.add("hidden");
});
grammarBtn.addEventListener("click", () => {
  grammar.classList.remove("hidden");
  dictionary.classList.add("hidden");
  learnMode.classList.add("hidden");
  resultPage.classList.add("hidden");
});
// フレーズを新しく表示
function showNewPhrase() {
  const remainingQuestionsList = allQuestions.filter(
    (q) => !wrongQuestions.some((wq) => wq.jp === q)
  ); // 間違えた問題を除外
  if (remainingQuestionsList.length === 0) {
    showResults();
    return;
  }

  const randomIndex = Math.floor(Math.random() * remainingQuestionsList.length);
  const randomPhrase = remainingQuestionsList[randomIndex];

  jpPhrase.textContent = randomPhrase;
  feedback.textContent = "";
  pipoInput.value = "";
}

// 回答チェック
checkAnswerBtn.addEventListener("click", () => {
  const correctAnswer = phrases[jpPhrase.textContent];
  const userInput = normalizeInput(pipoInput.value);
  const correct = normalizeInput(correctAnswer);

  if (userInput === correct) {
    correctAnswers++;
  } else {
    wrongQuestions.push({ jp: jpPhrase.textContent, correct: correctAnswer });
  }

  currentQuestion++;
  updateProgressMeter(); // 回答ごとに進捗メーターを更新
  remainingQuestions.textContent = 10 - currentQuestion;

  if (currentQuestion < 10) {
    showNewPhrase();
  } else {
    showResults();
  }
});

// 進捗メーターの値を更新する関数
function updateProgressMeter() {
  progressMeter.value = currentQuestion; // 現在の質問数をメーターに反映
}

// リセット
function resetQuiz() {
  currentQuestion = 0;
  correctAnswers = 0;
  progressMeter.value = 0; // メーターも初期化
  remainingQuestions.textContent = 10;
  correctAnswersText.textContent = "";
  wrongQuestions = [];
  showNewPhrase();
}

// 結果を表示
// 結果を表示
function showResults() {
  learnMode.classList.add("hidden");
  resultPage.classList.remove("hidden");
  correctAnswersText.textContent = `正解数: ${correctAnswers} / 10`;

  if (wrongQuestions.length > 0) {
    showWrongQuestions(); // 間違えた問題を表示する関数を呼び出し
  }
}

// 間違えた問題を再表示
function showWrongQuestions() {
  // resultPageに新しいコンテナを作成する
  const wrongQuestionContainer = document.createElement("div");
  wrongQuestionContainer.id = "wrongQuestions"; // IDを設定（必要ならCSSでスタイル可能）
  wrongQuestionContainer.innerHTML = `<h3>間違えた問題</h3>`;

  wrongQuestions.forEach((question, index) => {
    const questionElement = document.createElement("div");
    questionElement.innerHTML =
      '<p style="color:red;">問題 ' + (index + 1) + ':' + question.jp + '</p><p>正解: ' + question.correct + '</p>';
    wrongQuestionContainer.appendChild(questionElement);
  });

  // resultPageに要素を追加
  resultPage.appendChild(wrongQuestionContainer);
}

// 辞書検索
searchBtn.addEventListener("click", () => {
  const searchTerm = searchInput.value.trim();
  if (phrases[searchTerm]) {
    searchResult.textContent = `ピポ語: ${phrases[searchTerm]}`;
  } else {
    searchResult.innerHTML =
      "そのフレーズは見つかりませんでした。固有名詞の場合は、日本語で書きます。例:<br />日本語:ピポ会社<br />ピポ語:ピポ会社";
  }
});

// エンターキーが押されたときのイベントリスナー（学習モード）
pipoInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    checkAnswerBtn.click();
  }
});

// エンターキーが押されたときのイベントリスナー（辞書モード）
searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    searchBtn.click();
  }
});

// ページ読み込み時にリセット
resetQuiz();
