// Options page script for managing rules

let editingRuleId = null;
let patterns = []; // Array to store current patterns as tags

// Load and display rules on page load
document.addEventListener('DOMContentLoaded', async () => {
  await loadRules();
  
  // Set up event listeners
  document.getElementById('addRuleBtn').addEventListener('click', () => {
    openModal();
  });
  
  document.getElementById('closeModal').addEventListener('click', closeModal);
  document.getElementById('cancelBtn').addEventListener('click', closeModal);
  
  document.getElementById('ruleForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    await saveRule();
  });
  
  // Set up tag input handler
  const patternInput = document.getElementById('rulePattern');
  patternInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const value = patternInput.value.trim();
      if (value && !patterns.includes(value)) {
        addTag(value);
        patternInput.value = '';
      }
    } else if (e.key === 'Backspace' && patternInput.value === '' && patterns.length > 0) {
      // Remove last tag when backspace is pressed on empty input
      removeTag(patterns[patterns.length - 1]);
    }
  });
  
  // Close modal when clicking outside
  document.getElementById('ruleModal').addEventListener('click', (e) => {
    if (e.target.id === 'ruleModal') {
      closeModal();
    }
  });
});

async function loadRules() {
  const rules = await RuleManager.getRules();
  const rulesList = document.getElementById('rulesList');
  
  if (rules.length === 0) {
    rulesList.innerHTML = '<p class="empty-state">No rules configured. Click "Add Rule" to create one.</p>';
    return;
  }
  
  rulesList.innerHTML = rules.map(rule => createRuleCard(rule)).join('');
  
  // Attach event listeners to rule cards
  rules.forEach(rule => {
    attachRuleCardListeners(rule.id);
  });
}

function createRuleCard(rule) {
  const statusClass = rule.enabled ? 'enabled' : 'disabled';
  const statusText = rule.enabled ? 'Enabled' : 'Disabled';
  
  // Handle both string (legacy) and array (new) pattern formats
  const patternArray = Array.isArray(rule.pattern) ? rule.pattern : [rule.pattern];
  const patternsDisplay = patternArray.map(p => `<code>${escapeHtml(p)}</code>`).join(', ');
  
  return `
    <div class="rule-card ${statusClass}" data-rule-id="${rule.id}">
      <div class="rule-card-header">
        <div class="rule-info">
          <h3>${escapeHtml(rule.name)}</h3>
          <span class="rule-status">${statusText}</span>
        </div>
        <div class="rule-actions">
          <button class="btn-icon toggle-btn" data-action="toggle" title="Toggle rule">
            ${rule.enabled ? '⏸' : '▶'}
          </button>
          <button class="btn-icon edit-btn" data-action="edit" title="Edit rule">✏️</button>
          <button class="btn-icon delete-btn" data-action="delete" title="Delete rule">🗑️</button>
        </div>
      </div>
      <div class="rule-details">
        <div class="detail-item">
          <strong>Patterns:</strong> ${patternsDisplay}
        </div>
        <div class="detail-item">
          <strong>Group:</strong> ${escapeHtml(rule.groupName)} 
          <span class="color-badge" style="background-color: var(--color-${rule.groupColor})"></span>
        </div>
      </div>
    </div>
  `;
}

function attachRuleCardListeners(ruleId) {
  const card = document.querySelector(`[data-rule-id="${ruleId}"]`);
  if (!card) return;
  
  card.querySelector('[data-action="toggle"]').addEventListener('click', async () => {
    await RuleManager.toggleRule(ruleId);
    await loadRules();
  });
  
  card.querySelector('[data-action="edit"]').addEventListener('click', async () => {
    const rules = await RuleManager.getRules();
    const rule = rules.find(r => r.id === ruleId);
    if (rule) {
      openModal(rule);
    }
  });
  
  card.querySelector('[data-action="delete"]').addEventListener('click', async () => {
    if (confirm('Are you sure you want to delete this rule?')) {
      await RuleManager.deleteRule(ruleId);
      await loadRules();
    }
  });
}

// Tag management functions
function addTag(pattern) {
  if (pattern && pattern.trim() && !patterns.includes(pattern.trim())) {
    patterns.push(pattern.trim());
    renderTags();
  }
}

function removeTag(pattern) {
  patterns = patterns.filter(p => p !== pattern);
  renderTags();
}

function renderTags() {
  const tagsList = document.getElementById('tagsList');
  if (patterns.length === 0) {
    tagsList.innerHTML = '';
    return;
  }
  
  tagsList.innerHTML = patterns.map((pattern, index) => `
    <div class="tag" data-pattern-index="${index}">
      <span class="tag-text">${escapeHtml(pattern)}</span>
      <button type="button" class="tag-remove" data-pattern="${escapeHtml(pattern)}" title="Remove">×</button>
    </div>
  `).join('');
  
  // Attach event listeners to remove buttons
  tagsList.querySelectorAll('.tag-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const patternToRemove = btn.getAttribute('data-pattern');
      removeTag(patternToRemove);
    });
  });
}

function openModal(rule = null) {
  editingRuleId = rule ? rule.id : null;
  const modal = document.getElementById('ruleModal');
  const form = document.getElementById('ruleForm');
  
  document.getElementById('modalTitle').textContent = rule ? 'Edit Rule' : 'Add New Rule';
  
  // Reset patterns
  patterns = [];
  
  if (rule) {
    document.getElementById('ruleName').value = rule.name;
    // Handle both string (legacy) and array (new) pattern formats
    if (Array.isArray(rule.pattern)) {
      patterns = [...rule.pattern];
    } else if (rule.pattern) {
      patterns = [rule.pattern];
    }
    document.getElementById('rulePattern').value = '';
    document.getElementById('groupName').value = rule.groupName;
    document.getElementById('groupColor').value = rule.groupColor || 'grey';
    document.getElementById('ruleEnabled').checked = rule.enabled !== false;
  } else {
    form.reset();
    document.getElementById('ruleEnabled').checked = true;
    document.getElementById('rulePattern').value = '';
  }
  
  renderTags();
  modal.style.display = 'flex';
  // Focus the pattern input
  setTimeout(() => document.getElementById('rulePattern').focus(), 100);
}

function closeModal() {
  document.getElementById('ruleModal').style.display = 'none';
  editingRuleId = null;
  patterns = [];
  document.getElementById('ruleForm').reset();
  renderTags();
}

async function saveRule() {
  // Validate that at least one pattern is provided
  if (patterns.length === 0) {
    alert('Please add at least one URL pattern.');
    document.getElementById('rulePattern').focus();
    return;
  }
  
  const rule = {
    name: document.getElementById('ruleName').value.trim(),
    pattern: patterns.length === 1 ? patterns[0] : patterns, // Store as string if single, array if multiple
    groupName: document.getElementById('groupName').value.trim(),
    groupColor: document.getElementById('groupColor').value,
    enabled: document.getElementById('ruleEnabled').checked
  };
  
  if (editingRuleId) {
    await RuleManager.updateRule(editingRuleId, rule);
  } else {
    await RuleManager.addRule(rule);
  }
  
  closeModal();
  await loadRules();
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}


