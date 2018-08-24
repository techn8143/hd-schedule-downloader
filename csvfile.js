class CsvFile{
    constructor(){
        this.headerRow = "Subject,Start Date,Start Time,End Date,End Time,Location\r\n";
        this.events = [];
    }
    addZero(i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    }
    loadEvent(beginning, end, subject, location){
        if (typeof(subject) != "string"){
            var theSubject = "";
        }
        else{
            var theSubject = subject;
        }
        if (typeof(location) != "string"){
            var theLocation = "";
        }
        else{
            var theLocation = '"' + location + '"';
        }
        if (beginning instanceof Date){
            var startDate = this.addZero(beginning.getMonth() + 1) + '/' + this.addZero(beginning.getDate()) + '/' + this.addZero(beginning.getFullYear());
            var startTime = this.addZero(beginning.getHours()) + ':' + this.addZero(beginning.getMinutes());
            var endDate = "";
            var endTime = "";
        }
        else{
            throw('Invalid Type: Times must be JS Date Objects');
        }
        if (end instanceof Date){
            endDate = this.addZero(end.getMonth() + 1) + '/' + this.addZero(end.getDate()) + '/' + this.addZero(end.getFullYear());
            endTime = this.addZero(end.getHours()) + ':' + this.addZero(end.getMinutes());
        }
        var eventString = theSubject + ',' + startDate + ',' + startTime + ',' + endDate + ',' + endTime + ',' + theLocation + "\r\n";
        this.events.push(eventString);
    }
    toString(){
        var eventsString = "";
        this.events.forEach(function(e){
            eventsString += e;
        });
        return this.headerRow + eventsString;
    }
}