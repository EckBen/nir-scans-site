import { useData } from "../contexts/dataContext";

import { MdGridOn } from "react-icons/md";
import { FaCog } from "react-icons/fa";
import { IoIosQrScanner } from "react-icons/io";

import AddScanner from './AddScanner';
import Tile from './Tile';

export default function Home() {
    const { scanners, addScannerToUserAccount } = useData();
    return (
        <>
            <h1 className='text-3xl mb-5'>Home</h1>

            {(scanners === null || scanners.length === 0) ? (
                <>
                    <p>Add a scanner to your account to get started!</p>
                    <AddScanner handleNewScanner={addScannerToUserAccount} />
                </>
            ) : (
                <div className='w-full max-w-2xl flex flex-wrap gap-8 justify-center'>
                    <Tile
                        href='/samples'
                        label='Samples'
                        icon={
                            <div className='relative h-full w-full'>
                                <div className='absolute left-1/6 right-1/6 top-1/6 bottom-1/6'>
                                    <img src='/icons/colored-corn.svg' height='100%' width='100%' />
                                </div>
                                <div className='absolute -left-2 -top-2 -right-2 -bottom-2'>
                                    <IoIosQrScanner size='100%' color='black' />
                                </div>
                            </div>
                        }
                    />
                    <Tile
                        href='/plants'
                        label='Plants'
                        icon={<img src='/icons/colored-corn.svg' />}
                    />
                    <Tile
                        href='/fields'
                        label='Fields'
                        icon={<MdGridOn size='100%' color='saddlebrown' />}
                    />
                    <Tile
                        href='/settings'
                        label='Settings'
                        icon={<FaCog size='100%' color='rgb(60,60,60)' />}
                    />
                </div>
            )}
        </>
    );
}