// Background service worker for Automatic Tab Group extension

// Default rules structure
const DEFAULT_RULES = [
  {
    id: 'mail',
    name: 'Mail',
    pattern: ['mail.google.com', 'outlook.live.com'],
    groupName: 'Mail',
    groupColor: 'blue',
    enabled: true
  }
];

// Initialize storage with default rules if empty
chrome.runtime.onInstalled.addListener(async () => {
  const result = await chrome.storage.sync.get(['rules']);
  if (!result.rules || result.rules.length === 0) {
    await chrome.storage.sync.set({ rules: DEFAULT_RULES });
  }
});

// Listen for storage changes to update existing tab groups when rules change
chrome.storage.onChanged.addListener(async (changes, areaName) => {
  if (areaName === 'sync' && changes.rules) {
    const newRules = changes.rules.newValue || [];
    await updateExistingTabGroups(newRules);
  }
});

// Track processed tabs to avoid duplicate processing
const processedTabs = new Set();

// Listen for new tabs
chrome.tabs.onCreated.addListener(async (tab) => {
  // Wait a bit for the tab to fully load its URL, then fetch the tab again
  setTimeout(async () => {
    try {
      const updatedTab = await chrome.tabs.get(tab.id);
      if (updatedTab && updatedTab.url) {
        await processTab(updatedTab);
      }
    } catch (error) {
      console.error('Error processing tab onCreated:', error);
    }
  }, 500);
});

// Listen for tab updates (when URL changes)
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  // Process when URL changes (don't wait for 'complete' status)
  if (changeInfo.url) {
    // Create a unique key for this tab+URL combination
    const tabKey = `${tabId}_${changeInfo.url}`;
    
    // Skip if we've already processed this tab with this URL
    if (processedTabs.has(tabKey)) {
      return;
    }
    
    try {
      // Wait a moment for the tab to be fully ready
      setTimeout(async () => {
        try {
          const updatedTab = await chrome.tabs.get(tabId);
          if (updatedTab && updatedTab.url === changeInfo.url) {
            await processTab(updatedTab);
            processedTabs.add(tabKey);
            
            // Clean up old entries (keep only last 100)
            if (processedTabs.size > 100) {
              const entries = Array.from(processedTabs);
              processedTabs.clear();
              entries.slice(-50).forEach(key => processedTabs.add(key));
            }
          }
        } catch (error) {
          console.error('Error processing tab onUpdated:', error);
        }
      }, 300);
    } catch (error) {
      console.error('Error in onUpdated listener:', error);
    }
  }
});

async function processTab(tab) {
  console.log('[AutoTabGroup] Processing tab:', tab.id, tab.url);
  
  // Skip if tab doesn't have a valid URL (e.g., chrome:// pages, new tab page)
  if (!tab.url || tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://') || tab.url === 'about:blank') {
    console.log('[AutoTabGroup] Skipping tab - invalid URL:', tab.url);
    return;
  }

  // Get rules from storage
  const result = await chrome.storage.sync.get(['rules']);
  const rules = result.rules || DEFAULT_RULES;
  console.log('[AutoTabGroup] Loaded rules:', rules.length, 'rules');

  // Find matching rule
  const matchingRule = findMatchingRule(tab.url, rules);
  
  if (!matchingRule) {
    console.log('[AutoTabGroup] No matching rule found for URL:', tab.url);
    return;
  }
  
  if (!matchingRule.enabled) {
    console.log('[AutoTabGroup] Matching rule is disabled:', matchingRule.name);
    return;
  }

  console.log('[AutoTabGroup] Found matching rule:', matchingRule.name, 'for URL:', tab.url);

  // Find or create the tab group
  const groupId = await findOrCreateGroup(matchingRule, tab.id);
  
  if (groupId) {
    // If the group was just created, the tab is already in it
    // Otherwise, we need to add it
    try {
      const group = await chrome.tabGroups.get(groupId);
      const groupTabs = await chrome.tabs.query({ groupId: groupId });
      const isAlreadyInGroup = groupTabs.some(t => t.id === tab.id);
      
      if (!isAlreadyInGroup) {
        await chrome.tabs.group({
          groupId: groupId,
          tabIds: [tab.id]
        });
        console.log(`[AutoTabGroup] Tab ${tab.id} added to group "${matchingRule.groupName}"`);
      } else {
        console.log(`[AutoTabGroup] Tab ${tab.id} already in group "${matchingRule.groupName}"`);
      }
    } catch (error) {
      console.error('[AutoTabGroup] Error grouping tab:', error);
    }
  } else {
    console.error('[AutoTabGroup] Failed to find or create group');
  }
}

function findMatchingRule(url, rules) {
  // Find the first enabled rule that matches the URL
  for (const rule of rules) {
    if (!rule.enabled) continue;
    
    // Handle both string (legacy) and array (new) pattern formats
    const patternArray = Array.isArray(rule.pattern) ? rule.pattern : [rule.pattern];
    const urlLower = url.toLowerCase();
    
    // Check if any pattern matches (simple substring match, can be enhanced with regex)
    for (const pattern of patternArray) {
      const patternLower = pattern.toLowerCase();
      if (urlLower.includes(patternLower)) {
        return rule;
      }
    }
  }
  return null;
}

async function findOrCreateGroup(rule, tabId) {
  try {
    // Get all tab groups
    const groups = await chrome.tabGroups.query({});
    
    // Look for existing group with the same name
    for (const group of groups) {
      if (group.title === rule.groupName) {
        // Update the group if color or name has changed
        const needsUpdate = group.color !== (rule.groupColor || 'grey') || 
                           group.title !== rule.groupName;
        if (needsUpdate) {
          await chrome.tabGroups.update(group.id, {
            title: rule.groupName,
            color: rule.groupColor || 'grey'
          });
          console.log(`[AutoTabGroup] Updated group "${rule.groupName}" with new color: ${rule.groupColor || 'grey'}`);
        }
        return group.id;
      }
    }
    
    // Create new group with the current tab
    // Chrome requires at least one tab to create a group
    const groupId = await chrome.tabs.group({
      tabIds: [tabId]
    });
    
    // Update the group with name and color
    await chrome.tabGroups.update(groupId, {
      title: rule.groupName,
      color: rule.groupColor || 'grey'
    });
    
    return groupId;
  } catch (error) {
    console.error('Error finding/creating group:', error);
    return null;
  }
}

// Update existing tab groups when rules change
async function updateExistingTabGroups(rules) {
  try {
    console.log('[AutoTabGroup] Updating existing tab groups based on rule changes');
    const groups = await chrome.tabGroups.query({});
    
    // Map rules by group name for quick lookup
    const rulesByGroupName = {};
    for (const rule of rules) {
      if (rule.enabled) {
        rulesByGroupName[rule.groupName] = rule;
      }
    }
    
    // Update each existing group if it matches a rule
    for (const group of groups) {
      const matchingRule = rulesByGroupName[group.title];
      if (matchingRule) {
        const needsUpdate = group.color !== (matchingRule.groupColor || 'grey') || 
                           group.title !== matchingRule.groupName;
        if (needsUpdate) {
          await chrome.tabGroups.update(group.id, {
            title: matchingRule.groupName,
            color: matchingRule.groupColor || 'grey'
          });
          console.log(`[AutoTabGroup] Updated existing group "${group.title}" to color: ${matchingRule.groupColor || 'grey'}`);
        }
      }
    }
  } catch (error) {
    console.error('[AutoTabGroup] Error updating existing tab groups:', error);
  }
}
