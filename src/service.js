function randomInteger(min, max) {
    const rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
}

function getArrayOfMines(store) {
    const array = [];
    const numberOfMines = Math.floor(store.fieldSize ** 2 * store.minePercent);
    new Array(numberOfMines).fill([]).forEach(() => {
        array.push([randomInteger(0, store.fieldSize - 1), randomInteger(0, store.fieldSize - 1)]);
    });
    return array;
}

function getNumberOfRoundMines(store, i, j) {
    const arr = store.fieldData;

    const top = arr[i]?.[j - 1]?.isMine;
    const bottom = arr[i]?.[j + 1]?.isMine;
    const right = arr[i + 1]?.[j]?.isMine;
    const left = arr[i - 1]?.[j]?.isMine;

    const topLeft = arr[i - 1]?.[j - 1]?.isMine;
    const topRight = arr[i + 1]?.[j - 1]?.isMine;
    const bottomRight = arr[i + 1]?.[j + 1]?.isMine;
    const bottomLeft = arr[i - 1]?.[j + 1]?.isMine;

    return [top, bottom, right, left, topLeft, topRight, bottomRight, bottomLeft].reduce((acc, value) => 
        value !== undefined ? acc + Number(value) : acc,
        0
    );
}

export function resetStore(store) {
    store.fieldData = new Array(store.fieldSize).fill([]).map(() => {
        return new Array(store.fieldSize).fill({}).map(() => ({
            isOpen: false,
            isMarked: false,
            isMine: false,
            value: null,
        }));
    });

    getArrayOfMines(store).forEach((arr) => {
        store.fieldData[arr[0]][arr[1]].isMine = true;
    });

    store.fieldData.forEach((arr, i) => {
        arr.forEach((_, j) => {
            store.fieldData[i][j].value = getNumberOfRoundMines(store, i, j);
        });
    });
}

export function gameOver(store) {
    const buttons = document.querySelectorAll('.fieldButton');
    [...buttons].forEach((button, index) => {
        const i = Math.floor(index / store.fieldSize);
        const j = index % store.fieldSize;

        if (store.fieldData[i][j].isMine) {
            button.classList.add('mine');
        }
    });
    store.isGameOver = true;
}

export function isWin(store) {
    return store.fieldData.every((arr) => {
        return arr.every((data) => data.isOpen && !data.isMine || data.isMine && data.isMarked);
    });
}