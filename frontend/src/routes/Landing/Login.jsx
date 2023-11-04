import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as Form from '@radix-ui/react-form';
import { signInWithEmail } from '../../api';

const Login = () => {
    const [form, setForm] = useState({
        email: '',
        password: '',
    })
    const [loginError, setLoginError] = useState(null)

    const navigate = useNavigate()

    const handleChange = (e) => {
        setLoginError(null)
        setForm(prevForm => {
            return {
                ...prevForm,
                [e.target.name]: e.target.value,
            }
        })
    }

    const handleLogin = (e) => {
        e.preventDefault()
        signInWithEmail(form).then((res) => {
            if (res === 'bearer') {
                console.log("SIGNED IN")
                navigate('/matches')
            } else {
                setLoginError(res);
            }
        })
    }

    return (
        <div>
            <Form.Root className='FormRoot p-5' onSubmit={handleLogin}>
                <Form.Field className="FormField" name="email">
                    <div className="flex justify-between items-baseline">
                        <Form.Label className="FormLabel">Email</Form.Label>
                        <Form.Message className="FormMessage" match="valueMissing">
                            Email is required
                        </Form.Message>
                        <Form.Message className="FormMessage" match="typeMismatch">
                            Please provide a valid email
                        </Form.Message>
                        {loginError && <span className="FormMessage">
                            Wrong email or password
                        </span>}
                    </div>
                    <Form.Control asChild>
                        <input className="Input" type="email" required value={form.email} onChange={(e) => handleChange(e)} />
                    </Form.Control>
                </Form.Field>

                <Form.Field className="FormField" name="password">
                    <div className="flex justify-between items-baseline">
                        <Form.Label className="FormLabel">Password</Form.Label>
                        <Form.Message className="FormMessage" match="valueMissing">
                            Password is required
                        </Form.Message>
                        {loginError && <span className="FormMessage">
                            Wrong email or password
                        </span>}
                    </div>
                    <Form.Control asChild>
                        <input className="Input" type="password" required value={form.password} onChange={(e) => handleChange(e)} />
                    </Form.Control>
                </Form.Field>

                <Form.Submit className="landing-btn mt-5">
                    Login
                </Form.Submit>
            </Form.Root>
        </div>
    )
};

export default Login;