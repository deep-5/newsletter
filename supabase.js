/**
 * AIRA Newsletter - Google Sheets & Database Integration
 * Connected to Google Sheet:
 * https://docs.google.com/spreadsheets/d/1TxwtcRBFNN6SdvZM5f2g1ZU9uRp_iSTNaCFrmF3wDig/edit?usp=sharing
 */

// Google Sheets Configuration
const GOOGLE_SHEETS_CONFIG = {
  spreadsheetUrl: 'https://docs.google.com/spreadsheets/d/1TxwtcRBFNN6SdvZM5f2g1ZU9uRp_iSTNaCFrmF3wDig/edit?usp=sharing',
  spreadsheetId: '1TxwtcRBFNN6SdvZM5f2g1ZU9uRp_iSTNaCFrmF3wDig',
  // Google Apps Script Web App URL (Deploy script in your Google Sheet > Extensions > Apps Script)
  scriptUrl: 'https://script.google.com/macros/s/AKfycbx_YOUR_DEPLOYED_WEB_APP_ID/exec'
};

// Optional: Supabase Config
const SUPABASE_CONFIG = {
  url: 'https://YOUR_PROJECT_ID.supabase.co',
  anonKey: 'YOUR_SUPABASE_ANON_KEY'
};

// Initialize Supabase Client if library is available
let supabaseClient = null;
if (typeof supabase !== 'undefined' && SUPABASE_CONFIG.url !== 'https://YOUR_PROJECT_ID.supabase.co') {
  try {
    supabaseClient = supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
    console.log('⚡ Supabase connected successfully to AIRA Database!');
  } catch (err) {
    console.warn('Supabase initialization error:', err);
  }
}

// =========================================================================
// Database & Google Sheets Operations
// =========================================================================

const DatabaseService = {
  /**
   * Add email subscriber to Google Sheets and Database
   */
  async subscribe(email, source = 'AIRA Website') {
    const cleanEmail = (email || '').trim().toLowerCase();
    if (!cleanEmail) return { success: false };

    const timestamp = new Date().toISOString();
    const readableDate = new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    // 1. Send directly to Google Sheets Webhook
    if (GOOGLE_SHEETS_CONFIG.scriptUrl && !GOOGLE_SHEETS_CONFIG.scriptUrl.includes('YOUR_DEPLOYED_WEB_APP_ID')) {
      try {
        const formData = new FormData();
        formData.append('email', cleanEmail);
        formData.append('source', source);
        formData.append('timestamp', readableDate);
        formData.append('page', window.location.href);

        await fetch(GOOGLE_SHEETS_CONFIG.scriptUrl, {
          method: 'POST',
          mode: 'no-cors',
          body: formData
        });
        console.log('⚡ Subscriber successfully synced to Google Sheet:', cleanEmail);
      } catch (err) {
        console.warn('Google Sheets sync warning:', err);
      }
    }

    // 2. Send to Supabase if active
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient
          .from('subscribers')
          .insert([{ email: cleanEmail, source: source }]);
        
        if (error && error.code !== '23505') {
          console.error('Supabase subscriber error:', error);
        }
      } catch (err) {
        console.error('Supabase error:', err);
      }
    }
    
    // 3. Store locally in browser storage
    const list = JSON.parse(localStorage.getItem('aira_subscribers') || '[]');
    const exists = list.some(item => (typeof item === 'string' ? item : item.email) === cleanEmail);
    if (!exists) {
      list.push({ email: cleanEmail, date: readableDate, source: source });
      localStorage.setItem('aira_subscribers', JSON.stringify(list));
    }

    return { success: true };
  },

  /**
   * Fetch comments for a post
   */
  async getComments(postSlug) {
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient
          .from('comments')
          .select('*')
          .eq('post_slug', postSlug)
          .order('created_at', { ascending: false });

        if (!error && data) {
          return data.map(item => ({
            id: item.id,
            author: item.author_name,
            text: item.comment_text,
            date: new Date(item.created_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })
          }));
        }
      } catch (err) {
        console.error('Supabase comments error:', err);
      }
    }

    // Local fallback
    const local = JSON.parse(localStorage.getItem('aira_comments') || '{}');
    return local[postSlug] || [];
  },

  /**
   * Add new comment
   */
  async postComment(postSlug, authorName, commentText) {
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient
          .from('comments')
          .insert([{
            post_slug: postSlug,
            author_name: authorName || 'AI Enthusiast',
            comment_text: commentText
          }]);

        if (error) console.error('Supabase post comment error:', error);
      } catch (err) {
        console.error('Supabase comment error:', err);
      }
    }

    // Always update local cache
    const local = JSON.parse(localStorage.getItem('aira_comments') || '{}');
    if (!local[postSlug]) local[postSlug] = [];
    local[postSlug].unshift({
      author: authorName || 'AI Enthusiast',
      text: commentText,
      date: 'Just now'
    });
    localStorage.setItem('aira_comments', JSON.stringify(local));
    return { success: true };
  },

  /**
   * Record Like
   */
  async recordLike(postSlug) {
    if (supabaseClient) {
      try {
        await supabaseClient.from('likes').insert([{ post_slug: postSlug }]);
      } catch (err) {
        console.error('Supabase like error:', err);
      }
    }
  },

  /**
   * Record Poll Vote
   */
  async recordPollVote(postSlug, vote) {
    if (supabaseClient) {
      try {
        await supabaseClient.from('poll_votes').insert([{
          post_slug: postSlug,
          vote: vote
        }]);
      } catch (err) {
        console.error('Supabase poll error:', err);
      }
    }
  }
};

window.DatabaseService = DatabaseService;
