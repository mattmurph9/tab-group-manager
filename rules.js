// Rule management utilities

class RuleManager {
  static async getRules() {
    const result = await chrome.storage.sync.get(['rules']);
    return result.rules || [];
  }

  static async saveRules(rules) {
    await chrome.storage.sync.set({ rules });
  }

  static async addRule(rule) {
    const rules = await this.getRules();
    const newRule = {
      ...rule,
      id: rule.id || `rule_${Date.now()}`,
      enabled: rule.enabled !== undefined ? rule.enabled : true
    };
    rules.push(newRule);
    await this.saveRules(rules);
    return newRule;
  }

  static async updateRule(ruleId, updates) {
    const rules = await this.getRules();
    const index = rules.findIndex(r => r.id === ruleId);
    if (index !== -1) {
      rules[index] = { ...rules[index], ...updates };
      await this.saveRules(rules);
      return rules[index];
    }
    return null;
  }

  static async deleteRule(ruleId) {
    const rules = await this.getRules();
    const filtered = rules.filter(r => r.id !== ruleId);
    await this.saveRules(filtered);
    return filtered;
  }

  static async toggleRule(ruleId) {
    const rules = await this.getRules();
    const rule = rules.find(r => r.id === ruleId);
    if (rule) {
      rule.enabled = !rule.enabled;
      await this.saveRules(rules);
      return rule;
    }
    return null;
  }
}


