import { birds } from "./birds.js";

const learning = {
    init() {
        console.log("Learning init");
        learning.createTiles();
    },

    displayAllTiles(birds) {
        const learningContainer = document.querySelector("#learning-container");

    },

    createTiles() {
        const learningContainer = document.querySelector("#learning-container");
        const birdArray = Object.keys(birds);
        for (let bird of birdArray) {
            let newTile = document.createElement("div");
            newTile.classList.add("tile");
            newTile.textContent = birds[bird];
            newTile.style.backgroundImage = `url('../media/images/${bird}.jpg')`;
            newTile.setAttribute("data-bird", bird);
            learningContainer.appendChild(newTile);
        }
    },
};

document.addEventListener('DOMContentLoaded', learning.init);