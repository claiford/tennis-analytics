import axios from 'axios';
import supabase from './connnections';

// const API_ENDPOINT = `${process.env.REACT_APP_BACKEND_URL}/api`

export async function signUpNewUser(formData) {
    console.log(formData)
    const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
    })
}

export async function signInWithEmail(formData) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
    })
}

export async function signOut() {
    const { error } = await supabase.auth.signOut()
}