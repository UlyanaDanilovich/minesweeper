import { resetStore, gameOver, isWin } from "./service.js";
import { initialStore } from "./constants.js";

const field = document.querySelector('.field');
const reset = document.querySelector('.reset');

let store = structuredClone(initialStore);

window.addEventListener('load', () => {
    resetStore(store);

    const buttonSize = `${100 / store.fieldSize}%`;
    store.fieldData.forEach((arr, i) => {
        arr.forEach((_, j) => {
            const button = document.createElement('button');
            button.classList.add("fieldButton");
            button.style.width = buttonSize;
            button.style.height = buttonSize;
            button.dataset.index = `${i}:${j}`;
            field.append(button);
        });
    });
});

field.addEventListener('click', (event) => {
    if (store.isGameOver) {
        return;
    }
    const [i, j] = event.target.dataset.index.split(":");
    const data = store.fieldData[i][j];

    if (data.isMarked) {
        return;
    }

    if (data.isMine) {
        gameOver(store);
        return;
    }

    event.target.innerHTML = data.value;
    event.target.style.color = store.colorMap[data.value];
    data.isOpen = true;
    event.target.classList.add('opened');

    if (isWin(store)) {
        alert('Win');
        store.isGameOver = true;
    }
});

field.addEventListener('contextmenu', (event) => {
    event.preventDefault();
    if (store.isGameOver) {
        return;
    }
    const [i, j] = event.target.dataset.index.split(":");
    const data = store.fieldData[i][j];

    if (data.isOpen) {
        return;
    }

    if (data.isMarked) {
        data.isMarked = false;
        event.target.innerHTML = '';
    } else {
        data.isMarked = true;
        event.target.innerHTML = '🚩';
    }

    if (isWin(store)) {
        alert('Win');
        store.isGameOver = true;
    }
});

reset.addEventListener('click', () => {
    store = JSON.parse(JSON.stringify(initialStore));
    resetStore(store);

    const fieldButtons = document.querySelectorAll('.fieldButton');
    [...fieldButtons].forEach(button => {
        button.innerHTML = '';
        button.classList.remove('opened');
        button.classList.remove('mine');
    });
});
