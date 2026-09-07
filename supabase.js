/**
 * AIRA Newsletter - Supabase Client Integration
 * Database for: Subscribers, Comments, Likes, Polls with real-time timestamps
 */

// REPLACE with your Supabase Project Settings -> API (URL & Anon Key)
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
// Supabase Data Operations (with seamless fallback)
// =========================================================================

const DatabaseService = {
  /**
   * Add email subscriber to Supabase
   */
  async subscribe(email) {
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient
          .from('subscribers')
          .insert([{ email: email.trim().toLowerCase() }]);
        
        if (error && error.code !== '23505') { // Ignore duplicate key errors
          console.error('Supabase subscriber error:', error);
        }
        return { success: !error || error.code === '23505' };
      } catch (err) {
        console.error('Supabase error:', err);
      }
    }
    
    // Fallback to local storage
    const list = JSON.parse(localStorage.getItem('aira_subscribers') || '[]');
    if (!list.includes(email)) {
      list.push(email);
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
