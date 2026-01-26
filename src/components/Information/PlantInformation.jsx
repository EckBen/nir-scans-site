import { useState } from "react";
import { useParams } from "react-router";
import { useNavigate } from "react-router";
import { Collapse } from "@mui/material";

import { useData } from "../../contexts/dataContext";

import Button from '../Button';
import CreateOrUpdate from "../crudModals/CreateOrUpdate";
import { BaseTable } from "../Tables/BaseTable";

export default function PlantInformation() {
    const navigate = useNavigate();
    const params = useParams();
    const {
        getPlantInformation,
        sampleTableData,
        plants,
        updatePlant,
        deletePlant,
        fields,
        createNewField,
        updateField
    } = useData();
    const information = getPlantInformation(params.plantID);
    
    const [showFieldTable, setShowFieldTable] = useState(false);
    const [showSampleTable, setShowSampleTable] = useState(false);

    const toggleFieldTable = () => {
        setShowFieldTable(!showFieldTable);
    }

    const openField = (row) => {
        navigate(`/fields/${row.fieldID}`);
    };
    
    const handleRemovePlantFromField = (row) => {
        if (confirm('Are you sure that you want to remove this plant from the selected field?')) {
            // Find and copy field object
            const newFieldObj = JSON.parse(JSON.stringify(fields.find(f => f.fieldID === row.fieldID)));
    
            // Remove the target plant from the field
            newFieldObj.plants = newFieldObj.plants.filter(p => p.plantID !== information.plantID).map(p => p.plantID);
    
            // Update the field in state and database
            updateField(newFieldObj);
        }
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

    const handleRemoveSampleFromPlant = (row) => {
        if (confirm('Are you sure that you want to remove the selected sample from this plant?')) {
            // Find and copy plant object
            const newPlantObj = JSON.parse(JSON.stringify(plants.find(p => p.plantID === information.plantID)));

            // Remove the target sample from plant
            newPlantObj.samples = newPlantObj.samples.filter(s => s.sampleID !== row.sampleID).map(s => s.sampleID);

            // Update the plant in state and database
            updatePlant(newPlantObj);
        }
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

                        {information.averageMoisture === null ? (
                                <div className='w-fit m-auto'>
                                    <p className='text-gray-400 italic my-5 max-w-[200px] text-center'>No samples in this plant. Add at least one to get the average moisture percentage.</p>
                                </div>
                            ) : (
                                <div className='flex flex-col items-center border border-gray-300 p-3 m-4'>
                                    <p className='text-4xl font-bold'>{information.averageMoisture} %</p>
                                    <p className='italic text-sm text-gray-500'>(Average Moisture)</p>
                                </div>
                        )}

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
                                                <div className='flex'>
                                                    <Button
                                                        onClick={handleOpen}
                                                        className='px-2 py-1 mt-2 ml-auto text-sm self-end'
                                                    >
                                                        Add to a Field
                                                    </Button>
                                                </div>
                                        }
                                        createFunction={createNewField}
                                        updateFunction={updateField}
                                        autoInclude={information.plantID}
                                    />
                                }
    
                                {information.fieldsTableData.length ? (
                                    <BaseTable
                                        columns={fieldTableColumns}
                                        rows={information.fieldsTableData}
                                        onClick={openField}
                                        onClickRemove={handleRemovePlantFromField}
                                        rowsPerPageOptions={[]}
                                    />
                                ) : (
                                    <div className='mt-2.5 text-center'>
                                        <p className='italic text-gray-500'>This plant is not in any fields.</p>
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
                                                    <div className='flex'>
                                                        <Button
                                                            onClick={handleOpen}
                                                            className='px-3 py-2 w-fit mx-auto mt-3 text-sm'
                                                        >
                                                            Add to a Field
                                                        </Button>
                                                    </div>
                                            }
                                            createFunction={createNewField}
                                            updateFunction={updateField}
                                            autoInclude={information.plantID}
                                        />
                                    </div>
                                )}
                            </div>
                        </Collapse>
    
                        <Collapse in={showSampleTable}>
                            <div className="flex flex-col">
                                <div className='h-[1px] w-4/5 bg-gray-300 mx-auto my-3' />
                                <p className='font-bold'>Samples in Plant</p>
    
                                {information.samplesTableData.length === 0 ? <></> :
                                    <CreateOrUpdate
                                        itemName='Sample'
                                        itemOptions={sampleTableData}
                                        itemIdKey='sampleID'
                                        itemLabelKey='sampleID'
                                        groupName='Plant'
                                        groupOptions={plants}
                                        groupIdKey='plantID'
                                        openButton={
                                            (handleOpen) =>
                                                <Button
                                                    onClick={handleOpen}
                                                    className='px-2 py-1 w-fit m-0 mt-2 self-end text-sm'
                                                >
                                                    Add a Sample to this Plant
                                                </Button>
                                        }
                                        createFunction={() => {}}
                                        updateFunction={updatePlant}
                                        groupObject={plants.find(p => p.plantID === information.plantID)}
                                    />
                                }
    
                                {information.samplesTableData.length ? (
                                    <BaseTable
                                        columns={sampleTableColumns}
                                        rows={information.samplesTableData}
                                        onClick={openSample}
                                        onClickRemove={handleRemoveSampleFromPlant}
                                        rowsPerPageOptions={[]}
                                    />
                                ) : (
                                    <div className='mt-2.5 text-center'>
                                        <p className='italic text-gray-500'>There are no samples in this plant.</p>
                                        <CreateOrUpdate
                                            itemName='Sample'
                                            itemOptions={sampleTableData}
                                            itemIdKey='sampleID'
                                            itemLabelKey='sampleID'
                                            groupName='Plant'
                                            groupOptions={plants}
                                            groupIdKey='plantID'
                                            openButton={
                                                (handleOpen) =>
                                                    <Button
                                                        onClick={handleOpen}
                                                        className='px-3 py-2 w-fit mx-auto mt-3 text-sm'
                                                    >
                                                        Add a Sample to this Plant
                                                    </Button>
                                            }
                                            createFunction={() => {}}
                                            updateFunction={updatePlant}
                                            groupObject={plants.find(p => p.plantID === information.plantID)}
                                        />
                                    </div>
                                )}
                            </div>
                        </Collapse>

                        <div className='flex justify-center'>
                            <Button
                                onClick={() => deletePlant(information)}
                                variant='warning'
                            >
                                Delete This Plant
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}