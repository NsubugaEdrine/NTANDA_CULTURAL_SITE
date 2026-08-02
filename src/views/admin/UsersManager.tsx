// UsersManager.tsx — Admin user management (admin-only route).
// Responsibilities:
//   - Loads every profile ordered by creation date.
//   - Lists users with avatar, name, bio, email, role badge and join date.
//   - Lets admins promote/demote users between 'user' and 'admin' via a
//     per-row select. The current admin cannot change their own role (the
//     control is disabled), preventing accidental lock-out.
import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../lib/auth';
import { DashboardShell } from '../../components/dashboard/DashboardShell';
import { supabase } from '../../lib/supabase';
import { Profile, UserRole } from '../../types';
import { Alert, Badge, Button, Card, EmptyState, Select, Spinner } from '../../components/ui/form';

export const UsersManager: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: selectError } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    if (selectError) {
      setError(selectError.message);
    } else {
      setUsers((data as Profile[]) ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleRoleChange = async (id: string, role: UserRole) => {
    setError(null);
    const { error: updateError } = await supabase.from('profiles').update({ role }).eq('id', id);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    await load();
  };

  return (
    <DashboardShell title="User Management" subtitle="View and manage platform roles">
      <div className="space-y-6">
        {error && <Alert>{error}</Alert>}

        {loading ? (
          <Card className="p-10 text-center">
            <Spinner />
          </Card>
        ) : users.length === 0 ? (
          <Card>
            <EmptyState title="No users yet" message="Users will appear here as they sign up." />
          </Card>
        ) : (
          <Card className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#dbc1ba]/30 text-[#55423e]">
                  <th className="px-5 py-3 font-label-md text-xs uppercase tracking-wider">User</th>
                  <th className="px-5 py-3 font-label-md text-xs uppercase tracking-wider hidden md:table-cell">Email</th>
                  <th className="px-5 py-3 font-label-md text-xs uppercase tracking-wider">Role</th>
                  <th className="px-5 py-3 font-label-md text-xs uppercase tracking-wider hidden lg:table-cell">Joined</th>
                  <th className="px-5 py-3 font-label-md text-xs uppercase tracking-wider text-right">Change role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const isSelf = u.id === user?.id;
                  return (
                    <tr key={u.id} className="border-b border-[#dbc1ba]/15 hover:bg-[#f7f3f1] transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#6f250f]/10 flex items-center justify-center overflow-hidden shrink-0">
                            {u.avatar_url ? (
                              <img src={u.avatar_url} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <span className="material-symbols-outlined text-[#6f250f] text-lg">person</span>
                            )}
                          </div>
                          <div>
                            <p className="font-body-md text-sm font-semibold text-[#1c1b1a]">
                              {u.user_name ?? u.full_name ?? 'Unnamed user'}
                              {isSelf && <span className="text-[#88726c] font-normal"> (you)</span>}
                            </p>
                            {u.bio && <p className="font-body-md text-xs text-[#55423e] line-clamp-1">{u.bio}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 hidden md:table-cell">
                        <span className="font-body-md text-sm text-[#55423e]">{u.email ?? '—'}</span>
                      </td>
                      <td className="px-5 py-3">
                        <Badge color={u.role === 'admin' ? 'brown' : 'green'}>
                          {u.role === 'admin' ? 'Admin' : 'User'}
                        </Badge>
                      </td>
                      <td className="px-5 py-3 hidden lg:table-cell">
                        <span className="font-body-md text-xs text-[#88726c]">
                          {u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex justify-end">
                          <Select
                            value={u.role}
                            onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                            className="!py-1.5 !px-2 w-32 text-sm"
                            disabled={isSelf}
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </Select>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>
        )}
      </div>
    </DashboardShell>
  );
};
