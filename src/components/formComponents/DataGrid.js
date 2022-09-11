import React from 'react';
// import PropTypes from 'prop-types';
import { IconButton, TextField,Stack } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { createStyles, makeStyles } from '@mui/styles';
import { DataGrid } from '@mui/x-data-grid';
import { Icon } from '@iconify/react';
import searchFill from '@iconify/icons-eva/search-fill';
import trash2Fill from '@iconify/icons-eva/close-outline';

function escapeRegExp(value) {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

const defaultTheme = createTheme();
const useStyles = makeStyles(
  (theme) =>
    createStyles({
      tableroot: {
        padding: theme.spacing(0.5, 0.5, 0),
        justifyContent: 'space-between',
        display: 'flex',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        minHeight: '60px !important',
        margin: '10px'
      },
      textField: {
        [theme.breakpoints.down('xs')]: {
          width: '100%'
        },
        margin: theme.spacing(1, 0.5, 1.5),
        '& .MuiSvgIcon-root': {
          marginRight: theme.spacing(0.5)
        },
        '& .MuiInput-underline:before': {
          borderBottom: `1px solid ${theme.palette.divider}`,
          // borderRight: `1px solid ${theme.palette.divider}`
        }
      },
      
    }),
  { defaultTheme }
);

function QuickSearchToolbar(props) {
  const classes = useStyles();

  return (
    <div className={classes.tableroot}>
      {/* <div>
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
      </div> */}
      <TextField
        variant="standard"
        value={props.value}
        onChange={props.onChange}
        placeholder=" Search…"
        className={classes.textField}
        InputProps={{
          startAdornment: <Icon style={{width:'25px', height:'25px'}} size="medium" icon={searchFill} />,
          endAdornment: (
            <IconButton
              title="Clear"
              aria-label="Clear"
              size="medium"
              style={{ visibility: props.value ? 'visible' : 'hidden' }}
              onClick={props.clearSearch}
            >
              <Icon icon={trash2Fill} />
            </IconButton>
          )
        }}
        
      />
    </div>
  );
}

export default class TableContent extends React.Component {
  
  constructor(props) {
    super(props);
    
    this.state = {
      rows: props.data || [],
      columns: [],
      searchText: ''
    };
    
  }

  componentDidMount() {
    this.setState({ rows: this.props.data });
    this.setState({ columns: this.props.columns });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.data !== prevState.rows && prevState.searchText === '') {
      return { rows: nextProps.data };
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.data !== this.props.data) {
      // Perform some operation here
      // this.setState({ rows: this.props.data });
    }
  }

  requestSearch(searchValue) {
    this.setState({ searchText: searchValue });
    const searchRegex = new RegExp(escapeRegExp(searchValue), 'i');
    const filteredRows = this.props.data.filter((row) => {
      return Object.keys(row).some((field) => {
        const textvalue =
          row[field] !== null && row[field] !== undefined ? row[field].toString() : '';
        return searchRegex.test(textvalue);
      });
    });
    this.setState({ rows: filteredRows });
  }

  render() {

    return ( 
      <div style={{height: '100%' ,overflow: 'auto', width:'100%', }}>  
        <DataGrid 
          // autoHeight
          autoHeight = {this.props.autoHeight !== null && this.props.autoHeight !== undefined ? true: false}
          height = "100%"
          pageSize={10}
          rowsPerPageOptions={[5]}
          rows={this.state.rows} 
          columns={this.state.columns}
          // hideFooter
          disableMultipleSelection={true}
          disableSelectionOnClick
          showColumnRightBorder={false}
          onCellClick={(params)=>{
            if(this.props.onclickevt !== undefined){
              this.props.onclickevt(params);
            }
          }}
          components={{ Toolbar: QuickSearchToolbar,
            NoRowsOverlay: () => (
              <Stack style={{marginTop: '10%'}} alignItems="center" justifyContent="center">
                No records found
              </Stack>
            ),
            NoResultsOverlay: () => (
              <Stack style={{marginTop: '10%'}} alignItems="center" justifyContent="center">
                No results found
              </Stack>
            )
           }}
          componentsProps={{
            toolbar: {
              value: this.state.searchText,
              onChange: (event) => this.requestSearch(event.target.value),
              clearSearch: () => this.requestSearch('')
            }
            
          }}

          onRowDoubleClick={(rowData,event) => {
            if(this.props.onRowDoubleClick !== null && this.props.onRowDoubleClick !== undefined) {
              
              var target = event.target
              var targetstr = ""+target
              if(targetstr.includes("Div")) {
              
                this.props.onRowDoubleClick(rowData)
              }
              else if(targetstr.includes("Span")) {
               
              } 
             }
          }}
          onRowClick={(rowData,event) => {
            var target = event.target
              var targetstr = ""+target
              // console.log("targetstr",targetstr, this.props.onRowClick)
            if(this.props.onRowClick !== null && this.props.onRowClick !== undefined) {
             
              var target = event.target
              var targetstr = ""+target
              // console.log("targetstr",targetstr)
              if(targetstr.includes("Div")) {
                this.props.onRowClick(rowData)
               
              }
              else if(targetstr.includes("Span")) {
               
              }
            
             }
            }}

        />
      </div>
    );
  }
}
