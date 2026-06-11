/**
 * Supabase Service Client
 * 
 * Provides mock configuration and connection properties for Supabase DB & Auth.
 * When integrated, this client will enable real-time updates and direct database storage.
 */

// Simulated Local Storage DB for offline demonstration capability
const getStoredData = <T>(key: string, defaultValue: T): T => {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : defaultValue;
};

const setStoredData = <T>(key: string, data: T): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

interface StoredResume {
  id: string;
  name: string;
  size: string;
  dateUploaded: string;
  status: string;
}

interface StoredCampaign {
  id: string;
  name: string;
  status: string;
  sent: number;
  replies: number;
  responseRate: string;
  dateCreated: string;
}

interface CampaignInsert {
  name: string;
  status?: string;
  sent?: number;
  replies?: number;
}

export const supabaseService = {
  // Authentication Mock
  auth: {
    async getUser() {
      const user = localStorage.getItem('applyflow_user');
      if (user) {
        return { data: { user: JSON.parse(user) }, error: null };
      }
      return { data: { user: null }, error: null };
    },

    async signInWithGoogle() {
      const mockUser = {
        id: 'usr_892374982',
        email: 'alex.jobseeker@gmail.com',
        user_metadata: {
          full_name: 'Alex Jobseeker',
          avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&h=256&fit=crop',
        }
      };
      localStorage.setItem('applyflow_user', JSON.stringify(mockUser));
      localStorage.setItem('isLoggedIn', 'true');
      return { data: { user: mockUser }, error: null };
    },

    async signOut() {
      localStorage.removeItem('applyflow_user');
      localStorage.setItem('isLoggedIn', 'false');
      return { error: null };
    }
  },

  // Database Mock Tables
  db: {
    // Resume operations
    resumes: {
      async select() {
        const defaultResumes = [
          { id: '1', name: 'Alex_Jobseeker_CV.pdf', size: '245 KB', dateUploaded: '2026-06-05', status: 'Active' },
          { id: '2', name: 'Alex_Jobseeker_CoverLetter.pdf', size: '180 KB', dateUploaded: '2026-06-06', status: 'Inactive' }
        ];
        return { data: getStoredData('applyflow_resumes', defaultResumes), error: null };
      },
      async insert(resume: { name: string; size: string; status: string }) {
        const current = getStoredData<StoredResume[]>('applyflow_resumes', []);
        const newResume = {
          id: Math.random().toString(36).substring(2, 9),
          name: resume.name,
          size: resume.size,
          dateUploaded: new Date().toISOString().split('T')[0],
          status: resume.status
        };
        const updated = [newResume, ...current];
        setStoredData('applyflow_resumes', updated);
        return { data: newResume, error: null };
      }
    },

    // Campaign operations
    campaigns: {
      async select() {
        const defaultCampaigns = [
          { id: 'c1', name: 'Q2 Software Engineer Outreach', status: 'Running', sent: 48, replies: 12, responseRate: '25%', dateCreated: '2026-06-08' },
          { id: 'c2', name: 'Product Manager Auto-Apply', status: 'Completed', sent: 124, replies: 38, responseRate: '30%', dateCreated: '2026-05-15' },
          { id: 'c3', name: 'Frontend React Roles', status: 'Draft', sent: 0, replies: 0, responseRate: '0%', dateCreated: '2026-06-11' }
        ];
        return { data: getStoredData('applyflow_campaigns', defaultCampaigns), error: null };
      },
      async insert(campaign: CampaignInsert) {
        const current = getStoredData<StoredCampaign[]>('applyflow_campaigns', []);
        const newCampaign = {
          id: `c_${Math.random().toString(36).substring(2, 9)}`,
          name: campaign.name,
          status: campaign.status || 'Draft',
          sent: campaign.sent || 0,
          replies: campaign.replies || 0,
          responseRate: '0%',
          dateCreated: new Date().toISOString().split('T')[0]
        };
        const updated = [newCampaign, ...current];
        setStoredData('applyflow_campaigns', updated);
        return { data: newCampaign, error: null };
      }
    }
  }
};
