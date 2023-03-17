let gamepad;

function vibrateController(duration) {
  if (gamepad && 'vibrationActuator' in gamepad) {
    setTimeout(() => {
      gamepad.vibrationActuator.playEffect('dual-rumble', {
        startDelay: 0,
        duration: duration,
        weakMagnitude: 1.0,
        strongMagnitude: 1.0,
      });
    }, vibrationDelay);

    setTimeout(() => {
      showVibrationEmoji(duration);
    }, vibrationDelay);
  }
}
window.addEventListener('gamepadconnected', (e) => {
  gamepad = e.gamepad;
  console.log('Gamepad connected:', gamepad);
  updateControllerStatus('Connected');
});

window.addEventListener('gamepaddisconnected', (e) => {
  gamepad = null;
  console.log('Gamepad disconnected');
  updateControllerStatus('Not connected');
});

function updateControllerStatus(status) {
  const controllerStatusElem = document.getElementById('controllerStatus');
  controllerStatusElem.textContent = `Controller status: ${status}`;

  if (status === 'Connected') {
    controllerStatusElem.classList.add('connected');
    controllerStatusElem.classList.remove('not-connected');
  } else {
    controllerStatusElem.classList.add('not-connected');
    controllerStatusElem.classList.remove('connected');
  }
}


function addChatMessage(message) {
  const chatMessagesElem = document.getElementById('chatMessages');
  const newMessageElem = document.createElement('li');
  newMessageElem.textContent = message;
  chatMessagesElem.appendChild(newMessageElem);

  // Limit the number of displayed chat messages to 5
  if (chatMessagesElem.childElementCount > 5) {
    chatMessagesElem.removeChild(chatMessagesElem.firstElementChild);
  }
}

function connectToChannel(channelName) {
  if (!channelName) {
    alert('Please enter a Twitch channel name.');
    return;
  }

  const tmiOptions = {
    connection: {
      secure: true,
      reconnect: true,
    },
    channels: [channelName],
  };

  const tmiClient = new tmi.Client(tmiOptions);

  tmiClient.connect();

  tmiClient.on('connecting', () => {
    updateChatConnectionStatus('Connecting');
  });

  tmiClient.on('connected', () => {
    updateChatConnectionStatus('Connected');
  });

  tmiClient.on('disconnected', () => {
    updateChatConnectionStatus('Disconnected');
  });

tmiClient.on('message', (channel, tags, message, self) => {
  if (tags['display-name'].toLowerCase() === channelName.toLowerCase()) {
    const match = message.match(/^!bz+$/i);
    if (match) {
      const duration = (match[0].length - 1) * 200; // Subtract 1 to exclude the 'b' character
      vibrateController(duration);
   //   showVibrationEmoji(duration);
    }
  }
  addChatMessage(message);
});
}

function updateChatConnectionStatus(status) {
  const chatConnectionStatusElem = document.getElementById('chatConnectionStatus');
  chatConnectionStatusElem.textContent = `Chat connection status: ${status}`;

  if (status === 'Connected') {
    chatConnectionStatusElem.classList.add('connected');
    chatConnectionStatusElem.classList.remove('not-connected');
  } else {
    chatConnectionStatusElem.classList.add('not-connected');
    chatConnectionStatusElem.classList.remove('connected');
  }
}

// Auto-connect to the "shindigs" channel on page load
window.addEventListener('load', () => {
  connectToChannel('shindigs');
});

function showVibrationEmoji(duration) {
  const vibrationEmoji = document.getElementById('vibrationEmoji');
  vibrationEmoji.classList.remove('hidden');
  setTimeout(() => {
    vibrationEmoji.classList.add('hidden');
  }, duration);
}

let vibrationDelay = 0;

const vibrationDelaySlider = document.getElementById('vibrationDelay');

vibrationDelaySlider.addEventListener('input', (e) => {
  const delayValue = e.target.value;
  vibrationDelay = delayValue * 1000;
  document.getElementById('vibrationDelayValue').textContent = delayValue;
});
