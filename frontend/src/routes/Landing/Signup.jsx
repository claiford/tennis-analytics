import { useState } from 'react'
import * as Form from '@radix-ui/react-form';

const Signup = () => {
    const [form, setForm] = useState({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        confirm: '',
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
                <Form.Field className="FormField" name="firstname">
                    <div className="flex justify-between items-baseline">
                        <Form.Label className="FormLabel">First Name</Form.Label>
                        <Form.Message className="FormMessage" match="valueMissing">
                            Name is required
                        </Form.Message>
                    </div>
                    <Form.Control asChild>
                        <input className="Input" type="text" required value={form.firstname} onChange={(e) => handleChange(e)}/>
                    </Form.Control>
                </Form.Field>

                <Form.Field className="FormField" name="lastname">
                    <div className="flex justify-between items-baseline">
                        <Form.Label className="FormLabel">Last Name</Form.Label>
                        <Form.Message className="FormMessage" match="valueMissing">
                            Name is required
                        </Form.Message>
                    </div>
                    <Form.Control asChild>
                        <input className="Input" type="text" required value={form.lastname} onChange={(e) => handleChange(e)}/>
                    </Form.Control>
                </Form.Field>

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

                <Form.Field className="FormField" name="confirm">
                    <div className="flex justify-between items-baseline">
                        <Form.Label className="FormLabel">Confirm Password</Form.Label>
                        <Form.Message className="FormMessage" match="valueMissing">
                            {form.password.length > 0 ? "Does not match" : "-"}
                        </Form.Message>
                        <Form.Message className="FormMessage" match={(value, formData) => value !== formData.password}>
                            Does not match
                        </Form.Message>
                    </div>
                    <Form.Control asChild>
                        <input className="Input" type="password" required value={form.confirm} onChange={(e) => handleChange(e)}/>
                    </Form.Control>
                </Form.Field>

                <Form.Submit className="mt-5">
                    <button className="landing-btn">
                        Signup
                    </button>
                </Form.Submit>
            </Form.Root>
        </div>
    )
};

export default Signup;