import { DateTime } from "luxon";

const MatchCard = ({ match }) => {
    return (
        <div className="h-24 bg-white flex-auto flex flex-col justify-center rounded-l-md p-5">
            <div className="flex justify-between items-center">
                <span>
                    {match.title}
                </span>
                <div className="flex flex-col">
                    <span>
                        {DateTime.fromISO(match.when).toLocaleString({ weekday: 'short', month: 'short', day: '2-digit' })}
                    </span>
                    <span>
                        {DateTime.fromISO(match.when).toLocaleString({ hour: 'numeric', minute: '2-digit' })}
                    </span>
                </div>
                <div className="flex flex-col">
                    <span>
                        {match.player_count} / {match.player_capacity}
                    </span>
                </div>
            </div>
        </div>
    )
};

export default MatchCard;