window.__forceSmoothScrollPolyfill__ = true

var trackingData = [];
var observerName = "";
var courseNumber = "";
var classAct = "";
var studentBeh = "";
var cogState = "";
var currentObserving = "";

var trackingState = {
    classAct: "",
    studentBeh:"",
    cogState: ""
}

var idToOtherMap = {
    classActSelector: "otherClassActText",
    studentActSelector: "otherBehText",
    cogSelector: "otherStatetText"
}

registerSelectors("classActSelector", "classAct");
registerSelectors("studentActSelector", "studentBeh");
registerSelectors("cogSelector", "cogState");

function registerSelectors(id, key){
    document.getElementById(id).addEventListener("change", (e) => {
        e.preventDefault();
        let selectedOption = e.srcElement[e.srcElement.selectedIndex].value;
        if(selectedOption.startsWith("other")){
            let localtextArea = document.getElementById(selectedOption);
            localtextArea.removeAttribute("disabled");
            localtextArea.classList.remove("d-none");
            trackingState[key] = localtextArea.value;
            localtextArea.addEventListener("input", (e) => {
                e.preventDefault();
                trackingState[key] = localtextArea.value;
            })
        }else{
            document.getElementById(idToOtherMap[id]).setAttribute("disabled", true);
            document.getElementById(idToOtherMap[id]).classList.add("d-none");
            trackingState[key] = selectedOption;
        }
    })
}

//continue with adding to trackingData and locking/enabling form

function showModal(){
    $("#requiredModal").modal('show');

    $("#requiredModal").on('hidden.bs.modal', function () {
        if(observerName === ""){
            document.getElementById("partID").focus();
        }else{
            document.getElementById("courseID").focus();
        }
    });
}

function convertArrayOfObjectsToCSV(args) {  
    let result, ctr, keys, columnDelimiter, lineDelimiter, data;

    data = args.data || null;
    if (data == null || !data.length) {
        return null;
    }

    columnDelimiter = args.columnDelimiter || ',';
    lineDelimiter = args.lineDelimiter || '\n';

    keys = Object.keys(data[0]);

    result = '';
    result += keys.join(columnDelimiter);
    result += lineDelimiter;

    data.forEach(function(item) {
        ctr = 0;
        keys.forEach(function(key) {
            if (ctr > 0) result += columnDelimiter;

            result += item[key];
            ctr++;
        });
        result += lineDelimiter;
    });

    return result;
}

function downloadCSV(args) {  
    let data, filename, link;
    let csv = convertArrayOfObjectsToCSV({
        data: trackingData
    });
    if (csv == null) return;

    filename = args.filename || 'export.csv';

    if (!csv.match(/^data:text\/csv/i)) {
        csv = 'data:text/csv;charset=utf-8,' + csv;
    }
    data = encodeURI(csv);

    link = document.createElement('a');
    link.setAttribute('href', data);
    link.setAttribute('download', filename);
    link.click();
}

function getCurrentTimeInString(){
    return (new Date).toLocaleString();
}