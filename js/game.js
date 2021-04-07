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
    playerTurn: true,

    init() {
        console.log('init');
        document.querySelector("#start-menu__form").addEventListener("submit", game.handleFormSubmit);
        setTimeout(() => { document.querySelector("#bubble_hello").style.display = "initial"; }, 600)
    },

    /**
     * Returns a random value from an array
     * @param {Array} array 
     * @returns Value from a random array's index
     */
    getRandomItemFromArray(array) {
        return array[Math.round(Math.random() * (array.length - 1))];
    },

    /**
     * Create a random array of unique value which contains as well the right answer
     * @param {Number} noTiles Number of choice tiles
     * @returns A shuffled array
     */
    getRandomArrayWithAnswer(noTiles, array, answer) {
        const randomSet = new Set();
        randomSet.add(answer);
        for (let i = 1; i < noTiles; i++) {
            // We loop until we add a new and unique bird to the array
            while (randomSet.size != i + 1) {
                randomSet.add(game.getRandomItemFromArray(array));
            }
        }
        return game.setToShuffleArray(randomSet);
    },

    /**
     * Converts a set into an array and shuffle it.
     * @param {Set} set 
     * @returns Shuffled array
     */
    setToShuffleArray(set) {
        let randomSetArray = Array.from(set);
        for (let i = randomSetArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [randomSetArray[i], randomSetArray[j]] = [randomSetArray[j], randomSetArray[i]]
        }
        return randomSetArray;
    },

    /**
     * Remove a bird from an array
     * @param {*} bird bird's name to remove
     * @param {*} array array list where the bid is removed
     */
    removeBirdFromArray(bird, array) {
        let indexToRemove = array.indexOf(bird);
        array.splice(indexToRemove, 1);
    },

    createTiles(noTiles, mode) {
        const choiceContainer = document.querySelector("#choice-container");
        const randomBirdArray = game.getRandomArrayWithAnswer(noTiles, Object.keys(game.birds), game.currentBird);
        for (let bird of randomBirdArray) {
            let newTile = document.createElement("div");
            newTile.classList.add("tile");
            switch (mode) {
                case "sounds":
                    newTile.textContent = game.birds[bird];
                    break;
                case "pictures":
                    newTile.style.backgroundImage = `url('../media/images/${bird}.png')`;
                    break;
            }
            newTile.setAttribute("data-bird", bird);
            choiceContainer.appendChild(newTile);
        }
    },

    resetTiles() {
        document.querySelector("#choice-container").innerHTML = "";
    },

    handleTileClick(event) {
        if (game.playerTurn) {
            //we check that we haven't clicked on the parent container
            if (event.target.classList.contains("tile")) {
                game.answer = event.target.dataset.bird;
                game.playerTurn = false;
                game.checkAnswer(event.target);
            }
        }
    },

    checkAnswer(tile) {
        tile.textContent = game.birds[tile.dataset.bird];
        if (game.answer === game.currentBird) {
            console.log("Bravo c'est gagné !");
            game.score++;
            tile.style.backgroundColor = "green";
            tile.style.boxShadow = "0 0 30px green";
        } else {
            setTimeout(game.showGoodAnswer, 300);
            tile.style.backgroundColor = "red";
            tile.style.boxShadow = "0 0 30px red";
        }
        game.removeBirdFromArray(game.currentBird, game.remainingBirds);
        game.totalScore++;
        setTimeout(game.askNewQuestion, 2000);
    },

    showGoodAnswer() {
        let tiles = document.querySelectorAll(".tile");
        for (const tile of tiles) {
            if (tile.dataset.bird == game.currentBird) {
                tile.textContent = game.birds[tile.dataset.bird];
                tile.style.backgroundColor = "green";
                tile.style.boxShadow = "0 0 30px green";
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
            game.currentBird = game.getRandomItemFromArray(game.remainingBirds);
            game.resetTiles();
            game.createTiles(game.noTiles, game.params.selectedMode);
            game.updateScore();
            game.playerTurn = true;
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
        const choiceContainer = document.querySelector("#choice-container");
        document.querySelector("#start-menu").style.display = "none";
        document.querySelector("#coucou_dessin").style.display = "none";
        document.querySelector("#bubble_hello").style.display = "none";
        switch (game.params.selectedDifficulty) {
            case "easy":
                game.noTiles = 2;
                choiceContainer.classList.add("grid_1-2");
                break;
            case "normal":
                game.noTiles = 4;
                choiceContainer.classList.add("grid_2-2");
                break;
            case "hard":
                game.noTiles = 6;
                choiceContainer.classList.add("grid_2-3");
                break;
        }
        // document.querySelector("#choice-container").style["display"] = "grid";
        // document.querySelector("#choice-container").style.gridTemplate = `repeat(2, 200px) / repeat(${game.noTiles / 2}, 200px)`;
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