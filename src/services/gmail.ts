/**
 * Gmail API Integration Service
 * 
 * Mock interface and integration points for Google Gmail API.
 * Future integration will use Google OAuth tokens to send, list, and read emails.
 */

export interface GmailProfile {
  emailAddress: string;
  messagesTotal: number;
  threadsTotal: number;
  historyId: string;
}

export interface GmailDraft {
  id: string;
  message: {
    id: string;
    threadId: string;
    labelIds: string[];
    snippet: string;
  };
}

export const gmailService = {
  // Check if Gmail OAuth is authorized
  async getAuthStatus(): Promise<{ authorized: boolean; email?: string }> {
    // Simulated token check
    const isAuthed = localStorage.getItem('gmail_oauth_connected') === 'true';
    const email = localStorage.getItem('gmail_oauth_email') || 'user@gmail.com';
    return { authorized: isAuthed, email: isAuthed ? email : undefined };
  },

  // Get user profile details from Gmail
  async getProfile(): Promise<GmailProfile | null> {
    const isAuthed = localStorage.getItem('gmail_oauth_connected') === 'true';
    if (!isAuthed) return null;

    return {
      emailAddress: localStorage.getItem('gmail_oauth_email') || 'user@gmail.com',
      messagesTotal: 1250,
      threadsTotal: 840,
      historyId: '8917240',
    };
  },

  // Authorize Gmail OAuth flow (simulated)
  async connectAccount(email: string): Promise<boolean> {
    localStorage.setItem('gmail_oauth_connected', 'true');
    localStorage.setItem('gmail_oauth_email', email);
    return true;
  },

  // Disconnect Gmail account
  async disconnectAccount(): Promise<boolean> {
    localStorage.removeItem('gmail_oauth_connected');
    localStorage.removeItem('gmail_oauth_email');
    return true;
  },

  // Send a raw email draft/message using Gmail API
  async sendEmail(to: string, subject: string, body: string): Promise<{ success: boolean; messageId?: string }> {
    console.log(`[Gmail API] Sending email to: ${to}, Subject: ${subject}, Body length: ${body.length}`);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    return {
      success: true,
      messageId: `msg_${Math.random().toString(36).substring(2, 11)}`,
    };
  }
};
