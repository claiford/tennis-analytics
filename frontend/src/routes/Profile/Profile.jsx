const Profile = () => {
    return (
        <div className='h-full flex flex-row gap-5 m-5'>
            <div className='w-1/2 bg-white rounded-xl'>
                Profile
            </div>
            <div className='h-full flex-auto flex flex-col gap-5'>
                <div className='h-1/3 bg-white rounded-xl'>
                    Stats
                </div>
                <div className='flex-auto bg-white rounded-xl'>
                    Friends
                </div>
            </div>
        </div>
    )
};

export default Profile;