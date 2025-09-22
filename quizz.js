// ✅ All Questions
const questions = {
  "Guest": [
    { q: "MANASI a super singer contestant came to our college for which event?", options: ["takshashila 2025", "refresh 2024", "halloween", "refresh2025"], answer: 3 },
    { q: "YUVAN came to Takshila on which day of the event?", options: ["first day", "second day", "third day", "none of the above"], answer: 1 },
    { q: "Which of the following guests did NOT come to takshashila 2025?", options: ["kural", "ADK", "Arun vijay", "Gukesh"], answer: 2 },
    { q: "Singer Karthick was the guest for which event?", options: ["takshashila 2025", "halloween", "diwali", "Takshashila 2024"], answer: 3 },
    { q: "VIDYUTRENZ2025 was promoted by which famous Instagram influencer?", options: ["solosoniyasign", "A2D", "itssharathhere", "Tamil tech"], answer: 2 }
  ],
  "Tech": [
    { q: "The tech club CELUSTIUS was inaugurated in which month?", options: ["November", "February", "June", "October"], answer: 3 },
    { q: "Which club is known for the department of IT?", options: ["Trojens", "ajna", "hackerz", "revil"], answer: 0 },
    { q: "Which club is known for the department of EEE?", options: ["IMPACT", "impulse", "Ezhal", "vakka"], answer: 1 },
    { q: "What is the bio of the club ASYMETRIC related to?", options: ["monarchy", "autocracy", "democracy", "oligarchy"], answer: 2 },
    { q: "Which of the non-tech events was NOT conducted during Tech Fiesta 2025?", options: ["BGMI", "chess", "jam", "call of duty"], answer: 3 }
  ],
  "Non-Tech": [
    { q: "Which club is known for its podcast?", options: ["connects", "impulse", "campus tv", "impulse"], answer: 2 },
    { q: "Youth Fest 2025 was conducted by which club?", options: ["yuvenza", "sonic fusions", "impact", "connects"], answer: 0 },
    { q: "How many non-tech clubs are there in CIT?", options: ["11", "10", "9", "8"], answer: 2 },
    { q: "The only classical dance club of CIT is?", options: ["swaydevils", "natyameya", "Dgrooves", "techfiesta"], answer: 0 },
    { q: "Which is the literature club of CIT?", options: ["cavort", "teahouse", "coffehouse", "tamilan"], answer: 1 }
  ],
  "Funny": [
    { q: "How many canteens are there in CIT?", options: ["4", "6", "7", "8"], answer: 2 },
    { q: "Which department staff are more strict in CIT?", options: ["VLSI", "IT", "CSBS", "CSE"], answer: 3 },
    { q: "Which is our flagship event in college?", options: ["techfiesta", "takshashila", "navaratri", "halloween"], answer: 1 },
    { q: "How many huts are there in CIT?", options: ["2", "3", "1", "4"], answer: 0 },
    { q: "When is our next meeting with SENTHIL SIR?", options: ["wednesday", "tuesday", "thursday", "friday"], answer: 0 }
  ]
};

// ✅ Globals
let selectedCategory = "";
let currentQuestions = [];
let currentIndex = 0;
let score = 0;
let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];

// ✅ Audio
const correctSound = document.getElementById("correct-sound");
const wrongSound = document.getElementById("wrong-sound");
const backgroundMusic = document.getElementById("background-music");

// ✅ Elements
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultsScreen = document.getElementById("results-screen");
const leaderboardModal = document.getElementById("leaderboard-modal");

const categorySelect = document.getElementById("category-select");
const startButton = document.getElementById("start-button");
const questionText = document.getElementById("question-text");
const optionsContainer = document.getElementById("options-container");
const nextButton = document.getElementById("next-button");
const finalScore = document.getElementById("final-score");
const playerNameInput = document.getElementById("enter_player_name");
const submitBtn = document.querySelector(".btn-submit");
const backBtn = document.querySelector(".btn-back");
const leaderboardList = document.getElementById("leaderboard-list");
const closeLeaderboardBtn = document.getElementById("close-leaderboard-btn");
const questionNumber = document.getElementById("question-number");

// ✅ Start Quiz
startButton.addEventListener("click", () => {
  selectedCategory = categorySelect.value;
  currentQuestions = getRandomQuestions(questions[selectedCategory], 5);
  currentIndex = 0;
  score = 0;

  if (backgroundMusic && backgroundMusic.paused) {
    backgroundMusic.volume = 0.5;
    backgroundMusic.play().catch(err => console.log("Audio error:", err));
  }

  startScreen.classList.add("hidden");
  quizScreen.classList.remove("hidden");

  loadQuestion();
});

//  Load Question
function loadQuestion() {
  const currentQ = currentQuestions[currentIndex];
  questionText.textContent = currentQ.q;
  optionsContainer.innerHTML = "";

  currentQ.options.forEach((opt, idx) => {
    const btn = document.createElement("button");
    btn.classList.add("option");
    btn.textContent = opt;
    btn.addEventListener("click", () => selectAnswer(idx, currentQ.answer, btn));
    optionsContainer.appendChild(btn);
  });

  questionNumber.textContent = currentIndex + 1;
  nextButton.style.display = "none";
}

//  Select Answer
function selectAnswer(selected, correct, clickedBtn) {
  const allButtons = document.querySelectorAll(".option");

  allButtons.forEach(btn => btn.disabled = true);

  if (selected === correct) {
    clickedBtn.classList.add("correct");
    score++;
    correctSound.play();
  } else {
    clickedBtn.classList.add("incorrect");
    allButtons[correct].classList.add("correct");
    wrongSound.play();
  }

  nextButton.style.display = "inline-block";
}

// ✅ Next Question
nextButton.addEventListener("click", () => {
  currentIndex++;
  if (currentIndex < currentQuestions.length) {
    loadQuestion();
  } else {
    showResults();
  }
});

// ✅ Show Results
function showResults() {
  quizScreen.classList.add("hidden");
  resultsScreen.classList.remove("hidden");
  finalScore.textContent = score;
}

// ✅ Submit Score
submitBtn.addEventListener("click", () => {
  const name = playerNameInput.value.trim();
  if (!name) {
    alert("Enter your name before submitting.");
    return;
  }

  leaderboard.push({ name, score });
  leaderboard.sort((a, b) => b.score - a.score);
  leaderboard = leaderboard.slice(0, 10);
  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));

  updateLeaderboard();
  resultsScreen.classList.add("hidden");
  leaderboardModal.classList.remove("hidden");
});

//  Update Leaderboard
function updateLeaderboard() {
  leaderboardList.innerHTML = "";
  leaderboard.forEach((entry, i) => {
    const li = document.createElement("li");
    li.textContent = `${i + 1}. ${entry.name} - ${entry.score}`;
    leaderboardList.appendChild(li);
  });
}

//  Go Back
backBtn.addEventListener("click", () => {
  resultsScreen.classList.add("hidden");
  startScreen.classList.remove("hidden");
  playerNameInput.value = "";
  score = 0;
});

//  Close Leaderboard
closeLeaderboardBtn.addEventListener("click", () => {
  leaderboardModal.classList.add("hidden");
  startScreen.classList.remove("hidden");
  playerNameInput.value = "";
  score = 0;
  leaderboardList.innerHTML = "";
});

//  Get Random Questions
function getRandomQuestions(arr, n) {
  const shuffled = arr.slice().sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
}

//  Initialize Leaderboard
updateLeaderboard();


