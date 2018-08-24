// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

window.onload = function(){
  chrome.storage.sync.get('filename', function(data) {
    document.getElementById('fileName').value = data.filename;
    console.log('Filename Loaded As:', data.filename);
  });
  chrome.storage.sync.get('location', function(data) {
    document.getElementById('location').value = data.location;
    console.log('Location Loaded As:', data.location);
  });
  chrome.storage.sync.get('eventname', function(data) {
    document.getElementById('eventName').value = data.eventname;
    console.log('Eventname Loaded As:', data.eventname);
  });
}
document.getElementById('saveButton').onclick = function(){
  var filename = document.getElementById('fileName').value;
  chrome.storage.sync.set({filename: filename}, function() {
    console.log('Filename Saved As:' + filename);
  });
  var location = document.getElementById('location').value;
  chrome.storage.sync.set({location: location}, function() {
    console.log('Location Saved As:' + location);
  });
  var eventname = document.getElementById('eventName').value;
  chrome.storage.sync.set({eventname: eventname}, function() {
    console.log('Eventname Saved As:' + eventname);
  });
  chrome.tabs.getCurrent(function(tab) {
    chrome.tabs.query({url: 'https://yourschedule.homedepot.com/*'}, function(tab){
        if (tab){
          if (tab.length > 0){
             for (var i = 0; i < tab.length; i++){
                chrome.tabs.reload(tab[i].id, function(){});
             }
          }
        }
    });
    chrome.tabs.remove(tab.id, function() {});
  });
}