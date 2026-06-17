import { ref, onMounted } from 'vue'
import { supabase } from './useSupabase'

const user = ref(null)
const loading = ref(true)

export function useAuth() {
  const getSession = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    user.value = session?.user ?? null
    loading.value = false
    return session
  }

  const signUp = async (email, password, namaLengkap) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nama_lengkap: namaLengkap }
      }
    })
    if (error) throw error
    return data
  }

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) throw error
    user.value = data.user
    return data
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    user.value = null
  }

  onMounted(() => {
    getSession()
    supabase.auth.onAuthStateChange((_event, session) => {
      user.value = session?.user ?? null
      loading.value = false
    })
  })

  return { user, loading, getSession, signUp, signIn, signOut }
}
