import React from 'react'; 
import axios from 'axios'; 
import config from '../../../config/config'; 
import AddCustomer from './addCustomer'; 
import ButtonContent from '../../../components/formComponents/Button';
import {  Stack, Container, Typography } from '@mui/material';
import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill'; 
import ModalTitleBar from '../../../components/Modal/Titlebar';
import LoadingModal from '../../../components/Modal/loadingmodal';
import TableContent from '../../../components/formComponents/DataGrid';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar'; 
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@mui/icons-material/Close'; 
import DataManager from '../../../controller/datacontroller'



export default class SelectCustomer extends React.Component {

    constructor(props){

        super(props);
        this.state={

            addcustomerShown: false,
            searched: "",
            customers: [],
            origincustomers: [],
            isAddCustomerOpen: false,
            isLoading: false,
            columns:[
                {
                    field: 'name',
                    headerName: 'Name',
                    // minWidth: 200,
                    flex: 1,
                    editable: false,
                    
                    renderCell: (params) => (
                    <div>
                        {params.row.name}
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
                        {params.row.email}
                    </div>
                    )
                },
                {
                    field: 'phone',
                    headerName: 'Mobile Number',
                    // minWidth: 200,
                    flex: 1,
                    editable: false,
                    renderCell: (params) => (
                    <div>
                        {params.row.phone !=='' && params.row.phone !== null ? params.row.phone : "--"}
                    </div>
                    )
                },
                {
                    field: '',
                    headerName: '',
                    // minWidth: 100,
                    flex: 1,
                    editable: false,
                    renderCell: (params) => (
                        <strong>  
                            <ButtonContent color="success" variant="contained" size="small"  onClick={()=>this.onSelectCustomer(params.row)} label="Select"/>
                        </strong>
                    )
                },
                
            ]
        }

        this.onSelectCustomer = this.onSelectCustomer.bind(this)
        this.handleCloseCustomer = this.handleCloseCustomer.bind(this)
    }

   
    
    componentDidMount(){
        this.getCustomerList()
    }
   
    requestSearch(searchVal) { 
        const filteredRows = this.state.origincustomers.filter((row) => { 
            return row.name.toLowerCase().includes(searchVal.toLowerCase()); 
        });
        
       this.setState({customers: filteredRows})
       if(searchVal.length >=2 && filteredRows.length===0) {
            //console.log("Add customer", filteredRows.length)
            this.setState({addcustomerShown: true})

       }
    }

    cancelSearch() {
        this.setState({searched: ""})
        this.requestSearch("");
    }
    
    getCustomerList(){
        this.setState({isLoading: true})
        var businessdetail = {}
        var  detail = window.localStorage.getItem('businessdetail');
        if(detail !== undefined && detail !== 'undefined'){
            businessdetail = JSON.parse(detail);
            // axios.get(config.root+"customer/"+businessdetail["id"]).then(res=>{
            //     var status = res.data["status"];
            //     var data = res.data["data"];
            //     if(status === 200){
            //         this.setState({customers:data, origincustomers: data, isLoading: false}, function() {
            //             //console.log(this.state.customers)
            //         });
            //     }
            // })

            const dataManager = new DataManager()
            dataManager.getData("select sync_id as id, member_id, name, email, dob, first_visit, last_visit, visit_count, total_spent, loyality_point, created_at, created_by, updated_at, updated_by, status, phone, businessId, sync_status, sync_id  from customers").then(response =>{
                if (response instanceof Array) {
                    this.setState({customers: response, origincustomers: response, isLoading: false}, function(){
                        // console.log(this.state.customerlist)
                    })
                }
                
            })


        }
    }

    
    onClickAddCustomer() {

        console.log("handleCloseCustomer",this.props)
        // this.props.handleCloseCustomer()
        // this.props.onClose()
        // setTimeout(()=>{
        //     this.setState({addcustomerShown: false, isAddCustomerOpen: true})
        // },100)
       
        this.setState({isAddCustomerOpen: true})
       
    }

    handleCloseCustomer(){
        this.setState( {isAddCustomerOpen: false},function() {
            this.getCustomerList()
        })
    }

    onSelectCustomer(row) {
        
        
        this.props.onSelectCustomer(row); 
    }
        
    render(){
        return (
         
            <div style={{height: '100%', marginTop: 5}}>
                {this.state.isLoading &&  <LoadingModal show={this.state.isLoading}></LoadingModal>}

                <Container maxWidth="xl" style={{width: "100%", height: '70%'}}>

                {!this.state.isAddCustomerOpen && 
                    <div style={{height: '100%', background: 'transparent'}}>
                        {/* <ModalTitleBar style={{marginLeft: -40 }}onClose={()=>this.props.handleCloseCustomer()} title="Select Customer"/> */}

                        <AppBar  color="primary" style={{ position: 'relative',background: 'transparent', boxShadow: 'none',width:'100%',marginLeft: -20,marginRight: 40 }}>
                            <Toolbar>
                                <Typography variant="h6" component="div" style={{color:'#134163'}}>
                                Select Customer
                                </Typography>

                                <div style={{marginLeft: "auto", marginRight: -60}}>
                                
                                <IconButton
                                edge="start"
                                onClick={()=>this.props.handleCloseCustomer()}
                                aria-label="close"
                                style={{"color":'#134163'}}
                                >
                                <CloseIcon />
                                </IconButton>
                                </div>

                            </Toolbar>
                            </AppBar>

                        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                            <Typography variant="h4" gutterBottom>
                            {/* Employee */}
                            </Typography>
                            <ButtonContent color="success" 
                            onClick={()=>this.onClickAddCustomer()}
                            size="large"
                            variant="contained"
                            label="Add Customer"
                            disabled={(navigator.onLine)? false: true}
                            startIcon={<Icon icon={plusFill} />}
                            />
                        </Stack>
 
                
                {this.state.customers.length>0 &&
                 <TableContent pageSize={5} data={this.state.customers} columns={this.state.columns} style={{height: '100%'}} /> 
                }
                {
                    this.state.customers.length===0 &&
                    <Typography variant="subtitle2" align="center" style={{cursor:'pointer', marginTop: 20}} >No Customer Found.</Typography> 
                }
            
                </div>
            }

                
                
            { /** Add Customer */ }
                {this.state.isAddCustomerOpen && <div>
                    <div style={{border:'1px solid',right:0, bottom:0,top:'0',left:'0',position:'absolute'}}>
                        <div style={{background:'rgba(0,0,0,0.8)',right:0, bottom:0,top:'0',left:'0',position:'absolute' }}>
                        </div>
                        <div style={{background:'#fff', height:'80%', width:'900px', position:'relative', borderRadius: 10}}>
                        
                            <ModalTitleBar onClose={()=>this.handleCloseCustomer()} title="Add Customer"/> 
                            
                             <AddCustomer afterSubmit={()=>{this.handleCloseCustomer()}}/>

                        </div>
                    </div>
                </div> }

                </Container>
            </div>

          
        )
    }
} 