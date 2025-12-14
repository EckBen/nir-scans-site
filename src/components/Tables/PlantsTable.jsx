import { useNavigate } from "react-router";
import { useData } from '../../contexts/dataContext';

import { BaseTable } from './BaseTable';

export default function PlantsTable() {
  const { plantTableData } = useData();
  const navigate = useNavigate();
  
  const openPlant = ({ href }) => {
    navigate(href);
  };

  const deletePlant = (row) => {
    console.log('Wishlist - delete plant from plant table', row);
  }

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
    <BaseTable
      initSortDirection='desc'
      columns={columns}
      rows={plantTableData}
      onClick={openPlant}
      onClickDelete={deletePlant}
      initRowsPerPage={20}
      rowsPerPageOptions={[]}
    />
  );
}