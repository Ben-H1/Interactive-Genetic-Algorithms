// algorithm options
var chanceToCrossover;
var chanceToMutate;
var chanceToGoUp;
var chanceToGoDown;
var minimumChange;
var maximumChange;
var decimalPlaces;
var populationSize;

var populationBoxes = [];
var population = [];

// fitness function
var x1Goal;
var x2Goal;
var x3Goal;
var x4Goal;
var x5Goal;

// algorithm options - inputs                                                     algorithm options - displays
var chanceToCrossoverSlider = document.querySelector(`#chanceToCrossoverSlider`); var chanceToCrossoverDisplay = document.querySelector(`#chanceToCrossoverDisplay`);
var chanceToMutateSlider    = document.querySelector(`#chanceToMutateSlider`);    var chanceToMutateDisplay    = document.querySelector(`#chanceToMutateDisplay`);
var chanceToGoUpSlider      = document.querySelector(`#chanceToGoUpSlider`);      var chanceToGoUpDisplay      = document.querySelector(`#chanceToGoUpDisplay`);
var chanceToGoDownSlider    = document.querySelector(`#chanceToGoDownSlider`);    var chanceToGoDownDisplay    = document.querySelector(`#chanceToGoDownDisplay`);
var minimumChangeSlider     = document.querySelector(`#minimumChangeSlider`);     var minimumChangeDisplay     = document.querySelector(`#minimumChangeDisplay`);
var maximumChangeSlider     = document.querySelector(`#maximumChangeSlider`);     var maximumChangeDisplay     = document.querySelector(`#maximumChangeDisplay`);
var decimalPlacesSlider     = document.querySelector(`#decimalPlacesSlider`);     var decimalPlacesDisplay     = document.querySelector(`#decimalPlacesDisplay`);
var populationSizeSlider    = document.querySelector(`#populationSizeSlider`);    var populationSizeDisplay    = document.querySelector(`#populationSizeDisplay`);

// algorithm options - input events
chanceToCrossoverSlider.addEventListener(`input`, (event) => { updateDisplay         (chanceToCrossoverDisplay,                                         event.target.value,   `percentage`); });
chanceToMutateSlider   .addEventListener(`input`, (event) => { updateDisplay         (chanceToMutateDisplay,                                            event.target.value,   `percentage`); });
chanceToGoUpSlider     .addEventListener(`input`, (event) => { updateOppositeDisplays(chanceToGoUpDisplay,   event.target.value, chanceToGoDownDisplay, chanceToGoDownSlider, `percentage`); });
chanceToGoDownSlider   .addEventListener(`input`, (event) => { updateOppositeDisplays(chanceToGoDownDisplay, event.target.value, chanceToGoUpDisplay,   chanceToGoUpSlider,   `percentage`); });
minimumChangeSlider    .addEventListener(`input`, (event) => { updateDisplay         (minimumChangeDisplay,                                             event.target.value,   `decimal`); });
maximumChangeSlider    .addEventListener(`input`, (event) => { updateDisplay         (maximumChangeDisplay,                                             event.target.value,   `decimal`); });
decimalPlacesSlider    .addEventListener(`input`, (event) => { updateDisplay         (decimalPlacesDisplay,                                             event.target.value,   `decimalPlaces`); });
populationSizeSlider   .addEventListener(`input`, (event) => { updateDisplay         (populationSizeDisplay,                                            event.target.value,   ``); });

// algorithm options - change events
chanceToCrossoverSlider.addEventListener(`change`, (event) => { chanceToCrossover = event.target.value; });
chanceToMutateSlider   .addEventListener(`change`, (event) => { chanceToMutate    = event.target.value; });
chanceToGoUpSlider     .addEventListener(`change`, (event) => { chanceToGoUp      = event.target.value; chanceToGoDown = chanceToGoDownSlider.value; });
chanceToGoDownSlider   .addEventListener(`change`, (event) => { chanceToGoDown    = event.target.value; chanceToGoUp   = chanceToGoUpSlider.value; });
minimumChangeSlider    .addEventListener(`change`, (event) => { minimumChange     = event.target.value; });
maximumChangeSlider    .addEventListener(`change`, (event) => { maximumChange     = event.target.value; });
decimalPlacesSlider    .addEventListener(`change`, (event) => { decimalPlaces     = event.target.value; });
populationSizeSlider   .addEventListener(`change`, (event) => { populationSize    = event.target.value; refreshPopulationBlock(populationSize); });

// fitness function - inputs                        fitness function - displays                                       fitness function - second displays
var x1Slider = document.querySelector(`#x1Slider`); var x1SliderDisplay = document.querySelector(`#x1SliderDisplay`); var x1Display = document.querySelector(`#x1Display`);
var x2Slider = document.querySelector(`#x2Slider`); var x2SliderDisplay = document.querySelector(`#x2SliderDisplay`); var x2Display = document.querySelector(`#x2Display`);
var x3Slider = document.querySelector(`#x3Slider`); var x3SliderDisplay = document.querySelector(`#x3SliderDisplay`); var x3Display = document.querySelector(`#x3Display`);
var x4Slider = document.querySelector(`#x4Slider`); var x4SliderDisplay = document.querySelector(`#x4SliderDisplay`); var x4Display = document.querySelector(`#x4Display`);
var x5Slider = document.querySelector(`#x5Slider`); var x5SliderDisplay = document.querySelector(`#x5SliderDisplay`); var x5Display = document.querySelector(`#x5Display`);

// fitness function - input events
x1Slider.addEventListener(`input`, (event) => { updateDisplay(x1SliderDisplay, event.target.value, `decimal`); updateDisplay(x1Display, event.target.value, `decimal`); });
x2Slider.addEventListener(`input`, (event) => { updateDisplay(x2SliderDisplay, event.target.value, `decimal`); updateDisplay(x2Display, event.target.value, `decimal`); });
x3Slider.addEventListener(`input`, (event) => { updateDisplay(x3SliderDisplay, event.target.value, `decimal`); updateDisplay(x3Display, event.target.value, `decimal`); });
x4Slider.addEventListener(`input`, (event) => { updateDisplay(x4SliderDisplay, event.target.value, `decimal`); updateDisplay(x4Display, event.target.value, `decimal`); });
x5Slider.addEventListener(`input`, (event) => { updateDisplay(x5SliderDisplay, event.target.value, `decimal`); updateDisplay(x5Display, event.target.value, `decimal`); });

// fitness function - change events
x1Slider.addEventListener(`change`, (event) => { x1Goal = event.target.value; });
x2Slider.addEventListener(`change`, (event) => { x2Goal = event.target.value; });
x3Slider.addEventListener(`change`, (event) => { x3Goal = event.target.value; });
x4Slider.addEventListener(`change`, (event) => { x4Goal = event.target.value; });
x5Slider.addEventListener(`change`, (event) => { x5Goal = event.target.value; });

// update a display
function updateDisplay(display, value, type) {
    display.innerText = value;
    addDisplayType(display, type);
}

// update two displays with values adding up to 100
function updateOppositeDisplays(display, value, oppositeDisplay, oppositeElement, type) {
    display.innerText = value;

    var oppositeValue = 100 - value;
    oppositeElement.value     = oppositeValue;
    oppositeDisplay.innerText = oppositeValue;

    addDisplayType(display,         type);
    addDisplayType(oppositeDisplay, type);
}

// add extra text to a display
function addDisplayType(display, type) {
    switch (type) {
        case `percentage`:
            display.innerText += `%`;
            break;
        
        case `decimal`:
            if (Number.isInteger(parseFloat(display.innerText))) {
                display.innerText += `.0`;
            }
            break;

        case `decimalPlaces`:
            display.innerText += ` decimal places`;
            break;

        case `maths`:
            display.innerText = `\\(` + display.innerText + `\\)`;
            break;

        default:
            break;
    }
}

// buttons - inputs
var runButton  = document.querySelector(`#runButton`);
var stepButton = document.querySelector(`#stepButton`);
var stopButton = document.querySelector(`#stopButton`);

// buttons - click events
generateInitialPopulationButton.addEventListener(`click`, (element) => { generateInitialPopulation(); });
runButton                      .addEventListener(`click`, (element) => {});
stepButton                     .addEventListener(`click`, (element) => {});
stopButton                     .addEventListener(`click`, (element) => {});

// initialise everything
function initialise() {
    // algorithm options
    chanceToCrossover = 50;
            updateDisplay(chanceToCrossoverDisplay, chanceToCrossover, `percentage`);
            chanceToCrossoverSlider.value = chanceToCrossover;
    chanceToMutate = 50;
            updateDisplay(chanceToMutateDisplay, chanceToMutate, `percentage`);
            chanceToMutateSlider.value = chanceToMutate;
    chanceToGoUp = 50;
            chanceToGoDown = 100 - chanceToGoUp;
            updateOppositeDisplays(chanceToGoUpDisplay, chanceToGoDown, chanceToGoDownDisplay, chanceToGoUp, `percentage`);
            chanceToGoUpSlider.value = chanceToGoUp;
            chanceToGoDownSlider.value = chanceToGoDown;
    minimumChange = 1;
            updateDisplay(minimumChangeDisplay, minimumChange, `decimal`);
            minimumChangeSlider.value = minimumChange;
    maximumChange = 10;
            updateDisplay(maximumChangeDisplay, maximumChange, `decimal`);
            maximumChangeSlider.value = maximumChange;
    decimalPlaces = 1;
            updateDisplay(decimalPlacesDisplay, decimalPlaces, `decimalPlaces`);
            decimalPlacesSlider.value = decimalPlaces;
    populationSize = 10;
            updateDisplay(populationSizeDisplay, populationSize, ``);
            populationSizeSlider.value = populationSize;

    // fitness function
    x1Goal = 5.0;
            updateDisplay(x1SliderDisplay, x1Goal, `decimal`);
            updateDisplay(x1Display,       x1Goal, `decimal`);
    x2Goal = 5.0;
            updateDisplay(x2SliderDisplay, x2Goal, `decimal`);
            updateDisplay(x2Display,       x2Goal, `decimal`);
    x3Goal = 5.0;
            updateDisplay(x3SliderDisplay, x3Goal, `decimal`);
            updateDisplay(x3Display,       x3Goal, `decimal`);
    x4Goal = 5.0;
            updateDisplay(x4SliderDisplay, x4Goal, `decimal`);
            updateDisplay(x4Display,       x4Goal, `decimal`);
    x5Goal = 5.0;
            updateDisplay(x5SliderDisplay, x5Goal, `decimal`);
            updateDisplay(x5Display,       x5Goal, `decimal`);

    refreshPopulationBlock(populationSize);
}

function refreshPopulationBlock(populationSize) {
    clearPopulationBlock();
    createPopulationBlock(populationSize);
}

function clearPopulationBlock() {
    var populationTable = document.querySelector(`#populationTable`);

    while (populationTable.childNodes.length > 2) {
        populationTable.removeChild(populationTable.lastChild);
    }
}

function createPopulationBlock(populationSize) {
    var populationTable = document.querySelector(`#populationTable`);
    
    for (var i = 0; i < populationSize; i++) {
        var box = document.createElement(`tr`);
        box.className = `solutionBox`;

        var indexBox = document.createElement(`td`);
        indexBox.className = `solutionIndex`
        indexBox.innerText = i + 1;
        box.appendChild(indexBox);

        var x1Box = document.createElement(`td`);
        var x2Box = document.createElement(`td`);
        var x3Box = document.createElement(`td`);
        var x4Box = document.createElement(`td`);
        var x5Box = document.createElement(`td`);

        var boxes = new Array(x1Box, x2Box, x3Box, x4Box, x5Box);
        populationBoxes.push(boxes);

        for (var j = 0; j < boxes.length; j++) {
            boxes[j].className = `xBox`;
            box.appendChild(boxes[j]);
        }

        populationTable.appendChild(box);
    }
}

function generateInitialPopulation() {
    clearPopulation();

    for (var i = 0; i < populationSize; i++) {
        var currentSolution = [];

        for (var j = 0; j < 5; j++) {
            var random = (Math.random() * 11).toFixed(decimalPlaces);
            currentSolution.push(random);
        }

        population.push(currentSolution);
    }

    updatePopulationDisplay();
}

function clearPopulation() {
    population = [];
}

function updatePopulationDisplay() {
    for (var i = 0; i < populationSize; i++) {
        var currentSolution = population[i];

        for (var j = 0; j < currentSolution.length; j++) {
            populationBoxes[i][j].innerText = currentSolution[j];
        }
    }
}

function getFitness(solution) {
    var fitness = 0;

    var goals = new Array(x1Goal, x2Goal, x3Goal, x4Goal, x5Goal);

    for (var i = 0; i < solution.length; i++) {
        fitness += +Math.abs(goals[i] - solution[i]).toFixed(decimalPlaces);
    }

    return fitness.toFixed(decimalPlaces);
}

initialise();