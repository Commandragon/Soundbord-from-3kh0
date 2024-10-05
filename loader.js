// A unminified version is at og-loader.js
let audioElements = {};
const spinnerElement = document.querySelector(".spinner");
const containerElement = document.querySelector(".flex-container");
let hasLoaded = false;
let time = Date.now();

fetch("sounds.json?t=" + time).then(response => response.json()).then(data => {
    data.sounds.forEach(sound => {
        const soundElement = document.createElement("div");
        soundElement.classList.add("sound");
        const buttonElement = document.createElement("button");
        buttonElement.classList.add("small-button");
        buttonElement.style.backgroundColor = sound.color;

        // Play sound on button click
        buttonElement.addEventListener("click", () => {
            stopAll(); // Stop all sounds before playing the selected one
            if (audioElements[sound.name]) {
                audioElements[sound.name].currentTime = 0;
                audioElements[sound.name].play();
            }
        });
        
        soundElement.appendChild(buttonElement);
        
        const nameElement = document.createElement("p");
        nameElement.classList.add("name");
        nameElement.innerText = sound.name;
        soundElement.appendChild(nameElement);
        
        const audioElement = document.createElement("audio");
        audioElement.src = sound.mp3;
        audioElement.preload = "auto";
        audioElements[sound.name] = audioElement;
        document.body.appendChild(audioElement);
        
        const progressBar = document.createElement("progress");
        progressBar.classList.add("progress");
        progressBar.value = 0;
        progressBar.max = 1; // Set the maximum value for the progress bar
        soundElement.appendChild(progressBar);
        
        audioElement.addEventListener("timeupdate", () => {
            progressBar.value = audioElement.currentTime / audioElement.duration;
        });

        containerElement.appendChild(soundElement);
    });
    spinnerElement.remove();
    hasLoaded = true;
    console.log(data.sounds.length + " sounds loaded!");
}).catch(error => {
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
        errorMessageElement.innerText = "An unknown error occurred while trying to load the soundboard.";
        containerElement.appendChild(errorMessageElement);
        spinnerElement.remove();
    }
}, 7000);

function playAll() {
    for (const name in audioElements) {
        if (Object.hasOwnProperty.call(audioElements, name)) {
            const el = audioElements[name];
            el.currentTime = 0; // Reset time to the beginning
            el.play();
        }
    }
}

function stopAll() {
    for (const name in audioElements) {
        if (Object.hasOwnProperty.call(audioElements, name)) {
            const el = audioElements[name];
            el.pause();
            el.currentTime = 0;
        }
    }
}
