import { useNavigate } from "react-router";
import { useData } from '../../contexts/dataContext';

import { BaseTable } from './BaseTable';
import CreateOrUpdate from "../crudModals/CreateOrUpdate";
import Button from "../Button";

export default function PlantsTable() {
  const { plantTableData, deletePlant, sampleTableData, plants, createNewPlant, updatePlant } = useData();
  const navigate = useNavigate();
  
  const openPlant = ({ href }) => {
    navigate(href);
  };

  const columns = [{
    key: 'latestTimestamp',
    label: 'Latest Sample Date/Time',
  },{
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

  return (
    <>
      <CreateOrUpdate
        forceNew={true}
        itemName='Sample'
        itemOptions={sampleTableData}
        itemIdKey='sampleID'
        itemLabelKey='sampleID'
        groupName='Plant'
        groupOptions={plants}
        groupIdKey='plantID'
        openButton={
          (handleOpen) =>
            <div className='flex'>
              <Button
                onClick={handleOpen}
                className='px-2 py-1 mt-2 ml-auto text-sm self-end'
              >
                Create New Plant
              </Button>
            </div>
        }
        createFunction={createNewPlant}
        updateFunction={updatePlant}
      />

      <BaseTable
        initSortDirection='desc'
        columns={columns}
        rows={plantTableData}
        onClick={openPlant}
        onClickDelete={deletePlant}
        initRowsPerPage={20}
        rowsPerPageOptions={[]}
      />
    </>
  );
}