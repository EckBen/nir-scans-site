import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';

import ScrollShadow from '../ScrollShadow/ScrollShadow';

import { FaTrash } from "react-icons/fa";
import { MdOpenInNew } from "react-icons/md";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function EnhancedTableHead({ order, orderBy, onRequestSort, headCells }) {
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.key}
            align={headCell.isNumeric ? 'right' : 'left'}
            sortDirection={orderBy === headCell.key ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.key}
              direction={orderBy === headCell.key ? order : 'asc'}
              onClick={createSortHandler(headCell.key)}
            >
              {headCell.label}
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell
          sortDirection={false}
        ></TableCell>
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  headCells: PropTypes.array.isRequired
};



export function BaseTable({ initSortDirection='asc', columns, rows, onClick, maxWidth=650, onClickDelete=false, initRowsPerPage=5, rowsPerPageOptions=[5,10,25] }) {
  const [order, setOrder] = React.useState(initSortDirection);
  const [orderBy, setOrderBy] = React.useState(columns[0].key);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(initRowsPerPage);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      [...rows]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [rows, order, orderBy, page, rowsPerPage],
  );

  return (
    <Box sx={{ width: '100%', maxWidth: maxWidth + 'px' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer id='table' sx={{ position: 'relative' }}>
        {/* <TableContainer sx={{ boxShadow: 'inset -10px 0px 10px -5px rgba(0,0,0,0.2)' }}> */}
          <ScrollShadow wrapperId='#table'>
            <Table
              size='small'
            >
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                headCells={columns}
              />
              <TableBody >
                {visibleRows.map((row, index) => {
                  return (
                    <TableRow
                      key={index}
                      hover
                      onClick={() => onClick(row)}
                      sx={{ cursor: 'pointer' }}
                    >
                      {columns.map(({ key }, i) => 
                        <TableCell
                          key={key + index}
                          align={i === 0 ? 'left' : 'center'}
                        >{row[key]}</TableCell>)}
                      <TableCell>
                        <Box sx={{ display: 'flex' }}>
                          <IconButton aria-label="open">
                            <MdOpenInNew color='blue' size='20px' />
                          </IconButton>
                          {onClickDelete === false ? (<></>) : (
                            <IconButton onClick={(e) => {
                              e.stopPropagation();
                              onClickDelete(row);
                            }} aria-label="delete">
                              <FaTrash color='red' size='20px' />
                            </IconButton>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: 53 * emptyRows,
                    }}
                  >
                    <TableCell colSpan={columns.length + 1} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollShadow>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={rowsPerPageOptions}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}

BaseTable.propTypes = {
  initSortDirection: PropTypes.string,
  columns: PropTypes.array.isRequired,
  rows: PropTypes.array.isRequired,
  onClick: PropTypes.func.isRequired,
  maxWidth: PropTypes.number,
  onClickDelete: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  initRowsPerPage: PropTypes.number,
  rowsPerPageOptions: PropTypes.array
};