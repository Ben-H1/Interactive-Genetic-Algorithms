var chanceToCrossover;
var chanceToMutate;
var chanceToGoUp;
var chanceToGoDown;
var minimumChange;
var maximumChange;
var decimalPlaces;
var populationSize;
var solutionSize;
var cullSize;
var simulationSpeed;

var goalSliders;
var goalDisplays1;
var goalDisplays2;
var goals;
var population;

var interval;
var running = false;
var steps = 0;

var populationBoxes = [];
var fitnessBoxes    = [];

var saveSettingsButton = getById(`saveSettingsButton`);
var loadSettingsButton = getById(`loadSettingsButton`);
var loadFile           = getById(`loadFile`);

saveSettingsButton.addEventListener(`click`,  (event) => { saveSettings(); });
loadSettingsButton.addEventListener(`click`,  (event) => { loadFile.click(); });
loadFile          .addEventListener(`change`, (event) => { loadSettings(event); });

function saveSettings() {
	var filename = `settings`;
	var text = constructSettings();
	var blob = new Blob([text], {type:'text/plain;charset=utf-8'});
	saveAs(blob, filename + `.txt`);
}

function constructSettings() {
    var settings = ``;

    settings += `chanceToCrossover=${chanceToCrossover}\n`;
    settings += `chanceToMutate=${chanceToMutate}\n`;
    settings += `chanceToGoUp=${chanceToGoUp}\n`;
    settings += `chanceToGoDown=${chanceToGoDown}\n`;
    settings += `minimumChange=${minimumChange}\n`;
    settings += `maximumChange=${maximumChange}\n`;
    settings += `decimalPlaces=${decimalPlaces}\n`;
    settings += `populationSize=${populationSize}\n`;
    settings += `solutionSize=${solutionSize}\n`;
    settings += `cullSize=${cullSize}\n`;
    settings += `simulationSpeed=${simulationSpeed}\n`;

    for (var i = 0; i < goals.length; i++) {
        settings += `goal${i + 1}=${goalSliders[i].value}`;
        if (i != goals.length - 1) {
            settings += `\n`;
        }
    }

    return settings;
}

var saveAs = saveAs || function (view) {
    "use strict";
    if (typeof navigator !== "undefined" && /MSIE [1-9]\./.test(navigator.userAgent)) {
        return
    }
    var doc = view.document,
        get_URL = function () {
            return view.URL || view.webkitURL || view
        },
        save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a"),
        can_use_save_link = "download" in save_link,
        click = function (node) {
            var event = new MouseEvent("click");
            node.dispatchEvent(event)
        },
        is_safari = /Version\/[\d\.]+.*Safari/.test(navigator.userAgent),
        webkit_req_fs = view.webkitRequestFileSystem,
        req_fs = view.requestFileSystem || webkit_req_fs || view.mozRequestFileSystem,
        throw_outside = function (ex) {
            (view.setImmediate || view.setTimeout)(function () {
                throw ex
            }, 0)
        },
        force_saveable_type = "application/octet-stream",
        fs_min_size = 0,
        arbitrary_revoke_timeout = 500,
        revoke = function (file) {
            var revoker = function () {
                if (typeof file === "string") {
                    get_URL().revokeObjectURL(file)
                } else {
                    file.remove()
                }
            };
            if (view.chrome) {
                revoker()
            } else {
                setTimeout(revoker, arbitrary_revoke_timeout)
            }
        },
        dispatch = function (filesaver, event_types, event) {
            event_types = [].concat(event_types);
            var i = event_types.length;
            while (i--) {
                var listener = filesaver["on" + event_types[i]];
                if (typeof listener === "function") {
                    try {
                        listener.call(filesaver, event || filesaver)
                    } catch (ex) {
                        throw_outside(ex)
                    }
                }
            }
        },
        auto_bom = function (blob) {
            if (/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
                return new Blob(["\ufeff", blob], {
                    type: blob.type
                })
            }
            return blob
        },
        FileSaver = function (blob, name, no_auto_bom) {
            if (!no_auto_bom) {
                blob = auto_bom(blob)
            }
            var filesaver = this,
                type = blob.type,
                blob_changed = false,
                object_url, target_view, dispatch_all = function () {
                    dispatch(filesaver, "writestart progress write writeend".split(" "))
                },
                fs_error = function () {
                    if (target_view && is_safari && typeof FileReader !== "undefined") {
                        var reader = new FileReader;
                        reader.onloadend = function () {
                            var base64Data = reader.result;
                            target_view.location.href = "data:attachment/file" + base64Data.slice(base64Data.search(/[,;]/));
                            filesaver.readyState = filesaver.DONE;
                            dispatch_all()
                        };
                        reader.readAsDataURL(blob);
                        filesaver.readyState = filesaver.INIT;
                        return
                    }
                    if (blob_changed || !object_url) {
                        object_url = get_URL().createObjectURL(blob)
                    }
                    if (target_view) {
                        target_view.location.href = object_url
                    } else {
                        var new_tab = view.open(object_url, "_blank");
                        if (new_tab == undefined && is_safari) {
                            view.location.href = object_url
                        }
                    }
                    filesaver.readyState = filesaver.DONE;
                    dispatch_all();
                    revoke(object_url)
                },
                abortable = function (func) {
                    return function () {
                        if (filesaver.readyState !== filesaver.DONE) {
                            return func.apply(this, arguments)
                        }
                    }
                },
                create_if_not_found = {
                    create: true,
                    exclusive: false
                },
                slice;
            filesaver.readyState = filesaver.INIT;
            if (!name) {
                name = "download"
            }
            if (can_use_save_link) {
                object_url = get_URL().createObjectURL(blob);
                setTimeout(function () {
                    save_link.href = object_url;
                    save_link.download = name;
                    click(save_link);
                    dispatch_all();
                    revoke(object_url);
                    filesaver.readyState = filesaver.DONE
                });
                return
            }
            if (view.chrome && type && type !== force_saveable_type) {
                slice = blob.slice || blob.webkitSlice;
                blob = slice.call(blob, 0, blob.size, force_saveable_type);
                blob_changed = true
            }
            if (webkit_req_fs && name !== "download") {
                name += ".download"
            }
            if (type === force_saveable_type || webkit_req_fs) {
                target_view = view
            }
            if (!req_fs) {
                fs_error();
                return
            }
            fs_min_size += blob.size;
            req_fs(view.TEMPORARY, fs_min_size, abortable(function (fs) {
                fs.root.getDirectory("saved", create_if_not_found, abortable(function (dir) {
                    var save = function () {
                        dir.getFile(name, create_if_not_found, abortable(function (file) {
                            file.createWriter(abortable(function (writer) {
                                writer.onwriteend = function (event) {
                                    target_view.location.href = file.toURL();
                                    filesaver.readyState = filesaver.DONE;
                                    dispatch(filesaver, "writeend", event);
                                    revoke(file)
                                };
                                writer.onerror = function () {
                                    var error = writer.error;
                                    if (error.code !== error.ABORT_ERR) {
                                        fs_error()
                                    }
                                };
                                "writestart progress write abort".split(" ").forEach(function (event) {
                                    writer["on" + event] = filesaver["on" + event]
                                });
                                writer.write(blob);
                                filesaver.abort = function () {
                                    writer.abort();
                                    filesaver.readyState = filesaver.DONE
                                };
                                filesaver.readyState = filesaver.WRITING
                            }), fs_error)
                        }), fs_error)
                    };
                    dir.getFile(name, {
                        create: false
                    }, abortable(function (file) {
                        file.remove();
                        save()
                    }), abortable(function (ex) {
                        if (ex.code === ex.NOT_FOUND_ERR) {
                            save()
                        } else {
                            fs_error()
                        }
                    }))
                }), fs_error)
            }), fs_error)
        },
        FS_proto = FileSaver.prototype,
        saveAs = function (blob, name, no_auto_bom) {
            return new FileSaver(blob, name, no_auto_bom)
        };
    if (typeof navigator !== "undefined" && navigator.msSaveOrOpenBlob) {
        return function (blob, name, no_auto_bom) {
            if (!no_auto_bom) {
                blob = auto_bom(blob)
            }
            return navigator.msSaveOrOpenBlob(blob, name || "download")
        }
    }
    FS_proto.abort = function () {
        var filesaver = this;
        filesaver.readyState = filesaver.DONE;
        dispatch(filesaver, "abort")
    };
    FS_proto.readyState = FS_proto.INIT = 0;
    FS_proto.WRITING = 1;
    FS_proto.DONE = 2;
    FS_proto.error = FS_proto.onwritestart = FS_proto.onprogress = FS_proto.onwrite = FS_proto.onabort = FS_proto.onerror = FS_proto.onwriteend = null;
    return saveAs
}(typeof self !== "undefined" && self || typeof window !== "undefined" && window || this.content);
if (typeof module !== "undefined" && module.exports) {
    module.exports.saveAs = saveAs
} else if (typeof define !== "undefined" && define !== null && define.amd != null) {
    define([], function () {
        return saveAs
    })
}

function loadSettings(event) {
    if (event.target.files.length == 0) { 
        return false;
    }
    
	var file = event.target.files[0];
	var reader = new FileReader();

	reader.readAsText(file);

    reader.onload = (e) => {
        deconstructSettings(reader.result);
	}
}

function deconstructSettings(settings) {
    var lines = settings.split(`\n`);
    var numberOfValidSettings = 0;

    var tempChanceToCrossover = null;
    var tempChanceToMutate    = null;
    var tempChanceToGoUp      = null;
    var tempChanceToGoDown    = null;
    var tempMinimumChange     = null;
    var tempMaximumChange     = null;
    var tempDecimalPlaces     = null;
    var tempPopulationSize    = null;
    var tempSolutionSize      = null;
    var tempCullSize          = null;
    var tempSimulationSpeed   = null;

    for (var i = 0; i < 11; i++) {
        var currentLine  = lines[i];
        var lineParts    = currentLine.split(`=`);
        var settingName  = lineParts[0];
        var settingValue = lineParts[1];

        switch (settingName) {
            case `chanceToCrossover`:
                tempChanceToCrossover = parseInt(settingValue);
                break;

            case `chanceToMutate`:
                tempChanceToMutate = parseInt(settingValue);
                break;

            case `chanceToGoUp`:
                tempChanceToGoUp = parseInt(settingValue);
                break;

            case `chanceToGoDown`:
                tempChanceToGoDown = parseInt(settingValue);
                break;

            case `minimumChange`:
                tempMinimumChange = parseFloat(settingValue);
                break;

            case `maximumChange`:
                tempMaximumChange = parseFloat(settingValue);
                break;

            case `decimalPlaces`:
                tempDecimalPlaces = parseInt(settingValue);
                break;

            case `populationSize`:
                tempPopulationSize = parseInt(settingValue);
                break;

            case `solutionSize`:
                tempSolutionSize = parseInt(settingValue);
                break;

            case `cullSize`:
                tempCullSize = parseInt(settingValue);
                break;

            case `simulationSpeed`:
                tempSimulationSpeed = parseInt(settingValue);
                break;

            default:
                break;
        }
    }

    if (tempChanceToCrossover >= chanceToCrossoverSlider.min && tempChanceToCrossover <= chanceToCrossoverSlider.max) {
        numberOfValidSettings++;
    }

    if (tempChanceToMutate >= chanceToMutateSlider.min && tempChanceToMutate <= chanceToMutateSlider.max) {
        numberOfValidSettings++;
    }

    if (tempChanceToGoUp >= chanceToGoUpSlider.min && tempChanceToGoUp <= chanceToGoUpSlider.max && tempChanceToGoDown == 100 - tempChanceToGoUp) {
        numberOfValidSettings++;
    }

    if (tempChanceToGoDown >= chanceToGoDownSlider.min && tempChanceToGoDown <= chanceToGoDownSlider.max && tempChanceToGoUp == 100 - tempChanceToGoDown) {
        numberOfValidSettings++;
    }

    if (tempMinimumChange >= minimumChangeSlider.min && tempMinimumChange <= minimumChangeSlider.max && tempMinimumChange <= tempMaximumChange) {
        numberOfValidSettings++;
    }

    if (tempMaximumChange >= maximumChangeSlider.min && tempMaximumChange <= maximumChangeSlider.max && tempMaximumChange >= tempMinimumChange) {
        numberOfValidSettings++;
    }

    if (tempDecimalPlaces >= decimalPlacesSlider.min && tempDecimalPlaces <= decimalPlacesSlider.max) {
        numberOfValidSettings++;
    }

    if (tempPopulationSize >= populationSizeSlider.min && tempPopulationSize <= populationSizeSlider.max) {
        numberOfValidSettings++;
    }

    if (tempSolutionSize >= solutionSizeSlider.min && tempSolutionSize <= solutionSizeSlider.max && tempSolutionSize == lines.length - 11) {
        numberOfValidSettings++;
    }

    if (tempCullSize >= cullSizeSlider.min && tempCullSize <= cullSizeSlider.max && tempCullSize <= tempSolutionSize) {
        numberOfValidSettings++;
    }

    if (tempSimulationSpeed >= simulationSpeedSlider.min && tempSimulationSpeed <= simulationSpeedSlider.max) {
        numberOfValidSettings++;
    }

    if (numberOfValidSettings != 11) {
        console.error(`Invalid settings file`);
        return;
    }

    var tempGoals = [];

    for (var i = 11; i < lines.length; i++) {
        var currentLine  = lines[i];
        var lineParts    = currentLine.split(`=`);
        var settingName  = lineParts[0];
        var settingValue = lineParts[1];

        tempGoals.push(parseFloat(settingValue));
    }

    var numberOfGoals      = lines.length - 11;
    var numberOfValidGoals = 0;

    for (var i = 0; i < tempGoals.length; i++) {
        if (tempGoals[i] >= goalSliders[0].min && tempGoals[i] <= goalSliders[0].max) {
            numberOfValidGoals++;
        }
    }

    if (numberOfValidGoals != numberOfGoals) {
        console.error(`Invalid settings file`);
        return;
    }

    chanceToCrossover = tempChanceToCrossover;
    chanceToMutate    = tempChanceToMutate   ;
    chanceToGoUp      = tempChanceToGoUp     ;
    chanceToGoDown    = tempChanceToGoDown   ;
    minimumChange     = tempMinimumChange    ;
    maximumChange     = tempMaximumChange    ;
    decimalPlaces     = tempDecimalPlaces    ; updateDecimalPlaces();
    populationSize    = tempPopulationSize   ; setCullMaximum();
    solutionSize      = tempSolutionSize     ;
    cullSize          = tempCullSize         ;
    simulationSpeed   = tempSimulationSpeed  ;

    refreshGoalBlock();

    for (var i = 0; i < goalSliders.length; i++) {
        goals[i] = tempGoals[i];
        updateDisplay(goalSliders[i], goals[i].toFixed(decimalPlaces));
        updateDisplay(goalDisplays1[i], goals[i].toFixed(decimalPlaces));
        updateMathsDisplay(goalDisplays2[i], goals[i].toFixed(decimalPlaces), i);
    }

    MathJax.typeset();

    updateAllDisplays();
    refreshPopulationTable();
}

var chanceToCrossoverSlider = getById(`chanceToCrossoverSlider`); var chanceToCrossoverDisplay = getById(`chanceToCrossoverDisplay`);
var chanceToMutateSlider    = getById(`chanceToMutateSlider`   ); var chanceToMutateDisplay    = getById(`chanceToMutateDisplay`   );
var chanceToGoUpSlider      = getById(`chanceToGoUpSlider`     ); var chanceToGoUpDisplay      = getById(`chanceToGoUpDisplay`     );
var chanceToGoDownSlider    = getById(`chanceToGoDownSlider`   ); var chanceToGoDownDisplay    = getById(`chanceToGoDownDisplay`   );
var minimumChangeSlider     = getById(`minimumChangeSlider`    ); var minimumChangeDisplay     = getById(`minimumChangeDisplay`    );
var maximumChangeSlider     = getById(`maximumChangeSlider`    ); var maximumChangeDisplay     = getById(`maximumChangeDisplay`    );
var decimalPlacesSlider     = getById(`decimalPlacesSlider`    ); var decimalPlacesDisplay     = getById(`decimalPlacesDisplay`    );
var populationSizeSlider    = getById(`populationSizeSlider`   ); var populationSizeDisplay    = getById(`populationSizeDisplay`   );
var solutionSizeSlider      = getById(`solutionSizeSlider`     ); var solutionSizeDisplay      = getById(`solutionSizeDisplay`     );
var cullSizeSlider          = getById(`cullSizeSlider`         ); var cullSizeDisplay          = getById(`cullSizeDisplay`         );
var simulationSpeedSlider   = getById(`simulationSpeedSlider`  ); var simulationSpeedDisplay   = getById(`simulationSpeedDisplay`  );

chanceToCrossoverSlider.addEventListener(`input`, (event) => { updateDisplay(chanceToCrossoverDisplay, event.target.value                                             ); chanceToCrossover = event.target.value;                                               });
chanceToMutateSlider   .addEventListener(`input`, (event) => { updateDisplay(chanceToMutateDisplay   , event.target.value                                             ); chanceToMutate    = event.target.value;                                               });
chanceToGoUpSlider     .addEventListener(`input`, (event) => { updateDisplay(chanceToGoUpDisplay     , event.target.value, chanceToGoDownSlider, chanceToGoDownDisplay); chanceToGoUp      = event.target.value; chanceToGoDown = 100 - chanceToGoUp;          });
chanceToGoDownSlider   .addEventListener(`input`, (event) => { updateDisplay(chanceToGoDownDisplay   , event.target.value, chanceToGoUpSlider  , chanceToGoUpDisplay  ); chanceToGoDown    = event.target.value; chanceToGoUp   = 100 - chanceToGoDown;        });
minimumChangeSlider    .addEventListener(`input`, (event) => { updateDisplay(minimumChangeDisplay    , makeDecimal(event.target.value)                                ); minimumChange     = event.target.value; checkMinAndMax();                             });
maximumChangeSlider    .addEventListener(`input`, (event) => { updateDisplay(maximumChangeDisplay    , makeDecimal(event.target.value)                                ); maximumChange     = event.target.value; checkMinAndMax2();                            });
decimalPlacesSlider    .addEventListener(`input`, (event) => { updateDisplay(decimalPlacesDisplay    , event.target.value                                             ); decimalPlaces     = event.target.value; updateDecimalPlaces();                        });
populationSizeSlider   .addEventListener(`input`, (event) => { updateDisplay(populationSizeDisplay   , event.target.value                                             ); populationSize    = event.target.value; refreshPopulationTable(); setCullMaximum();   });
solutionSizeSlider     .addEventListener(`input`, (event) => { updateDisplay(solutionSizeDisplay     , event.target.value                                             ); solutionSize      = event.target.value; refreshGoalBlock(); refreshPopulationTable(); });
cullSizeSlider         .addEventListener(`input`, (event) => { updateDisplay(cullSizeDisplay         , event.target.value                                             ); cullSize          = event.target.value;                                               });
simulationSpeedSlider  .addEventListener(`input`, (event) => { updateDisplay(simulationSpeedDisplay  , event.target.value                                             ); simulationSpeed   = event.target.value; setSimulationSpeed();                         });

chanceToCrossoverDisplay.addEventListener(`input`, (event) => { updateDisplay(chanceToCrossoverSlider, event.target.value                                             ); chanceToCrossover = event.target.value;                                               });
chanceToMutateDisplay   .addEventListener(`input`, (event) => { updateDisplay(chanceToMutateSlider   , event.target.value                                             ); chanceToMutate    = event.target.value;                                               });
chanceToGoUpDisplay     .addEventListener(`input`, (event) => { updateDisplay(chanceToGoUpSlider     , event.target.value, chanceToGoDownDisplay, chanceToGoDownSlider); chanceToGoUp      = event.target.value; chanceToGoDown = 100 - chanceToGoUp;          });
chanceToGoDownDisplay   .addEventListener(`input`, (event) => { updateDisplay(chanceToGoDownSlider   , event.target.value, chanceToGoUpDisplay  , chanceToGoUpSlider  ); chanceToGoDown    = event.target.value; chanceToGoUp   = 100 - chanceToGoDown;        });
minimumChangeDisplay    .addEventListener(`input`, (event) => { updateDisplay(minimumChangeSlider    , event.target.value                                             ); minimumChange     = event.target.value; checkMinAndMax();                             });
maximumChangeDisplay    .addEventListener(`input`, (event) => { updateDisplay(maximumChangeSlider    , event.target.value                                             ); maximumChange     = event.target.value; checkMinAndMax2();                            });
decimalPlacesDisplay    .addEventListener(`input`, (event) => { updateDisplay(decimalPlacesSlider    , event.target.value                                             ); decimalPlaces     = event.target.value; updateDecimalPlaces();                        });
populationSizeDisplay   .addEventListener(`input`, (event) => { updateDisplay(populationSizeSlider   , event.target.value                                             ); populationSize    = event.target.value; refreshPopulationTable(); setCullMaximum();   });
solutionSizeDisplay     .addEventListener(`input`, (event) => { updateDisplay(solutionSizeSlider     , event.target.value                                             ); solutionSize      = event.target.value; refreshGoalBlock(); refreshPopulationTable(); });
cullSizeDisplay         .addEventListener(`input`, (event) => { updateDisplay(cullSizeSlider         , event.target.value                                             ); cullSize          = event.target.value;                                               });
simulationSpeedDisplay  .addEventListener(`input`, (event) => { updateDisplay(simulationSpeedSlider  , event.target.value                                             ); simulationSpeed   = event.target.value; setSimulationSpeed();                         });

function getById(id) {
    return document.querySelector(`#${id}`);
}

function createElement(tag) {
    return document.createElement(tag);
}

function makeDecimal(value) {
    return parseFloat(value).toFixed(decimalPlaces);
}

function updateDisplay(display, value, slider2, display2) {
    display.value = value;

    if (slider2 != null && display2 != null) {
        var oppositeValue = 100 - value;

        slider2.value  = oppositeValue;
        display2.value = oppositeValue;
    }
}

function updateMathsDisplay(display, value, index) {
    if (index != solutionSize - 1) {
        display.innerText = `\\( ( ${value} - x_{${index + 1}} ) + \\)`;
    } else {
        display.innerText = `\\( ( ${value} - x_{${index + 1}} ) \\)`;
    }
}

function checkMinAndMax() {
    if (parseFloat(minimumChange) > parseFloat(maximumChange)) {
        maximumChange = minimumChange;
        updateDisplay(minimumChangeSlider, minimumChange);
        updateDisplay(maximumChangeSlider, maximumChange); updateDisplay(maximumChangeDisplay, makeDecimal(maximumChange));
    }
}

function checkMinAndMax2() {
    if (parseFloat(maximumChange) < parseFloat(minimumChange)) {
        minimumChange = maximumChange;
        updateDisplay(maximumChangeSlider, maximumChange);
        updateDisplay(minimumChangeSlider, minimumChange); updateDisplay(minimumChangeDisplay, makeDecimal(minimumChange));
    }
}

function setCullMaximum() {
    cullSizeSlider.max  = populationSize;
    cullSizeDisplay.max = populationSize;

    if (parseInt(cullSize) > parseInt(populationSize)) {
        cullSize = populationSize;
        updateDisplay(cullSizeSlider,  cullSize);
        updateDisplay(cullSizeDisplay, cullSize);
    }
}

function setSimulationSpeed() {
    if (running) {
        clearInterval(interval);
        interval = setInterval(runSimulation, getCorrectSpeed(simulationSpeed));
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

    goalSliders.forEach((element) => {
        var display = element.parentNode.parentNode.childNodes[2].childNodes[0];

        element.step = newStep;
        display.step = newStep;
    });
}

function initialise() {
    setInitialValues();
    updateAllDisplays();
    refreshGoalBlock();
}

initialise();

function setInitialValues() {
    chanceToCrossover = 50 ;
    chanceToMutate    = 50 ;
    chanceToGoUp      = 50 ; chanceToGoDown    = 100 - chanceToGoUp;
    minimumChange     = 0.1;
    maximumChange     = 10 ;
    decimalPlaces     = 1  ;
    populationSize    = 10 ;
    solutionSize      = 5  ;
    cullSize          = 1  ;
    simulationSpeed   = 100;
}

function updateAllDisplays() {
    updateDisplay(chanceToCrossoverSlider, chanceToCrossover); updateDisplay(chanceToCrossoverDisplay, chanceToCrossover);
    updateDisplay(chanceToMutateSlider   , chanceToMutate   ); updateDisplay(chanceToMutateDisplay   , chanceToMutate   );
    updateDisplay(chanceToGoUpSlider     , chanceToGoUp     ); updateDisplay(chanceToGoUpDisplay     , chanceToGoUp     );
    updateDisplay(chanceToGoDownSlider   , chanceToGoDown   ); updateDisplay(chanceToGoDownDisplay   , chanceToGoDown   );
    updateDisplay(minimumChangeSlider    , minimumChange    ); updateDisplay(minimumChangeDisplay    , minimumChange    );
    updateDisplay(maximumChangeSlider    , maximumChange    ); updateDisplay(maximumChangeDisplay    , maximumChange    );
    updateDisplay(decimalPlacesSlider    , decimalPlaces    ); updateDisplay(decimalPlacesDisplay    , decimalPlaces    );
    updateDisplay(populationSizeSlider   , populationSize   ); updateDisplay(populationSizeDisplay   , populationSize   );
    updateDisplay(solutionSizeSlider     , solutionSize     ); updateDisplay(solutionSizeDisplay     , solutionSize     );
    updateDisplay(cullSizeSlider         , cullSize         ); updateDisplay(cullSizeDisplay         , cullSize         );
    updateDisplay(simulationSpeedSlider  , simulationSpeed  ); updateDisplay(simulationSpeedDisplay  , simulationSpeed  );
}

function refreshGoalBlock() {
    clearGoals();
    createGoalBlock();
}

function clearGoals() {
    var fitnessFunctionOptionsTable = getById(`fitnessFunctionOptionsTable`);
    fitnessFunctionOptionsTable.innerHTML = ``;

    var fitnessFunctionDisplayBlock = getById(`fitnessFunctionDisplayBlock`);
    fitnessFunctionDisplayBlock.innerHTML = ``;

    goalSliders   = [];
    goalDisplays1 = [];
    goalDisplays2 = [];
    goals         = [];
}

function createGoalBlock() {
    var fitnessFunctionOptionsTable = getById(`fitnessFunctionOptionsTable`);
    var fitnessFunctionDisplayBlock = getById(`fitnessFunctionDisplayBlock`);

    for (var i = 0; i < solutionSize; i++) {
        var row = createElement(`tr`);

        var td1 = createElement(`td`);
        var td2 = createElement(`td`);
        var td3 = createElement(`td`);

        var goalLabel = createElement(`span`);
        goalLabel.innerText = `\\(x_{${i + 1}}\\) goal:`;
        
        var goalSlider = createElement(`input`);
        goalSlider.type = `range`;
        goalSlider.className = `slider`;
        goalSlider.min   = -10;
        goalSlider.max   = 10;
        goalSlider.step  = 1 / Math.pow(10, decimalPlaces);
        goalSlider.value = 0;
        
        var goalDisplay1 = createElement(`input`);
        goalDisplay1.type = `number`;
        goalDisplay1.className = `display`;
        
        goalDisplay1.min   = -10;
        goalDisplay1.max   = 10;
        goalDisplay1.step  = 1 / Math.pow(10, decimalPlaces);
        goalDisplay1.value = makeDecimal(goalSlider.value);

        goalSliders  .push(goalSlider);
        goalDisplays1.push(goalDisplay1);

        td1.appendChild(goalLabel);    row.appendChild(td1);
        td2.appendChild(goalSlider);   row.appendChild(td2);
        td3.appendChild(goalDisplay1); row.appendChild(td3);

        fitnessFunctionOptionsTable.appendChild(row);

        var goalDisplay2 = createElement(`span`);
        goalDisplay2.className = `mathsDisplay`;
        updateMathsDisplay(goalDisplay2, makeDecimal(goalSlider.value), i);

        goalDisplays2.push(goalDisplay2);
        fitnessFunctionDisplayBlock.appendChild(goalDisplay2);
    }

    goalSliders.forEach((element) => {
        element.addEventListener(`input`, (event) => {
            var display1 = event.path[2].childNodes[2].childNodes[0];
            var index = goalDisplays1.indexOf(display1);
            var display2 = fitnessFunctionDisplayBlock.childNodes[index];
            updateDisplay(display1, makeDecimal(event.target.value));
            updateMathsDisplay(display2, makeDecimal(event.target.value), index);
            updateGoals();
            MathJax.typeset();
        });
    });

    goalDisplays1.forEach((element) => {
        element.addEventListener(`input`, (event) => {
            var slider = event.path[2].childNodes[1].childNodes[0];
            var index = goalDisplays1.indexOf(event.path[2].childNodes[2].childNodes[0]);
            var display2 = fitnessFunctionDisplayBlock.childNodes[index];
            updateDisplay(slider, makeDecimal(event.target.value));
            updateMathsDisplay(display2, makeDecimal(event.target.value), index);
            updateGoals();
            MathJax.typeset();
        });
    });

    updateGoals();
    MathJax.typeset();
}

function updateGoals() {
    for (var i = 0; i < solutionSize; i++) {
        var currentSlider = goalSliders[i];
        goals[i] = currentSlider.value;
    }
}

var populationTable = getById(`populationTable`);
refreshPopulationTable();

function refreshPopulationTable() {
    resetInterval();
    clearPopulationTable();
    createPopulationTable();
}

function clearPopulationTable() {
    populationTable.innerHTML = ``;
}

function createPopulationTable() {
    createPopulationTableHeader();
    createPopulationTableContent();
}

function createPopulationTableHeader() {
    var row = createElement(`tr`);

    var index = createElement(`th`);
    index.className = `populationHeader`;
    index.innerText = `Index`;

    row.appendChild(index);

    for (var i = 0; i < solutionSize; i++) {
        var header = createElement(`th`);
        header.className = `populationHeader`;
        header.innerText = `\\( x_{${i + 1}} \\)`;
        row.appendChild(header);
    }

    var fitness = createElement(`th`);
    fitness.className = `populationHeader`;
    fitness.innerText = `Fitness`;

    row.appendChild(fitness);

    populationTable.appendChild(row);

    MathJax.typeset();
}

function createPopulationTableContent() {
    clearPopulationBoxes();
    clearPopulation();
    resetSteps();

    for (var i = 0; i < populationSize; i++) {
        var row = createElement(`tr`);
        row.className = `solutionBox`;

        var index = createElement(`td`);
        index.className = `solutionIndex`;
        index.innerText = i + 1;
        row.appendChild(index);

        var boxes = [];

        for (var j = 0; j < solutionSize; j++) {
            var box = createElement(`td`);
            box.className = `xBox`;
            boxes.push(box);
            row.appendChild(box);
        }

        populationBoxes.push(boxes);

        var fitness = createElement(`td`);
        fitness.className = `solutionFitness`;
        row.appendChild(fitness);

        fitnessBoxes.push(fitness);

        populationTable.appendChild(row);
    }
}

function clearPopulationBoxes() {
    populationBoxes = [];
    fitnessBoxes    = [];
}

function clearPopulation() {
    population = [];
}

function resetSteps() {
    steps = 0;
}

var generateInitialPopulationButton = getById(`generateInitialPopulationButton`);
generateInitialPopulationButton.addEventListener(`click`, (event) => { generateInitialPopulation(); });

function generateInitialPopulation() {
    clearPopulation();
    resetSteps();

    for (var i = 0; i < populationSize; i++) {
        var currentSolution = [];

        for (var j = 0; j < solutionSize; j++) {
            var random = getRandomDecimal(goalSliders[j].min, goalSliders[j].max, decimalPlaces);
            currentSolution.push(random);
        }

        population.push(currentSolution);
    }

    sortPopulationByFitness();
    updatePopulationDisplay();
}

function sortPopulationByFitness() {
    population.sort((a, b) => {
        return parseFloat(getFitness(a)) > parseFloat(getFitness(b)) ? 1 : -1;
    });
}

function updatePopulationDisplay() {
    for (var i = 0; i < population.length; i++) {
        var currentSolution = population[i];

        for (var j = 0; j < currentSolution.length; j++) {
            populationBoxes[i][j].innerText = currentSolution[j];
        }

        fitnessBoxes[i].innerText = getFitness(currentSolution);
    }
}

function getFitness(solution) {
    var fitness = 0;

    for (var i = 0; i < solution.length; i++) {
        fitness += +Math.abs(goals[i] - solution[i]).toFixed(decimalPlaces);
    }

    return fitness.toFixed(decimalPlaces);
}

function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function getRandomDecimal(min, max, dp) {
    min = parseFloat(min);
    max = parseFloat(max);

    return (Math.random() * (max - min) + min).toFixed(dp);
}

var playButton  = getById(`playButton`);  playButton .addEventListener(`click`, (event) => { play();  });
var pauseButton = getById(`pauseButton`); pauseButton.addEventListener(`click`, (event) => { pause(); });
var stepButton  = getById(`stepButton`);  stepButton .addEventListener(`click`, (event) => { step();  });
var stopButton  = getById(`stopButton`);  stopButton .addEventListener(`click`, (event) => { stop();  });

function play() {
    if (!running) {
        interval = setInterval(runSimulation, getCorrectSpeed(simulationSpeed));
        running = true;
    }
}

function getCorrectSpeed(speed) {
    return (1 / speed) * 1000;
}

function runSimulation() {
    step();

    if (getFitness(population[0]) == 0) {
        stop();
    }
}

function pause() {
    resetInterval();
}

function stop() {
    resetInterval();
    resetSteps();
}

function resetInterval() {
    clearInterval(interval);
    running = false;
}

function step() {
    cullPopulation();
    generateNewPopulation();
    sortPopulationByFitness();
    updatePopulationDisplay();
    steps++;
}

function cullPopulation() {
    var newPopulation = [];

    for (var i = 0; i < cullSize; i++) {
        newPopulation.push(population[i]);
    }

    population = newPopulation;
}

function generateNewPopulation() {
    var newPopulation = [];

    for (var i = 0; i < populationSize; i++) {
        var randomNumber   = getRandomInteger(0, population.length - 1);
        var randomSolution = population[randomNumber];
        var newSolution    = [];

        if (getRandomInteger(1, 100) <= chanceToCrossover) {
            var randomNumber2   = getRandomInteger(0, population.length - 1);
            var randomSolution2 = population[randomNumber2];

            newSolution = crossoverSolutions(randomSolution, randomSolution2);
        } else {
            newSolution = mutateSolution(randomSolution);
        }

        newPopulation.push(newSolution);
    }

    population = newPopulation;
}

function crossoverSolutions(solution1, solution2) {
    var newSolution    = [];
    var crossoverPoint = getRandomInteger(1, solution1.length - 1);

    for (var i = 0; i < crossoverPoint; i++) {
        newSolution.push(solution1[i]);
    }

    for (var i = crossoverPoint; i < solution1.length; i++) {
        newSolution.push(solution2[i]);
    }

    return newSolution;
}

function mutateSolution (solution) {
    var newSolution = [];

    for (var i = 0; i < solution.length; i++) {
        var current = parseFloat(solution[i]);

        if (getRandomInteger(1, 100) <= chanceToMutate) {
            var randomAmount = getRandomDecimal(minimumChange, maximumChange, decimalPlaces);

            if (getRandomInteger(1, 100) <= chanceToGoUp) {
                current += parseFloat(randomAmount);
            } else {
                current -= parseFloat(randomAmount);
            }
        }

        current = current.toFixed(decimalPlaces);

        newSolution.push(current);
    }

    return newSolution;
}