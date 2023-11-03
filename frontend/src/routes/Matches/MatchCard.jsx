import { DateTime } from "luxon";

import * as Separator from '@radix-ui/react-separator';

const MatchCard = ({ match }) => {
    return (
        <div className="h-24 bg-white flex-auto flex flex-col justify-center rounded-l-md p-5">
            <div className="flex items-center">
                <p className="w-1/4 flex justify-start">
                    {match.title}
                </p>
                <div className="h-full flex-auto flex items-center justify-between">
                    <Separator.Root className="SeparatorRoot h-full w-0.5" orientation='vertical' />
                    <p className="text-left basis-1/4">
                        {match.where}
                    </p>
                    <div className="flex flex-col">
                        <span>
                            {DateTime.fromISO(match.when).toLocaleString({ weekday: 'short', month: 'short', day: '2-digit' })}
                        </span>
                        <span>
                            {DateTime.fromISO(match.when).toLocaleString({ hour: 'numeric', minute: '2-digit' })}
                        </span>
                    </div>
                    <p className="flex flex-col">
                            {match.player_count} / {match.player_capacity}
                    </p>
                </div>
            </div>
        </div>
    )
};

export default MatchCard;