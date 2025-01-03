import { supabaseAuth } from './supabase-auth';

export interface UserRole {
  role: string;
}

export async function fetchUserRole(userId: string): Promise<string> {
  try {
    const response = await fetch(`/api/auth/role?userId=${userId}`);
    if (!response.ok) throw new Error('Failed to fetch role');
    const data = await response.json();
    return data.role || 'user';
  } catch (error) {
    console.error('Error fetching user role:', error);
    return 'user';
  }
}

export async function getCurrentSession() {
  try {
    const { data: { session }, error } = await supabaseAuth.auth.getSession();
    if (error) throw error;
    return session;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}