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

    answer: null,
    currentBird: "mesange_charbonniere",

    init() {
        console.log('init');
        game.askNewQuestion();
    },

    getRandomBird() {
        let randomNum = Math.round(Math.random() * (Object.keys(game.birds).length - 1));
        return Object.keys(game.birds)[randomNum];
    },

    getRandomBirdSet(noTiles) {
        const randomSet = new Set();
        let randomNum = null;
        for (let i = 0; i < noTiles; i++) {
            while (randomSet.size != i + 1) {
                randomNum = Math.round(Math.random() * (Object.keys(game.birds).length - 1));
                randomSet.add(Object.keys(game.birds)[randomNum]);
            }
        }
        if (!randomSet.has(game.currentBird)) {
            console.log("La réponse n'est pas dedans :(");
            let randomSetValues = randomSet.values();
            let randomDelete = Math.round((Math.random() * (randomSet.size - 1)));
            let currentValue = null;
            console.log(randomDelete);
            for (let i = 0; i < randomSet.size; i++) {
                currentValue = randomSetValues.next().value;
                if (i === randomDelete) {
                    console.log("A supprimer: ", currentValue);
                    randomSet.delete(currentValue);
                    randomSet.add(game.currentBird);
                }
            }
        }
        return randomSet;
    },

    createTiles(noTiles) {
        const choiceContainer = document.querySelector("#choice-container");
        const randomBirdSet = game.getRandomBirdSet(noTiles);
        for (let bird of randomBirdSet) {
            let newTile = document.createElement("div");
            newTile.classList.add("tile");
            newTile.textContent = game.birds[bird];
            newTile.setAttribute("data-bird", bird);
            choiceContainer.appendChild(newTile);
        }
    },

    resetTiles(){
        const choiceContainer = document.querySelector("#choice-container");
        choiceContainer.innerHTML = "";
    },

    handleTileClick(event) {
        //we check that we haven't clicked on the parent container
        if (event.target.classList.contains("tile")) {
            game.answer = event.target.dataset.bird;
            console.log(game.answer);
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
        setTimeout(game.askNewQuestion, 300);
    },

    displayQuestion(){
        const questionDiv = document.querySelector("#question");
        let questionHTML = `<audio autoplay controls src="./media/audio/${game.currentBird}.mp3" type="audio/mpeg">Your browser does not support the audio element</audio>`;
        questionDiv.innerHTML = questionHTML;
    },

    askNewQuestion(){
        game.currentBird = game.getRandomBird();
        game.resetTiles();
        game.createTiles(4);
        document.querySelector("#choice-container").addEventListener("click", game.handleTileClick);
        game.displayQuestion();
    },
}

document.addEventListener('DOMContentLoaded', game.init);