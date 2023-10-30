import { EnterIcon, CircleBackslashIcon } from '@radix-ui/react-icons'

import MatchCard from './MatchCard';

const OpenMatches = ({ openMatches, handleJoin }) => {
    const openMatchCards = openMatches.map((match) => (
        <div key={match.id} className="flex">
            <MatchCard match={match} />
            {match.player_count === match.player_capacity ? (
                <button className="bg-gray-200 px-2 rounded-r-md" ><CircleBackslashIcon /></button>
            ) : (
                <button className="bg-green-200 px-2 rounded-r-md" onClick={() => handleJoin(match.id)}><EnterIcon /></button>
            )}
        </div>
    ))

    return (
        <div className="flex flex-col gap-3" >
            {openMatchCards}
        </div>
    )
};

export default OpenMatches;