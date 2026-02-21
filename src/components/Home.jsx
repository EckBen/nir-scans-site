import { useData } from "../contexts/dataContext";

import { MdGridOn } from "react-icons/md";
import { FaCog } from "react-icons/fa";
import { IoIosQrScanner } from "react-icons/io";

import AddScanner from './crudModals/AddScanner';
import Tile from './Tile';
import CardWithTitle from './CardWithTitle';

export default function Home() {
    const { scanners, addScannerToUserAccount } = useData();
    console.log(scanners);

    const getLastSyncString = (scanners) => {
        let str = scanners.reduce((last, s) => {
            s.samples.forEach(sample => {
                if (last === null || last < sample.timestamp) {
                    last = sample.timestamp;
                }
            });
            return last;
        }, null);

        if (str === null) {
            return 'No data reported';
        } else {
            const date = new Date(str);
            const year = date.getFullYear();
            const month = date.toLocaleString('default', { month: 'long' });
            const day = date.getDate();
            const niceDateString = `${month} ${day}, ${year}`;

            const options = { 
                hour: '2-digit', 
                minute: '2-digit', 
            };
            const niceTimeString = date.toLocaleTimeString("en-US", options);

            return `${niceDateString} at ${niceTimeString}`;
        }
    };

    return (
        <div className='mt-5'>
            {(scanners === null || scanners.length === 0) ? (
                <CardWithTitle title='Welcome!'>
                    <p className='mt-3 mb-5'>Add a scanner to your account to get started!</p>
                    <div className='w-fit mx-auto'><AddScanner handleNewScanner={addScannerToUserAccount} /></div>
                </CardWithTitle>
            ) : (
                <div>
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

                    <div className='mt-7'>
                        <p>Registered Scanners: {scanners.map(s => s.scannerID).join(', ')}</p>
                        <p>Last Data Sync: {getLastSyncString(scanners)}</p>
                    </div>
                </div>
            )}
        </div>
    );
}