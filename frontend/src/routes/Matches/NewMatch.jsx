import { useState } from 'react'
import * as Form from '@radix-ui/react-form';
import { DateTime } from "luxon";

import { createMatch } from '../../api';

import supabase from '../../connnections';

const formDefault = {
    title: '',
    venue: '',
    date: '',
    time: '',
}

const NewMatch = () => {
    const [form, setForm] = useState(formDefault)

    const handleChange = (e) => {
        setForm(prevForm => {
            return {
                ...prevForm,
                [e.target.name]: e.target.value,
            }
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const formatData = {
            title: form.title,
            where: form.venue,
            when: DateTime.fromISO(form.date + "T" + form.time).toISO()
        }
        createMatch(formatData)
            .then((res) => {
                console.log(res)
                setForm(formDefault)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    return (
        <div>
            <Form.Root className='FormRoot p-5' onSubmit={handleSubmit}>
                <Form.Field className="FormField" name="title">
                    <div className="flex justify-between items-baseline">
                        <Form.Label className="FormLabel">Title</Form.Label>
                        <Form.Message className="FormMessage" match="valueMissing">
                            Title is required
                        </Form.Message>
                    </div>
                    <Form.Control asChild>
                        <input className="Input" type="text" required value={form.title} onChange={(e) => handleChange(e)} />
                    </Form.Control>
                </Form.Field>

                <Form.Field className="FormField" name="venue">
                    <div className="flex justify-between items-baseline">
                        <Form.Label className="FormLabel">Venue</Form.Label>
                        <Form.Message className="FormMessage" match="valueMissing">
                            Venue is required
                        </Form.Message>
                    </div>
                    <Form.Control asChild>
                        <input className="Input" type="text" required value={form.venue} onChange={(e) => handleChange(e)} />
                    </Form.Control>
                </Form.Field>

                <Form.Field className="FormField" name="date">
                    <div className="flex justify-between items-baseline">
                        <Form.Label className="FormLabel">Date</Form.Label>
                        <Form.Message className="FormMessage" match="valueMissing">
                            Date is required
                        </Form.Message>
                    </div>
                    <Form.Control asChild>
                        <input className="Input" type="date" required value={form.date} onChange={(e) => handleChange(e)} />
                    </Form.Control>
                </Form.Field>

                <Form.Field className="FormField" name="time">
                    <div className="flex justify-between items-baseline">
                        <Form.Label className="FormLabel">Time</Form.Label>
                        <Form.Message className="FormMessage" match="valueMissing">
                            Time is required
                        </Form.Message>
                    </div>
                    <Form.Control asChild>
                        <input className="Input" type="time" required value={form.time} onChange={(e) => handleChange(e)} />
                    </Form.Control>
                </Form.Field>

                <Form.Submit className="landing-btn mt-5">
                    Submit
                </Form.Submit>
            </Form.Root>
        </div>
    )
};

export default NewMatch;