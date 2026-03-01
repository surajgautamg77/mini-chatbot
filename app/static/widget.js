(function() {
    const script = document.currentScript;
    const botId = script.getAttribute('data-bot-id');
    const botName = script.getAttribute('data-bot-name') || 'AI Assistant';
    // Use the provided app URL or fallback to the script's origin
    const appUrl = script.getAttribute('data-app-url') || script.src.split('/static/')[0];

    function generateUUID() {
        return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    }

    const styles = `
        #gemini-bot-btn {
            position: fixed; bottom: 15px; right: 15px; width: 60px; height: 60px;
            background: #4f46e5; color: white; border-radius: 50%; display: flex;
            align-items: center; justify-content: center; cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2); z-index: 999999; transition: transform 0.2s ease;
        }
        #gemini-bot-btn:hover { transform: scale(1.05); }
        #gemini-bot-container {
            position: fixed; bottom: 15px; right: 15px; width: 400px; height: 600px;
            max-width: calc(100vw - 30px); max-height: calc(100vh - 30px);
            z-index: 999998; display: none; border-radius: 16px; overflow: hidden;
            box-shadow: 0 12px 24px rgba(0,0,0,0.15); background: white; border: 1px solid #e5e7eb;
        }
    `;

    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    const btn = document.createElement("div");
    btn.id = "gemini-bot-btn";
    btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>';
    
    const container = document.createElement("div");
    container.id = "gemini-bot-container";

    const iframe = document.createElement("iframe");
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.border = "none";
    
    container.appendChild(iframe);
    document.body.appendChild(btn);
    document.body.appendChild(container);

    function toggleChat() {
        if (container.style.display === "none") {
            const sid = generateUUID();
            // Ensure proper URL construction with ? for query params
            iframe.src = `${appUrl}/embed/chat?chatbotId=${botId}&sessionId=${sid}`;
            container.style.display = "block";
            btn.style.display = "none";
        } else {
            container.style.display = "none";
            btn.style.display = "flex";
            iframe.src = "about:blank";
        }
    }

    btn.onclick = toggleChat;

    window.addEventListener("message", (e) => {
        if (e.data === "close-chat") toggleChat();
    }, false);
})();
