class IcalFile{
    constructor(){
        this.head = "BEGIN:VCALENDAR\r\nVERSION:2.0\r\n";
        this.prodID = "PRODID:-//HD-SCHEDULE-DOWNLOADER//VN8A\r\n";
        this.otherHead = "CALSCALE:GREGORIAN\r\nMETHOD:PUBLISH\r\n";
        this.end = "END:VCALENDAR\r\n";
        this.events = [];
        this.user = "HDASSOC";
    }
    icalTimeFromJSDate(dateObj){
        var year = dateObj.getFullYear();
        var day = this.addZero(dateObj.getDate());
        var month = this.addZero(dateObj.getMonth() + 1);
        var hours = this.addZero(dateObj.getHours());
        var minutes = this.addZero(dateObj.getMinutes());
        var seconds = this.addZero(dateObj.getSeconds());
        var icalTime = year + month + day + "T" + hours + minutes + seconds;
        return icalTime;
    }
    setUser(user){
        this.user = user;
    }
    loadEvent(beginning, end, summary, location){
        if (typeof(summary) != "string"){
            var theSummary = "";
        }
        else{
            var theSummary = summary;
        }
        if (typeof(location) != "string"){
            var theLocation = "";
            var loc = "";
        }
        else{
            var theLocation = location.replace(/,/g, "\\,");
            var loc = "LOCATION:" + theLocation + "\r\n";
        }
        if (beginning instanceof Date){
            var begin = "BEGIN:VEVENT\r\n";
            var uid = "UID:HDSCHEDULE" + this.icalTimeFromJSDate(beginning) + 'for' + this.user + "\r\n";
            var outSummary = "SUMMARY:" + theSummary + "\r\n";
            var start = "DTSTART:"  + this.icalTimeFromJSDate(beginning) + "\r\n";
            var stamp = "DTSTAMP:" + this.icalTimeFromJSDate(new Date()) + "\r\n";
            var endEvent = "END:VEVENT\r\n";
            var endTime = "";
        }
        else{
            throw('Invalid Type: Times must be JS Date Objects');
        }
        if (end instanceof Date){
            endTime = "DTEND:" + this.icalTimeFromJSDate(end) + "\r\n";
        }
        var theEvent = begin + start + endTime + stamp + uid + outSummary + loc + endEvent;
        this.events.push(theEvent);
    }
    addZero(i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    }
    toString(){
        var header = this.head + this.prodID + this.otherHead;
        var eventString = "";
        this.events.forEach(function(e){
            eventString += e;
        })
        return header + eventString + this.end;
    }
}
