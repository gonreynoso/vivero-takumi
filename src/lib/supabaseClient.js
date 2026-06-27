// Mock de Supabase — sin backend para el TP
export const supabase = {
  auth: {
    signInWithPassword: async () => ({ data: null, error: { message: 'Sin backend' } }),
    signUp: async () => ({ data: null, error: null }),
    signOut: async () => {},
    getSession: async () => ({ data: { session: null } }),
  },
  from: () => ({
    select: () => ({ order: async () => ({ data: [], error: null }), eq: () => ({ single: async () => ({ data: null, error: null }) }) }),
    insert: () => ({ select: () => ({ single: async () => ({ data: null, error: null }) }) }),
    update: () => ({ eq: () => ({ select: () => ({ single: async () => ({ data: null, error: null }) }) }) }),
    delete: () => ({ eq: async () => ({ error: null }) }),
  }),
}
