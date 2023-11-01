import { useState, useEffect } from 'react'
import { getDiagnostics, addDiagnostic } from '../../api';

import * as Dialog from '@radix-ui/react-dialog';

import NewDiagnostic from './NewDiagnostic';

const Display = ({ selectedMatch }) => {
    const [diagnostics, setDiagnostics] = useState([])
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleAdd = (formData) => {
        // setDialogOpen(false)
        addDiagnostic(selectedMatch.id, formData)
    }

    useEffect(() => {
        getDiagnostics(selectedMatch.id)
            .then((res) => {
                console.log("IN DISPLAY", res)
                setDiagnostics(res)
            })
    }, [selectedMatch])

    return (
        <>
            <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
                <Dialog.Trigger >
                    Add Diagnostic
                </Dialog.Trigger>
                <NewDiagnostic handleAdd={handleAdd}/>
            </Dialog.Root>
            <h1>{selectedMatch.title}</h1>
        </>
    )
};

export default Display;