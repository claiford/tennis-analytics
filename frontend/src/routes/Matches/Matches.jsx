import { useState, useEffect } from 'react';
import './styles.css';
import { getOpenMatches, getMatches, joinMatch, leaveMatch } from '../../api';

import * as Tabs from '@radix-ui/react-tabs';
import { EnterIcon, ExitIcon, EyeOpenIcon, CircleBackslashIcon } from '@radix-ui/react-icons'

import MatchCard from './MatchCard';
import NewMatch from './NewMatch';

const Matches = () => {
    const [matches, setMatches] = useState({
        open: [],
        joined: [],
        completed: [],
    })

    const fetchData = () => {
        getMatches()
            .then((res) => {
                console.log(res)
                setMatches({
                    open: res.notMyMatches.filter((match) => match.status === 'open'),
                    joined: res.myMatches.filter((match) => match.status === 'open'),
                    completed: res.myMatches.filter((match) => match.status === 'completed'),
                })
            })
    }

    const handleJoin = (match_id) => {
        joinMatch(match_id)
    }

    const handleLeave = (match_id) => {
        leaveMatch(match_id)
    }

    useEffect(() => {
        fetchData()
    }, [])

    const openMatchCards = matches.open.map((match) => (
        <div className="flex">
            <MatchCard key={match.id} match={match} />
            {match.player_count === match.player_capacity ? (
                <button className="bg-gray-200 px-2 rounded-r-md" ><CircleBackslashIcon /></button>
            ) : (
                <button className="bg-green-200 px-2 rounded-r-md" onClick={() => handleJoin(match.id)}><EnterIcon /></button>
            )}
        </div>
    ))

    const joinedMatchCards = matches.joined.map((match) => (
        <div className="flex">
            <MatchCard key={match.id} match={match} />
            <button className="bg-red-200 px-2 rounded-r-md" onClick={() => handleLeave(match.id)}><ExitIcon /></button>
        </div>
    ))

    const completedMatchCards = matches.completed.map((match) => (
        <div className="flex">
            <MatchCard key={match.id} match={match} />
            <button className="bg-green-200 px-2 rounded-r-md"><EyeOpenIcon /></button>
        </div>
    ))

    return (

        <div className='Matches h-full gap-5 m-5'>
            <Tabs.Root className="w-full h-full flex flex-col" defaultValue="tab1">
                <Tabs.List className="match-container w-full h-16 flex justify-around bg-white rounded-xl py-4 mb-5">
                    <Tabs.Trigger className="TabTrigger text-sm rounded-md px-8" value="tab1">Open</Tabs.Trigger>
                    <Tabs.Trigger className="TabTrigger text-sm rounded-md px-8" value="tab2">Joined</Tabs.Trigger>
                    <Tabs.Trigger className="TabTrigger text-sm rounded-md px-8" value="tab3">History</Tabs.Trigger>
                    <Tabs.Trigger className="TabTrigger text-sm rounded-md px-8" value="tab4">New</Tabs.Trigger>
                </Tabs.List>
                <div className="match-container flex-auto flex flex-col rounded-xl p-5">
                    <Tabs.Content className="flex flex-col gap-3" value="tab1">
                        {openMatchCards}
                    </Tabs.Content>
                    <Tabs.Content className="flex flex-col gap-3" value="tab2">
                        {joinedMatchCards}
                    </Tabs.Content>
                    <Tabs.Content value="tab3">
                        {completedMatchCards}
                    </Tabs.Content>
                    <Tabs.Content value="tab4">
                        <NewMatch />
                    </Tabs.Content>
                </div>
            </Tabs.Root>
        </div>
    )
};

export default Matches;