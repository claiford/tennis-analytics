import axios from 'axios';
import supabase from './connnections';

// const API_ENDPOINT = `${process.env.REACT_APP_BACKEND_URL}/api`

export async function signUpNewUser(formData) {
    console.log(formData)
    try {
        const { data, error } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
        })
        await supabase
            .from('profiles')
            .update({ first_name: formData.firstname, last_name: formData.lastname })
            .eq('id', data.user.id)

    } catch (e) {
        console.log(e)
    }
}

export async function signInWithEmail(formData) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: formData.email,
            password: formData.password,
        }) 
        if (error) throw error
    } catch (e) {
        return e
    }
}

export async function signOut() {
    const { error } = await supabase.auth.signOut()
}