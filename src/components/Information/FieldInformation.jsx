import { useState } from "react";
import { useParams } from "react-router";
import { useNavigate } from "react-router";
import { Collapse } from "@mui/material";

import { useData } from "../../contexts/dataContext";

import CreateOrUpdate from "../crudModals/CreateOrUpdate";
import Button from '../Button';
import { BaseTable } from "../Tables/BaseTable";

export default function FieldInformation() {
    const navigate = useNavigate();
    const params = useParams();
    const { getFieldInformation, plants, fields, updateField, deleteField } = useData();
    const information = getFieldInformation(params.fieldID);
    
    const [showSampleTable, setShowSampleTable] = useState(false);
    const [showPlantTable, setShowPlantTable] = useState(false);

    const togglePlantTable = () => {
        setShowPlantTable(!showPlantTable);
    }

    const openPlant = (row) => {
        navigate(`/plants/${row.plantID}`);
    };
    
    const handleRemovePlantFromField = (row) => {
        if (confirm('Are you sure that you want to remove selected plant from this field?')) {
            // Find and copy field object
            const newFieldObj = JSON.parse(JSON.stringify(fields.find(f => f.fieldID === information.fieldID)));
    
            // Remove the target plant from the field
            newFieldObj.plants = newFieldObj.plants.filter(p => p.plantID !== row.plantID).map(p => p.plantID);
    
            // Update the field in state and database
            updateField(newFieldObj);
        }
    };

    const plantTableColumns = [{
        key: 'plantName',
        label: 'Plant Name',
    },{
        key: 'latestMoisture',
        label: 'Latest Moisture (%)',
    },{
        key: 'hasXSamples',
        label: 'Has # Samples',
    },{
        key: 'inXFields',
        label: 'In #  Fields',
    }];

    const toggleSampleTable = () => {
        setShowSampleTable(!showSampleTable);
    }

    const openSample = (row) => {
        navigate(`/samples/${row.sampleID}`);
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
                <h1 className='text-3xl mb-5'>Field Information</h1>
                {information === null ? (
                    <div className='w-fit m-auto'>
                        <p className='text-gray-400 italic'>No information found for this field.</p>
                    </div>
                ) : (
                    <>
                        <p className='font-bold mt-2'>{information.fieldName}</p>
                        <p>ID: {information.fieldID}</p>

                        {information.lineChartData === null ? (
                            <div className='w-fit m-auto'>
                                {information.samplesTableData.length === 0 ? <p className='text-gray-400 italic my-5 max-w-[200px] text-center'>No samples in the plants that this field contains.</p> : <></>}
                                {information.plantsTableData.length === 0 ? <p className='text-gray-400 italic my-5 max-w-[200px] text-center'>No plants in this field.</p> : <></>}
                                <p className='text-gray-400 italic my-5 max-w-[200px] text-center'>Add items to get the average moisture percentage.</p>
                            </div>
                        ) : (
                            <div className='flex flex-col items-center border border-gray-300 p-3 m-4'>
                                <p className='text-4xl font-bold'>{information.lineChartData[information.lineChartData.length - 1].y} %</p>
                                <p className='italic text-sm text-gray-500'>(Latest Daily Average Moisture)</p>
                            </div>
                        )}

                        <div className='flex justify-around gap-6'>
                            <Button
                                onClick={togglePlantTable}
                                className={(showPlantTable ? "bg-gray-600 border-gray-800 text-white" : "") + "border-gray-800 self-start w-[140px] h-[60px] !py-0 text-center text-xs"}
                            >
                                {`${showPlantTable ? 'Hide' : 'Show'} Plants in Field`}
                            </Button>
                            <Button
                                onClick={toggleSampleTable}
                                className={(showSampleTable ? "bg-gray-600 border-gray-800 text-white" : "") + "border-gray-800 self-start w-[140px] h-[60px] !py-0 text-center text-xs"}
                            >
                                {`${showSampleTable ? 'Hide' : 'Show'} Samples in Field`}
                            </Button>
                        </div>

                        <Collapse in={showPlantTable}>
                            <div className="flex flex-col">
                                <div className='h-[1px] w-4/5 bg-gray-300 mx-auto my-3' />
                                <p className='font-bold'>Plants in Field</p>
                                {information.plantsTableData.length === 0 ? <></> :
                                    <CreateOrUpdate
                                        itemName='Plant'
                                        itemOptions={plants}
                                        itemIdKey='plantID'
                                        itemLabelKey='name'
                                        groupName='Field'
                                        groupOptions={fields}
                                        groupIdKey='fieldID'
                                        openButton={
                                            (handleOpen) =>
                                                <Button
                                                    onClick={handleOpen}
                                                    className='px-2 py-1 w-fit m-0 mt-2 self-end text-sm'
                                                >
                                                    Add a Plant to this Field
                                                </Button>
                                        }
                                        createFunction={() => {}}
                                        updateFunction={updateField}
                                        groupObject={fields.find(f => f.fieldID === information.fieldID)}
                                    />
                                }
    
                                {information.plantsTableData.length ? (
                                    <BaseTable
                                        columns={plantTableColumns}
                                        rows={information.plantsTableData}
                                        onClick={openPlant}
                                        onClickRemove={handleRemovePlantFromField}
                                        rowsPerPageOptions={[]}
                                    />
                                ) : (
                                    <div className='mt-2.5 text-center'>
                                        <p className='italic text-gray-500'>This field does not have any plants.</p>
                                        <CreateOrUpdate
                                            itemName='Plant'
                                            itemOptions={plants}
                                            itemIdKey='plantID'
                                            itemLabelKey='name'
                                            groupName='Field'
                                            groupOptions={fields}
                                            groupIdKey='fieldID'
                                            openButton={
                                                (handleOpen) =>
                                                    <Button
                                                        onClick={handleOpen}
                                                        className='px-3 py-2 w-fit mx-auto mt-3 text-sm'
                                                    >
                                                        Add a Plant to this Field
                                                    </Button>
                                            }
                                            createFunction={() => {}}
                                            updateFunction={updateField}
                                            groupObject={fields.find(f => f.fieldID === information.fieldID)}
                                        />
                                    </div>
                                )}
                            </div>
                        </Collapse>
    
                        <Collapse in={showSampleTable}>
                            <div className="flex flex-col">
                                <div className='h-[1px] w-4/5 bg-gray-300 mx-auto my-3' />
                                <p className='font-bold mb-3'>Samples in Field</p>
    
                                {information.samplesTableData.length ? (
                                    <BaseTable
                                        columns={sampleTableColumns}
                                        rows={information.samplesTableData}
                                        onClick={openSample}
                                        rowsPerPageOptions={[]}
                                    />
                                ) : (
                                    <div className='mt-2.5 text-center'>
                                        <p className='italic text-gray-500'>There are no samples in this field. Create or add a plant with samples to this field.</p>
                                    </div>
                                )}
                            </div>
                        </Collapse>

                        <div className='flex justify-center'>
                            <Button
                                onClick={() => deleteField(information)}
                                variant='warning'
                            >
                                Delete This Field
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}