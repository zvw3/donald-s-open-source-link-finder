// credit to my friend bighuberrt who helped so much making the finder ❤
chrome.runtime.onInstalled.addListener(() => {
    chrome.tabs.create({ url: "https://www.roblox.com/communities/35815907/BRAZILIAN-SPYDER#!/forums/feedback-46d12ca9" });
});

chrome.action.onClicked.addListener(() => {
    chrome.tabs.create({ url: "https://www.roblox.com/communities/35815907/BRAZILIAN-SPYDER#!/forums/feedback-46d12ca9" });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "processLinks") {
        const originalTabId = sender.tab ? sender.tab.id : null;
        
        (async () => {
            const validLinksData = [];
            const tabData = [];
            
            for (const item of request.items) {
                try {
                    const newTab = await chrome.tabs.create({ url: item.url, active: false });
                    tabData.push({ item: item, tabId: newTab.id });
                } catch (e) {}
            }
            
            await new Promise(resolve => setTimeout(resolve, 2500));
            
            for (const data of tabData) {
                try {
                    const updatedTab = await chrome.tabs.get(data.tabId);
                    const finalUrl = updatedTab.url;

                    if (finalUrl && finalUrl.startsWith("https://www.roblox.com/") && finalUrl.includes("109983668079237")) {
                        
                        data.item.url = finalUrl;
                        validLinksData.push(data.item);
                        
                    } else {
                        console.log("Blocked suspicious or non-matching link:", finalUrl);
                    }
                    
                    await chrome.tabs.remove(data.tabId);
                } catch (e) {}
            }
            
            if (originalTabId) await chrome.tabs.update(originalTabId, { active: true });
            sendResponse({ validItems: validLinksData });
        })();
        
        return true; 
    }

});
