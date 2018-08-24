window.onload = function(){
    var fileName = "hd-schedule";
    var eventLocation = "";
    var eventName = "Work-HD";
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


function scheduleMain(fileName, eventTitle, loc){
    var HDSchedule = new HDScheduleParser();
    var theCSVFile = new CsvFile();
    var theICALFile = new IcalFile();
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
function addDownloadButtons(blobCSV, blobICAL, filename){
    var toolbar = document.getElementById('toolbar');
    var toolbarParent = toolbar.parentNode;
    
    var saveWindow = document.createElement('div');
    saveWindow.style.position = 'absolute';
    saveWindow.style.right = '120px';
    saveWindow.style.top = '77px';
    saveWindow.style.marginTop = '5px';
    saveWindow.style.zIndex = "100";
    var header = document.createElement('span');
    header.innerHTML = 'Export to File:';
    header.style.fontSize = '16px';
    //header.style.lineHeight = '32px';
    var button = document.createElement('a');
    var url = URL.createObjectURL(blobCSV);
    button.href = url;
    button.innerHTML = 'CSV';
    button.style.marginLeft = '10px';
    //button.style.padding = '10px';
    button.style.fontSize = '16px';
    button.style.cursor = "pointer"
    //button.style.marginTop = "25px";
    var calbut = document.createElement('a');
    var urlB = URL.createObjectURL(blobICAL);
    calbut.href = urlB;
    calbut.innerHTML = 'ICAL';
    calbut.style.marginLeft = '10px';
    //button.style.padding = '10px';
    calbut.style.fontSize = '16px';
    calbut.style.cursor = "pointer"
    button.download = filename + '.csv';
    calbut.download = filename + '.ics';
    var close = document.createElement('a');
    close.innerHTML = 'Close';
    close.style.padding = '10px';
    close.style.fontSize = "18px";
    close.style.marginTop = '25px';
    close.onclick = function(){
        saveWindow.remove();
    }
    saveWindow.appendChild(header);
    saveWindow.appendChild(button);
    saveWindow.appendChild(calbut);
    //saveWindow.appendChild(close);
    toolbarParent.insertBefore(saveWindow, toolbar);
    
}