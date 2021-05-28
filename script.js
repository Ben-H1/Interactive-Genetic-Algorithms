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

var saveSettingsButton = getById(`saveSettingsButton`);
var loadSettingsButton = getById(`loadSettingsButton`);
var loadFile           = getById(`loadFile`);

saveSettingsButton.addEventListener(`click`,  (event) => { saveSettings(); });
loadSettingsButton.addEventListener(`click`,  (event) => { loadFile.click(); });
loadFile          .addEventListener(`change`, (event) => { loadSettings(event); });

function saveSettings() {
    console.log(`save`);
	var filename = `settings`;
	var text = constructSettings();
	var blob = new Blob([text], {type:'text/plain;charset=utf-8'});
	saveAs(blob, filename + `.txt`);
}

function constructSettings() {
    var settings = `hi`;

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
    console.log(`load`);

    if (event.target.files.length == 0) { 
        return false;
    }
    
	var file = event.target.files[0];
	var reader = new FileReader();

	reader.readAsText(file);

    reader.onload = (e) => {
        deconstructSettings(reader.result);
	}

    updateAllDisplays();
}

function deconstructSettings(settings) {
    console.log(settings);
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

chanceToCrossoverSlider.addEventListener(`input`, (event) => { updateDisplay(chanceToCrossoverDisplay, event.target.value                                             ); chanceToCrossover = event.target.value;                                        });
chanceToMutateSlider   .addEventListener(`input`, (event) => { updateDisplay(chanceToMutateDisplay   , event.target.value                                             ); chanceToMutate    = event.target.value;                                        });
chanceToGoUpSlider     .addEventListener(`input`, (event) => { updateDisplay(chanceToGoUpDisplay     , event.target.value, chanceToGoDownSlider, chanceToGoDownDisplay); chanceToGoUp      = event.target.value; chanceToGoDown = 100 - chanceToGoUp;   });
chanceToGoDownSlider   .addEventListener(`input`, (event) => { updateDisplay(chanceToGoDownDisplay   , event.target.value, chanceToGoUpSlider  , chanceToGoUpDisplay  ); chanceToGoDown    = event.target.value; chanceToGoUp   = 100 - chanceToGoDown; });
minimumChangeSlider    .addEventListener(`input`, (event) => { updateDisplay(minimumChangeDisplay    , makeDecimal(event.target.value)                                ); minimumChange     = event.target.value; checkMinAndMax();                      });
maximumChangeSlider    .addEventListener(`input`, (event) => { updateDisplay(maximumChangeDisplay    , makeDecimal(event.target.value)                                ); maximumChange     = event.target.value; checkMinAndMax2();                     });
decimalPlacesSlider    .addEventListener(`input`, (event) => { updateDisplay(decimalPlacesDisplay    , event.target.value                                             ); decimalPlaces     = event.target.value; updateDecimalPlaces();                 });
populationSizeSlider   .addEventListener(`input`, (event) => { updateDisplay(populationSizeDisplay   , event.target.value                                             ); populationSize    = event.target.value;                                        });
solutionSizeSlider     .addEventListener(`input`, (event) => { updateDisplay(solutionSizeDisplay     , event.target.value                                             ); solutionSize      = event.target.value; refreshGoalBlock();                    });

chanceToCrossoverDisplay.addEventListener(`input`, (event) => { updateDisplay(chanceToCrossoverSlider, event.target.value                                             ); chanceToCrossover = event.target.value;                                        });
chanceToMutateDisplay   .addEventListener(`input`, (event) => { updateDisplay(chanceToMutateSlider   , event.target.value                                             ); chanceToMutate    = event.target.value;                                        });
chanceToGoUpDisplay     .addEventListener(`input`, (event) => { updateDisplay(chanceToGoUpSlider     , event.target.value, chanceToGoDownDisplay, chanceToGoDownSlider); chanceToGoUp      = event.target.value; chanceToGoDown = 100 - chanceToGoUp;   });
chanceToGoDownDisplay   .addEventListener(`input`, (event) => { updateDisplay(chanceToGoDownSlider   , event.target.value, chanceToGoUpDisplay  , chanceToGoUpSlider  ); chanceToGoDown    = event.target.value; chanceToGoUp   = 100 - chanceToGoDown; });
minimumChangeDisplay    .addEventListener(`input`, (event) => { updateDisplay(minimumChangeSlider    , event.target.value                                             ); minimumChange     = event.target.value; checkMinAndMax();                      });
maximumChangeDisplay    .addEventListener(`input`, (event) => { updateDisplay(maximumChangeSlider    , event.target.value                                             ); maximumChange     = event.target.value; checkMinAndMax2();                     });
decimalPlacesDisplay    .addEventListener(`input`, (event) => { updateDisplay(decimalPlacesSlider    , event.target.value                                             ); decimalPlaces     = event.target.value; updateDecimalPlaces();                 });
populationSizeDisplay   .addEventListener(`input`, (event) => { updateDisplay(populationSizeSlider   , event.target.value                                             ); populationSize    = event.target.value;                                        });
solutionSizeDisplay     .addEventListener(`input`, (event) => { updateDisplay(solutionSizeSlider     , event.target.value                                             ); solutionSize      = event.target.value; refreshGoalBlock();                    });

function getById(id) {
    return document.querySelector(`#${id}`);
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
        goalDisplay1.value = makeDecimal(goalSlider.value);

        goalSliders  .push(goalSlider);
        goalDisplays1.push(goalDisplay1);

        td1.appendChild(goalLabel);    row.appendChild(td1);
        td2.appendChild(goalSlider);   row.appendChild(td2);
        td3.appendChild(goalDisplay1); row.appendChild(td3);

        fitnessFunctionOptionsTable.appendChild(row);

        var goalDisplay2 = document.createElement(`span`);
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