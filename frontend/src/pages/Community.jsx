import React, { useState, useEffect } from 'react';
import { communityAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, Heart, Send, Hash, ShieldCheck, Users 
} from 'lucide-react';

const CommunityPage = () => {
  const { user } = useAuth();
  const [communities, setCommunities] = useState([]);
  const [activeCommId, setActiveCommId] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loadingComms, setLoadingComms] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(false);
  
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [publisherLoading, setPublisherLoading] = useState(false);

  const [commentsInput, setCommentsInput] = useState({});

  const loadCommunities = async () => {
    try {
      setLoadingComms(true);
      const res = await communityAPI.getCommunities(user.id);
      setCommunities(res.data);
      if (res.data.length > 0 && !activeCommId) {
        setActiveCommId(res.data[0].id);
      }
    } catch (err) {
      console.error("Failed to load community groups:", err);
    } finally {
      setLoadingComms(false);
    }
  };

  const loadPosts = async (commId) => {
    if (!commId) return;
    try {
      setLoadingPosts(true);
      const res = await communityAPI.getPosts(commId);
      setPosts(res.data);
    } catch (err) {
      console.error(`Failed to load posts for community ${commId}:`, err);
    } finally {
      setLoadingPosts(false);
    }
  };

  useEffect(() => {
    loadCommunities();
  }, []);

  useEffect(() => {
    if (activeCommId) {
      loadPosts(activeCommId);
    }
  }, [activeCommId]);

  const activeComm = communities.find(c => c.id === activeCommId);

  const handleJoinCommunity = async (commId) => {
    try {
      const res = await communityAPI.joinCommunity(commId);
      setCommunities(prev => prev.map(c => {
        if (c.id === commId) {
          return {
            ...c,
            is_joined: res.data.joined,
            member_count: res.data.joined ? c.member_count + 1 : c.member_count - 1
          };
        }
        return c;
      }));
    } catch (err) {
      console.error("Failed to toggle join community:", err);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!postTitle.trim() || !postContent.trim() || !activeCommId) return;
    
    setPublisherLoading(true);
    try {
      const res = await communityAPI.createPost(activeCommId, {
        title: postTitle,
        content: postContent
      });
      setPosts(prev => [res.data, ...prev]);
      
      setPostTitle('');
      setPostContent('');
    } catch (err) {
      console.error("Failed to publish post:", err);
      alert("Failed to publish post.");
    } finally {
      setPublisherLoading(false);
    }
  };

  const handleLikePost = async (postId) => {
    try {
      const res = await communityAPI.likePost(postId);
      setPosts(prev => prev.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            is_liked: res.data.is_liked,
            likes_count: res.data.likes_count
          };
        }
        return p;
      }));
    } catch (err) {
      console.error("Failed to toggle like post:", err);
    }
  };

  const handleAddComment = async (e, postId) => {
    e.preventDefault();
    const commentText = commentsInput[postId];
    if (!commentText || !commentText.trim()) return;

    try {
      const res = await communityAPI.commentOnPost(postId, { content: commentText });
      
      setPosts(prev => prev.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            comments: [...p.comments, res.data]
          };
        }
        return p;
      }));

      setCommentsInput(prev => ({
        ...prev,
        [postId]: ''
      }));
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  };

  const handleCommentInputChange = (postId, text) => {
    setCommentsInput(prev => ({
      ...prev,
      [postId]: text
    }));
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 pb-24 min-h-[calc(100vh-140px)] font-outfit text-left text-white">
      
      {/* Left Pane: Communities Channels List */}
      <div className="w-full md:w-64 shrink-0 flex flex-col gap-4">
        <div className="glass-card p-4 border-white/5 bg-black/45">
          <h3 className="font-extrabold text-[10px] uppercase tracking-wider text-slate-500 mb-4 px-2">Community Clubs</h3>
          
          {loadingComms ? (
            <div className="space-y-2 py-4">
              {[1, 2, 3].map(n => (
                <div key={n} className="h-10 w-full bg-white/5 border border-white/10 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <nav className="space-y-1">
              {communities.map((comm) => {
                const isActive = comm.id === activeCommId;
                return (
                  <button
                    key={comm.id}
                    onClick={() => setActiveCommId(comm.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      isActive 
                        ? 'bg-[#DFFE00] text-black shadow-sm shadow-[#DFFE00]/10'
                        : 'text-slate-400 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Hash className={`h-4.5 w-4.5 shrink-0 stroke-[2px] ${isActive ? 'text-black' : 'text-[#DFFE00]'}`} />
                      <span className="line-clamp-1">{comm.name}</span>
                    </div>
                    {comm.is_joined && (
                      <span className={`text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded-md ${
                        isActive ? 'bg-black/10 text-black' : 'bg-[#DFFE00]/10 text-[#DFFE00]'
                      }`}>
                        Joined
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          )}
        </div>
      </div>

      {/* Right Pane: Discussion Feed */}
      <div className="flex-1 min-w-0 space-y-6">
        {activeComm ? (
          <>
            {/* Header info board */}
            <div className="glass-card p-6 border-white/5 bg-black/45 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-syne font-extrabold uppercase tracking-tight text-white">#{activeComm.name}</h2>
                <p className="text-slate-400 text-xs font-semibold mt-1">
                  {activeComm.description}
                </p>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <span className="text-xs font-extrabold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <Users className="h-4 w-4 text-[#DFFE00]" />
                  <span>{activeComm.member_count} members</span>
                </span>
                
                <button
                  onClick={() => handleJoinCommunity(activeComm.id)}
                  className={`text-xs font-extrabold px-5 py-2.5 rounded-xl transition-all duration-200 uppercase tracking-wider ${
                    activeComm.is_joined
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : 'btn-secondary'
                  }`}
                >
                  {activeComm.is_joined ? 'Subscribed ✓' : 'Join Club'}
                </button>
              </div>
            </div>

            {/* Post publisher widget */}
            {activeComm.is_joined ? (
              <div className="glass-card p-5 border-white/5 bg-black/45">
                <h4 className="font-extrabold text-[10px] uppercase tracking-wider text-slate-400 pl-1 mb-3">Create Discussion</h4>
                <form onSubmit={handleCreatePost} className="space-y-3">
                  <input 
                    type="text" 
                    placeholder="Discussion Title"
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                    className="glass-input text-sm py-2.5"
                    required
                  />
                  <textarea 
                    rows="3"
                    placeholder="What would you like to discuss inside this circle?"
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    className="glass-input text-sm resize-none"
                    required
                  />
                  <div className="flex justify-end">
                    <button 
                      type="submit" 
                      disabled={publisherLoading}
                      className="btn-primary py-2 px-5 text-xs flex items-center gap-1.5 shadow-sm"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>{publisherLoading ? 'Posting...' : 'Publish'}</span>
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="p-4 bg-[#DFFE00]/5 border border-[#DFFE00]/15 text-[#DFFE00] text-xs font-extrabold uppercase tracking-wider rounded-2xl flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 stroke-[2px]" />
                <span>Join this community group to write posts and participate in discussion threads.</span>
              </div>
            )}

            {/* Feed posts list */}
            <AnimatePresence mode="wait">
              {loadingPosts ? (
                <div className="space-y-4">
                  {[1, 2].map(n => (
                    <div key={n} className="glass-card h-[160px] animate-pulse border-white/5 bg-black/45" />
                  ))}
                </div>
              ) : posts.length > 0 ? (
                <motion.div 
                  className="space-y-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {posts.map((post) => (
                    <div key={post.id} className="glass-card p-6 border-white/5 bg-black/45 relative">
                      
                      {/* Post top author bar */}
                      <div className="flex items-center gap-3 mb-4">
                        <img 
                          src={post.author_pic || `https://api.dicebear.com/7.x/adventurer/svg?seed=${post.author_name}`} 
                          alt={post.author_name} 
                          className="h-9 w-9 rounded-xl object-cover bg-slate-900 border border-white/10"
                        />
                        <div>
                          <h5 className="font-extrabold text-xs text-white">{post.author_name}</h5>
                          <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider">
                            {new Date(post.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {/* Post content body */}
                      <div className="space-y-2 mb-6">
                        <h4 className="font-syne font-extrabold text-sm md:text-base text-white">{post.title}</h4>
                        <p className="text-xs md:text-sm text-slate-300 font-semibold leading-relaxed">
                          {post.content}
                        </p>
                      </div>

                      {/* Likes count & reactions bar */}
                      <div className="flex items-center gap-6 mb-6 pb-4 border-b border-white/5 text-xs font-semibold">
                        <button 
                          onClick={() => handleLikePost(post.id)}
                          className={`flex items-center gap-1.5 transition-colors ${
                            post.is_liked ? 'text-red-500' : 'text-slate-400 hover:text-red-400'
                          }`}
                        >
                          <Heart className={`h-4.5 w-4.5 ${post.is_liked ? 'fill-current' : ''}`} />
                          <span>{post.likes_count} Likes</span>
                        </button>

                        <span className="text-slate-400 flex items-center gap-1.5">
                          <MessageSquare className="h-4.5 w-4.5" />
                          <span>{post.comments.length} Comments</span>
                        </span>
                      </div>

                      {/* Comments lists and publisher */}
                      <div className="space-y-4">
                        {post.comments.length > 0 && (
                          <div className="space-y-3 pl-3 border-l-2 border-white/5 max-h-[220px] overflow-y-auto">
                            {post.comments.map((comm) => (
                              <div key={comm.id} className="text-xs">
                                <div className="flex items-center gap-2">
                                  <span className="font-extrabold text-[#DFFE00]">{comm.author_name}</span>
                                  <span className="text-[9px] text-slate-500 font-semibold">
                                    {new Date(comm.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </div>
                                <p className="text-slate-300 font-semibold leading-relaxed mt-0.5">
                                  {comm.content}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Add comment publisher input */}
                        {activeComm.is_joined && (
                          <form onSubmit={(e) => handleAddComment(e, post.id)} className="flex gap-2">
                            <input 
                              type="text" 
                              placeholder="Write a comment..."
                              value={commentsInput[post.id] || ''}
                              onChange={(e) => handleCommentInputChange(post.id, e.target.value)}
                              className="glass-input text-xs py-2 px-3 focus:ring-1 focus:ring-slate-800"
                              required
                            />
                            <button 
                              type="submit" 
                              className="p-2 rounded-xl bg-white/5 border border-white/10 text-[#DFFE00] hover:bg-white/10 shrink-0"
                            >
                              <Send className="h-4 w-4" />
                            </button>
                          </form>
                        )}
                      </div>

                    </div>
                  ))}
                </motion.div>
              ) : (
                <div className="glass-card p-12 text-center text-slate-500 font-bold text-xs leading-relaxed border-white/5 bg-black/45 uppercase tracking-wider">
                  No discussion threads inside this club yet. Break the ice by posting something!
                </div>
              )}
            </AnimatePresence>
          </>
        ) : (
          <div />
        )}
      </div>

    </div>
  );
};

export default CommunityPage;
