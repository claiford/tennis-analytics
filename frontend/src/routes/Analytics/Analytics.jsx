import * as Toolbar from '@radix-ui/react-toolbar';
import * as Dialog from '@radix-ui/react-dialog';
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
import '../styles.css';

const MatchSelect = () => {
    return (
        <Dialog.Root>
            <Toolbar.Button className="ToolbarButton hover:cursor-pointer">
                <Dialog.Trigger asChild>
                    <CaretDownIcon />
                </Dialog.Trigger>
            </Toolbar.Button>
            <Dialog.Portal>
                <Dialog.Overlay className="DialogOverlay" />
                <Dialog.Content className="DialogContent">
                    <Dialog.Title className="DialogTitle">Select Match</Dialog.Title>
                    <Dialog.Description className="DialogDescription">
                        Make changes to your profile here. Click save when you're done.
                    </Dialog.Description>
                    <fieldset className="Fieldset">
                        <label className="Label" htmlFor="name">
                            Name
                        </label>
                        <input className="Input" id="name" defaultValue="Pedro Duarte" />
                    </fieldset>
                    <fieldset className="Fieldset">
                        <label className="Label" htmlFor="username">
                            Username
                        </label>
                        <input className="Input" id="username" defaultValue="@peduarte" />
                    </fieldset>
                    <div style={{ display: 'flex', marginTop: 25, justifyContent: 'flex-end' }}>
                        <Dialog.Close asChild>
                            <button className="Button green">Load</button>
                        </Dialog.Close>
                    </div>
                    <Dialog.Close asChild>
                        <button className="IconButton" aria-label="Close">
                            <Cross2Icon />
                        </button>
                    </Dialog.Close>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
};

const Analytics = () => {
    return (
        <div className='h-full flex flex-col gap-5 m-5 bg-white rounded-xl'>
            <Toolbar.Root className="ToolbarRoot" aria-label="Formatting options">
                <MatchSelect />
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

            Heat map
        </div>
    )
};

export default Analytics;