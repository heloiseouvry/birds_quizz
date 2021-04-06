const game = {
    birds: {
        "alouette_lulu": "Alouette Lulu",
        "chardonneret_elegant": "Chardonneret Elegant",
        "chouette_hulotte": "Chouette Hulotte",
        "grive_draine": "Grive Draine",
        "merle_noir": "Merle Noir",
        "mesange_bleue": "Mésange Bleue",
        "mesange_charbonniere": "Mésange Charbonnière",
        "mesange_noire": "Mésange noire",
        "rougegorge_familier": "Rouge-gorge familier",
        "troglodyte_mignon": "Troglodyte Mignon",
    },

    remainingBirds: [
        "alouette_lulu",
        "chardonneret_elegant",
        "chouette_hulotte",
        "grive_draine",
        "merle_noir",
        "mesange_bleue",
        "mesange_charbonniere",
        "mesange_noire",
        "rougegorge_familier",
        "troglodyte_mignon",
    ],

    answer: null,
    currentBird: "grive_draine",
    noTiles: 4,
    score: 0,

    init() {
        console.log('init');
        game.askNewQuestion();
        console.log("currentBird : ", game.currentBird);
    },

    getRandomRemainingBird() {
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
        console.log("Remaining birds: ", game.remainingBirds);
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
            tile.style.backgroundColor = "green";
        } else {
            tile.style.backgroundColor = "red";
        }
        game.removeCurrentBirdFromRemaining();
        setTimeout(game.askNewQuestion, 300);
    },

    displayQuestion() {
        const questionDiv = document.querySelector("#question");
        let questionHTML = `<audio autoplay controls src="./media/audio/${game.currentBird}.mp3" type="audio/mpeg">Your browser does not support the audio element</audio>`;
        questionDiv.innerHTML = questionHTML;
    },

    askNewQuestion() {
        if (game.remainingBirds.length) {
            game.currentBird = game.getRandomRemainingBird();
            game.resetTiles();
            game.createTiles(4);
            document.querySelector("#choice-container").addEventListener("click", game.handleTileClick);
            game.displayQuestion();
        } else {
            game.endOfGame();
        }
    },

    endOfGame() {
        console.log("Le jeu est fini !");
    },
}

document.addEventListener('DOMContentLoaded', game.init);