import { useState, useEffect } from 'react';
import './styles.css';
import { getMatches, joinMatch, leaveMatch, completeMatch } from '../../api';

import * as Tabs from '@radix-ui/react-tabs';
import { ExitIcon, EyeOpenIcon, CheckCircledIcon } from '@radix-ui/react-icons'

import OpenMatches from './OpenMatches';
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

    const handleComplete = (match_id) => {
        completeMatch(match_id)
    }

    useEffect(() => {
        fetchData()

        // Set up an interval and store its ID
        const intervalId = setInterval(() => {
            // Code to run every 2 seconds
            console.log('This code runs every 2 seconds');
            fetchData();
        }, 1000); // 2000 milliseconds = 2 seconds

        // Clear the interval when the component is unmounted
        return () => clearInterval(intervalId);
    }, [])

    const joinedMatchCards = matches.joined.map((match) => (
        <div key={match.id} className="flex">
            <MatchCard match={match} />
            <div className="flex flex-col">
                <button className="flex-auto bg-red-200 px-2 rounded-tr-md" onClick={() => handleLeave(match.id)}><ExitIcon /></button>
                <button className=" flex-auto bg-blue-200 px-2 rounded-br-md" onClick={() => handleComplete(match.id)}><CheckCircledIcon /></button>
            </div>
        </div>
    ))

    const completedMatchCards = matches.completed.map((match) => (
        <div key={match.id} className="flex">
            <MatchCard match={match} />
            <button className="bg-violet-200 px-2 rounded-r-md"><EyeOpenIcon /></button>
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
                    <Tabs.Content value="tab1">
                        <OpenMatches openMatches={matches.open} handleJoin={handleJoin}/>
                    </Tabs.Content>
                    <Tabs.Content className="flex flex-col gap-3" value="tab2">
                        {joinedMatchCards}
                    </Tabs.Content>
                    <Tabs.Content className="flex flex-col gap-3" value="tab3">
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