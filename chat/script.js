// Google APIの設定
const CLIENT_ID = '1009288328361-9tspigls3gsulslvi3k5dm3mfb7nto5p.apps.googleusercontent.com';
const API_KEY = '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';
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
const SCOPES = 'https://www.googleapis.com/auth/drive.file';

document.addEventListener('DOMContentLoaded', () => {
    const chatBox = document.getElementById('chat-box');
    const chatInput = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-button');

    // Google APIの初期化
    gapi.load('client:auth2', initClient);

    function initClient() {
        gapi.client.init({
            apiKey: API_KEY,
            clientId: CLIENT_ID,
            discoveryDocs: DISCOVERY_DOCS,
            scope: SCOPES
        }).then(() => {
            gapi.auth2.getAuthInstance().signIn().then(loadChatMessages);
        });
    }

    // Google Driveからチャットメッセージを取得
    function loadChatMessages() {
        gapi.client.drive.files.list({
            'q': "name='chat.txt'",
            'spaces': 'drive',
            'fields': "files(id, name)"
        }).then(response => {
            const files = response.result.files;
            if (files && files.length > 0) {
                const fileId = files[0].id;
                gapi.client.drive.files.get({
                    fileId: fileId,
                    alt: 'media'
                }).then(response => {
                    const messages = response.body.split('\n');
                    chatBox.innerHTML = '';
                    messages.forEach(message => {
                        if (message.trim()) {
                            const messageDiv = document.createElement('div');
                            messageDiv.className = 'mb-2';
                            messageDiv.textContent = message;
                            chatBox.appendChild(messageDiv);
                        }
                    });
                    chatBox.scrollTop = chatBox.scrollHeight;
                });
            } else {
                gapi.client.drive.files.create({
                    resource: {
                        name: 'chat.txt',
                        mimeType: 'text/plain'
                    },
                    media: {
                        mimeType: 'text/plain',
                        body: ''
                    },
                    fields: 'id'
                }).then(response => {
                    console.log('Created file with ID: ' + response.result.id);
                });
            }
        });
    }

    // メッセージ送信
    function sendMessage() {
        const message = chatInput.value;
        if (message.trim() === '') return;

        gapi.client.drive.files.list({
            'q': "name='chat.txt'",
            'spaces': 'drive',
            'fields': "files(id, name)"
        }).then(response => {
            const files = response.result.files;
            if (files && files.length > 0) {
                const fileId = files[0].id;
                gapi.client.drive.files.get({
                    fileId: fileId,
                    alt: 'media'
                }).then(response => {
                    const currentMessages = response.body;
                    const newMessages = currentMessages ? currentMessages + '\n' + message : message;
                    const file = new Blob([newMessages], { type: 'text/plain' });
                    const metadata = {
                        'name': 'chat.txt',
                        'mimeType': 'text/plain'
                    };
                    const form = new FormData();
                    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
                    form.append('file', file);

                    fetch('https://www.googleapis.com/upload/drive/v3/files/' + fileId + '?uploadType=multipart', {
                        method: 'PATCH',
                        headers: {
                            'Authorization': 'Bearer ' + gapi.auth.getToken().access_token
                        },
                        body: form
                    }).then(() => {
                        chatInput.value = '';
                        loadChatMessages();
                    });
                });
            }
        });
    }

    sendButton.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });
});
