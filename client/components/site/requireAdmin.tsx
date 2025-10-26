import React, { useEffect, useState, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface Props {
  children: ReactNode;
}

export default function RequireAdmin({ children }: Props) {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('ADMIN_TOKEN');
    if (!token) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    fetch('/api/admin/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error('Unauthorized');
        return res.json();
      })
      .then(() => setIsAdmin(true))
      .catch(() => {
        localStorage.removeItem('ADMIN_TOKEN');
        setIsAdmin(false);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!isAdmin) return <Navigate to="/" replace />;

  return <>{children}</>;
}
