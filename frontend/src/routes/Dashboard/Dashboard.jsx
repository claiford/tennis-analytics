const Dashboard = () => {
    return (
        <div className='h-full flex flex-row gap-5 m-5'>
            <div className='w-1/2 bg-white rounded-xl'>
                Upcoming
            </div>
            <div className='h-full w-1/2 flex flex-col gap-5'>
                <div className='flex-auto bg-white rounded-xl'>
                    Friends
                </div>
                <div className='flex-auto bg-white rounded-xl'>
                    Latest
                </div>
            </div>
        </div>
    )
};

export default Dashboard;