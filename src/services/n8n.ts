/**
 * n8n Automation Workflows Integration Service
 * 
 * Provides mock configuration and webhook triggers for n8n automations.
 * This can be used to forward email tracking, parsing, or automated followups.
 */

export interface N8nWebhookConfig {
  webhookUrl: string;
  enabled: boolean;
  events: {
    onSend: boolean;
    onReply: boolean;
    onStatusChange: boolean;
  };
}

export const n8nService = {
  // Get webhook configuration
  async getConfig(): Promise<N8nWebhookConfig> {
    const defaultVal: N8nWebhookConfig = {
      webhookUrl: 'https://n8n.mycompany.com/webhook/applyflow-receiver',
      enabled: false,
      events: {
        onSend: true,
        onReply: true,
        onStatusChange: false,
      }
    };
    const saved = localStorage.getItem('n8n_config');
    return saved ? JSON.parse(saved) : defaultVal;
  },

  // Save config
  async saveConfig(config: N8nWebhookConfig): Promise<boolean> {
    localStorage.setItem('n8n_config', JSON.stringify(config));
    return true;
  },

  // Trigger n8n webhook when an email is sent (simulated)
  async triggerOnSend(payload: { company: string; email: string; subject: string; position: string }): Promise<{ success: boolean }> {
    const config = await this.getConfig();
    if (!config.enabled) {
      return { success: false };
    }

    console.log(`[n8n Webhook] Triggered event 'onSend' at ${config.webhookUrl}`, payload);
    try {
      // Future: await fetch(config.webhookUrl, { method: 'POST', body: JSON.stringify(payload) })
      return { success: true };
    } catch {
      return { success: false };
    }
  },

  // Trigger n8n webhook when a reply is received
  async triggerOnReply(payload: { company: string; from: string; body: string; sentiment: string }): Promise<{ success: boolean }> {
    const config = await this.getConfig();
    if (!config.enabled) {
      return { success: false };
    }

    console.log(`[n8n Webhook] Triggered event 'onReply' at ${config.webhookUrl}`, payload);
    return { success: true };
  }
};
