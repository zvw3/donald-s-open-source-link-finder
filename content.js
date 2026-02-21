// credit to my friend who helped so much making the finder ❤
const anyLinkRegex = /(https?:\/\/[^\s"'<>]+)/g;

document.addEventListener('keydown', async (event) => {
    if (event.key.toLowerCase() === 'g') {
        const extractedItems = [];
        const processedLinks = new Set();
        
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        let node;
        
        while ((node = walker.nextNode())) {
            const text = node.nodeValue;
            if (text && text.match(anyLinkRegex)) {
                const matches = text.match(anyLinkRegex);
                
                for (let link of matches) {
                    if (!processedLinks.has(link)) {
                        processedLinks.add(link);
                        
                        let username = "Unknown";
                        let postContainer = node.parentElement;
                        let walkLevels = 6;
                        while (postContainer && postContainer.parentElement && walkLevels > 0) {
                            postContainer = postContainer.parentElement;
                            walkLevels--;
                        }
                        const containerText = postContainer ? (postContainer.innerText || postContainer.textContent) : "";
                        const nameMatch = containerText.match(/([a-zA-Z0-9_]+)\s*[·•]/);
                        if (nameMatch && nameMatch[1]) username = nameMatch[1].trim();

                        extractedItems.push({ url: link, username: username });
                    }
                }
            }
        }
        
        if (extractedItems.length === 0) {
            alert("No links found on this page.");
            return;
        }

        chrome.runtime.sendMessage({ action: "processLinks", items: extractedItems }, (response) => {
            if (response && response.validItems) {
                const snatchedData = response.validItems.map(item => `${item.url}\nBy: ${item.username}\n`);
                
                if (snatchedData.length > 0) {
                    const resultString = snatchedData.join('\n') + "\nsnatched with donald's link snatcher 🔥";
                    navigator.clipboard.writeText(resultString).then(() => {
                        alert("✅ SUCCESS! Un-shortened and verified:\n\n" + resultString);
                    });
                } else {
                    alert("❌ Checked links, but NONE went to the right game (or they were fake scam sites).");
                }
            }
        });
    }

});
