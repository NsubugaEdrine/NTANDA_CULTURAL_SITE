// PublicProfile.tsx — Public member profile page (/u/:userName).
// Responsibilities:
//   - Looks up the profile by username; shows a "Member not found" state
//     if it doesn't exist.
//   - Renders the member's cover banner, avatar, name, @username, role
//     badge, member-since date, bio and personal info chips.
//   - Loads the member's published posts and public pages and renders them
//     in separate "Stories" and "Personal pages" sections.
//   - Uses relative date formatting for post timestamps.
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Profile, Post, Page } from '../../types';
import { fetchPublicProfile, fetchPublishedPostsByAuthor, fetchPublicPagesByAuthor } from '../../lib/content';
import { Badge } from '../../components/ui/form';

const formatDate = (iso: string): string => {
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const days = Math.floor(diff / 86400000);
  if (days <= 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return d.toLocaleDateString();
};

const memberSince = (iso: string): string =>
  new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'long' });

interface PersonalInfo {
  location?: string;
  tribe?: string;
  languages?: string;
  occupation?: string;
  interests?: string;
}

export const PublicProfile: React.FC = () => {
  const { userName = '' } = useParams<{ userName: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      setNotFound(false);
      const found = await fetchPublicProfile(userName);
      if (!active) return;
      if (!found) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      setProfile(found);
      const [postList, pageList] = await Promise.all([
        fetchPublishedPostsByAuthor(found.id),
        fetchPublicPagesByAuthor(found.id),
      ]);
      if (!active) return;
      setPosts(postList);
      setPages(pageList);
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [userName]);

  const personal = (profile?.personal_info ?? {}) as PersonalInfo;
  const infoRows: { label: string; value: string }[] = [];
  if (personal.location) infoRows.push({ label: 'Location', value: personal.location });
  if (personal.tribe) infoRows.push({ label: 'Tribe / Ethnicity', value: personal.tribe });
  if (personal.languages) infoRows.push({ label: 'Languages', value: personal.languages });
  if (personal.occupation) infoRows.push({ label: 'Occupation', value: personal.occupation });

  const allPublished = posts.length + pages.length;

  return (
    <div className="pt-16 pb-24 max-w-7xl mx-auto px-4 md:px-16 min-h-screen">
      <Link
        to="/stories"
        className="inline-flex items-center gap-1 font-label-md text-sm text-[#6f250f] hover:text-[#8e3b24] mt-6 mb-6"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Back to Community Stories
      </Link>

      {loading ? (
        <div className="text-center py-16 bg-white rounded-xl border border-[#dbc1ba]/30 p-8">
          <div className="w-8 h-8 border-4 border-[#dbc1ba] border-t-[#6f250f] rounded-full animate-spin mx-auto"></div>
          <p className="font-body-md text-sm text-[#55423e] mt-3">Loading profile...</p>
        </div>
      ) : notFound || !profile ? (
        <div className="text-center py-16 bg-white rounded-xl border border-[#dbc1ba]/30 p-8">
          <span className="material-symbols-outlined text-5xl text-[#88726c] mb-2">person_off</span>
          <h2 className="font-headline-sm text-xl text-[#1c1b1a]">Member not found</h2>
          <p className="font-body-md text-sm text-[#55423e] mt-1">
            No UBUNTU-GEN member exists with the username “{userName}”.
          </p>
        </div>
      ) : (
        <>
          {/* Profile header */}
          <section className="bg-white rounded-xl border border-[#dbc1ba]/30 overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-[#6f250f] to-[#855400]" />
            <div className="px-6 md:px-10 pb-6 -mt-12">
              <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-[#ece7e5] border-4 border-white flex items-center justify-center shrink-0 shadow-md">
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} alt={profile.user_name ?? 'Member'} className="w-full h-full object-cover" />
                  ) : (
                    <span className="material-symbols-outlined text-[#6f250f] text-4xl">person</span>
                  )}
                </div>
                <div className="pb-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="font-headline-md text-2xl md:text-3xl text-[#1c1b1a] font-bold">
                      {profile.full_name ?? profile.user_name ?? 'UBUNTU-GEN Member'}
                    </h1>
                    <Badge color={profile.role === 'admin' ? 'gold' : 'green'}>
                      {profile.role === 'admin' ? 'Administrator' : 'Contributor'}
                    </Badge>
                  </div>
                  {profile.user_name && (
                    <p className="font-label-md text-sm text-[#88726c]">@{profile.user_name}</p>
                  )}
                  <p className="font-body-md text-xs text-[#88726c] mt-1">
                    Member since {memberSince(profile.created_at)}
                    {allPublished > 0 && ` · ${allPublished} published`}
                  </p>
                </div>
              </div>
              {profile.bio && (
                <p className="font-body-lg text-sm md:text-base text-[#55423e] mt-4 max-w-2xl">{profile.bio}</p>
              )}
              {infoRows.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {infoRows.map((row) => (
                    <span
                      key={row.label}
                      className="inline-flex items-center gap-1.5 bg-[#f7f3f1] border border-[#dbc1ba]/40 rounded-full px-3 py-1.5 font-body-md text-xs text-[#1c1b1a]"
                    >
                      <span className="font-label-md text-[#855400] font-semibold">{row.label}:</span>
                      {row.value}
                    </span>
                  ))}
                </div>
              )}
              {personal.interests && (
                <p className="font-body-md text-sm text-[#55423e] mt-4">
                  <span className="font-label-md text-[#855400] font-semibold">Cultural interests:</span>{' '}
                  {personal.interests}
                </p>
              )}
            </div>
          </section>

          {allPublished === 0 ? (
            <div className="mt-8 text-center py-16 bg-white rounded-xl border border-[#dbc1ba]/30 p-8">
              <span className="material-symbols-outlined text-5xl text-[#88726c] mb-2">auto_stories</span>
              <h3 className="font-headline-sm text-xl text-[#1c1b1a]">No public stories yet</h3>
              <p className="font-body-md text-sm text-[#55423e] mt-1">
                This member hasn't published any community stories or pages yet.
              </p>
            </div>
          ) : (
            <div className="mt-8 space-y-10">
              {posts.length > 0 && (
                <section>
                  <div className="mb-4 border-l-4 border-[#855400] pl-4 py-1">
                    <h2 className="font-headline-md text-2xl text-[#1c1b1a] font-bold">Stories</h2>
                    <p className="font-body-md text-sm text-[#55423e]">
                      Posts, blogs and vlogs published by {profile.user_name ?? 'this member'}.
                    </p>
                  </div>
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
                            <Badge color={post.content_type === 'vlog' ? 'gold' : 'brown'}>
                              {post.content_type}
                            </Badge>
                            <span className="font-body-md text-xs text-[#88726c] ml-auto">
                              {formatDate(post.created_at)}
                            </span>
                          </div>
                          <h3 className="font-headline-sm text-lg text-[#1c1b1a] font-bold">{post.title}</h3>
                          {post.excerpt && (
                            <p className="font-body-md text-sm text-[#55423e] mt-1 line-clamp-3">{post.excerpt}</p>
                          )}
                          {post.content && (
                            <p className="font-body-md text-sm text-[#55423e] mt-1 line-clamp-2">{post.content}</p>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              )}

              {pages.length > 0 && (
                <section>
                  <div className="mb-4 border-l-4 border-[#855400] pl-4 py-1">
                    <h2 className="font-headline-md text-2xl text-[#1c1b1a] font-bold">Personal pages</h2>
                    <p className="font-body-md text-sm text-[#55423e]">
                      Public heritage pages created by {profile.user_name ?? 'this member'}.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                            <p className="font-body-md text-sm text-[#55423e] mt-1 line-clamp-3">
                              {page.description}
                            </p>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};
