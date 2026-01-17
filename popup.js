// Popup script

document.addEventListener('DOMContentLoaded', async () => {
  // Load rules count
  const rules = await RuleManager.getRules();
  const enabledCount = rules.filter(r => r.enabled).length;
  document.getElementById('rulesCount').textContent = 
    `${enabledCount} ${enabledCount === 1 ? 'rule' : 'rules'} active`;
  
  // Open options page
  document.getElementById('openOptions').addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });
});


