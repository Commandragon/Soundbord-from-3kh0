// A unminified version is at og-loader.js
// Use a single audio element for playback
const globalAudioPlayer = new Audio();
let audioElements = {}; // Keep for playAll/stopAll compatibility, but only store srcs
const spinnerElement = document.querySelector(".spinner");
const containerElement = document.querySelector(".flex-container");
let hasLoaded = false;
let time = Date.now();

fetch("sounds.json?t=" + time)
  .then(response => response.json())
  .then(data => {
    data.sounds.forEach(sound => {
      const soundElement = document.createElement("div");
      soundElement.classList.add("sound");
      const buttonElement = document.createElement("button");
      buttonElement.classList.add("small-button");
      buttonElement.style.backgroundColor = sound.color || "#333";
      buttonElement.addEventListener("click", () => {
        // Lazy load and play
        globalAudioPlayer.src = sound.mp3;
        globalAudioPlayer.currentTime = 0;
        globalAudioPlayer.play();
      });
      soundElement.appendChild(buttonElement);
      const nameElement = document.createElement("p");
      nameElement.classList.add("name");
      nameElement.innerText = sound.name || sound.mp3.split("/").pop();
      soundElement.appendChild(nameElement);
      // Store src for playAll/stopAll
      audioElements[sound.name || sound.mp3] = sound.mp3;
      containerElement.appendChild(soundElement);
    });
    spinnerElement.remove();
    hasLoaded = true;
    console.log(data.sounds.length + " sounds loaded!");
  })
  .catch(error => {
    const errorMessageElement = document.createElement("h3");
    errorMessageElement.style.color = "red";
    errorMessageElement.innerText = "Error loading soundboard: " + error;
    containerElement.appendChild(errorMessageElement);
    spinnerElement.remove();
  });

setTimeout(() => {
  if (!hasLoaded) {
    const errorMessageElement = document.createElement("h3");
    errorMessageElement.style.color = "red";
    errorMessageElement.innerText = "A unknown error occured while trying to load the soundboard.";
    containerElement.appendChild(errorMessageElement);
    spinnerElement.remove();
  }
}, 7000);

// Play all sounds (sequentially, not simultaneously, to avoid lag)
function playAll() {
  const soundList = Object.values(audioElements);
  let idx = 0;
  function playNext() {
    if (idx >= soundList.length) return;
    globalAudioPlayer.src = soundList[idx];
    globalAudioPlayer.currentTime = 0;
    globalAudioPlayer.play();
    idx++;
    globalAudioPlayer.onended = playNext;
  }
  playNext();
}

// Stop all (just pause the global player)
function stopAll() {
  globalAudioPlayer.pause();
  globalAudioPlayer.currentTime = 0;
}



