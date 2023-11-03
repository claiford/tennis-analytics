import { useState, useEffect } from 'react';

import { getCompletedMatches, getDiagnostics, addDiagnostic } from '../../api';

import * as Toolbar from '@radix-ui/react-toolbar';
import * as Dialog from '@radix-ui/react-dialog';
import * as RadioGroup from '@radix-ui/react-radio-group';
import * as Separator from '@radix-ui/react-separator';
import { PlusIcon } from '@radix-ui/react-icons';
import PuffLoader from "react-spinners/PuffLoader";

import MatchSelect from './MatchSelect';
import Display from './Display';
import NewDiagnostic from './NewDiagnostic';

import {
    StrikethroughIcon,
    TextAlignLeftIcon,
    TextAlignCenterIcon,
    TextAlignRightIcon,
    FontBoldIcon,
    FontItalicIcon,
    CaretDownIcon,
    Cross2Icon,
} from '@radix-ui/react-icons';
import './styles.css';

const Analytics = () => {
    const [completedMatches, setCompletedMatches] = useState([])
    const [selectedMatch, setSelectedMatch] = useState(null)
    const [matchDialogOpen, setMatchDialogOpen] = useState(false);

    const [diagnostics, setDiagnostics] = useState([])
    const [diagnosticDialogOpen, setDiagnosticDialogOpen] = useState(false);
    const [selectedDiagnostic, setSelectedDiagnostic] = useState(null)

    const handleSelectMatch = (e) => {
        e.preventDefault()
        setMatchDialogOpen(false)
        setSelectedMatch(completedMatches.find((match) => match.id === Number(e.target.match.value)))
    };

    const handleAddDiagnostic = (formData) => {
        setDiagnosticDialogOpen(false)
        addDiagnostic(selectedMatch.id, formData)
    }

    const handleChangeDiagnostic = (e) => {
        setSelectedDiagnostic(diagnostics.find((diagnostic) => diagnostic.id === Number(e.target.value)))
    }

    useEffect(() => {
        getCompletedMatches()
            .then((res) => {
                setCompletedMatches(res)
            })
    }, [])

    useEffect(() => {
        if (selectedMatch) {
            getDiagnostics(selectedMatch.id)
                .then((res) => {
                    setDiagnostics(res)
                })
        }
    }, [selectedMatch])

    const diagnosticOptions = diagnostics.map((diagnostic) => {
        if (diagnostic.status === "loading") {
            return (
                <div key={diagnostic.id} className="flex items-center gap-5">
                    <PuffLoader color="#36d7b7" size={15} />
                    <span className="opacity-20">{diagnostic.title}</span>
                </div>
            )
        } else if (diagnostic.status === "loaded") {
            return (
                <div key={diagnostic.id} className="flex items-center gap-5">
                    <RadioGroup.Item key={diagnostic.id} className="AnalyticsRadioGroupItem" value={diagnostic.id} id="r1">
                        <RadioGroup.Indicator className="AnalyticsRadioGroupIndicator" />
                    </RadioGroup.Item>
                    <label className="Label" htmlFor="r1">
                        {diagnostic.title}
                    </label>
                </div>
            )
        }
    })

    return (
        <div className='Analytics h-full flex flex-col gap-5 m-5 bg-white rounded-xl'>
            <Toolbar.Root className="ToolbarRoot" aria-label="Formatting options">
                <Dialog.Root open={matchDialogOpen} onOpenChange={setMatchDialogOpen}>
                    <Dialog.Trigger asChild>
                        <Toolbar.Button className="ToolbarButton">
                            <CaretDownIcon />
                        </Toolbar.Button>
                    </Dialog.Trigger>
                    <MatchSelect completedMatches={completedMatches} selectedMatch={selectedMatch} handleSelectMatch={handleSelectMatch} />
                </Dialog.Root>

                <Toolbar.Separator className="ToolbarSeparator" />

                {selectedMatch ? (
                    <p className="">{selectedMatch?.title}</p>
                ) : (
                    <p className="">select a match</p>
                )}

                {/* <Toolbar.ToggleGroup type="single" defaultValue="center" aria-label="Text alignment">
                    <Toolbar.ToggleItem className="ToolbarToggleItem" value="left" aria-label="Left aligned">
                        <TextAlignLeftIcon />
                    </Toolbar.ToggleItem>
                    <Toolbar.ToggleItem className="ToolbarToggleItem" value="center" aria-label="Center aligned">
                        <TextAlignCenterIcon />
                    </Toolbar.ToggleItem>
                    <Toolbar.ToggleItem className="ToolbarToggleItem" value="right" aria-label="Right aligned">
                        <TextAlignRightIcon />
                    </Toolbar.ToggleItem>
                </Toolbar.ToggleGroup>

                <Toolbar.Separator className="ToolbarSeparator" /> */}

                <Toolbar.Button className="ToolbarButton" style={{ marginLeft: 'auto' }}>
                    Share
                </Toolbar.Button>
            </Toolbar.Root>

            {selectedMatch &&
                <div className="h-full w-full flex">
                    <div className="basis-1/5 shrink-0 h-full flex flex-col items-center gap-2 p-2">
                        <p>select diagnostic</p>
                        <Separator.Root className="SeparatorRoot h-0.5 w-1/2" orientation="horizontal" />
                        <div className="flex flex-col items-center gap-4 m-2">
                            <form>
                                <RadioGroup.Root
                                    className="flex flex-col gap-4"
                                    orientation="horizontal"
                                    onChange={handleChangeDiagnostic}
                                    name="radio"
                                >
                                    {diagnosticOptions}
                                </RadioGroup.Root>
                            </form>
                            <Dialog.Root open={diagnosticDialogOpen} onOpenChange={setDiagnosticDialogOpen}>
                                <Dialog.Trigger asChild>
                                    <button className="ToolbarButton"><PlusIcon /></button>
                                </Dialog.Trigger>
                                <NewDiagnostic handleAddDiagnostic={handleAddDiagnostic} />
                            </Dialog.Root>
                        </div>
                    </div>
                    {selectedDiagnostic &&
                        <Display selectedDiagnostic={selectedDiagnostic} />
                    }
                </div>
            }
        </div>
    )
};

export default Analytics;