// CommunityFeed.tsx — Public "Community Stories" feed (/stories).
// Responsibilities:
//   - Loads all published posts (plus every profile for author lookups) in
//     parallel and joins author info in-memory via a Map.
//   - Also loads public personal pages and mixes them into the grid as
//     highlighted "Personal page" cards.
//   - AuthorLink links to each author's public profile (/u/:userName) when a
//     username exists.
//   - formatDate renders relative dates (Today / Yesterday / N days ago).
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Post, Profile } from '../../types';
import { fetchPublicPages } from '../../lib/content';
import { Page } from '../../types';
import { Badge } from '../../components/ui/form';

interface PostWithAuthor extends Post {
  author: Pick<Profile, 'id' | 'user_name' | 'full_name' | 'avatar_url'> | null;
}

interface PageWithAuthor extends Page {
  author: Pick<Profile, 'id' | 'user_name' | 'full_name' | 'avatar_url'> | null;
}

const AuthorLink: React.FC<{ author: Pick<Profile, 'id' | 'user_name' | 'full_name' | 'avatar_url'> | null }> = ({
  author,
}) => {
  const display = author?.user_name ?? author?.full_name ?? 'NTANDA Contributor';
  if (!author?.user_name) {
    return <span className="font-label-md text-xs text-[#55423e]">{display}</span>;
  }
  return (
    <Link
      to={`/u/${encodeURIComponent(author.user_name)}`}
      className="font-label-md text-xs text-[#6f250f] hover:text-[#8e3b24] hover:underline"
    >
      {display}
    </Link>
  );
};

const formatDate = (iso: string): string => {
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const days = Math.floor(diff / 86400000);
  if (days <= 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return d.toLocaleDateString();
};

export const CommunityFeed: React.FC = () => {
  const [posts, setPosts] = useState<PostWithAuthor[]>([]);
  const [pages, setPages] = useState<PageWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      const [{ data: postsData }, { data: authorsData }] = await Promise.all([
        supabase
          .from('posts')
          .select('*')
          .eq('status', 'published')
          .order('created_at', { ascending: false }),
        supabase.from('profiles').select('id, user_name, full_name, avatar_url'),
      ]);
      if (!active) return;
      const authors = (authorsData ?? []) as Profile[];
      const authorMap = new Map(authors.map((a) => [a.id, a]));
      setPosts(
        (postsData ?? []).map((p) => ({
          ...(p as Post),
          author: authorMap.get(p.author_id) ?? null,
        }))
      );
      const publicPages = await fetchPublicPages();
      setPages(
        publicPages.map((p) => ({
          ...p,
          author: authorMap.get(p.author_id) ?? null,
        }))
      );
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="pt-16 pb-24 max-w-7xl mx-auto px-4 md:px-16 min-h-screen">
      <section className="mb-10 border-l-4 border-[#855400] pl-6 py-2 mt-6">
        <span className="font-label-md text-xs sm:text-sm text-[#855400] uppercase tracking-widest block font-bold">
          Voices of the Community
        </span>
        <h2 className="font-headline-md text-3xl md:text-4xl text-[#1c1b1a] mb-1 font-bold">
          Community Stories
        </h2>
        <p className="font-body-lg text-sm sm:text-base text-[#55423e] max-w-2xl">
          Personal cultural posts, blogs and vlogs shared by NTANDA contributors.
        </p>
      </section>

      {loading ? (
        <div className="text-center py-16 bg-white rounded-xl border border-[#dbc1ba]/30 p-8">
          <div className="w-8 h-8 border-4 border-[#dbc1ba] border-t-[#6f250f] rounded-full animate-spin mx-auto"></div>
          <p className="font-body-md text-sm text-[#55423e] mt-3">Loading stories...</p>
        </div>
      ) : posts.length === 0 && pages.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-[#dbc1ba]/30 p-8">
          <span className="material-symbols-outlined text-5xl text-[#88726c] mb-2">auto_stories</span>
          <h3 className="font-headline-sm text-xl text-[#1c1b1a]">No community stories yet</h3>
          <p className="font-body-md text-sm text-[#55423e] mt-1">
            Be the first to share your heritage. Sign in and create a post.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-white border border-[#dbc1ba]/30 rounded-xl overflow-hidden hover:shadow-xl transition-shadow group"
            >
              {post.cover_image && (
                <div className="h-48 overflow-hidden bg-[#1c1b1a]">
                  <img
                    src={post.cover_image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Badge color={post.content_type === 'vlog' ? 'gold' : 'brown'}>{post.content_type}</Badge>
                  <span className="font-body-md text-xs text-[#88726c] ml-auto">{formatDate(post.created_at)}</span>
                </div>
                <h3 className="font-headline-sm text-lg text-[#1c1b1a] font-bold">{post.title}</h3>
                {post.excerpt && (
                  <p className="font-body-md text-sm text-[#55423e] mt-1 line-clamp-3">{post.excerpt}</p>
                )}
                {post.content && (
                  <p className="font-body-md text-sm text-[#55423e] mt-1 line-clamp-2">{post.content}</p>
                )}
                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[#dbc1ba]/20">
                  <div className="w-7 h-7 rounded-full bg-[#6f250f]/10 flex items-center justify-center overflow-hidden shrink-0">
                    {post.author?.avatar_url ? (
                      <img src={post.author.avatar_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="material-symbols-outlined text-[#6f250f] text-sm">person</span>
                    )}
                  </div>
                  <span className="font-label-md text-xs text-[#55423e]">
                    <AuthorLink author={post.author} />
                  </span>
                </div>
              </div>
            </article>
          ))}

          {pages.map((page) => (
            <article
              key={page.id}
              className="bg-[#f7f3f1] border border-[#855400]/30 rounded-xl overflow-hidden hover:shadow-xl transition-shadow group"
            >
              {page.cover_image && (
                <div className="h-32 overflow-hidden bg-[#1c1b1a]">
                  <img
                    src={page.cover_image}
                    alt={page.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Badge color="green">Personal page</Badge>
                </div>
                <h3 className="font-headline-sm text-lg text-[#1c1b1a] font-bold">{page.title}</h3>
                {page.description && (
                  <p className="font-body-md text-sm text-[#55423e] mt-1 line-clamp-3">{page.description}</p>
                )}
                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[#855400]/20">
                  <div className="w-7 h-7 rounded-full bg-[#855400]/10 flex items-center justify-center overflow-hidden shrink-0">
                    {page.author?.avatar_url ? (
                      <img src={page.author.avatar_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="material-symbols-outlined text-[#855400] text-sm">person</span>
                    )}
                  </div>
                  <span className="font-label-md text-xs text-[#55423e]">
                    <AuthorLink author={page.author} />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
