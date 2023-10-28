import { useState } from 'react'
import * as Form from '@radix-ui/react-form';

const Login = () => {
    const [form, setForm] = useState({
        email: '',
        password: '',
    })

    const handleChange = (e) => {
        console.log(e.target.name)
        setForm(prevForm => {
            return {
                ...prevForm,
                [e.target.name]: e.target.value,
            }
        })
    }

    return (
        <div>
            <Form.Root className='FormRoot p-5'>
                <Form.Field className="FormField" name="email">
                    <div className="flex justify-between items-baseline">
                        <Form.Label className="FormLabel">Email</Form.Label>
                        <Form.Message className="FormMessage" match="valueMissing">
                            Email is required
                        </Form.Message>
                        <Form.Message className="FormMessage" match="typeMismatch">
                            Please provide a valid email
                        </Form.Message>
                    </div>
                    <Form.Control asChild>
                        <input className="Input" type="email" required value={form.email} onChange={(e) => handleChange(e)}/>
                    </Form.Control>
                </Form.Field>

                <Form.Field className="FormField" name="password">
                    <div className="flex justify-between items-baseline">
                        <Form.Label className="FormLabel">Password</Form.Label>
                        <Form.Message className="FormMessage" match="valueMissing">
                            Password is required
                        </Form.Message>
                    </div>
                    <Form.Control asChild>
                        <input className="Input" type="password" required value={form.password} onChange={(e) => handleChange(e)}/>
                    </Form.Control>
                </Form.Field>

                <Form.Submit className="mt-5">
                    <button className="landing-btn">
                        Login
                    </button>
                </Form.Submit>
            </Form.Root>
        </div>
    )
};

export default Login;