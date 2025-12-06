import { useNavigate } from "react-router";
import { useData } from '../contexts/dataContext';

import { BaseTable } from './BaseTable';

export default function FieldsTable() {
  const { fieldTableData } = useData();
  const navigate = useNavigate();
  
  console.log(fieldTableData);

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
    <BaseTable
      initSortDirection='desc'
      columns={columns}
      rows={fieldTableData}
      onClick={openField}
    />
  );
}