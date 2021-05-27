var chanceToCrossover;
var chanceToMutate;
var chanceToGoUp;
var chanceToGoDown;
var minimumChange;
var maximumChange;
var decimalPlaces;
var populationSize;
var solutionSize;

var goalSliders;
var goalDisplays1;
var goalDisplays2;
var goals;
var population;

var chanceToCrossoverSlider = getById(`chanceToCrossoverSlider`); var chanceToCrossoverDisplay = getById(`chanceToCrossoverDisplay`);
var chanceToMutateSlider    = getById(`chanceToMutateSlider`   ); var chanceToMutateDisplay    = getById(`chanceToMutateDisplay`   );
var chanceToGoUpSlider      = getById(`chanceToGoUpSlider`     ); var chanceToGoUpDisplay      = getById(`chanceToGoUpDisplay`     );
var chanceToGoDownSlider    = getById(`chanceToGoDownSlider`   ); var chanceToGoDownDisplay    = getById(`chanceToGoDownDisplay`   );
var minimumChangeSlider     = getById(`minimumChangeSlider`    ); var minimumChangeDisplay     = getById(`minimumChangeDisplay`    );
var maximumChangeSlider     = getById(`maximumChangeSlider`    ); var maximumChangeDisplay     = getById(`maximumChangeDisplay`    );
var decimalPlacesSlider     = getById(`decimalPlacesSlider`    ); var decimalPlacesDisplay     = getById(`decimalPlacesDisplay`    );
var populationSizeSlider    = getById(`populationSizeSlider`   ); var populationSizeDisplay    = getById(`populationSizeDisplay`   );
var solutionSizeSlider      = getById(`solutionSizeSlider`     ); var solutionSizeDisplay      = getById(`solutionSizeDisplay`     );

chanceToCrossoverSlider.addEventListener(`input`, (event) => { updateDisplay(chanceToCrossoverDisplay, event.target.value                                             ); chanceToCrossover = event.target.value;                                        });
chanceToMutateSlider   .addEventListener(`input`, (event) => { updateDisplay(chanceToMutateDisplay   , event.target.value                                             ); chanceToMutate    = event.target.value;                                        });
chanceToGoUpSlider     .addEventListener(`input`, (event) => { updateDisplay(chanceToGoUpDisplay     , event.target.value, chanceToGoDownSlider, chanceToGoDownDisplay); chanceToGoUp      = event.target.value; chanceToGoDown = 100 - chanceToGoUp;   });
chanceToGoDownSlider   .addEventListener(`input`, (event) => { updateDisplay(chanceToGoDownDisplay   , event.target.value, chanceToGoUpSlider  , chanceToGoUpDisplay  ); chanceToGoDown    = event.target.value; chanceToGoUp   = 100 - chanceToGoDown; });
minimumChangeSlider    .addEventListener(`input`, (event) => { updateDisplay(minimumChangeDisplay    , event.target.value                                             ); minimumChange     = event.target.value;                                        });
maximumChangeSlider    .addEventListener(`input`, (event) => { updateDisplay(maximumChangeDisplay    , event.target.value                                             ); maximumChange     = event.target.value;                                        });
decimalPlacesSlider    .addEventListener(`input`, (event) => { updateDisplay(decimalPlacesDisplay    , event.target.value                                             ); decimalPlaces     = event.target.value; updateDecimalPlaces();                 });
populationSizeSlider   .addEventListener(`input`, (event) => { updateDisplay(populationSizeDisplay   , event.target.value                                             ); populationSize    = event.target.value;                                        });
solutionSizeSlider     .addEventListener(`input`, (event) => { updateDisplay(solutionSizeDisplay     , event.target.value                                             ); solutionSize      = event.target.value; refreshGoals();                        });

chanceToCrossoverDisplay.addEventListener(`input`, (event) => { chanceToCrossoverSlider.value = event.target.value; chanceToCrossover = event.target.value;                 });
chanceToMutateDisplay   .addEventListener(`input`, (event) => { chanceToMutateSlider   .value = event.target.value; chanceToMutate    = event.target.value;                 });
chanceToGoUpDisplay     .addEventListener(`input`, (event) => { chanceToGoUpSlider     .value = event.target.value; chanceToGoUp      = event.target.value;                 });
chanceToGoDownDisplay   .addEventListener(`input`, (event) => { chanceToGoDownSlider   .value = event.target.value; chanceToGoDown    = event.target.value;                 });
minimumChangeDisplay    .addEventListener(`input`, (event) => { minimumChangeSlider    .value = event.target.value; minimumChange     = event.target.value;                 });
maximumChangeDisplay    .addEventListener(`input`, (event) => { maximumChangeSlider    .value = event.target.value; maximumChange     = event.target.value;                 });
decimalPlacesDisplay    .addEventListener(`input`, (event) => { decimalPlacesSlider    .value = event.target.value; decimalPlaces     = event.target.value;                 });
populationSizeDisplay   .addEventListener(`input`, (event) => { populationSizeSlider   .value = event.target.value; populationSize    = event.target.value;                 });
solutionSizeDisplay     .addEventListener(`input`, (event) => { solutionSizeSlider     .value = event.target.value; solutionSize      = event.target.value; refreshGoals(); });

function getById(id) {
    return document.querySelector(`#${id}`);
}

function updateDisplay(display, value, slider2, display2) {
    display.value = value;

    if (slider2 != null && display2 != null) {
        var oppositeValue = 100 - value;

        slider2.value  = oppositeValue;
        display2.value = oppositeValue;
    }
}

function updateDecimalPlaces() {
    var newStep = 1 / Math.pow(10, decimalPlaces);

    minimumChangeSlider .step = newStep; minimumChangeSlider .min = newStep;
    minimumChangeDisplay.step = newStep; minimumChangeDisplay.min = newStep;

    if (minimumChange < newStep) {
        minimumChange = newStep;
        updateDisplay(minimumChangeSlider,  minimumChange);
        updateDisplay(minimumChangeDisplay, minimumChange);
    }

    maximumChangeSlider .step = newStep; maximumChangeSlider .min = newStep;
    maximumChangeDisplay.step = newStep; maximumChangeDisplay.min = newStep;

    if (maximumChange < newStep) {
        maximumChange = newStep;
        updateDisplay(maximumChangeSlider,  maximumChange);
        updateDisplay(maximumChangeDisplay, maximumChange);
    }
}

function initialise() {
    chanceToCrossover = 50                ; updateDisplay(chanceToCrossoverSlider, chanceToCrossover); updateDisplay(chanceToCrossoverDisplay, chanceToCrossover);
    chanceToMutate    = 50                ; updateDisplay(chanceToMutateSlider   , chanceToMutate   ); updateDisplay(chanceToMutateDisplay   , chanceToMutate   );
    chanceToGoUp      = 50                ; updateDisplay(chanceToGoUpSlider     , chanceToGoUp     ); updateDisplay(chanceToGoUpDisplay     , chanceToGoUp     );
    chanceToGoDown    = 100 - chanceToGoUp; updateDisplay(chanceToGoDownSlider   , chanceToGoDown   ); updateDisplay(chanceToGoDownDisplay   , chanceToGoDown   );
    minimumChange     = 0.1               ; updateDisplay(minimumChangeSlider    , minimumChange    ); updateDisplay(minimumChangeDisplay    , minimumChange    );
    maximumChange     = 10                ; updateDisplay(maximumChangeSlider    , maximumChange    ); updateDisplay(maximumChangeDisplay    , maximumChange    );
    decimalPlaces     = 1                 ; updateDisplay(decimalPlacesSlider    , decimalPlaces    ); updateDisplay(decimalPlacesDisplay    , decimalPlaces    );
    populationSize    = 10                ; updateDisplay(populationSizeSlider   , populationSize   ); updateDisplay(populationSizeDisplay   , populationSize   );
    solutionSize      = 5                 ; updateDisplay(solutionSizeSlider     , solutionSize     ); updateDisplay(solutionSizeDisplay     , solutionSize     );

    refreshGoals();
}

initialise();

function refreshGoals() {
    clearGoals();
    createGoals();
}

function clearGoals() {
    var fitnessFunctionTable = getById(`fitnessFunctionTable`);
    fitnessFunctionTable.innerHTML = ``;

    goalSliders   = [];
    goalDisplays1 = [];
    goalDisplays2 = [];
    goals         = [];
}

function createGoals() {
    var fitnessFunctionTable = getById(`fitnessFunctionTable`);
    for (var i = 0; i < solutionSize; i++) {
        var row = document.createElement(`tr`);

        var td1 = document.createElement(`td`);
        var td2 = document.createElement(`td`);
        var td3 = document.createElement(`td`);

        var goalLabel = document.createElement(`span`);
        goalLabel.innerText = `\\(x_{${i + 1}}\\) goal:`;
        
        var goalSlider = document.createElement(`input`);
        goalSlider.type = `range`;
        goalSlider.className = `slider`;
        goalSlider.min   = -10;
        goalSlider.max   = 10;
        goalSlider.step  = 1 / Math.pow(10, decimalPlaces);
        goalSlider.value = 0;
        
        var goalDisplay1 = document.createElement(`input`);
        goalDisplay1.type = `number`;
        goalDisplay1.className = `display`;
        
        goalDisplay1.min   = -10;
        goalDisplay1.max   = 10;
        goalDisplay1.step  = 1 / Math.pow(10, decimalPlaces);
        goalDisplay1.value = goalSlider.value;

        goalSliders  .push(goalSlider);
        goalDisplays1.push(goalDisplay1);

        td1.appendChild(goalLabel);    row.appendChild(td1);
        td2.appendChild(goalSlider);   row.appendChild(td2);
        td3.appendChild(goalDisplay1); row.appendChild(td3);

        fitnessFunctionTable.appendChild(row);
    }

    goalSliders.forEach((element) => {
        element.addEventListener(`input`, (event) => { console.log(event.target); });
    });

    MathJax.typeset();
}