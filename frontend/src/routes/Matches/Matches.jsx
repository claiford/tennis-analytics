import { useState, useEffect } from 'react';
import './styles.css';
import { getOpenMatches, getMyMatches } from '../../api';

import * as Tabs from '@radix-ui/react-tabs';

import MatchCard from './MatchCard';

const Matches = () => {
    const [matches, setMatches] = useState({
        open: [],
        confirmed: [],
        completed: [],
    })

    const openMatches = matches.open.map((match) => (
        <MatchCard key={match.id} match={match} />
    ))

    useEffect(() => {
        getOpenMatches().then((res) => {
            setMatches({
                open: res,
            })
        })
    }, [])

    return (

        <div className='Matches h-full gap-5 m-5'>
            <Tabs.Root className="w-full h-full flex flex-col" defaultValue="tab1">
                <Tabs.List className="match-container w-full h-16 flex justify-around bg-white rounded-xl py-4 mb-5">
                    <Tabs.Trigger className="TabTrigger text-sm rounded-md px-8" value="tab1">Open</Tabs.Trigger>
                    <Tabs.Trigger className="TabTrigger text-sm rounded-md px-8" value="tab2">Joined</Tabs.Trigger>
                    <Tabs.Trigger className="TabTrigger text-sm rounded-md px-8" value="tab3">History</Tabs.Trigger>
                </Tabs.List>
                <div className="match-container flex-auto flex flex-col gap-5 rounded-xl p-5">
                    <Tabs.Content value="tab1">
                        {openMatches}
                    </Tabs.Content>
                    <Tabs.Content value="tab2">
                        Tab two content
                    </Tabs.Content>
                    <Tabs.Content value="tab3">
                        Tab three content
                    </Tabs.Content>
                </div>
            </Tabs.Root>


            {/* <div className='match-container w-1/2 bg-white rounded-xl'>
                <MatchCard />
            </div>
            <div className='match-container w-1/2 bg-white rounded-xl'>
                History
            </div> */}
        </div>
    )
};

export default Matches;