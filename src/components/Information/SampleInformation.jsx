import { useParams } from "react-router";
import { useNavigate } from "react-router";

import { useData } from "../../contexts/dataContext";

import Button from '../Button';
import { BaseTable } from "../Tables/BaseTable";

export default function SampleInformation() {
    const navigate = useNavigate();
    const params = useParams();
    const { getSampleInformation } = useData();
    const information = getSampleInformation(params.sampleID);
    
    console.log(information);

    const openPlant = (row) => {
        navigate(`/plants/${row.plantID}`);
    };

    const handleDeleteFromPlant = (row) => {
        console.log('wishlist: delete sample from plant', row);
    };

    const handleAddToPlant = () => {
        console.log('wishlist: add sample to plants')
    };

    const plantTableColumns = [{
        key: 'name',
        label: 'Plant Name',
    },{
        key: 'plantID',
        label: 'Plant ID',
    },{
        key: 'numSamples',
        label: 'Has # Samples',
    }];

    return (
        <div className='w-full'>
            <div className='bg-white border border-gray-300 rounded-xl shadow-2xl p-4 w-fit max-w-[100%] h-fit m-auto'>
                <h1 className='text-3xl mb-5'>Sample Information</h1>
                {information === null ? (
                    <div className='w-fit m-auto'>
                        <p className='text-gray-400 italic'>No information found for this sample.</p>
                    </div>
                ) : (
                    <>
                        <div className='flex justify-between'>
                            <div className='flex flex-col items-center'>
                                <p className=''>{information.timestamp}</p>
                                <p className='italic text-sm text-gray-500'>(Taken at)</p>
                            </div>
                            <div className='flex flex-col items-center'>
                                <p className=''>{information.scannerID}</p>
                                <p className='italic text-sm text-gray-500'>(Scanner ID)</p>
                            </div>
                        </div>
            
                        <div className='flex flex-col items-center'>
                            <p className='font-bold mt-2'>{information.sampleID}</p>
                            <p className='italic text-sm text-gray-500'>(Sample ID)</p>
                        </div>
            
                        <div className='flex flex-col items-center border border-gray-300 p-3 m-4'>
                            <p className='text-4xl font-bold'>{information.modelResult} %</p>
                            <p className='italic text-sm text-gray-500'>(Sample Moisture)</p>
                        </div>
            
                        <div className='h-[1px] w-4/5 bg-gray-300 mx-auto my-3' />
            
                        <p className='font-bold'>Plants Containing Sample</p>
            
                        {information.plantsWithSample.length === 0 ? <></> :
                            <div className='flex'>
                                <Button
                                    onClick={handleAddToPlant}
                                    className='px-2 py-1 mt-2 ml-auto text-sm self-end'
                                >
                                    Add to a Plant
                                </Button>
                            </div>
                        }
            
                        {information.plantsWithSample.length ? (
                            <BaseTable
                                initSortDirection='desc'
                                columns={plantTableColumns}
                                rows={information.plantsWithSample}
                                onClick={openPlant}
                                onClickDelete={handleDeleteFromPlant}
                                rowsPerPageOptions={[]}
                            />
                        ) : (
                            <div className='mt-2.5 text-center'>
                                <p className='italic text-base text-gray-500'>This sample is not in any plants.</p>
                                <Button
                                    onClick={handleAddToPlant}
                                    className='px-3 py-2 mt-3 text-sm'
                                >Add to a Plant</Button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}