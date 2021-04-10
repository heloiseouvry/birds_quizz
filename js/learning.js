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
            newTile.classList.add("tile--learning");
            newTile.textContent = birds[bird];
            newTile.style.backgroundImage = `url('../media/images/${bird}.jpg')`;
            newTile.setAttribute("data-bird", bird);
            let audioHTML = document.createElement("audio");
            audioHTML.innerHTML = `Your browser does not support the audio element`;
            audioHTML.setAttribute("type", "audio/mpeg");
            // audioHTML.setAttribute("controls", "");
            audioHTML.setAttribute("src", `./media/audio/${bird}.mp3`);
            audioHTML.setAttribute("data-bird", bird);
            newTile.appendChild(audioHTML);
            learningContainer.appendChild(newTile);
        }
        document.querySelector("#learning-container").addEventListener("click", learning.handleTileClick);
    },

    /**
    * When user clicks on a tile, play/pause selected bird's song. 
    * @param {*} event callback parameter from the event listener
    */
    handleTileClick(event) {
        //we check that we haven't clicked on the parent container
        if (event.target.classList.contains("tile")) {
            let audioTags = document.querySelectorAll("audio");
            let selectedAudio = Array.from(audioTags).find( (elem) => { return elem.dataset.bird === event.target.dataset.bird; });
            if(selectedAudio.paused){
                for(const item of audioTags){
                    item.pause();
                }
                selectedAudio.play();
            } else{
                selectedAudio.pause();
            }
        }
    },
};

document.addEventListener('DOMContentLoaded', learning.init);