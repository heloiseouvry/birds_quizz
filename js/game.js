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

    init() {
        console.log('init');
        game.createTiles(4);
    },

    getRandomBird() {
        let randomNum = Math.round(Math.random() * (Object.keys(game.birds).length - 1));
        return Object.keys(game.birds)[randomNum];
    },

    getRandomBirdSet(noTiles) {
        const randomSet = new Set();
        let randomNum = null;
        for (let i = 0; i < noTiles; i++) {
            while(randomSet.size != i + 1) { 
                randomNum = Math.round(Math.random() * (Object.keys(game.birds).length - 1));
                randomSet.add(Object.keys(game.birds)[randomNum]);
            }
        }
        return randomSet;
    },
    
    createTiles(noTiles) {
        const choiceContainer = document.querySelector("#choice-container");
        const randomBirdSet = game.getRandomBirdSet(noTiles);
        for(let bird of randomBirdSet){
            let newTile = document.createElement("div");
            newTile.classList.add("tile");
            newTile.textContent = game.birds[bird];
            newTile.setAttribute("data-bird", bird);
            choiceContainer.appendChild(newTile);
        }
    },
}

document.addEventListener('DOMContentLoaded', game.init);