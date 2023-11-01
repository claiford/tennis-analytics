import { useState, useEffect } from 'react';

import { getCompletedMatches } from '../../api';

import * as Toolbar from '@radix-ui/react-toolbar';
import * as Dialog from '@radix-ui/react-dialog';

import MatchSelect from './MatchSelect';
import Display from './Display';

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
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleSelectMatch = (e) => {
        e.preventDefault()
        setDialogOpen(false)
        setSelectedMatch(completedMatches.find((match) => match.id === Number(e.target.match.value)))
    };

    useEffect(() => {
        getCompletedMatches()
            .then((res) => {
                setCompletedMatches(res)
            })
    }, [])

    return (
        <div className='Analytics h-full flex flex-col gap-5 m-5 bg-white rounded-xl'>
            <Toolbar.Root className="ToolbarRoot" aria-label="Formatting options">
                <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
                    <Dialog.Trigger asChild>
                        <Toolbar.Button className="ToolbarButton">
                            <CaretDownIcon />
                        </Toolbar.Button>
                    </Dialog.Trigger>
                    <MatchSelect completedMatches={completedMatches} selectedMatch={selectedMatch} handleSelectMatch={handleSelectMatch} />
                </Dialog.Root>
                <Toolbar.ToggleGroup type="multiple" aria-label="Text formatting">
                    <Toolbar.ToggleItem className="ToolbarToggleItem" value="bold" aria-label="Bold">
                        <FontBoldIcon />
                    </Toolbar.ToggleItem>
                    <Toolbar.ToggleItem className="ToolbarToggleItem" value="italic" aria-label="Italic">
                        <FontItalicIcon />
                    </Toolbar.ToggleItem>
                    <Toolbar.ToggleItem
                        className="ToolbarToggleItem"
                        value="strikethrough"
                        aria-label="Strike through"
                    >
                        <StrikethroughIcon />
                    </Toolbar.ToggleItem>
                </Toolbar.ToggleGroup>

                <Toolbar.Separator className="ToolbarSeparator" />

                <Toolbar.ToggleGroup type="single" defaultValue="center" aria-label="Text alignment">
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

                <Toolbar.Separator className="ToolbarSeparator" />

                <Toolbar.Button className="ToolbarButton" style={{ marginLeft: 'auto' }}>
                    Share
                </Toolbar.Button>
            </Toolbar.Root>

            {selectedMatch ? (
                <Display selectedMatch={selectedMatch} />
            ) : (
                <h1>nothing selected</h1>
            )}
        </div>
    )
};

export default Analytics;