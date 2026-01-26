import { useNavigate } from "react-router";
import { useData } from '../../contexts/dataContext';

import { BaseTable } from './BaseTable';
import CreateOrUpdate from "../crudModals/CreateOrUpdate";
import Button from "../Button";

export default function FieldsTable() {
  const { fieldTableData, deleteField, plants, fields, createNewField, updateField } = useData();
  const navigate = useNavigate();
  
  const openField = ({ href }) => {
    navigate(href);
  };

  const columns = [{
    key: 'fieldName',
    label: 'Field Name',
  },{
    key: 'latestAvgMoisture',
    label: 'Latest Avg. Moisture (%)',
  },{
    key: 'latestDay',
    label: 'Latest Sample Day',
  },{
    key: 'hasXSamples',
    label: 'Has # Samples',
  },{
    key: 'hasXPlants',
    label: 'Has # Plants',
  }];

  return (
    <>
      {(plants && fields) ? (
        <CreateOrUpdate
          forceNew={true}
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
                  Create New Field
                </Button>
              </div>
          }
          createFunction={createNewField}
          updateFunction={updateField}
        />
      ) : <></>}
    
      <BaseTable
        initSortDirection='desc'
        columns={columns}
        rows={fieldTableData}
        onClick={openField}
        onClickDelete={deleteField}
        initRowsPerPage={20}
        rowsPerPageOptions={[]}
      />
    </>
  );
}