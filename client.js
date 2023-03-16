let controllerConnected = false;

function vibrateController() {
  const gamepads = navigator.getGamepads();
  for (const gamepad of gamepads) {
    if (gamepad && gamepad.vibrationActuator) {
      gamepad.vibrationActuator.playEffect('dual-rumble', {
        startDelay: 0,
        duration: 200,
        weakMagnitude: 1.0,
        strongMagnitude: 1.0,
      });
      controllerConnected = true;
    }
  }
  updateConnectionStatus();
}

function vibratePhone() {
  if ('vibrate' in navigator) {
    navigator.vibrate(200);
  } else {
    console.log('Vibration not supported on this device');
  }
}

function updateConnectionStatus() {
  const connectionStatus = document.getElementById('connectionStatus');
  if (controllerConnected) {
    connectionStatus.textContent = 'Controller connected';
  } else {
    connectionStatus.textContent = 'No controller connected';
  }
}

window.addEventListener('gamepadconnected', updateConnectionStatus);
window.addEventListener('gamepaddisconnected', updateConnectionStatus);

function connectToChannel() {
  const channelName = document.getElementById('channelName').value;

  const client = new tmi.Client({
    connection: {
      secure: true,
      reconnect: true,
    },
    channels: [channelName],
  });

  client.connect();

  client.on('message', (channel, tags, message, self) => {
    vibrateController();
    vibratePhone();
    displayChatMessage(tags, message);
  });
}

function displayChatMessage(tags, message) {
  const chatMessages = document.getElementById('chatMessages');
  const newMessage = document.createElement('li');
  newMessage.textContent = `${tags['display-name']}: ${message}`;
  chatMessages.appendChild(newMessage);
  if (chatMessages.childElementCount > 5) {
    chatMessages.removeChild(chatMessages.firstChild);
  }
}


function checkMobileDevice() {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const deviceStatus = document.getElementById('deviceStatus');
  const testVibrationButton = document.getElementById('testVibration');

  if (isMobile) {
    deviceStatus.textContent = 'Accessing on a mobile device';
    testVibrationButton.style.display = 'block';
  } else {
    deviceStatus.textContent = 'Not a mobile device';
    testVibrationButton.style.display = 'none';
  }
}

// Call the function to check if the user is on a mobile device
checkMobileDevice();