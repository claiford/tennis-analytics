import axios from 'axios';
import supabase from './connnections';

// const API_ENDPOINT = `${process.env.REACT_APP_BACKEND_URL}/api`

//        d8888 888     888 88888888888 888    888 
//       d88888 888     888     888     888    888 
//      d88P888 888     888     888     888    888 
//     d88P 888 888     888     888     8888888888 
//    d88P  888 888     888     888     888    888 
//   d88P   888 888     888     888     888    888 
//  d8888888888 Y88b. .d88P     888     888    888 
// d88P     888  "Y88888P"      888     888    888 

export async function getUserInfo() {
    const { data: { user } } = await supabase.auth.getUser()
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/user`)
    
    const currentUser = response.data.profiles.find((profile) => profile.id === user.id)
    
    return currentUser
}

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
        return data.session.token_type
    } catch (e) {
        return e
    }
}

export async function signOut() {
    const { error } = await supabase.auth.signOut()
}

// 888b     d888        d8888 88888888888 .d8888b.  888    888 8888888888 .d8888b.  
// 8888b   d8888       d88888     888    d88P  Y88b 888    888 888       d88P  Y88b 
// 88888b.d88888      d88P888     888    888    888 888    888 888       Y88b.      
// 888Y88888P888     d88P 888     888    888        8888888888 8888888    "Y888b.   
// 888 Y888P 888    d88P  888     888    888        888    888 888           "Y88b. 
// 888  Y8P  888   d88P   888     888    888    888 888    888 888             "888 
// 888   "   888  d8888888888     888    Y88b  d88P 888    888 888       Y88b  d88P 
// 888       888 d88P     888     888     "Y8888P"  888    888 8888888888 "Y8888P"  

export async function getCompletedMatches() {
    try {
        const { data: { user } } = await supabase.auth.getUser()

        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/matches/completed`)
        const completedMatches = response.data.matches
        const mapping = response.data.mapping

        const myCompletedMatches = []
        for (const row of mapping.filter((row) => row.profile_id === user.id)) {
            const match = completedMatches.find((match) => match.id === row.match_id)
            if (match) {
                myCompletedMatches.push(match)
            }
        }

        return myCompletedMatches
    } catch (e) {
        console.log(e)
    }
}

export async function getMatches() {
    try {
        const { data: { user } } = await supabase.auth.getUser()

        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/matches`)
        const matches = response.data.matches
        const mapping = response.data.mapping

        const myMatches = []
        const notMyMatches = []
        for (const row of mapping.filter((row) => row.profile_id === user.id)) {
            myMatches.push(matches.find((match) => match.id === row.match_id));
        }
        for (const row of mapping.filter((row) => row.profile_id !== user.id)) {
            if (!myMatches.some((match) => match.id === row.match_id)) {
                notMyMatches.push(matches.find((match) => match.id === row.match_id));
            }
        }
        return {
            myMatches: myMatches,
            notMyMatches: notMyMatches
        }
    } catch (e) {
        console.log(e)
    }
}

export async function createMatch(formData) {
    try {
        const { data: { user } } = await supabase.auth.getUser()
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/matches/create`, {
            user_id: user.id,
            data: formData
        })
        return response
    } catch (e) {
        throw e
    }
}

export async function joinMatch(match_id) {
    try {
        const { data: { user } } = await supabase.auth.getUser()
        const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/matches/join`, {
            user_id: user.id,
            match_id: match_id
        })
        return response
    } catch (e) {
        throw e
    }
}

export async function leaveMatch(match_id) {
    try {
        const { data: { user } } = await supabase.auth.getUser()
        const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/matches/leave`, {
            user_id: user.id,
            match_id: match_id
        })
        return response
    } catch (e) {
        throw e
    }
}

export async function completeMatch(match_id) {
    try {
        const { data: { user } } = await supabase.auth.getUser()
        const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/matches/complete`, {
            user_id: user.id,
            match_id: match_id
        })
        return response
    } catch (e) {
        throw e
    }
}

export async function getDiagnostics(match_id) {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/diagnostics`)
        const diagnostics = response.data.diagnostics.filter((diagnostic) => diagnostic.match_id === match_id)
        return diagnostics
    } catch (e) {
        throw e
    }
}

export async function addDiagnostic(match_id, formData) {
    try {
        const { data: { user } } = await supabase.auth.getUser()

        const data = {
            user_id: user.id,
            match_id: match_id,
            title: formData.title,
            position: formData.position,
            video: formData.video
        }

        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/diagnostics/create`, {
            user_id: user.id,
            match_id: match_id,
            title: formData.title,
            position: formData.position,
            video: formData.video
        }, {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        })
        return response.data.diagnostics
    } catch (e) {
        throw e
    }
}