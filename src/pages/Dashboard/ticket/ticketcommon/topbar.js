import React from 'react';
import { Grid, Typography, IconButton} from '@material-ui/core/'; 
import ModalTitleBar from '../../../../components/Modal/Titlebar';
import SelectCustomer from './selectCustomer';
import SelectTechnician from './selectTechnician'; 
import AccountCircle from '@mui/icons-material/AccountCircle';
import Close from '@mui/icons-material/Close';

import './css/topbar.css';

export default class TopBarComponent extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            selectTechnicianPopup: false, 
            selectCustomerPopup: false,
            selectCustomerDetailPopup: false
        }

        this.onSelectTechnician = this.onSelectTechnician.bind(this);
        this.handleCloseTechnician = this.handleCloseTechnician.bind(this);
        this.onSelectTechnician = this.onSelectTechnician.bind(this);
        this.openCustomerDetail = this.openCustomerDetail.bind(this);
        this.openselectCustomer = this.openselectCustomer.bind(this);
        this.handleCloseCustomer = this.handleCloseCustomer.bind(this);
        this.onSelectCustomer = this.onSelectCustomer.bind(this); 
    } 

    componentDidMount(){
        console.log(this.props);
    }

    openTechnician(){
        this.setState({selectTechnicianPopup: true})
    } 

    handleCloseTechnician(){
        this.setState({selectTechnicianPopup : false})
    }

    onSelectTechnician(obj){ 
        this.props.setTicketOwner(obj); 
        this.setState({selectTechnicianPopup : false})
    }

    openCustomerDetail(){
        this.setState({selectCustomerDetailPopup: true})
    }

    openselectCustomer(){  
        this.setState({selectCustomerPopup : true})
    }

    onSelectCustomer(obj){  
        this.props.selectCustomerDetail(obj)
        this.setState({selectCustomerPopup : false})
    }

    
    handleCloseCustomer(){
        this.setState({selectCustomerPopup : false})
    } 
 


    render(){
        return  <div style={{height:'100px', width:'100%'}}>
                    <Grid className='fullHeight padd20' item xs={12} spacing={2}   alignItems="baseline"> 
                        <Grid item xs={9}  style={{display:'flex'}} alignItems="center">
                                <div className={this.props.isDisabled ? "topbtn disabled" : "topbtn" } onClick={()=>{
                                        if(!this.props.isDisabled) {
                                            this.openTechnician()
                                        }
                                    }}>
                                        {(this.props.selectedTech !== undefined || this.props.selectedTech !== null) ? this.props.selectedTech.firstName+" "+this.props.selectedTech.lastName: ""}
                                </div>  
                                <div className={this.props.isDisabled ? "topbtn disabled" : "topbtn" } onClick={()=>{
                                        if(!this.props.isDisabled) {
                                            if(Object.keys(this.props.customer_detail).length>0) {
                                                this.openCustomerDetail()
                                            }
                                            else {
                                                this.openselectCustomer()
                                            }
                                        }
                                    }}>
                                        {Object.keys(this.props.customer_detail).length===0 ? "Select Customer": this.props.customer_detail.name}
                                </div>    
                                <AccountCircle fontSize="large" className={this.props.isDisabled ? "accnticon disabled" : "accnticon"}  
                                onClick={()=>{
                                        if(!this.props.isDisabled) {
                                            this.openselectCustomer()
                                        }
                                        
                                }}/> 
                        </Grid>
                        
                        <Grid item xs={3} style={{display:'flex', background: 'white'}} justify="flex-end" alignItems="center"> 

                            <div style={{marginLeft: 20, fontSize: 12}}>
                                <Typography  fontSize="14"  align="center" maxWidth="90 px">
                                    TID - # {this.props.ticketDetail.ticket_code}
                                </Typography>
                            </div>
                            <IconButton
                                edge="end"                                
                                onClick={()=>{
                                    this.props.handleCloseTicket();
                                }}
                                aria-label="close"
                                style={{"color":'#8C8C8C',marginLeft: 20}}
                                >
                                <Close />
                            </IconButton>
                            
                        </Grid> 
                    </Grid>
                    
                    {/* Select technician popup */}
                    {this.state.selectTechnicianPopup &&  
                        <div className="modalbox">
                            <div className='modal_backdrop'>
                            </div>
                            <div className='modal_container xl_modal'> 
                                <ModalTitleBar onClose={()=>this.handleCloseTechnician()} title="Select Technician"/> 
                                <SelectTechnician afterSubmit={()=>{this.handleCloseTechnician()}} onSelectTech={this.onSelectTechnician} technician={this.props.technicianList}/>
                            </div>
                        </div>
                    }


                    {/*Select Customer Popup*/}
                    {this.state.selectCustomerPopup && 
                        <div className="modalbox">
                            <div className='modal_backdrop'>
                            </div>
                            <div className='modal_container xl_modal'> 
                                <ModalTitleBar onClose={()=>this.handleCloseCustomer()} title="Select Customer"/>  
                                <SelectCustomer customerDetail={this.props.customer_detail} handleCloseCustomer={()=>this.handleCloseCustomer()} onSelectCustomer={(obj)=>this.onSelectCustomer(obj)}/>
                            </div>
                        </div>}



                </div>
    }
}