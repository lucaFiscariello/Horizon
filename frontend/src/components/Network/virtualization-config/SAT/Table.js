import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { getModel } from 'client/opensad-wrapper/clientModel';



const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'modulation', headerName: 'Modulation', width: 130 },
  { field: 'coding', headerName: 'Coding', width: 130 },
  {
    field: 'efficiency',
    headerName: 'Efficiency',
    width: 130,
  },
  {
    field: 'burst_length',
    headerName: 'Burst_length',
    width: 130,
   
  },
];



export default function DataTable(props) {

    const [items, setItems] = React.useState([]);


    React.useEffect(async ()  => {

        let res = await  getModel(props.projectName)
        setItems(res.model.topology.model.root.wave_forms.dvb_rcs2.item)
    }, []);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={items}
        columns={columns}
        pageSizeOptions={[5, 10]}
        initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
        }}
        checkboxSelection
      />
    </div>
  );
}