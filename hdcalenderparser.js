
function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

function createCSVofSchedule(sch){
    if (Array.isArray(sch)){
        var theResultString = "Subject, Start Date, Start Time, End Date, End Time\r\n";
        sch.forEach(
            function(e){
                    var newLine = "Work-HD, "
                    newLine = newLine + addZero(e.startTime.getMonth() + 1) + '/' + addZero(e.startTime.getDate()) + '/' + addZero(e.startTime.getFullYear()) + ',';
                    newLine = newLine + addZero(e.startTime.getHours()) + ':' + addZero(e.startTime.getMinutes()) + ',';
                    newLine = newLine + addZero(e.endTime.getMonth() + 1)+ '/' + addZero(e.endTime.getDate()) + '/' + addZero(e.endTime.getFullYear()) + ',';
                    newLine = newLine + addZero(e.endTime.getHours()) + ':' + addZero(e.endTime.getMinutes());
                    newLine += "  \r\n";
                    theResultString += newLine;
            }
        )
        console.log(theResultString);
        return theResultString;
    }
    else return '';
}

function toIcalDateTime(dateObj){
    var year = dateObj.getFullYear();
    var day = addZero(dateObj.getDate());
    var month = addZero(dateObj.getMonth() + 1);
    var hours = addZero(dateObj.getHours());
    var minutes = addZero(dateObj.getMinutes());
    var seconds = addZero(dateObj.getSeconds());
    var icalTime = year + month + day + "T" + hours + minutes + seconds;
    return icalTime;
}
function createICALofSchedule(sch){
    var icalstring = "";
    var head = "BEGIN:VCALENDAR \r\n VERSION:2.0\r\n"
    var prodID = "PRODID://HD-SCHEDULE-DOWNLOADER/VN8A/ \r\n";
    var otherHead = "CALSCALE:GREGORIAN\r\n METHOD:PUBLISH\r\n";
    icalstring += (head + prodID + otherHead);
    sch.forEach(
        function(e){
                var begin = "BEGIN:VEVENT\r\n";
                var uid = "UID:" + toIcalDateTime(e.startTime) + '@' + location.hostname + "\r\n";
                var summary = "SUMMARY: WORK-HD\r\n";
                var start = "DTSTART:"  + toIcalDateTime(e.startTime) + "\r\n";
                var end = "DTEND:" + toIcalDateTime(e.endTime) + "\r\n";
                var stamp = "DTSTAMP:" + toIcalDateTime(new Date()) + "\r\n";
                var endEvent = "END:VEVENT\r\n";
                //newLine = newLine + addZero(e.startTime.getMonth() + 1) + '/' + addZero(e.startTime.getDate()) + '/' + addZero(e.startTime.getFullYear()) + ',';
                //newLine = newLine + addZero(e.startTime.getHours()) + ':' + addZero(e.startTime.getMinutes()) + ',';
                //newLine = newLine + addZero(e.endTime.getMonth() + 1)+ '/' + addZero(e.endTime.getDate()) + '/' + addZero(e.endTime.getFullYear()) + ',';
                //newLine = newLine + addZero(e.endTime.getHours()) + ':' + addZero(e.endTime.getMinutes());
                //newLine += "  \r\n";
                //theResultString += newLine;
                icalstring += (begin + uid + summary + start + end + stamp + endEvent);
        }
    )
    var endCal = "END:VCALENDAR\r\n";
    icalstring += endCal;
    console.log(icalstring);
    return icalstring;
}
function parseForTime(ip){
    var d = new Date();
    var time = ip.match( /(\d+)(?::(\d\d))?\s*(p?)/ );
    console.log('t:', time);
    var hours =  parseInt( time[1]) + (time[3] ? 12 : 0);
    if (hours == 12) hours = 0;
    if (hours == 24) hours = 12; 
    d.setHours( parseInt( hours ));
    d.setMinutes( parseInt( time[2]) || 0 );
    d.setSeconds(0);
    return d;
}
console.log('parse HD calender');

var dates = document.getElementsByClassName('date');

var theSchedule = new Array();

for( var i = 0; i < dates.length; i++){
    var theDateObject = dates[i];
    var theHoursElement = theDateObject.parentElement.getElementsByClassName('hours');
    console.log(theHoursElement);
    var theHours = "";
    var theTime = null;
    if (theHoursElement.length > 0){
        theHours = theHoursElement[0].innerHTML;
        theHours = theHours.split('-');
        if (Array.isArray(theHours)){
            if(theHours.length > 1){
                let x = parseForTime(theHours[0]);
                let y = parseForTime(theHours[1]);
                theTime = [x, y];
            }
        }
    }
    var theDate = dates[i].firstChild.innerHTML;
    var index = i;
    console.log('Index:', i);
    console.log('Date:', theDate);
    console.log('Hours:', theHours);
    console.log('Time:', theTime);
    if (theTime != null){

        var dateHelper = theDate.split('/');
        console.log(dateHelper);
        theTime[0].setMonth(parseInt(dateHelper[0]) - 1);
        theTime[1].setMonth(parseInt(dateHelper[0]) - 1);
        theTime[0].setDate(dateHelper[1]);
        theTime[1].setDate(dateHelper[1]);
    
        var scheduleEntry = {
            "startTime": theTime[0],
            "endTime": theTime[1]
        };
        theSchedule.push(scheduleEntry);
        console.log('finishes:', theSchedule);
    }
    }

    var csvschedule = createCSVofSchedule(theSchedule);
    var icalSchedule = createICALofSchedule(theSchedule);
    console.log(csvschedule);
    blobObject = new Blob([csvschedule], {content: 'text/csv'});
    blobIcal = new Blob([icalSchedule], {content: 'text/calender'});
    
    addDownloadButtons();
  

    function addDownloadButtons(){
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
        var url = URL.createObjectURL(blobObject);
        button.href = url;
        button.innerHTML = 'CSV';
        button.style.marginLeft = '10px';
        //button.style.padding = '10px';
        button.style.fontSize = '16px';
        button.style.cursor = "pointer"
        //button.style.marginTop = "25px";
        button.onclick  = function (e){
            console.log('go');
            //e.preventDefault();
        }
        var calbut = document.createElement('a');
        var urlB = URL.createObjectURL(blobIcal);
        calbut.href = url;
        calbut.innerHTML = 'ICAL';
        calbut.style.marginLeft = '10px';
        //button.style.padding = '10px';
        calbut.style.fontSize = '16px';
        calbut.style.cursor = "pointer"

        saveWindow.onclick = function(){
            console.log('alive');
        }
        button.download = 'hd-schedule.csv';
        calbut.download = 'hd-schedule.ics';
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