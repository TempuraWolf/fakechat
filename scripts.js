// Function to add a receiver (left-side) message
function addReceiverMessage() {
  const chatBox = document.getElementById('chatBox');
  const messageContent = document.getElementById('newMessageText').value;
  const messageTime = document.getElementById('newMessageTime').value;
  
  if (messageContent) {
    const message = document.createElement('div');
    message.classList.add('message', 'received');
    message.innerHTML = `
      <span class="message-content">${messageContent}</span>
      <span class="message-time">${messageTime}</span>
	  <div class="message-icons" style="display: none;">
	  <span class="pencil">✏️</span>
	  <span class="delete">🗑️</span>
	  </div>
    `;
    chatBox.appendChild(message);
    chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to the bottom
	addMessageClickListeners();
  }
}

// Function to add a sender (right-side) message
function addSenderMessage() {
  const chatBox = document.getElementById('chatBox');
  const messageContent = document.getElementById('newMessageText').value;
  const messageTime = document.getElementById('newMessageTime').value;
  
  if (messageContent) {
    const message = document.createElement('div');
    message.classList.add('message', 'sent');
    message.innerHTML = `
      <span class="message-content">${messageContent}</span>
      <span class="message-time">${messageTime}</span>
	  <div class="message-icons" style="display: none;">
	  <span class="pencil">✏️</span>
	  <span class="delete">🗑️</span>
	  </div>
    `;
    chatBox.appendChild(message);
    chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to the bottom
	addMessageClickListeners();
  }
}

function editMessageContent(message) {
	const newContent = document.getElementById('newMessageText').value;
	const newTime = document.getElementById('newMessageTime').value;
	
	message.querySelector('.message-content').innerText = newContent;
	message.querySelector('.message-time').innerText = newTime;
}

function addPhotoMessage(sender = true) {
  const chatBox = document.getElementById('chatBox');
  const imageURL = prompt("Enter the image URL:");  // For simplicity, we're using a prompt here
  const messageTime = document.getElementById('newMessageTime').value;
  const messageContent = document.getElementById('newMessageText').value;

  if (imageURL) {
    const message = document.createElement('div');
    message.classList.add('message', sender ? 'sent' : 'received');
    if(messageContent) message.innerHTML = '<span class="message-content">'+messageContent+'</span>';
    message.innerHTML += '<img src="'+imageURL+'" alt="Photo message">';
	message.innerHTML += '<span class="message-time">'+messageTime+'</span>';
    message.innerHTML += '<div class="message-icons" style="display: none;"><span class="pencil">✏️</span><span class="delete">🗑️</span></div>';
    chatBox.appendChild(message);
    chatBox.scrollTop = chatBox.scrollHeight;  // Auto-scroll to the bottom
    addMessageClickListeners();  // Add click listener to the new message
  }
}

function changeContactAvatar() {
	const imageURL = prompt("Enter the image URL:");
	const avatarElement = document.getElementById('avatar');
	avatarElement.src = imageURL;
}

function changeContactName() {
	const newName = prompt("Enter the new contact name:");
	const nameElement = document.getElementById('contactName');
	nameElement.textContent = newName;
}

function deleteMessage(message) {
	message.remove();
	addMessageClickListeners();
}

// Function to add click event listeners to all messages
function addMessageClickListeners() {
  const messages = document.querySelectorAll('.message');

  messages.forEach(message => {
	console.log(message);
    message.addEventListener('click', () => {
      const icons = message.querySelector('.message-icons');
      if (icons) {
        icons.style.display = (icons.style.display === 'none' || icons.style.display === '') ? 'inline' : 'none';
      }
    });
	const pencilIcon = message.querySelector('.message-icons span.pencil');
	if (pencilIcon) {
		pencilIcon.addEventListener('click', (e) => {
			e.stopPropagation();
			editMessageContent(message);
		});
	}
	// const trashIcon = message.querySelector('.message-icons span.delete');
	// if (trashIcon) {
		// trashIcon.addEventListener('click', (e) => {
			// e.stopPropagation();
			// deleteMessage(message);
		// });
	// }
  });
}

function resetDefaultAvatar() {
	const avatar = document.getElementById('avatar');
	avatar.src = "https://media.discordapp.net/attachments/1013688683636985876/1293440399146225746/image.png?ex=670761be&is=6706103e&hm=a026e9351a05ad1586d724b349e1b5427e61199911ebd4c14d7eede43b335a4e&=&format=webp&quality=lossless";
}

function exportMessages() {
  // Get base chat info
  const data = {};
  
  data.contactName = document.querySelector('.contact-name').innerText;
  data.avatarURL = document.querySelector('.avatar').src;
	
  // Get all the message elements from the chat
  const messages = document.querySelectorAll('.message');
  
  // Extract the text or image content and the type (sent/received) of each message
  const chatData = Array.from(messages).map(message => {
    const type = message.classList.contains('sent') ? 'sent' : 'received';
    const content = message.querySelector('.message-content') ? message.querySelector('.message-content').innerText : null;
    const image = message.querySelector('img') ? message.querySelector('img').src : null;
	const timestamp = message.querySelector('.message-time').innerText;
    return { type, content, image, timestamp };
  });
  
  data.chatData = chatData;

  // Convert the chat data to a JSON string
  const json = JSON.stringify(data, null, 2);

  // Create a Blob from the JSON string
  const blob = new Blob([json], { type: 'application/json' });

  // Create a link element and trigger a download
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'chat-messages.json';
  link.click();
}

function importMessages() {
  const file = event.target.files[0];

  // Make sure a file was selected
  if (!file) {
    return;
  }
  
  const reader = new FileReader();
  reader.onload = function(e) {
	  const content = e.target.result;
	  const data = JSON.parse(content)
	  
	  document.getElementById('chatBox').textContent = '';
	  
	  document.querySelector('.contact-name').innerText = data.contactName;
	  document.querySelector('.avatar').src = data.avatarURL;
	  
	  if(data.height) {
		  document.querySelector('.chat-container').style.height = data.height;
	  }
	  if(data.width) {
		  document.querySelector('.chat-container').style.width = data.width;
	  }
	  
	  data.chatData.forEach(message => {
		  let messageElement = document.createElement('div');
		  messageElement.setAttribute('class', 'message ' + message.type);
		  if(message.content) {
			  let messageSpan = document.createElement('span');
			  messageSpan.setAttribute('class', 'message-content');
			  messageSpan.textContent = message.content;
			  messageElement.appendChild(messageSpan);
		  }
		  if(message.image) {
			  let messageImage = document.createElement('img');
			  messageImage.setAttribute('src', message.image);
			  messageImage.setAttribute('alt', 'Image Message');
			  messageElement.appendChild(messageImage);
		  }
		  
		  // Create element for the message timestamp
		  let messageTimestamp = document.createElement('span');
		  messageTimestamp.setAttribute('class', 'message-time');
		  messageTimestamp.textContent = message.timestamp;
		  messageElement.appendChild(messageTimestamp);
		  
		  // Create element for the hidden icons
		  let messageIcons = document.createElement('div');
		  messageIcons.setAttribute('class', 'message-icons');
		  messageIcons.setAttribute('style', 'display: none;');
		  let messageIconPencil = document.createElement('span');
		  messageIconPencil.setAttribute('class', 'pencil');
		  messageIconPencil.textContent = '✏';
		  messageIconPencil.addEventListener('click', (e) => {
			e.stopPropagation();
			editMessageContent(messageElement);
		  });
		  let messageIconDelete = document.createElement('span');
		  messageIconDelete.setAttribute('class', 'delete');
		  messageIconDelete.textContent = '🗑';
		  messageIcons.appendChild(messageIconPencil);
		  messageIcons.appendChild(messageIconDelete);
		  messageElement.appendChild(messageIcons);
		  
		  messageElement.addEventListener('click', () => {
			const icons = messageElement.querySelector('.message-icons');
			if (icons) {
				icons.style.display = (icons.style.display === 'none' || icons.style.display === '') ? 'inline' : 'none';
			}
		  });
		  
		  document.getElementById('chatBox').appendChild(messageElement);
	  });
  };
  reader.readAsText(file);
  
  document.getElementById('import').value = '';
}

function downloadImage() {
	const chatContainer = document.getElementById('chatContainer');
	
	html2canvas(chatContainer, {useCORS: true}).then(canvas => {
		const image = canvas.toDataURL('image/png');
		const link = document.createElement('a');
		link.href = image;
		link.download = 'chat-image.png';
		link.click();
	});
}

// Initially add click listeners to all existing messages
window.onload = () => {
  addMessageClickListeners();
  document.getElementById('addSenderPhoto').addEventListener('click', () => addPhotoMessage(true));
  document.getElementById('addReceiverPhoto').addEventListener('click', () => addPhotoMessage(false));
  document.getElementById('changeAvatar').addEventListener('click', () => changeContactAvatar());
  document.getElementById('changeName').addEventListener('click', () => changeContactName());
  document.getElementById('defaultAvatar').addEventListener('click', () => resetDefaultAvatar());
  document.getElementById('export').addEventListener('click', () => exportMessages());
  document.getElementById('import').addEventListener('change', () => importMessages());
document.getElementById('downloadImage').addEventListener('click', () => downloadImage());
};

const chatBox = document.getElementById('chatBox');

// Variables to store the starting position of the scroll
let isDragging = false;
let startY;
let scrollTop;

// Function to temporarily disable text selection
function disableTextSelection() {
  document.body.style.userSelect = 'none';   // Disable text selection globally during drag
}

// Function to re-enable text selection after dragging
function enableTextSelection() {
  document.body.style.userSelect = '';   // Reset the style, allowing selection again
}

// Function to start dragging
chatBox.addEventListener('mousedown', (e) => {
  isDragging = true;
  startY = e.pageY - chatBox.offsetTop;
  scrollTop = chatBox.scrollTop;
  disableTextSelection();  // Disable text selection when dragging starts
});

chatBox.addEventListener('mouseleave', () => {
  isDragging = false;
  enableTextSelection();  // Re-enable text selection when dragging stops
});

chatBox.addEventListener('mouseup', () => {
  isDragging = false;
  enableTextSelection();  // Re-enable text selection when dragging stops
});

chatBox.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  e.preventDefault();
  const y = e.pageY - chatBox.offsetTop;
  const scroll = (y - startY) * 1.5;  // Adjust the scroll sensitivity by changing the multiplier
  chatBox.scrollTop = scrollTop - scroll;
});

// For touch devices: Add touch events
chatBox.addEventListener('touchstart', (e) => {
  isDragging = true;
  startY = e.touches[0].pageY - chatBox.offsetTop;
  scrollTop = chatBox.scrollTop;
  disableTextSelection();  // Disable text selection during touch drag
});

chatBox.addEventListener('touchend', () => {
  isDragging = false;
  enableTextSelection();  // Re-enable text selection after touch ends
});

chatBox.addEventListener('touchmove', (e) => {
  if (!isDragging) return;
  const y = e.touches[0].pageY - chatBox.offsetTop;
  const scroll = (y - startY) * 1.5;  // Adjust the scroll sensitivity by changing the multiplier
  chatBox.scrollTop = scrollTop - scroll;
});