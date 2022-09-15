import React from 'react';
import { Grid, Typography, Button} from '@material-ui/core/';   
import ModalTitleBar from '../../../../components/Modal/Titlebar';  
import LoadingModal from '../../../../components/Modal/loadingmodal';
import { QueryFunctions } from './functions';
import OpentTicketsComponent from './opentickets';
import TicketServiceController from '../../../../controller/TicketServiceController';

export default class TransferServiceComponent extends React.Component{
    queryManager = new QueryFunctions();
    ticketServiceController = new TicketServiceController();
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
            if(this.props.data.ticketDetail.isDraft === 0){ 
                this.createCurrentTicket();
            }
            else{  
                this.updateExistingTickets(); 
            }
        }
        else{
            console.log("ELSE CONDITION")
            this.createCurrentTicket();
        }
    }

    updateExistingTickets(){
        var thisobj = this;
        if(this.state.tickettoTransfer.id !== undefined){  
            var transferticketprice = { 
               subTotal:  Number(this.props.data.selectedRowService.subtotal)+Number(this.state.tickettoTransfer.subtotal),
               taxAmount:  Number(this.props.data.selectedRowService.taxamount)+Number(this.state.tickettoTransfer.total_tax),
               discountAmount:   Number(this.props.data.selectedRowService.discountamount)+Number(this.state.tickettoTransfer.discounts),
               tipsAmount:   Number(this.props.data.selectedRowService.tips_amount)+Number(this.state.tickettoTransfer.total_tax),
               grandTotal:   Number(this.props.data.selectedRowService.subtotal)+Number(this.props.data.selectedRowService.taxamount)+Number(this.props.data.selectedRowService.tips_amount)+Number(this.state.tickettoTransfer.grand_total),
               ticketDiscount: {
                   discount_id: this.state.tickettoTransfer.discount_id,
                   discount_type: this.state.tickettoTransfer.discount_type,
                   discount_value: this.state.tickettoTransfer.discount_value,
                   discount_amt : this.state.tickettoTransfer.discount_totalamt
               },
               tipsType:this.state.tickettoTransfer.tips_type,
               tipsPercent: this.state.tickettoTransfer.tips_percent,
            }

            var input = {
               ticketDetail: Object.assign({}, this.state.tickettoTransfer), 
               ticketowner: this.props.data.ticketowner,
               customer_detail: this.props.data.customer_detail,
               price: transferticketprice,
               services_taken : this.props.data.services_taken, 
           } 
           
           var existticket = { 
            ticketDetail: Object.assign({}, this.props.data.ticketDetail), 
            ticketowner: this.props.data.ticketowner,
            customer_detail: this.props.data.customer_detail,
            price: transferticketprice, 
           }

           
            if(this.props.data.services_taken.length === 1){
                existticket.ticketDetail.isDelete =1
            }
            else{ 
                existticket.ticketDetail.isDelete =0
            } 
            this.ticketServiceController.updateExistingToTransferTicket(existticket).then(r=>{
                this.ticketServiceController.updateExistingToTransferTicket(input).then(r=>{
                input["ticketref_id"] = thisobj.state.tickettoTransfer.sync_id;
                
                console.log("CHECK SERTVICE ID CONDITION", input)
                if(thisobj.props.data.services_taken.length === 1){ 
                    console.log("IF ELSE SERTVICE ID CONDITION")
                    thisobj.ticketServiceController.saveTicketServices(input).then(r=>{
                        thisobj.props.data.closeCompletionTransfer(this.state.tickettoTransfer);
                    });
                }
                else{
                    if(thisobj.props.data.ticketDetail.isDraft === 0){  
                        var existinput = {
                            ticketDetail: Object.assign({}, thisobj.props.data.ticketDetail), 
                            ticketowner: this.props.data.ticketowner,
                            customer_detail: this.props.data.customer_detail,
                            price: transferticketprice,
                            services_taken : [], 
                            ticketref_id: thisobj.props.data.ticketDetail.sync_id
                        }  
                        this.props.data.services_taken.forEach((row, idx)=>{
                            console.log(idx, this.props.data.selectedRowServiceIndex)
                            if( idx !== this.props.data.selectedRowServiceIndex){
                                existinput.services_taken.push(row)
                            }
                            if(idx === this.props.data.services_taken.length-1){
                                console.log(existinput)
                                this.ticketServiceController.saveTicketServices(existinput).then(r=>{
                                    this.continueTransfer(input)
                                })
                            }
                        })

                    }
                    else{
                        this.continueTransfer(input);
                    }
                }
                })
            });
        }
        else{
            window.api.getTicketCode().then(res=>{ 
                console.log(res)
                if(res.ticketid !== ''){
                    var ticket_code = String(res.ticketid).padStart(4, '0');
                    window.api.getSyncUniqueId().then(sync=>{
                        var syncid = sync.syncid;
                        
                        var ticketDetail = Object.assign({}, thisobj.props.data.ticketDetail);
                        ticketDetail.ticket_code = ticket_code;
                        ticketDetail.sync_id = syncid;
                        ticketDetail.sync_status = 0;
                        this.setState({tickettoTransfer: ticketDetail}, ()=>{
                                this.TransferToNewTicket();
                        });
                    });
                } 
            }); 
        }
    } 

    createCurrentTicket(){
        var thisobj = this;
        var input = {
            ticketDetail: this.props.data.ticketDetail, 
            ticketowner: this.props.data.ticketowner,
            customer_detail: this.props.data.customer_detail,
            price: this.props.data.price
        }
        if(this.props.data.services_taken.length === 1){
            input.ticketDetail.isDelete =1
        }
        else{ 
            input.ticketDetail.isDelete =0
        } 
        this.ticketServiceController.saveNewVoidTransferredTicket(input).then(r=>{ 
            if(this.state.tickettoTransfer.id !== undefined){  
                 var transferticketprice = { 
                    subTotal:  Number(this.props.data.selectedRowService.subtotal)+Number(this.state.tickettoTransfer.subtotal),
                    taxAmount:  Number(this.props.data.selectedRowService.taxamount)+Number(this.state.tickettoTransfer.total_tax),
                    discountAmount:   Number(this.props.data.selectedRowService.discountamount)+Number(this.state.tickettoTransfer.discounts),
                    tipsAmount:   Number(this.props.data.selectedRowService.tips_amount)+Number(this.state.tickettoTransfer.total_tax),
                    grandTotal:   Number(this.props.data.selectedRowService.subtotal)+Number(this.props.data.selectedRowService.taxamount)+Number(this.props.data.selectedRowService.tips_amount)+Number(this.state.tickettoTransfer.grand_total),
                    ticketDiscount: {
                        discount_id: this.state.tickettoTransfer.discount_id,
                        discount_type: this.state.tickettoTransfer.discount_type,
                        discount_value: this.state.tickettoTransfer.discount_value,
                        discount_amt : this.state.tickettoTransfer.discount_totalamt
                    },
                    tipsType:this.state.tickettoTransfer.tips_type,
                    tipsPercent: this.state.tickettoTransfer.tips_percent,
                 }

                 var input = {
                    ticketDetail: Object.assign({}, this.state.tickettoTransfer), 
                    ticketowner: this.props.data.ticketowner,
                    customer_detail: this.props.data.customer_detail,
                    price: transferticketprice,
                    services_taken : this.props.data.services_taken, 
                }  
                 this.ticketServiceController.updateExistingToTransferTicket(input).then(r=>{
                    input["ticketref_id"] = thisobj.state.tickettoTransfer.sync_id;
                    
                    console.log("CHECK SERTVICE ID CONDITION")
                    if(thisobj.props.data.services_taken.length === 1){ 
                        console.log("IF ELSE SERTVICE ID CONDITION")
                        thisobj.ticketServiceController.saveTicketServices(input).then(r=>{
                            thisobj.props.data.closeCompletionTransfer(this.state.tickettoTransfer);
                        });
                    }
                    else{
                        if(thisobj.props.data.ticketDetail.isDraft === 0){  
                            var existinput = {
                                ticketDetail: Object.assign({}, thisobj.props.data.ticketDetail), 
                                ticketowner: this.props.data.ticketowner,
                                customer_detail: this.props.data.customer_detail,
                                price: transferticketprice,
                                services_taken : [], 
                                ticketref_id: thisobj.props.data.ticketDetail.sync_id
                            }  
                            this.props.data.services_taken.forEach((row, idx)=>{
                                console.log(idx, this.props.data.selectedRowServiceIndex)
                                if( idx !== this.props.data.selectedRowServiceIndex){
                                    existinput.services_taken.push(row)
                                }
                                if(idx === this.props.data.services_taken.length-1){
                                    console.log(existinput)
                                    this.ticketServiceController.saveTicketServices(existinput).then(r=>{
                                        this.continueTransfer(input)
                                    })
                                }
                            })

                        }
                        else{
                            this.continueTransfer(input);
                        }
                    }
                 })
            }
            else{
                window.api.getTicketCode().then(res=>{
                    if(res.ticketid !== ''){
                        var ticket_code = String(res.ticketid).padStart(4, '0');
                        window.api.getSyncUniqueId().then(sync=>{
                            var syncid = sync.syncid;
                            
                            var ticketDetail = Object.assign({}, thisobj.props.data.ticketDetail);
                            ticketDetail.ticket_code = ticket_code;
                            ticketDetail.sync_id = syncid;
                            ticketDetail.id = syncid;
                            ticketDetail.ticketref_id = syncid;
                            ticketDetail.sync_status = 0;
                            console.log("NEW TICKET CREATIONG ") 
                            console.log(ticketDetail)
                            this.setState({tickettoTransfer: ticketDetail, ticketref_id: syncid}, ()=>{ 
                                    this.TransferToNewTicket();
                            });
                        });
                    } 
                }); 
            }
        }); 
    }


    continueTransfer(input){
        var thisobj = this;
        console.log("CONTINUE TRANSFER START", input);
        if((input.ticketDetail.isDraft === 1 || input.ticketDetail.isDraft === undefined) && thisobj.props.data.selectedRowService.serviceref_id !== undefined && thisobj.props.data.selectedRowService.serviceref_id !==''){
            thisobj.ticketServiceController.updateTicketServiceToNewTicket({
                table_name:'ticket_services',
                ticketref_id: input.ticketref_id,
                query_value: thisobj.props.data.selectedRowService.serviceref_id ,
                query_field:'sync_id',
                data:{ticketref_id: input.ticketref_id} 
            }).then(r=>{
                console.log("TAX UPDATEING") 
                thisobj.ticketServiceController.updateTicketServiceToNewTicket({
                    table_name:'ticketservice_taxes',
                    ticketref_id: input.ticketref_id,
                    query_value: thisobj.props.data.selectedRowService.serviceref_id ,
                    query_field:'serviceref_id',
                    data:{ticketref_id: input.ticketref_id} 
                }).then(r=>{
                    console.log("NOTES UPDATEING") 
                    thisobj.ticketServiceController.updateTicketServiceToNewTicket({
                        table_name:'ticketservice_requestnotes',
                        ticketref_id: input.ticketref_id,
                        query_value: thisobj.props.data.selectedRowService.serviceref_id ,
                        query_field:'serviceref_id',
                        data:{ticketref_id: input.ticketref_id} 
                    }).then(r=>{
                        console.log("COMMISSIOn UPDATEING") 
                        thisobj.ticketServiceController.updateTicketServiceCommissionToNewTicket({
                            table_name:'employee_commission_detail',
                            ticketref_id: input.ticketref_id,
                            employeeId: thisobj.props.data.selectedRowService.employee_id,
                            query_value: thisobj.props.data.selectedRowService.serviceref_id ,
                            query_field:'ticketserviceref_id',
                            data:{ticketref_id: input.ticketref_id} 
                        }).then(r=>{ 
                            thisobj.props.data.closeCompletionTransfer(thisobj.props.data.ticketDetail);
                        })
                    })
                })
            })
        }
        else{ 
            input.services_taken= []
            input.services_taken.push(thisobj.props.data.selectedRowService)
            console.log("CONTINUE TRANSFER", input);
            thisobj.ticketServiceController.saveTicketServices(input).then(r=>{
                thisobj.props.data.spliceService();
            })
        }
    }

    TransferToNewTicket(){
        console.log("TRANSFER NEW TICKET")
        var thisobj  = this;
        var ticketDetail = Object.assign({}, this.state.tickettoTransfer);
        ticketDetail.isDelete = 0 
        var transferticketprice = { 
            subTotal:  Number(this.props.data.selectedRowService.subtotal),
            taxAmount:  Number(this.props.data.selectedRowService.taxamount),
            discountAmount:   Number(this.props.data.selectedRowService.discountamount),
            tipsAmount:   Number(this.props.data.selectedRowService.tips_amount),
            grandTotal:   Number(this.props.data.selectedRowService.subtotal)+Number(this.props.data.selectedRowService.taxamount)+Number(this.props.data.selectedRowService.tips_amount),
            ticketDiscount: {
                discount_id: this.state.tickettoTransfer.discount_id || '',
                discount_type: this.state.tickettoTransfer.discount_type||'',
                discount_value: this.state.tickettoTransfer.discount_value||'',
                discount_amt : this.state.tickettoTransfer.discount_totalamt||0
            },
            tipsType:this.state.tickettoTransfer.tips_type || '',
            tipsPercent: this.state.tipsPercent || '',
         }
        var input = {
            ticketDetail: ticketDetail, 
            ticketowner: this.props.data.ticketowner,
            customer_detail: this.props.data.customer_detail,
            price: transferticketprice,
            ticketref_id: ticketDetail.sync_id
        } 
        this.ticketServiceController.SaveTransferToNewTicket(input).then(r=>{ 

            var serviceinput = {
                ticketref_id: this.state.tickettoTransfer.sync_id,
                services_taken: this.props.data.services_taken,
                ticketDetail: this.state.tickettoTransfer
            }
            if(thisobj.props.data.services_taken.length === 1){ 
                console.log("IF ELSE SERTVICE ID CONDITION")
                this.ticketServiceController.saveTicketServices(serviceinput).then(r=>{
                    this.props.data.closeCompletionTransfer(this.state.tickettoTransfer)
                })
            }
            else{
                var existinput = {
                    ticketDetail: Object.assign({}, thisobj.props.data.ticketDetail), 
                    ticketowner: this.props.data.ticketowner,
                    customer_detail: this.props.data.customer_detail,
                    price: transferticketprice,
                    services_taken : [], 
                    ticketref_id: thisobj.props.data.ticketDetail.sync_id
                }  
                this.props.data.services_taken.forEach((row, idx)=>{
                    console.log(idx, this.props.data.selectedRowServiceIndex)
                    if( idx !== this.props.data.selectedRowServiceIndex){
                        existinput.services_taken.push(row)
                    }
                    if(idx === this.props.data.services_taken.length-1){
                        console.log(existinput)
                        this.ticketServiceController.saveTicketServices(existinput).then(r=>{
                           this.continueTransfer(input);
                        })
                    }
                })
            }
        })
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