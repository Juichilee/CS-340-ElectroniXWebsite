//function format from the Forms with Ajax and JS section and Asynchronous Requests section

document.getElementById('mailListSubmit').addEventListener('click', function(event){
    var req = new XMLHttpRequest();
    var payload = {nameInput:null, emailInput:null, survey:null};
    payload.nameInput = document.getElementById('nameInput').value;
    payload.emailInput = document.getElementById('emailInput').value;
    //From Eloquent Javascript to get the value of the checked radio button
    var buttons = document.getElementsByName('survey'); 
      for (var i = 0; i < buttons.length; i++) {
        if (buttons[i].checked) {
          payload.survey = buttons[i].value;
        }
      }
    req.open('POST', 'https://httpbin.org/post', true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.addEventListener('load',function(){
      if(req.status >= 200 && req.status < 400){
        var response = JSON.parse(req.responseText);
        console.log(response);
        document.getElementById('successMsg').textContent = "Thanks " + JSON.parse(response.data).nameInput + ", see you soon!";
      } else {
        console.log("Error in network request: " + req.statusText);
      }});
    req.send(JSON.stringify(payload));
    event.preventDefault();
  });
