// Catch Selectors
let lvlNameSpan = document.querySelector(".message .lvl");
let secondsSpan = document.querySelector(".message .seconds");
let startButton = document.querySelector(".start");
let theWord = document.querySelector(".the-word");
let input = document.querySelector(".input");
let upcomingWords = document.querySelector(".upcoming-words");
let timeLeftSpan = document.querySelector(".time span");
let scoreGot = document.querySelector(".score .got");
let scoreTotal = document.querySelector(".score .total");
let finishMessage = document.querySelector(".finish");
//select box
let levelSelect = document.getElementById("levelSelect");
//audio
let myAudioCorrectAnswer = document.querySelector(".myAudioCorrectAnswer");
let myAudiocongratulations = document.querySelector(".myAudiocongratulations");
let myAudioGameOver = document.querySelector(".myAudioGameOver");
//video
let videoBackground = document.querySelector(".video-background");

// Array Of Words
const words = ["html", "css", "java", "react", "redux"];

// Setting Levels
const levels = {
  Easy: 6,
  Normal: 4,
  Hard: 3,
};

// Default Level
let defaultLevelName = "Normal";
let defaultLevelSeconds = levels[defaultLevelName];

// Setting Level Name + Seconds + Score
lvlNameSpan.innerHTML = defaultLevelName;
secondsSpan.innerHTML = defaultLevelSeconds;
timeLeftSpan.innerHTML = defaultLevelSeconds;
scoreTotal.innerHTML = words.length;

// Add an event listener to the select element
levelSelect.addEventListener("change", function () {
  // Get the selected level name
  defaultLevelName = this.value;

  // Update the defaultLevelSeconds based on the selected level
  defaultLevelSeconds = levels[defaultLevelName];

  // Update the UI elements
  updateUIElements();
});

function updateUIElements() {
  // update Level Name + Seconds + Score
  lvlNameSpan.innerHTML = defaultLevelName;
  secondsSpan.innerHTML = defaultLevelSeconds;
  timeLeftSpan.innerHTML = defaultLevelSeconds;
}

// Disable Paste Event
input.onpaste = function () {
  return false;
};

//start code generation
startButton.onclick = function () {
  input.focus();
  // levelSelect.setAttribute("disabled", "disabled");
  levelSelect.disabled = true;
  generateWords();
};

function generateWords() {
  // Get Random Word From Array
  let randomWord = words[Math.floor(Math.random() * words.length)];
  // Get Word Index
  let indexOfSelectedWord = words.indexOf(randomWord);
  // Remove WordFrom Array
  words.splice(indexOfSelectedWord, 1);
  // Show The Random Word on screen
  theWord.innerHTML = randomWord;

  upcomingWords.innerHTML = "";

  for (let i = 0; i < words.length; i++) {
    let div = document.createElement("div");
    let divText = document.createTextNode(words[i]);
    div.appendChild(divText);
    upcomingWords.appendChild(div);
  }

  // Call Start Play Function
  startGame();
}

function startGame() {
  timeLeftSpan.innerHTML = defaultLevelSeconds;

  let start = setInterval(() => {
    timeLeftSpan.innerHTML--;

    if (timeLeftSpan.innerHTML === "0") {
      clearInterval(start);

      // Compare Words
      if (input.value.toLowerCase() === theWord.innerHTML.toLowerCase()) {
        // Empty Input Field
        input.value = "";

        // Increase Score
        scoreGot.innerHTML++;
        playAudio(myAudioCorrectAnswer);

        // check if array still has elements
        if (words.length > 0) {
          // Call Generate Word Function
          generateWords();
        } else {
          playAgain();
          addEventListeners();
        }
      } else {
        playAgain();
        addEventListeners();
      }
    }
  }, 1000);
}

function playAgain() {
  let div = document.createElement("div");
  div.className = "congrats";

  if (+scoreGot.innerHTML === +scoreTotal.innerHTML) {
    createWinLoseBAddToDom("span", "good", "congratulations", div);
    speak("congratulations");
    playAudio(myAudiocongratulations);
    playVideo(videoBackground);
  } else {
    createWinLoseBAddToDom("span", "bad", "Game Over", div);
    speak("Game Over,Try again!");
    playAudio(myAudioGameOver);
    finishMessage.style.backgroundColor = "#262627f2";
  }
  //create paragraph
  createWinLoseBAddToDom("p", "playAgain", "Do you want to play again?", div);
  //create parent for 2 buttons
  let divForBtns = document.createElement("div");
  divForBtns.className = "btns";
  //create 2 buttons
  let btnYes = createButton("YES", "yes");
  let btnNo = createButton("NO", "no");
  //append 2 buttons into thier parent
  appendBtnsInParet([btnYes, btnNo], divForBtns);
  //append parent for 2 buttons into div
  div.appendChild(divForBtns);
  //append div  into div with class finish in html
  finishMessage.appendChild(div);

  finishMessage.classList.add("active");
}

function createWinLoseBAddToDom(ele, className, text, parentToAppend) {
  let x = document.createElement(ele);
  x.className = className;
  let xText = document.createTextNode(text);
  x.appendChild(xText);
  parentToAppend.appendChild(x);
}

function createButton(text, className) {
  let btn = document.createElement("span");
  btn.className = className;
  let btnText = document.createTextNode(text);
  btn.appendChild(btnText);

  return btn;
}

function appendBtnsInParet(buttons, divForBtns) {
  buttons.forEach((button) => {
    divForBtns.appendChild(button);
    divForBtns.appendChild(button);
  });
}

function addEventListeners() {
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("yes")) {
      handleYesClick();
    }

    if (e.target.classList.contains("no")) {
      handleNoClick();
    }
  });
}

function handleYesClick() {
  location.reload();
}

function handleNoClick() {
  finishMessage.innerHTML = "";
  let p = document.createElement("p");
  let pText = document.createTextNode("THANK YOU");
  finishMessage.appendChild(pText);

  finishMessage.style.backgroundColor = "#262627f2";
}

// to use google voice
function speak(text) {
  const msg = new SpeechSynthesisUtterance();
  msg.text = text;
  msg.voice = speechSynthesis
    .getVoices()
    .find((voice) => voice.name === "Google UK English Male"); // Change to desired voice
  speechSynthesis.speak(msg);
}

// Load voices
window.speechSynthesis.onvoiceschanged = function () {
  speechSynthesis.getVoices();
};
//

function playAudio(audio) {
  audio.play();
}

function playVideo(video) {
  video.hidden = false;

  let startTime = 4.5;
  let endTime = 11.5;

  video.addEventListener("loadedmetadata", () => {
    video.currentTime = startTime;
    video.play();
  });

  video.addEventListener("timeupdate", () => {
    if (video.currentTime >= endTime) {
      video.pause();
    }
  });

  // Ensure the video starts playing from the start time
  if (video.readyState >= 1) {
    video.currentTime = startTime;
    video.play();
  }
}
