window.onload = function() {
    let fileName = "hd-schedule";
    let eventLocation = "";
    let eventName = "Work-HD";
    chrome.storage.sync.get('filename', function(data) {
        fileName = data.filename;
        chrome.storage.sync.get('location', function(data) {
            eventLocation = data.location;
            chrome.storage.sync.get('eventname', function(data) {
                eventName = data.eventname;
                scheduleMain(fileName, eventName, eventLocation);
            });
        });
    });
}

function scheduleMain(fileName, eventTitle, loc) {
    const HDSchedule = new HDScheduleParser();
    const theCSVFile = new CsvFile();
    const theICALFile = new IcalFile();
    theICALFile.setUser(HDSchedule.user);

    HDSchedule.schedule.forEach(function(shift){
        theCSVFile.loadEvent(shift.startTime, shift.endTime, eventTitle, loc);
        theICALFile.loadEvent(shift.startTime, shift.endTime, eventTitle, loc);
    });

    blobCSV = new Blob([theCSVFile.toString()], {content: 'text/csv'});
    blobICAL = new Blob([theICALFile.toString()], {content: 'text/calender'});
    addDownloadButtons(blobCSV, blobICAL, fileName)
}

//FUNCTION THAT ADDS THE DOWNLOAD BUTTONS TO THE WINDOW;
function addDownloadButtons(blobCSV, blobICAL, filename) {
    const toolbar = document.getElementById('toolbar');
    const toolbarParent = toolbar.parentNode;

    const saveWindow = document.createElement('div');
    saveWindow.style.position = 'absolute';
    saveWindow.style.right = '120px';
    saveWindow.style.top = '77px';
    saveWindow.style.marginTop = '5px';
    saveWindow.style.zIndex = "100";

    const header = document.createElement('span');
    header.innerHTML = 'Export to File:';
    header.style.fontSize = '16px';

    // CSV button
    const buttonCSV = document.createElement('a');
    const urlCSV = URL.createObjectURL(blobCSV);
    buttonCSV.href = urlCSV;
    buttonCSV.innerHTML = 'CSV';
    buttonCSV.style.marginLeft = '10px';
    buttonCSV.style.fontSize = '16px';

    // ICAL button
    const buttonICAL = document.createElement('a');
    const urlICAL = URL.createObjectURL(blobICAL);
    buttonICAL.href = urlICAL;
    buttonICAL.innerHTML = 'ICAL';
    buttonICAL.style.marginLeft = '10px';
    buttonICAL.style.fontSize = '16px';

    buttonCSV.download = filename + '.csv';
    buttonICAL.download = filename + '.ics';

    saveWindow.appendChild(header);
    saveWindow.appendChild(buttonCSV);
    saveWindow.appendChild(buttonICAL);
    toolbarParent.insertBefore(saveWindow, toolbar);
}
