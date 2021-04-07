const game = {
    birds: {
        "alouette_champs": "Alouette des champs",
        "alouette_lulu": "Alouette lulu",
        "buse": "Buse",
        "chardonneret_elegant": "Chardonneret élegant",
        "chouette_hulotte": "Chouette hulotte",
        "corneille": "Corneille",
        "coucou": "Coucou",
        "faucon_crecerelle": "Faucon crecerelle",
        "fauvette_jardins": "Fauvette des jardins",
        "fauvette_tete_noire": "Fauvette à tête noire",
        "geai_des_chenes": "Geai des Chênes",
        "goeland": "Goëland",
        "grand_corbeau": "Grand corbeau",
        "grive_draine": "Grive draine",
        "grive_musicienne": "Grive musicienne",
        "merle_noir": "Merle noir",
        "mesange_bleue": "Mésange bleue",
        "mesange_charbonniere": "Mésange charbonnière",
        "mesange_noire": "Mésange noire",
        "pic_noir": "Pic noir",
        "pic_vert": "Pic vert",
        "pigeon_ramier": "Pigeon ramier",
        "pinson_des_arbres": "Pinson des arbres",
        "pouillot_veloce": "Pouillot Véloce",
        "rougegorge_familier": "Rouge-gorge familier",
        "tourterelle": "Tourterelle",
        "troglodyte_mignon": "Troglodyte mignon",
    },

    remainingBirds: [
        "alouette_champs",
        "alouette_lulu",
        "buse",
        "chardonneret_elegant",
        "chouette_hulotte",
        "corneille",
        "coucou",
        "faucon_crecerelle",
        "fauvette_jardins",
        "fauvette_tete_noire",
        "geai_des_chenes",
        "goeland",
        "grand_corbeau",
        "grive_draine",
        "grive_musicienne",
        "merle_noir",
        "mesange_bleue",
        "mesange_charbonniere",
        "mesange_noire",
        "pic_noir",
        "pic_vert",
        "pigeon_ramier",
        "pinson_des_arbres",
        "pouillot_veloce",
        "rougegorge_familier",
        "tourterelle",
        "troglodyte_mignon",
    ],

    params: {
        mode: ["sounds", "pictures"],
        difficulty: ["easy", "normal", "hard"],
        selectedMode: "sounds",
        selectedDifficulty: "normal"
    },

    answer: null,
    currentBird: "grive_draine",
    noTiles: 4,
    score: 0,
    totalScore: 0,

    init() {
        console.log('init');
        document.querySelector("#start-menu__form").addEventListener("submit", game.handleFormSubmit);
    },

    getRandomBirdFromRemaining() {
        let randomNum = Math.round(Math.random() * (game.remainingBirds.length - 1));
        return game.remainingBirds[randomNum];
    },

    getRandomBirdArray(noTiles) {
        const randomSet = new Set();
        randomSet.add(game.currentBird);
        let randomNum = null;
        for (let i = 1; i < noTiles; i++) {
            while (randomSet.size != i + 1) {
                randomNum = Math.round(Math.random() * (Object.keys(game.birds).length - 1));
                randomSet.add(Object.keys(game.birds)[randomNum]);
            }
        }
        return game.shuffleBirdSetToArray(randomSet);
    },

    shuffleBirdSetToArray(set) {
        let randomSetArray = Array.from(set);
        for (let i = randomSetArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [randomSetArray[i], randomSetArray[j]] = [randomSetArray[j], randomSetArray[i]]
        }
        return randomSetArray;
    },

    removeCurrentBirdFromRemaining() {
        let indexToRemove = game.remainingBirds.indexOf(game.currentBird);
        game.remainingBirds.splice(indexToRemove, 1);
        // console.log("Remaining birds: ", game.remainingBirds);
    },

    createTiles(noTiles) {
        const choiceContainer = document.querySelector("#choice-container");
        const randomBirdArray = game.getRandomBirdArray(noTiles);
        for (let bird of randomBirdArray) {
            let newTile = document.createElement("div");
            newTile.classList.add("tile");
            newTile.textContent = game.birds[bird];
            newTile.setAttribute("data-bird", bird);
            choiceContainer.appendChild(newTile);
        }
    },

    resetTiles() {
        const choiceContainer = document.querySelector("#choice-container");
        choiceContainer.innerHTML = "";
    },

    handleTileClick(event) {
        //we check that we haven't clicked on the parent container
        if (event.target.classList.contains("tile")) {
            game.answer = event.target.dataset.bird;
            game.checkAnswer(event.target);
        }
    },

    checkAnswer(tile) {
        if (game.answer === game.currentBird) {
            console.log("Bravo c'est gagné !");
            game.score++;
            tile.style.backgroundColor = "green";
        } else {
            setTimeout(game.showGoodAnswer, 300);
            tile.style.backgroundColor = "red";
        }
        game.removeCurrentBirdFromRemaining();
        game.totalScore++;
        setTimeout(game.askNewQuestion, 1000);
    },

    showGoodAnswer() {
        let tiles = document.querySelectorAll(".tile");
        for (const tile of tiles) {
            if (tile.dataset.bird == game.currentBird) {
                tile.style.backgroundColor = "green";
            }
        }
    },

    displayQuestion() {
        const questionDiv = document.querySelector("#question");
        let questionHTML = `<audio autoplay controls src="./media/audio/${game.currentBird}.mp3" type="audio/mpeg">Your browser does not support the audio element</audio>`;
        questionDiv.innerHTML = questionHTML;
    },

    askNewQuestion() {
        if (game.remainingBirds.length) {
            game.currentBird = game.getRandomBirdFromRemaining();
            game.resetTiles();
            game.createTiles(game.noTiles);
            game.updateScore();
            document.querySelector("#choice-container").addEventListener("click", game.handleTileClick);
            game.displayQuestion();
        } else {
            game.endOfGame();
        }
    },

    updateScore() {
        const goodAnswers = document.querySelector("#score__good-answers");
        goodAnswers.textContent = game.score;
        const totalScore = document.querySelector("#score__total-score");
        totalScore.textContent = game.totalScore;
    },

    handleFormSubmit(event) {
        event.preventDefault();
        for (const mode of game.params.mode) {
            if (document.querySelector(`#start-menu__form__mode--${mode}`).checked) { game.params.selectedMode = mode };
        }
        for (const difficulty of game.params.difficulty) {
            if (document.querySelector(`#start-menu__form__difficulty--${difficulty}`).checked) { game.params.selectedDifficulty = difficulty };
        }
        game.launchGame();
    },

    launchGame() {
        console.log("Lancement du jeu !");
        document.querySelector("#start-menu").style.display = "none";
        switch (game.params.selectedDifficulty) {
            case "easy":
                game.noTiles = 2;
                break;
            case "normal":
                game.noTiles = 4;
                break;
            case "hard":
                game.noTiles = 6;
                break;
        }
        document.querySelector("#choice-container").style["display"] = "grid";
        document.querySelector("#choice-container").style.gridTemplate = `repeat(2, 200px) / repeat(${game.noTiles / 2}, 200px)`;
        game.askNewQuestion();
        console.log("currentBird : ", game.currentBird);
    },

    endOfGame() {
        console.log("Le jeu est fini !");
        const goodAnswers = document.querySelector("#end-menu__good-answers");
        goodAnswers.textContent = game.score;
        const totalScore = document.querySelector("#end-menu__total-score");
        totalScore.textContent = game.totalScore;
        const endMenu = document.querySelector("#end-menu");
        endMenu.style.display = "flex";
    },
}

document.addEventListener('DOMContentLoaded', game.init);