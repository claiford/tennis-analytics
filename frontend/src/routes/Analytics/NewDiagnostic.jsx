import { createRef, useState } from 'react';

import * as Dialog from '@radix-ui/react-dialog';
import * as Form from '@radix-ui/react-form';
import * as RadioGroup from '@radix-ui/react-radio-group';

import { Cross2Icon } from '@radix-ui/react-icons';

const NewDiagnostic = ({ handleAdd }) => {
    const fileInput = createRef()
    const [form, setForm] = useState({
        title: "",
        position: "front",
    })

    const handleChange = (e) => {
        setForm(prevForm => {
            console.log(e.target.name)
            return {
                ...prevForm,
                [e.target.name]: e.target.value,
            }
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const video = fileInput.current.files[0]
        handleAdd({
            ...form,
            video: video,
        })
    }

    // const radioChange = (value) = {
    // }

    return (
        <Dialog.Portal>
            <Dialog.Overlay className="AnalyticsDialogOverlay" />
            <Dialog.Content className="AnalyticsDialogContent flex flex-col items-center">
                <Dialog.Title className="AnalyticsDialogTitle">New Diagnostic</Dialog.Title>
                <Form.Root onSubmit={handleSubmit}>
                    <Form.Field className="AnalyticsFormField" name="title">
                        <div className="flex justify-between items-baseline">
                            <Form.Label className="AnalyticsFormLabel">Title</Form.Label>
                            <Form.Message className="AnalyticsFormMessage" match="valueMissing">
                                Title is required
                            </Form.Message>
                        </div>
                        <Form.Control asChild>
                            <input className="AnalyticsInput" type="text" required placeholder="eg. Set 1" onChange={(e) => handleChange(e)}/>
                        </Form.Control>
                    </Form.Field>

                    <Form.Field className="AnalyticsFormField" name="video">
                        <div className="flex justify-between items-baseline">
                            <Form.Label className="AnalyticsFormLabel">Video File</Form.Label>
                            <Form.Message className="AnalyticsFormMessage" match="valueMissing">
                                File is required
                            </Form.Message>
                            {/* <Form.Message className="AnalyticsFormMessage" match="typeMismatch">
                                Please provide a valid file
                            </Form.Message> */}
                        </div>
                        <Form.Control asChild>
                            <input className="AnalyticsFileInput" type="file" accept=".mp4" required ref={fileInput}/>
                        </Form.Control>
                    </Form.Field>

                    <Form.Field className="AnalyticsFormField" name="position">
                        <div className="flex justify-between items-baseline">
                            <Form.Label className="AnalyticsFormLabel">Position</Form.Label>
                        </div>
                        <RadioGroup.Root
                            className="AnalyticsRadioGroupRoot"
                            defaultValue="front"
                            onChange={(e) => handleChange(e)}
                            name="position"
                        >
                            <div className="flex items-center gap-5">
                                <RadioGroup.Item className="AnalyticsRadioGroupItem" value="front" id="r1">
                                    <RadioGroup.Indicator className="AnalyticsRadioGroupIndicator" />
                                </RadioGroup.Item>
                                <label className="Label" htmlFor="r1">
                                    Front
                                </label>
                            </div>
                            <div className="flex items-center gap-5">
                                <RadioGroup.Item className="AnalyticsRadioGroupItem" value="back" id="r2">
                                    <RadioGroup.Indicator className="AnalyticsRadioGroupIndicator" />
                                </RadioGroup.Item>
                                <label className="Label" htmlFor="r2">
                                    Back
                                </label>
                            </div>
                        </RadioGroup.Root>
                    </Form.Field>

                    <Form.Submit className="AnalyticsButton green mt-5">
                        Upload
                    </Form.Submit>
                </Form.Root>

                {/* <form className="flex flex-col items-center" >
                    <fieldset className="AnalyticsFieldset">
                        <select className="p-2 rounded-md" name="match" id="match" defaultValue={selectedMatch?.id}>
                            <option hidden>-</option>
                            {selectOptions}
                        </select>
                    </fieldset>
                    <button type="submit" className="AnalyticsButton green">
                        Load
                    </button>
                </form> */}

                <Dialog.Close asChild>
                    <button className="AnalyticsIconButton" aria-label="Close">
                        <Cross2Icon />
                    </button>
                </Dialog.Close>
            </Dialog.Content>
        </Dialog.Portal>
    )
};

export default NewDiagnostic;