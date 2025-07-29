const minutesDisplay = document.getElementById("minutes");
const secondsDisplay = document.getElementById("seconds");
const status = document.getElementById("status");
const breakTimeDisplay = document.getElementById("break-time");
const workTimeDisplay = document.getElementById("work-time");
const sessionsDisplay = document.getElementById("amount-of-sessions");
const settings = document.querySelector(".settings");

const startBtn = document.getElementById("start");
const pauseBtn = document.getElementById("pause");
const resetBtn = document.getElementById("reset");

const breakUpBtn = document.querySelector(".work.buttons:nth-child(2) button:first-child");
const breakDownBtn = document.querySelector(".work.buttons:nth-child(2) button:last-child");
const workUpBtn = document.querySelector(".work.buttons:nth-child(1) button:first-child");
const workDownBtn = document.querySelector(".work.buttons:nth-child(1) button:last-child");
const sessionsUpBtn = document.querySelector("#sessions button:first-child");
const sessionsDownBtn = document.querySelector("#sessions button:last-child");

// Initial values
let workMinutes = 25;
let breakMinutes = 5;
let totalSessions = 5;
let currentSession = 1;
let currentTime = workMinutes * 60;
let interval = null;
let isRunning = false;
let isWorkSession = true;

function updateDisplay() {
  const mins = Math.floor(currentTime / 60);
  const secs = currentTime % 60;
  minutesDisplay.textContent = String(mins).padStart(2, '0');
  secondsDisplay.textContent = String(secs).padStart(2, '0');
}

function updateSettingsDisplay() {
  breakTimeDisplay.textContent = breakMinutes;
  workTimeDisplay.textContent = workMinutes;
  sessionsDisplay.textContent = totalSessions;
}

function switchSession() {
  if (isWorkSession) {
    // Finished a work session
    if (currentSession >= totalSessions) {
      status.textContent = "All Sessions Complete!";
      clearInterval(interval);
      isRunning = false;
      return;
    }
    currentSession++;
    currentTime = breakMinutes * 60;
    status.textContent = "Break Time";
    isWorkSession = false;
  } else {
    // Finished a break, start next work session
    currentTime = workMinutes * 60;
    status.textContent = "Work Time";
    isWorkSession = true;
  }
  updateDisplay();
  startTimer(); // Automatically start next session
}

function startTimer() {
  if (isRunning) return;
  isRunning = true;
  interval = setInterval(() => {
    currentTime--;
    updateDisplay();
    if (currentTime <= 0) {
      clearInterval(interval);
      isRunning = false;
      switchSession();
    }
  }, 1000);
  settings.style.display = "none"; // Hide settings during timer
  pauseBtn.style.display = "inline"; // Show pause button
  resetBtn.style.display = "inline"; // Show reset button
}

function pauseTimer() {
  clearInterval(interval);
  isRunning = false;
}

function resetTimer() {
  clearInterval(interval);
  isRunning = false;
  currentSession = 1;
  isWorkSession = true;
  currentTime = workMinutes * 60;
  status.textContent = "Work Time";
  settings.style.display = ""; // Show settings after reset
  pauseBtn.style.display = "none"; // Hide pause button
  resetBtn.style.display = "none"; // Hide reset button
  updateDisplay();
}

// Button Events
startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);

// Break time adjustment
breakUpBtn.addEventListener("click", () => {
  if (breakMinutes < 30) breakMinutes++;
  updateSettingsDisplay();
  if (!isWorkSession && !isRunning) {
    currentTime = breakMinutes * 60;
    updateDisplay();
  }
});
breakDownBtn.addEventListener("click", () => {
  if (breakMinutes > 1) breakMinutes--;
  updateSettingsDisplay();
  if (!isWorkSession && !isRunning) {
    currentTime = breakMinutes * 60;
    updateDisplay();
  }
});

// Work time adjustment
workUpBtn.addEventListener("click", () => {
  if (workMinutes < 60) workMinutes++;
  updateSettingsDisplay();
  if (isWorkSession && !isRunning) {
    currentTime = workMinutes * 60;
    updateDisplay();
  }
});
workDownBtn.addEventListener("click", () => {
  if (workMinutes > 1) workMinutes--;
  updateSettingsDisplay();
  if (isWorkSession && !isRunning) {
    currentTime = workMinutes * 60;
    updateDisplay();
  }
});

// Sessions adjustment
sessionsUpBtn.addEventListener("click", () => {
  if (totalSessions < 20) totalSessions++;
  updateSettingsDisplay();
});
sessionsDownBtn.addEventListener("click", () => {
  if (totalSessions > 1) totalSessions--;
  updateSettingsDisplay();
});

// Initialize
updateSettingsDisplay();
updateDisplay();
