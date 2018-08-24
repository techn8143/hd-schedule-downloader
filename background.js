// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({filename: 'hd-schedule'}, function() {
  });
  chrome.storage.sync.set({eventname: 'Work-HD'}, function() {
  });
  chrome.storage.sync.set({location: ''}, function() {
  });
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {hostEquals: 'yourschedule.homedepot.com'},
      })],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});


// chrome.tabs.onUpdated.addListener( function(tabId, changeInfo, tab){
//     //ON THE TAB LOAD COMPLETE EVENT
//     if (changeInfo.status == 'complete') {
//       //GETS THE TAB THAT WAS COMPLETED
//       chrome.tabs.get(tabId, function(tab){
//         //IF THE TAB URL MATCHES THE HD SCHEDULE URL, AUTOMATICALLY INJECTS THE SCRIPT
//         var tabUrl = tab.url;
//         var matches = tabUrl.match( /.*https?:\/\/yourschedule\.homedepot\.com.*/ );
//         if (matches){
//           console.log('HD Schedule Downloader: HD Schedule Page Loaded, injecting script...');
//           chrome.tabs.executeScript(tab.id, {file: 'hdcalenderparser.js'} );
//         }
//       });
      
//     }

// });


  
