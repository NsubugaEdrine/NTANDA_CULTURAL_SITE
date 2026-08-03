// form.tsx — Reusable UI form primitives (design-system components).
// Responsibilities:
//   - Input / TextArea / Select: labeled fields with the UBUNTU-GEN look,
//     forwarded props so they behave like native elements.
//   - Button: primary / secondary / ghost / danger variants.
//   - Badge: colored status/type pill (brown, gold, green, red).
//   - Card: white rounded container used across dashboards and lists.
//   - EmptyState: consistent "nothing here" placeholder with optional action.
//   - Alert: inline error or success message.
//   - Spinner: small loading indicator.
// These are shared by the dashboard, admin, auth and public views.
import React from 'react';

export const Input: React.FC<
  React.InputHTMLAttributes<HTMLInputElement> & { label?: string }
> = ({ label, className = '', id, ...rest }) => (
  <div className="space-y-1.5">
    {label && (
      <label htmlFor={id} className="font-label-md text-xs text-[#55423e] uppercase tracking-wider block">
        {label}
      </label>
    )}
    <input
      id={id}
      className={`w-full px-4 py-2.5 rounded-lg border border-[#dbc1ba]/60 bg-white text-[#1c1b1a] focus:outline-none focus:ring-2 focus:ring-[#6f250f]/40 focus:border-[#6f250f] transition-colors ${className}`}
      {...rest}
    />
  </div>
);

export const TextArea: React.FC<
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string }
> = ({ label, className = '', id, ...rest }) => (
  <div className="space-y-1.5">
    {label && (
      <label htmlFor={id} className="font-label-md text-xs text-[#55423e] uppercase tracking-wider block">
        {label}
      </label>
    )}
    <textarea
      id={id}
      className={`w-full px-4 py-2.5 rounded-lg border border-[#dbc1ba]/60 bg-white text-[#1c1b1a] focus:outline-none focus:ring-2 focus:ring-[#6f250f]/40 focus:border-[#6f250f] transition-colors min-h-[120px] ${className}`}
      {...rest}
    />
  </div>
);

export const Select: React.FC<
  React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string }
> = ({ label, className = '', id, children, ...rest }) => (
  <div className="space-y-1.5">
    {label && (
      <label htmlFor={id} className="font-label-md text-xs text-[#55423e] uppercase tracking-wider block">
        {label}
      </label>
    )}
    <select
      id={id}
      className={`w-full px-4 py-2.5 rounded-lg border border-[#dbc1ba]/60 bg-white text-[#1c1b1a] focus:outline-none focus:ring-2 focus:ring-[#6f250f]/40 focus:border-[#6f250f] transition-colors ${className}`}
      {...rest}
    >
      {children}
    </select>
  </div>
);

export const Button: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' | 'danger' }
> = ({ variant = 'primary', className = '', ...rest }) => {
  const base =
    'px-5 py-2.5 rounded-lg font-label-md text-sm transition-all active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-[#6f250f] text-white hover:bg-[#8e3b24] shadow-sm',
    secondary: 'border border-[#855400] text-[#855400] hover:bg-[#855400]/10',
    ghost: 'text-[#6f250f] hover:bg-[#6f250f]/10',
    danger: 'bg-[#b3261e] text-white hover:bg-[#d93d35] shadow-sm',
  };
  return <button className={`${base} ${variants[variant]} ${className}`} {...rest} />;
};

export const Badge: React.FC<{ color?: 'brown' | 'gold' | 'green' | 'red'; children: React.ReactNode }> = ({
  color = 'brown',
  children,
}) => {
  const colors = {
    brown: 'bg-[#6f250f]/10 text-[#6f250f]',
    gold: 'bg-[#855400]/10 text-[#855400]',
    green: 'bg-[#264338]/10 text-[#264338]',
    red: 'bg-[#b3261e]/10 text-[#b3261e]',
  };
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full font-label-md text-[12px] font-semibold ${colors[color]}`}>
      {children}
    </span>
  );
};

export const Card: React.FC<{ className?: string; children: React.ReactNode }> = ({ className = '', children }) => (
  <div className={`bg-white rounded-xl border border-[#dbc1ba]/30 shadow-sm ${className}`}>{children}</div>
);

export const EmptyState: React.FC<{ title: string; message?: string; action?: React.ReactNode }> = ({
  title,
  message,
  action,
}) => (
  <div className="text-center py-16 px-6">
    <span className="material-symbols-outlined text-[#dbc1ba] text-5xl block mb-3">inventory_2</span>
    <h3 className="font-headline-sm text-xl text-[#1c1b1a]">{title}</h3>
    {message && <p className="font-body-md text-sm text-[#55423e] mt-1 max-w-md mx-auto">{message}</p>}
    {action && <div className="mt-6">{action}</div>}
  </div>
);

export const Alert: React.FC<{ type?: 'error' | 'success'; children: React.ReactNode }> = ({
  type = 'error',
  children,
}) => (
  <div
    className={`px-4 py-3 rounded-lg font-body-md text-sm border ${
      type === 'error'
        ? 'bg-[#b3261e]/10 text-[#8a1c15] border-[#b3261e]/20'
        : 'bg-[#264338]/10 text-[#264338] border-[#264338]/20'
    }`}
  >
    {children}
  </div>
);

export const Spinner: React.FC = () => (
  <span className="inline-block w-4 h-4 border-2 border-[#dbc1ba] border-t-[#6f250f] rounded-full animate-spin align-middle"></span>
);
