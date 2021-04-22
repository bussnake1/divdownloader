
window.addEventListener('DOMContentLoaded', (event) => {
  var enableButton = document.getElementById("enableButton");

  chrome.storage.local.get(['divDownloaderEnabled'], function(result) {
    enableButton.innerHTML = result.divDownloaderEnabled ? 'Disable' : 'Enable';
  });

  enableButton.onclick = function() {

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      var status = null;  
      if(enableButton.innerHTML === 'Enable'){
        status = 'enabled'
      }
      else status = 'disabled';
  
      // saving extension status in local storage --> on new page load, it will use the saved value
      chrome.storage.local.set({divDownloaderEnabled: status === 'enabled' ? true : false});
  
      chrome.tabs.sendMessage(tabs[0].id, {status: status}, function(response) {
          if(response.status === 'enabled'){
            enableButton.innerHTML = 'Disable';
          }
          else if(response.status === 'disabled'){
            enableButton.innerHTML = 'Enable';
          }
      });
    });
  }

});

