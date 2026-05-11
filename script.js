const intro = document.querySelector("#intro");
const test = document.querySelector("#test");
const result = document.querySelector("#result");
const startTest = document.querySelector("#start-test");
const questionKicker = document.querySelector("#question-kicker");
const questionText = document.querySelector("#question-text");
const progressCount = document.querySelector("#progress-count");
const progressBar = document.querySelector("#progress-bar");
const runningScore = document.querySelector("#running-score");
const backButton = document.querySelector("#back-button");
const scoreValue = document.querySelector("#score-value");
const verdict = document.querySelector("#verdict");
const breakdown = document.querySelector("#breakdown");
const renderResult = document.querySelector("#render-result");
const restartTest = document.querySelector("#restart-test");
const canvas = document.querySelector("#result-canvas");

const questions = [
  "Have you ever vaped?",
  "Have you ever smoked?",
  "Have you ever done drugs?",
  "Have you ever kissed someone romantically?",
  "Have you ever touched someone intimately?",
  "Has anyone seen you naked in a romantical context?",
  "Have you ever had sex?",
  "Have you ever had someone touch you in your private areas?",
  "Have you ever been in a relationship?",
  "Have you ever hugged someone romantically?",
  "Have you ever dirty talked over text?",
  "Have you ever sent dirty pics?",
  "Have you ever gooned?",
  "Have you ever watched porn?",
  "Have you ever held hands romantically?",
  "Have you ever started a fight?",
  "Have you ever snuck out of your house?",
  "Have you ever cheated on a partner?",
  "Have you ever stolen something?",
  "Have you ever shoplifted?",
  "Have you ever hooked up with someone with no intention of getting together?",
  "Have you ever downloaded something illegal?",
  "Have you ever been suspended from school?",
  "Have you ever been expelled from school?",
  "Have you ever had your parents called about your bad behaviour in school?",
  "Have you ever started a fake rumour about somebody?",
  "Have you ever done something behind your friends back?",
  "Have you ever watched someone get changed?",
  "Have you sexually assaulted someone?",
  "Have you ever killed anyone?",
  "Have you ever had thoughts on being a terrorist?",
  "Have you ever tried making explosives?",
  "Have you ever been in contact with terrorist groups?",
  "Do you take money from Israel?",
  "Have you ever tortured someone?",
];

let index = 0;
let answers = [];

function getScore() {
  const answered = answers.length || 1;
  const noAnswers = answers.filter((answer) => answer === "no").length;
  return Math.round((noAnswers / answered) * 100);
}

function getFinalScore() {
  const noAnswers = answers.filter((answer) => answer === "no").length;
  return Math.round((noAnswers / questions.length) * 100);
}

function getVerdict(score) {
  if (score >= 95) return "museum-grade purity";
  if (score >= 85) return "basically untouched by lore";
  if (score >= 70) return "mostly clean, slightly suspicious";
  if (score >= 55) return "standard issue menace";
  if (score >= 40) return "deeply compromised";
  if (score >= 25) return "classified government document";
  return "jakub purity has left the building";
}

function showScreen(screen) {
  intro.hidden = screen !== "intro";
  test.hidden = screen !== "test";
  result.hidden = screen !== "result";
}

function renderQuestion() {
  const answered = answers.length;
  const score = getScore();
  progressCount.textContent = `${index + 1}/${questions.length}`;
  progressBar.style.width = `${(answered / questions.length) * 100}%`;
  questionKicker.textContent = `question ${index + 1}`;
  questionText.textContent = questions[index];
  runningScore.textContent = answered ? `current purity: ${score}%` : "purity currently unknown";
  backButton.hidden = index === 0;
}

function renderFinal() {
  const score = getFinalScore();
  const yesAnswers = answers.filter((answer) => answer === "yes").length;
  const noAnswers = answers.filter((answer) => answer === "no").length;
  scoreValue.textContent = score;
  verdict.textContent = getVerdict(score);
  breakdown.textContent = `${noAnswers} no answers, ${yesAnswers} yes answers, ${questions.length} total questions. Your Jakub Purity Score is based on how many times you said no.`;
  showScreen("result");
}

function answerQuestion(answer) {
  answers[index] = answer;
  if (index >= questions.length - 1) {
    renderFinal();
    return;
  }
  index += 1;
  renderQuestion();
}

function restart() {
  index = 0;
  answers = [];
  showScreen("intro");
  renderQuestion();
}

function drawGrid(ctx, width, height) {
  ctx.strokeStyle = "rgba(255,255,255,0.06)";
  for (let x = 0; x <= width; x += 72) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y <= height; y += 72) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
}

function fitText(ctx, text, maxWidth, startSize, minSize, weight = 900) {
  let size = startSize;
  do {
    ctx.font = `${weight} ${size}px Inter, Arial, sans-serif`;
    if (ctx.measureText(text).width <= maxWidth) return size;
    size -= 3;
  } while (size >= minSize);
  return minSize;
}

function drawResultGraphic() {
  const ctx = canvas.getContext("2d");
  const score = getFinalScore();
  const yesAnswers = answers.filter((answer) => answer === "yes").length;
  const noAnswers = answers.filter((answer) => answer === "no").length;

  ctx.fillStyle = "#030303";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawGrid(ctx, canvas.width, canvas.height);

  const glow = ctx.createRadialGradient(930, 180, 0, 930, 180, 620);
  glow.addColorStop(0, "rgba(233,255,112,0.24)");
  glow.addColorStop(1, "rgba(233,255,112,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#e9ff70";
  ctx.font = "900 34px Inter, Arial, sans-serif";
  ctx.fillText("THE JAKUB PURITY TEST", 72, 100);

  ctx.fillStyle = "#f5f5f0";
  fitText(ctx, `${score}%`, 840, 220, 118, 950);
  ctx.fillText(`${score}%`, 72, 310);

  ctx.fillStyle = "#f5f5f0";
  fitText(ctx, getVerdict(score), 980, 74, 42, 900);
  ctx.fillText(getVerdict(score), 72, 430);

  ctx.fillStyle = "rgba(255,255,255,0.08)";
  roundRect(ctx, 72, 540, 1056, 230, 28);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.16)";
  ctx.stroke();

  ctx.fillStyle = "#e9ff70";
  ctx.font = "900 28px Inter, Arial, sans-serif";
  ctx.fillText("BREAKDOWN", 112, 610);
  ctx.fillStyle = "#f5f5f0";
  ctx.font = "900 72px Inter, Arial, sans-serif";
  ctx.fillText(`${noAnswers} no`, 112, 700);
  ctx.fillText(`${yesAnswers} yes`, 560, 700);

  ctx.fillStyle = "#a6a6a0";
  ctx.font = "800 28px Inter, Arial, sans-serif";
  ctx.fillText(`${questions.length} questions answered`, 112, 850);
  ctx.fillText("score is based on the percentage of no answers", 112, 895);

  ctx.fillStyle = "#f5f5f0";
  ctx.font = "900 46px Inter, Arial, sans-serif";
  ctx.fillText("jakublabs.xyz", 72, 1390);
  ctx.fillStyle = "#a6a6a0";
  ctx.font = "800 24px Inter, Arial, sans-serif";
  ctx.fillText("not a real diagnosis. obviously.", 72, 1430);

  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = "jakub-purity-score.png";
  link.click();
}

function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
}

startTest.addEventListener("click", () => {
  showScreen("test");
  renderQuestion();
});

document.querySelectorAll("[data-answer]").forEach((button) => {
  button.addEventListener("click", () => answerQuestion(button.dataset.answer));
});

backButton.addEventListener("click", () => {
  if (index <= 0) return;
  answers.splice(index - 1, 1);
  index -= 1;
  renderQuestion();
});

restartTest.addEventListener("click", restart);
renderResult.addEventListener("click", drawResultGraphic);

renderQuestion();
