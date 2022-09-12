import React from 'react'; 
import { Container, Typography } from '@mui/material';  
import LoadingModal from '../../../../components/Modal/loadingmodal';
import TableContent from '../../../../components/formComponents/DataGrid';
  


export default class SelectTechnician extends React.Component {

    constructor(props){

        super(props);
        this.state={
            searched: "",
            tech: [],
            origintech: [],
            isLoading: false,
            columns:[
                {
                    field: 'firstName',
                    headerName: 'Name',
                    // minWidth: 200,
                    flex: 1,
                    editable: false,
                    renderCell: (params) => (
                    <div>
                        {params.row.firstName} {params.row.lastName}
                    </div>
                    )
                },
                {
                    field: 'email',
                    headerName: 'Email',
                    // minWidth: 200,
                    flex: 1,
                    editable: false,
                    renderCell: (params) => (
                    <div>
                        {params.row.email !== ''&&params.row.email !== null ? params.row.email : "--"}
                    </div>
                    )
                },
                {
                    field: 'mobile',
                    headerName: 'Mobile Number',
                    // minWidth: 200,
                    flex: 1,
                    editable: false,
                    renderCell: (params) => (
                    <div>
                        {params.row.mobile === null ? "NA": (params.row.mobile === "null") ? 'NA': params.row.mobile}
                        {/* {params.row.mobile !='' && params.row.mobile != null ? params.row.mobile : "--"} */}
                    </div>
                    )
                }, 
                
            ]
        }

        this.onSelectTech = this.onSelectTech.bind(this)
    }

   
    
    componentDidMount(){
        this.getTechList()
    }
   
    requestSearch(searchVal) { 
        const filteredRows = this.state.origintech.filter((row) => {
           
            var name = row.firstName+" "+row.lastName
            return name.toLowerCase().includes(searchVal.toLowerCase());
            
            
        });
        
       this.setState({tech: filteredRows})
       
    }

    cancelSearch() {
        this.setState({searched: ""})
        this.requestSearch("");
    }
    
    getTechList(){
        this.setState({tech:this.props.technician, origintech: this.props.technician, isLoading: false})
    }

    
    
    onSelectTech(row) {
        console.log(row);
        this.props.onSelectTech(row); 
    }
        
    render(){
        return (
         
            <div style={{height: '100%'}}>
                {this.state.isLoading &&  <LoadingModal show={this.state.isLoading}></LoadingModal>}

                <Container maxWidth="xl" style={{width: "100%", height: '100%'}}> 
                
                {this.state.tech.length>0 &&
                    <div style={{marginTop:30, height: '85%'}}>
                    <TableContent style={{height: '100%'}} onRowClick={(params)=> this.onSelectTech(params.row)} pageSize={5} data={this.state.tech} columns={this.state.columns} />
                    </div>
                
                }
                {
                    this.state.tech.length===0 &&
                    <Typography variant="subtitle2" align="center" style={{cursor:'pointer', marginTop: 20}} >No Technician Found.</Typography> 
                } 
                </Container>
            </div>

          
        )
    }
} 