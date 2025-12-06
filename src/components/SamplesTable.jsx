import { useNavigate } from "react-router";
import { useData } from '../contexts/dataContext';

import { BaseTable } from './BaseTable';

export default function SamplesTable() {
  const { sampleTableData } = useData();
  const navigate = useNavigate();
  
  console.log(sampleTableData);

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
      rows={sampleTableData}
      onClick={openSample}
      deleteable={false}
    />
  );
}