var trackingData = [];
var partID = "";
var courseID = "";
var btnIdToNameMap = new Map();
btnIdToNameMap.set("btnBore", "Bored");
btnIdToNameMap.set("btnEnCo", "Engaged and Concentrated");
btnIdToNameMap.set("btnFrus", "Frustrated");
btnIdToNameMap.set("btnDeli", "Delight");
btnIdToNameMap.set("btnConf", "Confused");
btnIdToNameMap.set("btnSupr", "Surprised");
btnIdToNameMap.set("btnNeut", "Neutral");
btnIdToNameMap.set("btnStop", "Stop");

function addEventListenerToBtns(){
    btnIdToNameMap.forEach((v, k) => {
        document.getElementById(k).addEventListener("click", e => {
            e.preventDefault();
            addToTrackingData(v,getCurrentTimeInString());
        });
    });

    document.getElementById("btnStart").addEventListener("click", (e) =>{
        e.preventDefault();
        partID = document.getElementById("partID").value;
        courseID = document.getElementById("courseID").value;

        if(partID === "" || courseID === ""){
            showModal();
        }else{
            addToTrackingData("Start",getCurrentTimeInString());
            enableBtns();
            lockRequiredForm();
            document.getElementById("btnStart").setAttribute("disabled", true);
        }
    });

    // document.getElementById("btnReset").addEventListener("click", (e) =>{
    //     e.preventDefault();
    //     document.getElementById("btnStart").removeAttribute("disabled");
    //     disableBtns();
    //     enableRequiredForm();
    //     trackingData = [];
    // });
    
    document.getElementById("btnDownload").addEventListener("click", (e) =>{
        e.preventDefault();
        convertArrayOfObjectsToCSV(trackingData);
        downloadCSV({"filename": partID});
        // document.getElementById("btnReset").click();
    });
}

//true or false does not matter in this function, to re-enable button, attribute disabled must be removed
function disableBtns() {
    btnIdToNameMap.forEach((v, k) => {
        document.getElementById(k).setAttribute("disabled", true);
    });

    // document.getElementById("btnReset").setAttribute("disabled", true);
    document.getElementById("btnDownload").setAttribute("disabled", true);
}

function enableBtns() {
    btnIdToNameMap.forEach((v, k) => {
        document.getElementById(k).removeAttribute("disabled");
    })

    // document.getElementById("btnReset").removeAttribute("disabled");
    document.getElementById("btnDownload").removeAttribute("disabled");
}

function lockRequiredForm(){
    document.getElementById("partID").setAttribute("readonly", true);
    document.getElementById("courseID").setAttribute("readonly", true);
}

function enableRequiredForm(){
    document.getElementById("partID").removeAttribute("readonly");
    document.getElementById("courseID").removeAttribute("readonly");
}

function convertArrayOfObjectsToCSV(args) {  
    var result, ctr, keys, columnDelimiter, lineDelimiter, data;

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
    var data, filename, link;
    var csv = convertArrayOfObjectsToCSV({
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

function addToTrackingData(emotion, time){
    var obj = {
        PartID: "",
        CourseID: "",
        Emotion: "",
        Date: "",
        TimeStamp: ""
    };
    obj.PartID = partID;
    obj.CourseID = courseID;
    obj.Emotion = emotion;
    obj.Date = time;
    trackingData.push(obj);
}

function showModal(){
    $("#requiredModal").modal('show');

    $("#requiredModal").on('hidden.bs.modal', function () {
        if(partID === ""){
            document.getElementById("partID").focus();
        }else{
            document.getElementById("courseID").focus();
        }
    });
}

addEventListenerToBtns();
disableBtns();
