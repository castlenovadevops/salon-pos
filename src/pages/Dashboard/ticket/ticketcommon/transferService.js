import React from 'react';
import { Grid, Typography, Button} from '@material-ui/core/';   
import ModalTitleBar from '../../../../components/Modal/Titlebar';  
import LoadingModal from '../../../../components/Modal/loadingmodal';
import { QueryFunctions } from './functions';
import OpentTicketsComponent from './opentickets';

import TicketDataController from '../../../../controller/TicketDataController';

export default class TransferServiceComponent extends React.Component{
    queryManager = new QueryFunctions();
    ticketdataController = new TicketDataController();
    constructor(props){
        super(props);  
        this.state = { 
            transferAlert: false,
            isLoading: false,
            tickettoTransfer: {},
            confirmtransfer: false, 
        } 

        this.onTransfer = this.onTransfer.bind(this)
        this.createCurrentTicket = this.createCurrentTicket.bind(this);
        this.handleCloseTransferAlert = this.handleCloseTransferAlert.bind(this);
        this.handleTransferAlert = this.handleTransferAlert.bind(this);
        this.calculateTotal = this.calculateTotal.bind(this);
        this.createNewTicketWithTransfer = this.createNewTicketWithTransfer.bind(this);
    }     
    
    createNewTicketWithTransfer(){
        this.setState({isLoading:true})
        if(this.props.data.services_taken.length === 1){
            this.setState({transferAlert: true, isLoading: false})
        }
        else{ 
            this.handleTransferAlert();
        }
    }

    handleTransferAlert(){
        if(this.state.tickettoTransfer.id !== undefined){ 
            if(this.props.data.ticketDetail.id === undefined){
                this.ticketdataController.saveCurrentEmptyTicket({ticketDetail: this.props.data.ticketDetail, ticketowner: this.props.data.ticketowner, isDelete:1}).then(r=>{
                    this.calculateTotal();
                })
            }
            else{
                this.calculateTotal()
            }
        }
        else{
            console.log("ELSE CONDITION")
            this.createCurrentTicket();
        }
    }

    componentDidMount(){ 
        console.log(this.props)
    }
    
    calculateTotal(){   
        var services = [];
        services.push(Object.assign({}, this.props.data.selectedRowService));
        var input = {
            ticketowner: this.props.data.ticketowner,
            ticketDetail: this.state.tickettoTransfer,
            services_taken : services, 
            subTotal: this.state.tickettoTransfer.subtotal,
            taxAmount :this.state.tickettoTransfer.total_tax,
            discountAmount:this.state.tickettoTransfer.discounts,
            grandTotal: this.state.tickettoTransfer.grand_total
        } 
        
        input["subTotal"] = Number(input["subTotal"]) + Number(this.props.data.selectedRowService.subtotal);
        input["taxAmount"] = Number(input["taxAmount"]) + Number(this.props.data.selectedRowService.taxamount);
        input["discountAmount"] = Number(input["discountAmount"]) + Number(this.props.data.selectedRowService.discountamount);
        input["grandTotal"] =  input["subTotal"] +  input["taxAmount"]  -  input["discountAmount"];
        if(this.props.data.selectedRowService.serviceref_id !== undefined ){
            this.ticketdataController.updateTransferedService({id: this.props.data.selectedRowService.serviceref_id}).then(r=>{ 
                console.log(input, this.props.data.selectedRowService.serviceref_id);
                this.ticketdataController.saveTransferUpdateTicket(input).then(r=>{
                    this.setState({confirmtransfer: false, transferAlert: false}, ()=>{
                        this.props.data.closeCompletionTransfer(this.state.tickettoTransfer);
                    })
                })
            })
        }
        else{
            this.ticketdataController.saveTransferUpdateTicket(input).then(r=>{
                this.setState({confirmtransfer: false, transferAlert: false}, ()=>{
                    this.props.data.closeCompletionTransfer(this.state.tickettoTransfer);
                })
            })
        }

    }   

    createCurrentTicket(){
        var input = {ticketDetail: this.props.data.ticketDetail, ticketowner: this.props.data.ticketowner}
        if(this.props.data.services_taken.length === 1){
            input.isDelete =1
        }
        else{ 
            input.isDelete =0
        }
        this.ticketdataController.saveEmptyTicket(input).then(res=>{
            this.setState({tickettoTransfer: res}, ()=>{
                this.calculateTotal()
            });
        });
    }

    handleCloseTransferAlert(){
        this.setState({transferAlert: false, confirmtransfer: false})
    }

    onTransfer(tickettoTransfer){   
        this.setState({tickettoTransfer: tickettoTransfer}, ()=>{
            if(this.props.data.services_taken.length === 1){
                this.setState({transferAlert: true, isLoading: false})
            }
            else{   
                this.setState({confirmtransfer: true})
            }
        });
    }

    render(){
        return <>      
            {this.props.data.selectedRowService!== undefined && <div className="modalbox">
                <div className='modal_backdrop'>
                </div>
                <div className='modal_container xl_modal'> 
                    <ModalTitleBar onClose={()=>{this.props.data.closeTransfer()}} title={this.props.data.selectedRowService.servicedetail.name}/>  
                    <Grid item xs={12} style={{padding:10, height: '80%'}}> 
                        <div style={{marginRight: 20,width: '100%', textAlign: 'right', float: 'right'}}>
                            <Button style={{marginRight: 10}} onClick={()=>this.createNewTicketWithTransfer()} color="secondary" variant="contained">Create New Ticket</Button>
                        </div> 
                        <OpentTicketsComponent data={{
                            ticketDetail: this.props.data.ticketDetail,
                            onTransfer: (row)=>{
                                this.onTransfer(row)
                            }
                        }} />
                    </Grid>
                </div>
            </div> }


           {this.state.transferAlert && <div className="modalbox">
                <div className='modal_backdrop'>
                </div>
                <div className='modal_container ' style={{height:'180px', width:'500px'}}> 
                    <ModalTitleBar onClose={()=>{this.props.data.closeTransfer()}} title={this.props.data.selectedRowService.servicedetail.name}/>  
                        <Grid item xs={12} style={{display:'flex',marginTop:10}}>
                            <Typography id="modal-modal-title" variant="subtitle2" component="h2" align="left" style={{marginLeft:20}}>Transfering this service will void the existing ticket (TID - # {this.props.data.ticketDetail.ticket_code}) ? </Typography>
                        </Grid>
                        <Grid item xs={12} style={{display:'flex',marginTop:10}}>
                            <Grid item xs={8}></Grid>
                            <Grid item xs={4} style={{display: 'flex'}}> 
                                <Button style={{marginRight: 10}} onClick={()=>this.handleTransferAlert()} color="secondary" variant="contained">Yes</Button>
                                <Button onClick={()=>this.handleCloseTransferAlert()} color="secondary" variant="outlined">No</Button>
                            </Grid> 
                        </Grid>
                </div>
            </div> }

            

           {this.state.confirmtransfer && <div className="modalbox">
                <div className='modal_backdrop'>
                </div>
                <div className='modal_container ' style={{height:'180px', width:'500px'}}> 
                    <ModalTitleBar onClose={()=>{this.props.data.closeTransfer()}} title={this.props.data.selectedRowService.servicedetail.name}/>  
                        <Grid item xs={12} style={{display:'flex',marginTop:10}}>
                            <Typography id="modal-modal-title" variant="subtitle2" component="h2" align="left" style={{marginLeft:20}}>Are you sure to transfer this service to this ticket (TID - # {this.state.tickettoTransfer.ticket_code}) ? </Typography>
                        </Grid>
                        <Grid item xs={12} style={{display:'flex',marginTop:10}}>
                            <Grid item xs={8}></Grid>
                            <Grid item xs={4} style={{display: 'flex'}}> 
                                <Button style={{marginRight: 10}} onClick={()=>this.handleTransferAlert()} color="secondary" variant="contained">Yes</Button>
                                <Button onClick={()=>this.handleCloseTransferAlert()} color="secondary" variant="outlined">No</Button>
                            </Grid> 
                        </Grid>
                </div>
            </div> }
            
            {this.state.isLoading && <LoadingModal />}
        </>
    }
}