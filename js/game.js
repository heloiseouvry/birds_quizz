import { birds } from "./birds.js";

const game = {
    remainingChoices: [],

    params: {
        mode: ["sounds_to_names", "sounds_to_pictures"],
        difficulty: ["easy", "normal", "hard"],
        selectedMode: "sounds_to_pictures",
        selectedDifficulty: "normal"
    },

    userAnswer: null,
    currentBird: null,
    noTiles: 4,
    nbQuestions: 15,
    score: 0,
    totalScore: 0,
    playerTurn: true,

    /**
     * Initialisation method 
     */
    init() {
        console.log('Game init');
        document.querySelector("#start-menu__form").addEventListener("submit", game.handleStartFormSubmit);
        setTimeout(() => { document.querySelector("#bubble_hello").style.display = "initial"; }, 600)
        game.initNumberOfRemainingChoicesWith(game.nbQuestions + 1, birds);
    },

    /**
     * Fill the remainingChoices array with a specific number of object's data
     * @param {Number} number 
     * @param {Object} data 
     */
    initNumberOfRemainingChoicesWith(number, data) {
        game.remainingChoices = game.getRandomArrayWithAnswer(number, Object.keys(data), null);
        game.removeItemFromArray(null,game.remainingChoices)
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
     * Remove an item from an array
     * @param {*} item item to remove
     * @param {*} array array list where the bid is removed
     */
    removeItemFromArray(item, array) {
        let indexToRemove = array.indexOf(item);
        array.splice(indexToRemove, 1);
    },

    /**
     * Create a number of tiles with their style depending on game's difficulty played
     * @param {Number} noTiles number of tiles that needs to be created
     * @param {String} difficulty difficulty of the game
     */
    createTiles(noTiles, difficulty) {
        const choiceContainer = document.querySelector("#choice-container");
        const randomBirdArray = game.getRandomArrayWithAnswer(noTiles, Object.keys(birds), game.currentBird);
        for (let bird of randomBirdArray) {
            let newTile = document.createElement("div");
            newTile.classList.add("tile");
            newTile.style.backgroundImage = `url('../media/images/${bird}.jpg')`;
            if (difficulty === "easy") {
                newTile.textContent = birds[bird];
            }
            newTile.setAttribute("data-bird", bird);
            choiceContainer.appendChild(newTile);
        }
        document.querySelector("#choice-container").addEventListener("click", game.handleTileClick);
    },

    /**
     * Remove all the <div class="tile"> from the <div id="choice-container">
     */
    resetTiles() {
        document.querySelector("#choice-container").innerHTML = "";
    },

    /**
     * When user clicks on a tile, get the data and triggers the game.checkAnswer() method. 
     * @param {*} event callback parameter from the event listener
     */
    handleTileClick(event) {
        // we prevent the player to click more than once
        if (game.playerTurn) {
            //we check that we haven't clicked on the parent container
            if (event.target.classList.contains("tile")) {
                game.userAnswer = event.target.dataset.bird;
                game.playerTurn = false;
                game.checkAnswer(event.target, game.currentBird);
            }
        }
    },

    /**
     * Check that selected tile corresponds to the answer then ask a new question.
     * @param {HTMLElement} tile Tile that user clicked on
     * @param {String} answer Text of the answer
     */
    checkAnswer(tile, answer) {
        tile.textContent = birds[tile.dataset.bird];
        if (game.userAnswer === answer) {
            console.log("Bravo c'est gagné !");
            game.score++;
            tile.style.backgroundColor = "green";
            tile.style.boxShadow = "0 0 30px green";
        } else {
            setTimeout(game.showGoodAnswer, 300, game.currentBird);
            tile.style.backgroundColor = "red";
            tile.style.boxShadow = "0 0 30px red";
        }
        game.removeItemFromArray(game.currentBird, game.remainingChoices);
        game.totalScore++;
        setTimeout(game.askNewQuestion, 2000, "audio");
    },

    /**
     * Display the stylized tile corresponding to the correct answer
     * @param {String} answer Text of the answer
     */
    showGoodAnswer(answer) {
        let tiles = document.querySelectorAll(".tile");
        for (const tile of tiles) {
            if (tile.dataset.bird == answer) {
                tile.textContent = birds[tile.dataset.bird];
                tile.style.backgroundColor = "green";
                tile.style.boxShadow = "0 0 30px green";
            }
        }
    },

    /**
     * Display the question depending on its type (audio, image...)
     * @param {String} type Type of the question
     */
    displayQuestion(type) {
        const questionDiv = document.querySelector("#question");
        let questionHTML = null;
        switch (type) {
            case "audio":
                questionHTML = `<audio autoplay controls src="./media/audio/${game.currentBird}.mp3" type="audio/mpeg">Your browser does not support the audio element</audio>`;
                break;
        }
        questionDiv.innerHTML = questionHTML;
    },

    /**
     * If there are choices left, ask a new question by selecting a new answer and creating the corresponding tiles, then display it, otherwise end the game.
     * @param {String} type Type of the question
     */
    askNewQuestion(type) {
        if (game.remainingChoices.length) {
            game.currentBird = game.getRandomItemFromArray(game.remainingChoices);
            game.resetTiles();
            game.createTiles(game.noTiles, game.params.selectedDifficulty);
            game.displayScore();
            game.playerTurn = true;
            game.displayQuestion(type);
        } else {
            game.endOfGame();
        }
    },

    /**
     * Display the scores on HTML page
     */
    displayScore() {
        document.querySelector("#score__good-answers").textContent = game.score;
        document.querySelector("#score__total-score").textContent = game.totalScore;
    },

    /**
     * When user submits the start form, get the data and triggers the game.launchGame() method
     * @param {*} event callback parameter from the event listener
     */
    handleStartFormSubmit(event) {
        event.preventDefault();
        // for (const mode of game.params.mode) {
        //     if (document.querySelector(`#start-menu__form__mode--${mode}`).checked) { game.params.selectedMode = mode };
        // }
        for (const difficulty of game.params.difficulty) {
            if (document.querySelector(`#start-menu__form__difficulty--${difficulty}`).checked) { game.params.selectedDifficulty = difficulty };
        }
        game.launchGame();
    },

    /**
     * Hide the start menu and launch the game by asking a new question.
     */
    launchGame() {
        console.log("Lancement du jeu !");
        const choiceContainer = document.querySelector("#choice-container");
        document.querySelector("#start-menu").style.display = "none";
        document.querySelector("#coucou_dessin").style.display = "none";
        document.querySelector("#bubble_hello").style.display = "none";
        game.askNewQuestion("audio");
    },

    /**
     * Display the end menu with the final score
     */
    endOfGame() {
        console.log("Le jeu est fini !");
        document.querySelector("#end-menu__good-answers").textContent = game.score;
        document.querySelector("#end-menu__total-score").textContent = game.totalScore;
        document.querySelector("#end-menu").style.display = "flex";
    },
}

document.addEventListener('DOMContentLoaded', game.init);