document.addEventListener('DOMContentLoaded', () => {
    const chatBox = document.getElementById('chat-box');
    const chatInput = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-button');

    // ローカルストレージからチャットメッセージを取得
    function loadChatMessages() {
        const messages = JSON.parse(localStorage.getItem('chatMessages')) || [];
        chatBox.innerHTML = '';
        messages.forEach(message => {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'mb-2';
            messageDiv.textContent = message;
            chatBox.appendChild(messageDiv);
        });
        chatBox.scrollTop = chatBox.scrollHeight; // スクロールを一番下に
    }

    // メッセージ送信
    function sendMessage() {
        const message = chatInput.value;
        if (message.trim() === '') return;

        let messages = JSON.parse(localStorage.getItem('chatMessages')) || [];
        messages.push(message);
        if (messages.length > 100) {
            messages = messages.slice(-100); // 最新100件のメッセージのみ保持
        }
        localStorage.setItem('chatMessages', JSON.stringify(messages));

        chatInput.value = '';
        loadChatMessages();
    }

    sendButton.addEventListener('click', sendMessage);

    chatInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });

    // 初回読み込み
    loadChatMessages();
});
