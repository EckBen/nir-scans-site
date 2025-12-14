import { useNavigate } from "react-router";
import { useData } from '../../contexts/dataContext';

import { BaseTable } from './BaseTable';

export default function SamplesTable() {
  const { sampleTableData } = useData();
  const navigate = useNavigate();
  
  const openSample = ({ href }) => {
    navigate(href);
  };

  const columns = [{
    key: 'timestamp',
    label: 'Date/Time Taken',
  },{
    key: 'scannerID',
    label: 'Scanner ID',
  },{
    key: 'modelResult',
    label: 'Moisture (%)',
  },{
    key: 'inXPlants',
    label: 'In # Plants',
  }];

  return (
    <BaseTable
      initSortDirection='desc'
      columns={columns}
      rows={sampleTableData.concat(sampleTableData,sampleTableData,sampleTableData,sampleTableData,sampleTableData)}
      onClick={openSample}
      initRowsPerPage={20}
      rowsPerPageOptions={[]}
    />
  );
}