let gamepad;

function vibrateController() {
  if (gamepad && 'vibrationActuator' in gamepad) {
    gamepad.vibrationActuator.playEffect('dual-rumble', {
      startDelay: 0,
      duration: 500,
      weakMagnitude: 1.0,
      strongMagnitude: 1.0,
    });
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

function connectToChannel() {
  const channelName = document.getElementById('channelName').value;

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

  tmiClient.on('message', (channel, tags, message, self) => {
    console.log('New chat message:', message);
    vibrateController();
    addChatMessage(message);
  });
}