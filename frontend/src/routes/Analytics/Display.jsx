import { useState, useEffect } from 'react'
import { updateDiagnosticNotes } from '../../api';

import * as Form from '@radix-ui/react-form';
import { Pencil1Icon, PaperPlaneIcon } from '@radix-ui/react-icons';

import Chart from './Chart';

const Display = ({ selectedDiagnostic }) => {
    const [editNotes, setEditNotes] = useState()
    const [notes, setNotes] = useState("")

    const handleChange = (e) => {
        console.log(e.target.value)
        setNotes(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setEditNotes(false)

        updateDiagnosticNotes(selectedDiagnostic.id, notes)
    }

    const toggleForm = () => {
        setEditNotes((prev) => !prev)
    }

    useEffect(() => {
        setNotes(selectedDiagnostic.notes)
    }, [selectedDiagnostic])

    return (
        <div className="h-full flex justify-center items-center gap-3 p-3">
            <div className="h-full flex flex-col">
                <Form.Root onSubmit={handleSubmit}>
                    <Form.Field className="AnalyticsFormField" name="title">
                        <div className="flex justify-between items-baseline">
                            <Form.Label className="AnalyticsFormLabel">Notes</Form.Label>
                            {editNotes ? (
                                <Form.Submit className="notes-btn">
                                    <PaperPlaneIcon />
                                </Form.Submit>
                            ) : (
                                <button className="notes-btn" onClick={toggleForm}>
                                    <Pencil1Icon />
                                </button>
                            )}
                        </div>
                        <Form.Control asChild>
                            <textarea
                                className="TextArea text-xs rounded-md p-2"
                                name="notes"
                                rows={10}
                                disabled={!editNotes}
                                value={notes}
                                onChange={handleChange}
                            >
                            </textarea>
                        </Form.Control>
                    </Form.Field>
                </Form.Root>
                <video key={selectedDiagnostic.processed_video_url} controls>
                    <source src={selectedDiagnostic.processed_video_url} type="video/webm" />
                </video>
            </div>
            <Chart selectedDiagnostic={selectedDiagnostic} />
        </div>
    )
};

export default Display;