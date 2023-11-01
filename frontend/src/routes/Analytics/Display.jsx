import { useState, useEffect } from 'react'
import { getDiagnostics, addDiagnostic } from '../../api';

import * as Dialog from '@radix-ui/react-dialog';
import * as RadioGroup from '@radix-ui/react-radio-group';
import * as Separator from '@radix-ui/react-separator';
import { PlusIcon } from '@radix-ui/react-icons';

import NewDiagnostic from './NewDiagnostic';
import Chart from './Chart';

const Display = ({ selectedMatch }) => {
    const [diagnostics, setDiagnostics] = useState([])
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedDiagnostic, setSelectedDiagnostic] = useState(null)

    const handleAdd = (formData) => {
        setDialogOpen(false)
        addDiagnostic(selectedMatch.id, formData)
    }

    const handleChange = (e) => {
        console.log("setting")
        setSelectedDiagnostic(diagnostics.find((diagnostic) => diagnostic.id === Number(e.target.value)))
    }

    useEffect(() => {
        getDiagnostics(selectedMatch.id)
            .then((res) => {
                setDiagnostics(res)
            })
    }, [selectedMatch])

    const diagnosticOptions = diagnostics.map((diagnostic) => (
        <div className="flex items-center gap-5">
            <RadioGroup.Item key={diagnostic.id} className="AnalyticsRadioGroupItem" value={diagnostic.id} id="r1">
                <RadioGroup.Indicator className="AnalyticsRadioGroupIndicator" />
            </RadioGroup.Item>
            <label className="Label" htmlFor="r1">
                {diagnostic.title}
            </label>
        </div>
    ))

    return (
        <div className="w-full h-full flex">
            <div className="w-1/4 h-full flex flex-col items-center gap-2 p-2">
                <h1>select diagnostic</h1>
                <Separator.Root className="SeparatorRoot h-0.5 w-1/2" orientation="horizontal" />
                <div className="flex flex-col items-center gap-4 m-2">
                    <form>
                        <RadioGroup.Root
                            className="flex flex-col gap-4"
                            orientation="horizontal"
                            onChange={handleChange}
                            name="radio"
                        >
                            {diagnosticOptions}
                        </RadioGroup.Root>
                    </form>
                    <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
                        <Dialog.Trigger asChild>
                            <button className="ToolbarButton"><PlusIcon /></button>
                        </Dialog.Trigger>
                        <NewDiagnostic handleAdd={handleAdd} />
                    </Dialog.Root>
                </div>


            </div>
            {selectedDiagnostic &&
                <Chart selectedDiagnostic={selectedDiagnostic} />
            }

        </div>
    )
};

export default Display;