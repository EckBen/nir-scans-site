import { useState } from "react";
import { useParams } from "react-router";
import { useNavigate } from "react-router";
import { Collapse } from "@mui/material";

import { useData } from "../../contexts/dataContext";

import Button from '../Button';
import { BaseTable } from "../Tables/BaseTable";

export default function PlantInformation() {
    const navigate = useNavigate();
    const params = useParams();
    const { getPlantInformation } = useData();
    const information = getPlantInformation(params.plantID);
    
    console.log(information);

    const [showFieldTable, setShowFieldTable] = useState(false);
    const [showSampleTable, setShowSampleTable] = useState(false);

    const toggleFieldTable = () => {
        setShowFieldTable(!showFieldTable);
    }

    const openField = (row) => {
        navigate(`/fields/${row.fieldID}`);
    };
    
    const handleDeleteFromField = (row) => {
        console.log('wishlist: delete plant from field', row);
    };

    const handleAddToField = () => {
        console.log('wishlist: add plant to field')
    };

    const fieldTableColumns = [{
        key: 'fieldName',
        label: 'Field Name',
    },{
        key: 'latestAvgMoisture',
        label: 'Latest Avg. Moisture (%)',
    },{
        key: 'hasXPlants',
        label: 'Has # Plants',
    }];

    const toggleSampleTable = () => {
        setShowSampleTable(!showSampleTable);
    }

    const openSample = (row) => {
        navigate(`/samples/${row.sampleID}`);
    };

    const handleDeleteFromPlant = (row) => {
        console.log('wishlist: delete sample from plant', row);
    };

    const handleAddToPlant = () => {
        console.log('wishlist: add a sample to plant')
    };

    const sampleTableColumns = [{
        key: 'timestamp',
        label: 'Date/Time Taken',
        size: 'large',
        titleLines: 2,
        cellSplit: ', '
    },{
        key: 'scannerID',
        label: 'Scanner ID',
        size: 'medium',
        titleLines: 2,
    },{
        key: 'modelResult',
        label: 'Moisture (%)',
        size: 'small',
        titleLines: 2,
        isNumeric: true,
    }];
    
    return (
        <div className='w-full'>
            <div className='bg-white border border-gray-300 rounded-xl shadow-2xl p-4 w-fit max-w-[100%] h-fit m-auto'>
                <h1 className='text-3xl mb-5'>Plant Information</h1>
                {information === null ? (
                    <div className='w-fit m-auto'>
                        <p className='text-gray-400 italic'>No information found for this plant.</p>
                    </div>
                ) : (
                    <>
                        <p className='font-bold mt-2'>{information.plantName}</p>
                        <p>ID: {information.plantID}</p>

                        <div className='flex flex-col items-center border border-gray-300 p-3 m-4'>
                            <p className='text-4xl font-bold'>{information.lineChartData[information.lineChartData.length - 1].y} %</p>
                            <p className='italic text-sm text-gray-500'>(Latest Daily Average Moisture)</p>
                        </div>

                        <div className='flex justify-around gap-6'>
                            <Button
                                onClick={toggleFieldTable}
                                className={(showFieldTable ? "bg-gray-600 border-gray-800 text-white" : "") + "border-gray-800 self-start w-[140px] h-[60px] !py-0 text-center text-xs"}
                            >
                                {`${showFieldTable ? 'Hide' : 'Show'} Fields Containing Plant`}
                            </Button>
                            <Button
                                onClick={toggleSampleTable}
                                className={(showSampleTable ? "bg-gray-600 border-gray-800 text-white" : "") + "border-gray-800 self-start w-[140px] h-[60px] !py-0 text-center text-xs"}
                            >
                                {`${showSampleTable ? 'Hide' : 'Show'} Samples in Plant`}
                            </Button>
                        </div>

                        <Collapse in={showFieldTable}>
                            <div className="flex flex-col">
                                <div className='h-[1px] w-4/5 bg-gray-300 mx-auto my-3' />
                                <p className='font-bold'>Fields Containing Plant</p>
                                {information.fieldsTableData.length === 0 ? <></> :
                                    <Button
                                        onClick={handleAddToField}
                                        className='px-2 py-1 w-fit m-0 mt-2 self-end text-sm'
                                    >
                                        Add to a Field
                                    </Button>
                                }
    
                                {information.fieldsTableData.length ? (
                                    <BaseTable
                                        columns={fieldTableColumns}
                                        rows={information.fieldsTableData}
                                        onClick={openField}
                                        onClickDelete={handleDeleteFromField}
                                        rowsPerPageOptions={[]}
                                    />
                                ) : (
                                    <div className='mt-2.5 text-center'>
                                        <p className='italic text-gray-500'>This plant is not in any fields.</p>
                                        <Button
                                            onClick={handleAddToField}
                                            className='px-3 py-2 w-fit mx-auto mt-3 text-sm'
                                        >
                                            Add to a Field
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </Collapse>
    
                        <Collapse in={showSampleTable}>
                            <div className="flex flex-col">
                                <div className='h-[1px] w-4/5 bg-gray-300 mx-auto my-3' />
                                <p className='font-bold'>Samples in Plant</p>
    
                                {information.samplesTableData.length === 0 ? <></> :
                                    <Button
                                        onPress={handleAddToPlant}
                                        className='px-2 py-1 w-fit m-0 mt-2 self-end text-sm'
                                    >
                                        Add a Sample to this Plant
                                    </Button>
                                }
    
                                {information.samplesTableData.length ? (
                                    <BaseTable
                                        columns={sampleTableColumns}
                                        rows={information.samplesTableData}
                                        onClick={openSample}
                                        onClickDelete={handleDeleteFromPlant}
                                        rowsPerPageOptions={[]}
                                    />
                                ) : (
                                    <div className='mt-2.5 text-center'>
                                        <p className='italic text-gray-500'>There are no samples in this plant.</p>
                                        <Button
                                            onPress={handleAddToPlant}
                                            className='px-3 py-2 w-fit mx-auto mt-3 text-sm'
                                        >
                                            Add a Sample to this Plant
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </Collapse>
                    </>
                )}
            </div>
        </div>
    );
}