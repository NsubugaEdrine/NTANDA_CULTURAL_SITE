// ProfilePage.tsx — Signed-in user's profile editor (protected route).
// Responsibilities:
//   - Pre-fills the form from the current profile when it loads.
//   - Avatar upload: lets the user pick an image, uploads it to the
//     'avatars' storage bucket via uploadContentFile and previews the URL.
//   - Identity fields: username (required), full name, bio, and the
//     account email (read-only, managed by the identity provider).
//   - Personal information: location, tribe, languages, occupation and
//     cultural interests — stored as a JSON `personal_info` object.
//   - Shows the user's role (Contributor vs Administrator).
//   - Save calls updateProfile, which persists to Supabase and refreshes
//     the shared auth state.
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth';
import { uploadContentFile } from '../../lib/content';
import { Alert, Button, Input, TextArea } from '../../components/ui/form';

interface PersonalInfoForm {
  location: string;
  tribe: string;
  languages: string;
  occupation: string;
  interests: string;
}

const emptyPersonal: PersonalInfoForm = {
  location: '',
  tribe: '',
  languages: '',
  occupation: '',
  interests: '',
};

export const ProfilePage: React.FC = () => {
  const { user, profile, updateProfile, signOut } = useAuth();
  const navigate = useNavigate();

  const [userName, setUserName] = useState('');
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [personal, setPersonal] = useState<PersonalInfoForm>(emptyPersonal);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (profile) {
      setUserName(profile.user_name ?? '');
      setFullName(profile.full_name ?? '');
      setBio(profile.bio ?? '');
      setAvatarUrl(profile.avatar_url);
      const p = profile.personal_info ?? {};
      setPersonal({
        location: (p.location as string) ?? '',
        tribe: (p.tribe as string) ?? '',
        languages: (p.languages as string) ?? '',
        occupation: (p.occupation as string) ?? '',
        interests: (p.interests as string) ?? '',
      });
    }
  }, [profile]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    const { url, error: uploadError } = await uploadContentFile(file, 'avatars');
    setUploading(false);
    if (uploadError) {
      setError(uploadError);
      return;
    }
    setAvatarUrl(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!userName.trim()) {
      setError('A username is required.');
      return;
    }

    setLoading(true);
    const { error: updateError } = await updateProfile({
      user_name: userName.trim(),
      full_name: fullName.trim() || null,
      bio: bio.trim() || null,
      avatar_url: avatarUrl,
      personal_info: {
        location: personal.location,
        tribe: personal.tribe,
        languages: personal.languages,
        occupation: personal.occupation,
        interests: personal.interests,
      },
    });
    setLoading(false);

    if (updateError) {
      setError(updateError);
      return;
    }
    setSuccess('Profile updated successfully.');
  };

  const set = (key: keyof PersonalInfoForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setPersonal((prev) => ({ ...prev, [key]: e.target.value }));

  return (
    <div className="min-h-screen bg-[#fdf8f6]">
      {/* Top bar */}
      <header className="flex items-center justify-between px-4 md:px-16 h-16 bg-[#fdf8f6]/95 border-b border-[#dbc1ba]/20 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <Link to="/" className="font-display-lg-mobile text-2xl text-[#6f250f] font-bold tracking-tight">
            UBUNTU-GEN
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => navigate('/dashboard')}>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              Dashboard
            </span>
          </Button>
          <Button variant="secondary" onClick={signOut}>
            Sign Out
          </Button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 md:px-8 py-10">
        <div className="mb-8">
          <h1 className="font-headline-md text-3xl text-[#1c1b1a]">Your Profile</h1>
          <p className="font-body-md text-sm text-[#55423e] mt-1">
            {profile?.user_name
              ? 'Update your personal information and credentials.'
              : 'Complete your profile so the community knows who you are.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar */}
          <div className="bg-white rounded-xl border border-[#dbc1ba]/30 p-6">
            <h2 className="font-headline-sm text-lg text-[#1c1b1a] mb-4">Profile photo</h2>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-[#ece7e5] border-2 border-[#dbc1ba] flex items-center justify-center">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="material-symbols-outlined text-[#6f250f] text-3xl">person</span>
                )}
              </div>
              <div>
                <label className="inline-block bg-[#6f250f] text-white px-4 py-2 rounded-lg font-label-md text-sm hover:bg-[#8e3b24] cursor-pointer">
                  {uploading ? 'Uploading...' : 'Upload photo'}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                  />
                </label>
                <p className="font-body-md text-xs text-[#55423e] mt-1.5">
                  PNG or JPG. Stored securely in UBUNTU-GEN's cloud.
                </p>
              </div>
            </div>
          </div>

          {/* Identity */}
          <div className="bg-white rounded-xl border border-[#dbc1ba]/30 p-6 space-y-4">
            <h2 className="font-headline-sm text-lg text-[#1c1b1a]">Identity</h2>
            <Input
              id="userName"
              label="Username *"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="e.g. nakato_kintu"
              required
            />
            <Input
              id="fullName"
              label="Full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Nakato Kintu"
            />
            <TextArea
              id="bio"
              label="Bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Share a short story about yourself and your heritage..."
            />
            {user && (
              <div className="pt-2 border-t border-[#dbc1ba]/20">
                <p className="font-label-md text-xs text-[#55423e] uppercase tracking-wider mb-1">Account email</p>
                <p className="font-body-md text-sm text-[#1c1b1a]">{user.email ?? 'Apple / iCloud account'}</p>
                <p className="font-body-md text-xs text-[#88726c] mt-1">
                  Email is managed by your identity provider.
                </p>
              </div>
            )}
          </div>

          {/* Personal information */}
          <div className="bg-white rounded-xl border border-[#dbc1ba]/30 p-6 space-y-4">
            <h2 className="font-headline-sm text-lg text-[#1c1b1a]">Personal information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input id="location" label="Location" value={personal.location} onChange={set('location')} placeholder="e.g. Kampala, Uganda" />
              <Input id="tribe" label="Tribe / Ethnicity" value={personal.tribe} onChange={set('tribe')} placeholder="e.g. Baganda" />
              <Input id="languages" label="Languages" value={personal.languages} onChange={set('languages')} placeholder="e.g. Luganda, English" />
              <Input id="occupation" label="Occupation" value={personal.occupation} onChange={set('occupation')} placeholder="e.g. Cultural researcher" />
            </div>
            <TextArea
              id="interests"
              label="Cultural interests"
              value={personal.interests}
              onChange={set('interests')}
              placeholder="What aspects of culture do you preserve or share?"
            />
          </div>

          {/* Credential information */}
          <div className="bg-white rounded-xl border border-[#dbc1ba]/30 p-6 space-y-3">
            <h2 className="font-headline-sm text-lg text-[#1c1b1a]">Credentials & verification</h2>
            <p className="font-body-md text-sm text-[#55423e]">
              Account credentials are secured by your chosen sign-in method (email + password or
              Apple/iCloud). Your role within the community is listed below.
            </p>
            <div className="flex items-center gap-2">
              <span className="font-label-md text-xs text-[#55423e] uppercase tracking-wider">Role:</span>
              <span
                className={`px-3 py-1 rounded-full font-label-md text-xs font-semibold ${
                  profile?.role === 'admin'
                    ? 'bg-[#6f250f] text-white'
                    : 'bg-[#264338]/10 text-[#264338]'
                }`}
              >
                {profile?.role === 'admin' ? 'Administrator' : 'Contributor'}
              </span>
            </div>
          </div>

          {error && <Alert>{error}</Alert>}
          {success && <Alert type="success">{success}</Alert>}

          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Profile'}
            </Button>
            <Button type="button" variant="secondary" onClick={() => navigate('/dashboard')}>
              Cancel
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};
