class HDScheduleParser{

    constructor(){
        this.schedule = [];
        this.user = "HDAssoc";
        this.loadSchedule();
    }
    getDateNode(){
        return document.getElementsByClassName('date');
    }
    getHoursNode(dateNode){
        return dateNode.parentElement.getElementsByClassName('hours');
    }
    getTimeFromHoursElement(theHoursElement){
        if (theHoursElement.length > 0){
            var theHours = theHoursElement[0].innerHTML;
            theHours = theHours.split('-');
            if (Array.isArray(theHours)){
                if(theHours.length > 1){
                    let x = this.parseForTime(theHours[0]);
                    let y = this.parseForTime(theHours[1]);
                    return [x, y];
                }
            }
        }
        return null;
    }
    getDateFromElement(dateElement){
        return dateElement.firstChild.innerHTML;
    }
    setDateOnTimeObjects(theTime, theDate){
        var dateHelper = theDate.split('/');
        theTime[0].setMonth(parseInt(dateHelper[0]) - 1);
        theTime[1].setMonth(parseInt(dateHelper[0]) - 1);
        theTime[0].setDate(dateHelper[1]);
        theTime[1].setDate(dateHelper[1]);
        return theTime;
    }
    parseForTime(ip){
        var d = new Date();
        var time = ip.match( /(\d+)(?::(\d\d))?\s*(p?)/ );
        var hours =  parseInt( time[1]) + (time[3] ? 12 : 0);
        if (hours == 12) hours = 0;
        if (hours == 24) hours = 12; 
        d.setHours( parseInt( hours ));
        d.setMinutes( parseInt( time[2]) || 0 );
        d.setSeconds(0);
        return d;
    }
    getUserName(){
        var userNode = document.getElementsByClassName('userInfo');
        if (userNode){
            var child = userNode[0].getElementsByTagName('strong');
            if (child){
                var name = child[0].innerHTML;
                if (typeof(name) == "string"){
                    name = name.trim();
                    name = name.replace(" ", "");
                    name = name.replace(",", "");
                    return name;
                }
            }
        }
        return "HDAssoc";
    }
    loadSchedule(){
        var dates = this.getDateNode();
        var theSchedule = new Array();
        for( var i = 0; i < dates.length; i++){
            var theDateObject = dates[i];
            var theHoursElement = this.getHoursNode(theDateObject);
            var theTimes = this.getTimeFromHoursElement(theHoursElement);
            var theDate = this.getDateFromElement(theDateObject);
            var index = i;
            if (theTimes != null){
                this.setDateOnTimeObjects(theTimes, theDate);
                var scheduleEntry = {
                    "startTime": theTimes[0],
                    "endTime": theTimes[1]
                };
                this.schedule.push(scheduleEntry);
            }
        }
        this.user = this.getUserName();
    }

    
}
    



