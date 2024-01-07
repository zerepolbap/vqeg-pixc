document.addEventListener('DOMContentLoaded', function() {
  const specFileSelector = document.getElementById('specFileSelector');
  const launchButton = document.getElementById('launchButton');
  const startButton = document.getElementById('startButton');
  const enterButton = document.getElementById('enterButton');
  const cancelTestButton = document.getElementById('cancelTestButton');
  const newTestButton = document.getElementById('newTestButton');
  const codeInput = document.getElementById('codeInput');
  const descriptionText = document.getElementById('descriptionText');
  const completionMessage = document.getElementById('completionMessage');

  let currentFile = '';
  let currentLineNumber = 0;
  let specFileContent = [];
  let testId = '';
  let internalId = generateInternalId(6);

  fetchSpecFiles();

  launchButton.addEventListener('click', function() {
    currentFile = specFileSelector.value;
    testId = document.getElementById('testIdInput').value; // Store Test ID
    document.getElementById('testIdInput').value = ''; // Clear the Test ID input
    internalId = generateInternalId(6);
    currentLineNumber = 0;
    if (testId.trim() === '') {
      alert('Please enter a Test ID.');
      return;
    }
    fetchSpecFileContent(currentFile);
  });

  startButton.addEventListener('click', function() {
    logEvent(internalId, testId, -1, 'start', currentFile);
    currentLineNumber = 0;
    loadSpecLine();
    toggleScreen('testSessionScreen');
  });


  // Assign validateCode function directly to the event listeners
  enterButton.addEventListener('click', validateCode);
  
  codeInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      validateCode();
    }
  });


  cancelTestButton.addEventListener('click', function() {
    if (confirm('Are you sure you want to cancel the test?')) {
      logEvent(internalId, testId, -1, 'cancel', currentFile);
      completionMessage.textContent = 'Test Cancelled';
      toggleScreen('testCompleteScreen');
    }
  });

  newTestButton.addEventListener('click', function() {
    toggleScreen('selectionScreen');
  });


  function fetchSpecFiles() {
    fetch('/specs')
      .then(response => response.json())
      .then(files => {
        const selector = document.getElementById('specFileSelector');
        selector.innerHTML = '';
        files.forEach(file => {
          const option = document.createElement('option');
          option.value = file;
          option.textContent = file;
          selector.appendChild(option);
        });
      });
  }


  function fetchSpecFileContent(filename) {
    fetch('/getSpecFile/' + filename)
      .then(response => response.text())
      .then(data => {
        specFileContent = data.split('\n').filter(line => line.trim().length > 0);
        toggleScreen('testStartScreen');
      });
  }

  function loadSpecLine() {
    if (currentLineNumber < specFileContent.length) {
      const [description] = specFileContent[currentLineNumber].split(',');
      descriptionText.textContent = description;
      document.getElementById('codeInput').value = '';
    } else {
      showCompletionScreen('Test Completed Successfully!');
    }
  }

  function showCompletionScreen(message) {
    logEvent(internalId, testId, -1, 'complete', currentFile);
    completionMessage.textContent = message;
    toggleScreen('testCompleteScreen');
  }

  function validateCode() {
    const userCodeInput = document.getElementById('codeInput');
    const userCode = userCodeInput.value.toUpperCase();
    const [description, code] = specFileContent[currentLineNumber].split(',');
    if (userCode.trim() === code.trim()) {
      logEvent(internalId, testId, currentLineNumber, 'correct', userCode.trim());
      currentLineNumber++;
      loadSpecLine();
    } else {
      logEvent(internalId, testId, currentLineNumber, 'failure', userCode.trim());
      alert('Incorrect code. Please try again.');
      userCodeInput.value = ''; // Clear the text box
    }
  }

  function generateInternalId(length) {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }
  
  function logEvent(internalId, testId, lineNumber, eventType, eventArgs) {
    fetch('/logEvent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ internalId, testId, lineNumber, eventType, eventArgs }),
    });
  }

  function toggleScreen(screenId) {
    const screens = ['selectionScreen', 'testStartScreen', 'testSessionScreen', 'testCompleteScreen'];
    screens.forEach(screen => {
      document.getElementById(screen).style.display = screen === screenId ? 'block' : 'none';
    });
  }

});