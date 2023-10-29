import axios from 'axios';
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_KEY)
// const API_ENDPOINT = `${process.env.REACT_APP_BACKEND_URL}/api`

export async function signInWithEmail(formData) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
    })
}

export async function signOut() {
    const { error } = await supabase.auth.signOut()
}