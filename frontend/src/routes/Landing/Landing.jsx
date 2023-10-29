import { useState } from 'react';
import './styles.css';

import * as Separator from '@radix-ui/react-separator';

import Signup from './Signup';
import Login from './Login';

const Landing = () => {
    const [isLogin, setIsLogin] = useState(true);

    const handleSwitch = () => {
        setIsLogin(prev => !prev);
    }

    return (
        <div className="Landing h-full flex flex-col items-center">
            <div className={`${isLogin ? 'title-container-left' : 'title-container-right'}
                    w-3/4 h-24 flex-none flex justify-center md:justify-start items-center gap-3 rounded-full my-5 px-10`}>
                <p className='text-2xl text-white font-major'>TENNIS</p>
                <Separator.Root className="SeparatorRoot h-1/4 w-0.5" orientation='vertical' />
                <p className='w-24 md:w-auto text-sm text-left text-white font-major'>match analytics</p>
            </div>
            <div className="w-3/4 flex-auto flex flex-col md:flex-row justify-around my-5">
                <div className="w-full md:w-2/5 flex flex-col justify-center items-center my-5">
                    {isLogin ? (
                        <div className="form-container-left h-full w-full rounded-2xl">
                            <Login />
                        </div>
                    ) : (
                        <div className="option-container w-full h-full flex flex-col rounded-2xl p-4" onClick={handleSwitch}>
                            <p className="my-5 text-white">Already have an account?</p>
                            <div className="flex-auto flex flex-row md:flex-col justify-center my-6">
                                <p className='block-letters hidden md:block'>si</p>
                                <p className='block-letters'>gn</p>
                                <p className='block-letters block-letters-contrast'>in</p>
                            </div>
                        </div>
                    )}
                </div>
                <div className="w-full md:w-2/5 flex flex-col justify-center items-center my-5">
                    {!isLogin ? (
                        <div className="form-container-right h-full w-full rounded-2xl">
                            <Signup />
                        </div>
                    ) : (
                        <div className="option-container w-full h-full flex flex-col rounded-2xl p-4" onClick={handleSwitch}>
                            <p className="my-5 text-white">New here?</p>
                            <div className="flex-auto flex flex-row md:flex-col justify-center my-6">
                                <p className='block-letters hidden md:block'>si</p>
                                <p className='block-letters'>gn</p>
                                <p className='block-letters block-letters-contrast'>up</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
};

export default Landing;