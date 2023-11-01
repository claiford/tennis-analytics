import * as Dialog from '@radix-ui/react-dialog';

import { Cross2Icon } from '@radix-ui/react-icons';

const MatchSelect = ({ completedMatches, selectedMatch, handleSelectMatch }) => {
    const selectOptions = completedMatches.map((match) => (
        <option key={match.id} value={match.id}>
            {match.title}
        </option>
    ))

    return (
        <Dialog.Portal>
            <Dialog.Overlay className="AnalyticsDialogOverlay" />
            <Dialog.Content className="AnalyticsDialogContent flex flex-col items-center">
                <Dialog.Title className="AnalyticsDialogTitle">Select Match</Dialog.Title>
                <Dialog.Description className="AnalyticsDialogDescription">
                    View match from your completed matches
                </Dialog.Description>
                <form className="flex flex-col items-center" onSubmit={handleSelectMatch}>
                    <fieldset className="AnalyticsFieldset">
                        <select className="p-2 rounded-md" name="match" id="match" defaultValue={selectedMatch?.id}>
                            <option hidden>-</option>
                            {selectOptions}
                        </select>
                    </fieldset>
                    <button type="submit" className="AnalyticsButton green">
                        Load
                    </button>
                </form>

                <Dialog.Close asChild>
                    <button className="AnalyticsIconButton" aria-label="Close">
                        <Cross2Icon />
                    </button>
                </Dialog.Close>
            </Dialog.Content>
        </Dialog.Portal>
    )
};

export default MatchSelect;