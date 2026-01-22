// Popup script

let quickPatterns = []; // Array to store patterns as tags for quick add

// Tag management functions (similar to options.js)
function addQuickTag(pattern) {
  if (pattern && pattern.trim() && !quickPatterns.includes(pattern.trim())) {
    quickPatterns.push(pattern.trim());
    renderQuickTags();
  }
}

function removeQuickTag(pattern) {
  quickPatterns = quickPatterns.filter(p => p !== pattern);
  renderQuickTags();
}

function renderQuickTags() {
  const tagsList = document.getElementById('quickTagsList');
  if (quickPatterns.length === 0) {
    tagsList.innerHTML = '';
    return;
  }
  
  tagsList.innerHTML = quickPatterns.map((pattern, index) => {
    const patternEscaped = escapeHtml(pattern);
    return `<code class="removable-tag" data-pattern-index="${index}">
      ${patternEscaped}
      <button type="button" class="tag-remove" data-pattern="${patternEscaped}" title="Remove">×</button>
    </code>`;
  }).join('');
  
  // Attach event listeners to remove buttons
  tagsList.querySelectorAll('.tag-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const patternToRemove = btn.getAttribute('data-pattern');
      removeQuickTag(patternToRemove);
    });
  });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

document.addEventListener('DOMContentLoaded', async () => {
  // Load rules count
  await updateRulesCount();
  
  // Set up tag input handler
  const patternInput = document.getElementById('quickPattern');
  patternInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const value = patternInput.value.trim();
      if (value) {
        addQuickTag(value);
        patternInput.value = '';
      }
    } else if (e.key === 'Backspace' && patternInput.value === '' && quickPatterns.length > 0) {
      // Remove last tag when backspace is pressed on empty input
      removeQuickTag(quickPatterns[quickPatterns.length - 1]);
    }
  });
  
  // Toggle quick add form
  const toggleBtn = document.getElementById('toggleQuickAdd');
  const quickAddForm = document.getElementById('quickAddForm');
  const cancelBtn = document.getElementById('cancelQuickAdd');
  
  toggleBtn.addEventListener('click', () => {
    quickAddForm.style.display = 'block';
    toggleBtn.style.display = 'none'; // Hide the toggle button when form is open
    document.getElementById('quickPattern').focus();
  });
  
  cancelBtn.addEventListener('click', () => {
    quickAddForm.style.display = 'none';
    toggleBtn.style.display = 'block'; // Show the toggle button when form is closed
    quickPatterns = [];
    document.getElementById('quickAddForm').reset();
    renderQuickTags();
  });
  
  // Handle quick add form submission
  document.getElementById('quickAddForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const groupName = document.getElementById('quickGroupName').value.trim();
    const color = document.getElementById('quickColor').value;
    
    // Validate that at least one pattern is provided
    if (quickPatterns.length === 0) {
      alert('Please add at least one URL pattern.');
      document.getElementById('quickPattern').focus();
      return;
    }
    
    if (!groupName) {
      return;
    }
    
    try {
      const rule = {
        name: groupName,
        pattern: quickPatterns.length === 1 ? quickPatterns[0] : quickPatterns, // Store as string if single, array if multiple
        groupName: groupName,
        groupColor: color,
        enabled: true
      };
      
      await RuleManager.addRule(rule);
      
      // Reset form and hide
      quickPatterns = [];
      document.getElementById('quickAddForm').reset();
      renderQuickTags();
      quickAddForm.style.display = 'none';
      
      // Update rules count
      await updateRulesCount();
      
      // Show success message briefly
      toggleBtn.style.display = 'block'; // Show the toggle button after successful submission
      toggleBtn.textContent = '✓ Rule Added!';
      toggleBtn.style.backgroundColor = '#34a853';
      toggleBtn.style.color = 'white';
      setTimeout(() => {
        toggleBtn.textContent = '+ Add Rule';
        toggleBtn.style.backgroundColor = '';
        toggleBtn.style.color = '';
      }, 2000);
    } catch (error) {
      console.error('Error adding rule:', error);
      alert('Failed to add rule. Please try again.');
    }
  });
  
  // Open options page
  document.getElementById('openOptions').addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });
});

async function updateRulesCount() {
  const rules = await RuleManager.getRules();
  const enabledCount = rules.filter(r => r.enabled).length;
  document.getElementById('rulesCount').textContent = 
    `${enabledCount} ${enabledCount === 1 ? 'rule' : 'rules'} active`;
}


