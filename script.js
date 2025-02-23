let btn = document.querySelector("#btn");
let content = document.querySelector("#content");
let voice = document.querySelector("#voice");

function speak(text, lang = "en-IN") {
    let text_speak = new SpeechSynthesisUtterance(text);
    let voices = speechSynthesis.getVoices();

    // Ensure voices are loaded properly
    if (voices.length === 0) {
        speechSynthesis.onvoiceschanged = () => {
            voices = speechSynthesis.getVoices();
            text_speak.voice = voices.find(v => v.name.includes("Male")) || voices[0];
            text_speak.lang = lang;
            speechSynthesis.speak(text_speak);
        };
    } else {
        text_speak.voice = voices.find(v => v.name.includes("Male")) || voices[0];
        text_speak.lang = lang;
        speechSynthesis.speak(text_speak);
    }
}

function wishMe() {
    let hours = new Date().getHours();
    if (hours >= 0 && hours < 12) {
        speak("Good Morning Sir");
    } else if (hours >= 12 && hours < 16) {
        speak("Good Afternoon Sir");
    } else {
        speak("Good Evening Sir");
    }
}

// Setting up speech recognition
let speechRecognition = window.speechRecognition || window.webkitSpeechRecognition;
let recognition = new speechRecognition();
recognition.interimResults = false;  // Disable interim results
recognition.maxAlternatives = 1;

recognition.onstart = () => {
    console.log("Speech recognition started");
    voice.style.display = "block";
    btn.style.display = "none";
};

recognition.onend = () => {
    console.log("Speech recognition ended");
    btn.style.display = "flex";
    voice.style.display = "none";
};

recognition.onresult = (event) => {
    let transcript = event.results[0][0].transcript.toLowerCase().trim();
    console.log("Recognized speech:", transcript);  // Debugging log
    content.innerText = transcript;
    takeCommand(transcript);
};

recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);  // Log error to console
    speak("Sorry, I didn't understand.");
    btn.style.display = "flex";
    voice.style.display = "none";
};

btn.addEventListener("click", () => {
    console.log("Speech recognition started by user");
    recognition.start();
});

function takeCommand(message) {
    btn.style.display = "flex";
    voice.style.display = "none";

    if (message.includes("hello") || message.includes("hey")) {
        speak("Hello sir, how can I help you?");
    } else if (message.includes("who are you")) {
        speak("I am Salaar, a virtual assistant created by Tejjas.");
    } else if (message.includes("open youtube")) {
        speak("Opening YouTube...");
        window.open("https://www.youtube.com/");
    } else if (message.includes("open google")) {
        speak("Opening Google...");
        window.open("https://www.google.com/");
    } else if (message.includes("open whatsapp")) {
        speak("Opening WhatsApp...");
        window.open("https://web.whatsapp.com/");
    } else if (message.includes("open instagram")) {
        speak("Opening Instagram...");
        window.open("https://www.instagram.com/");
    } else if (message.includes("open calculator")) {
        speak("Opening Calculator...");
        window.open("calculator://");
    } else if (message.includes("time")) {
        let time = new Date().toLocaleTimeString();
        speak(`The current time is ${time}`);
    } else if (message.includes("date")) {
        let date = new Date().toLocaleDateString(undefined, {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        });
        speak(`Today's date is ${date}`);
    } else {
        let cleanedMessage = message.replace(/\b(salaar|salah|sarah|salar)\b/gi, "").trim();

        if (cleanedMessage === "") {
            speak("Please specify what you want to search for.");
        } else {
            speak(`This is what I found on the internet regarding ${cleanedMessage}`);
            let searchQuery = encodeURIComponent(cleanedMessage);
            window.open(`https://www.google.com/search?q=${searchQuery}`, "_blank");
        }
    }
}
