import { useNavigate } from "react-router";
import { useData } from '../../contexts/dataContext';

import { BaseTable } from './BaseTable';

export default function FieldsTable() {
  const { fieldTableData } = useData();
  const navigate = useNavigate();
  
  const openField = ({ href }) => {
    navigate(href);
  };

  const deleteField = (row) => {
    console.log('Wishlist - delete field from field table', row);
  }

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
    <BaseTable
      initSortDirection='desc'
      columns={columns}
      rows={fieldTableData}
      onClick={openField}
      onClickDelete={deleteField}
      initRowsPerPage={20}
      rowsPerPageOptions={[]}
    />
  );
}