$('#link').val(localStorage.getItem('rt_gchat_url')); // Retrieve the Webhook URL.

$(function () {
  // todo: fix self xss
  function log(msg, color) {
    // https://stackoverflow.com/questions/7505623/colors-in-javascript-console
    if (color) {
      console.log('%c' + msg, 'color:' + color);
      $('#log').append("<p style='color:" + color + "'>" + msg + '</p>');
    } else {
      console.log(msg);
      $('#log').append('<p>' + msg + '</p>');
    }
  }

  function send() {
    var link = $('#link').val();
    var text = $('#text').val();

    $('#text').val(''); // clear the text once run

    localStorage.setItem('rt_gchat_url', link); // Save the Webhook URL.

    if ((link == null || link == '', text == null || text == '')) {
      log('Error: Blank Message', 'red');
      $('#text').focus();

      return false;
    }

    fetch(link, {
      // https://chat.googleapis.com/v1/spaces/CHAT_ID/messages?key=KEY
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify({ text: text }),
    })
      .then((response) => {
        if (response.status == 200) {
          // Success!
          log('Success: Successfully Sent ' + text + '!');
          $('#text').focus();
        } else {
          // Server responded with an error.
          log(
            'Error: Error sending ' +
              text +
              '. Status Code: ' +
              response.status,
            'red'
          );
          $('#text').focus();
        }
      })
      .catch(function () {
        // URL is invalid.
        log('Error: Invalid URL when sending ' + text + '!', 'red');
        $('#text').focus();
      });
  }

  $('#btn').click(function () {
    send();
  });

  // Run send() when enter is pressed (excluding shift + enter).
  $('#text').keypress(function (key) {
    localStorage.setItem('rt_gchat_url', $('#link').val()); // Save URL

    // if key == enter and not shift key and if key.ctrlkey
    if ((key.which == 13 && !key.shiftKey) || key.ctrlKey) {
      send();
    }
  });

  // Reset the logs and the message.
  $('#reset').click(function () {
    $('#text').val('');
    $('#log').empty();
  });
});
