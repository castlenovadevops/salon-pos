import React from 'react';
import { Grid, Typography, Button} from '@material-ui/core/';   
import ModalTitleBar from '../../../../components/Modal/Titlebar';  
import LoadingModal from '../../../../components/Modal/loadingmodal';
import { QueryFunctions } from './functions';
import OpentTicketsComponent from './opentickets';
import TicketServiceController from '../../../../controller/TicketServiceController';

export default class CombineTicket extends React.Component{
    queryManager = new QueryFunctions();
    ticketServiceController = new TicketServiceController();
    constructor(props){
        super(props);  
        this.state = {  
            isLoading: false, 
            confirmCombine: false, 
            ticketToCombine: {}
        } 
 
        this.handleCloseTransferAlert = this.handleCloseTransferAlert.bind(this);
        this.handleTransferAlert = this.handleTransferAlert.bind(this);  
    }     
     
    handleTransferAlert(){
         this.combineTickets();
    }

    combineTickets(){
        var thisobj = this;
        
        var transferticketprice = { 
            subTotal:  Number(this.props.data.price.subTotal)+Number(this.state.ticketToCombine.subtotal),
            taxAmount:  Number(this.props.data.price.taxAmount)+Number(this.state.ticketToCombine.total_tax),
            discountAmount:   Number(this.props.data.price.discountAmount)+Number(this.state.ticketToCombine.discounts),
            tipsAmount:   Number(this.props.data.price.tipsAmount)+Number(this.state.ticketToCombine.tips_totalamt),
            grandTotal:   Number(this.props.data.price.subTotal)+Number(this.props.data.price.taxAmount)+Number(this.props.data.price.tipsAmount)+Number(this.state.ticketToCombine.grand_total),
            ticketDiscount: {
                discount_id: this.props.data.ticketDetail.discount_id,
                discount_type: this.props.data.ticketDetail.discount_type,
                discount_value: this.props.data.ticketDetail.discount_value,
                discount_amt : this.props.data.ticketDetail.discount_totalamt
            },
            tipsType:this.props.data.ticketDetail.tips_type,
            tipsPercent: this.props.data.ticketDetail.tips_percent,
         }
         
         var input = {
            ticketDetail: Object.assign({}, this.props.data.ticketDetail), 
            ticketowner: this.props.data.ticketowner,
            customer_detail: this.props.data.customer_detail,
            price: transferticketprice,
            services_taken : this.props.data.services_taken, 
            ticketDiscount: transferticketprice.ticketDiscount
        } 
        

        if(this.props.data.ticketDetail.isDraft === 1){   
            input.ticketref_id = input.ticketDetail.sync_id
            this.combineNewTicket(input);
        }
        else{ 
                    // this.TransferToNewTicket();
            this.ticketServiceController.saveTicket(input).then(r=>{
                input.ticketref_id = input.ticketDetail.sync_id
                this.ticketServiceController.saveTicketServices(input).then(r=>{
                    this.combineNewTicket(input);
                })
            }) 
        }
    }  
 
    combineNewTicket(input){
        var thisobj = this;
        console.log("CONTINUE COMBINE START", input);
        thisobj.ticketServiceController.updateTicketServiceToNewTicket({
            table_name:'ticket_services',
            ticketref_id: input.ticketref_id,
            query_value: this.state.ticketToCombine.id ,
            query_field:'ticketref_id',
            data:{ticketref_id: input.ticketref_id} 
        }).then(r=>{
            console.log("TAX UPDATEING") 
            thisobj.ticketServiceController.updateTicketServiceToNewTicket({
                table_name:'ticketservice_taxes',
                ticketref_id: input.ticketref_id,
                query_value: this.state.ticketToCombine.id ,
                query_field:'ticketref_id',
                data:{ticketref_id: input.ticketref_id} 
            }).then(r=>{
                console.log("NOTES UPDATEING") 
                thisobj.ticketServiceController.updateTicketServiceToNewTicket({
                    table_name:'ticketservice_requestnotes',
                    ticketref_id: input.ticketref_id,
                    query_value: this.state.ticketToCombine.id ,
                    query_field:'ticketref_id',
                    data:{ticketref_id: input.ticketref_id} 
                }).then(r=>{
                    console.log("COMMISSIOn UPDATEING") 
                    thisobj.ticketServiceController.updateTicketServiceToNewTicket({
                        table_name:'employee_commission_detail',
                        ticketref_id: input.ticketref_id, 
                        query_value: this.state.ticketToCombine.id ,
                        query_field:'ticketref_id',
                        data:{ticketref_id: input.ticketref_id} 
                    }).then(r=>{ 
                        this.ticketServiceController.deleteTicket( this.state.ticketToCombine.id ).then(r=>{
                            thisobj.props.data.closeCompletionCombine(thisobj.props.data.ticketDetail);
                        })
                    })
                })
            })
        }) 
    }
  
    handleCloseTransferAlert(){
        this.setState({  confirmCombine: false})
    }

    onCombine(ticketToCombine){   
        this.setState({ticketToCombine: ticketToCombine}, ()=>{ 
            this.setState({confirmCombine: true}) 
        });
    }

    render(){
        return <>      
           <div className="modalbox">
                <div className='modal_backdrop'>
                </div>
                <div className='modal_container xl_modal'> 
                    <ModalTitleBar onClose={()=>{this.props.data.closeCombine()}} title={'Combine Ticket'}/>  
                    <Grid item xs={12} style={{padding:10, height: '80%'}}>  
                        <OpentTicketsComponent data={{
                            ticketDetail: this.props.data.ticketDetail,
                            onTransfer: (row)=>{
                                this.onCombine(row)
                            }
                        }} />
                    </Grid>
                </div>
            </div>  

           {this.state.confirmCombine && <div className="modalbox">
                <div className='modal_backdrop'>
                </div>
                <div className='modal_container ' style={{height:'180px', width:'500px'}}> 
                    <ModalTitleBar onClose={()=>{this.props.data.closeTransfer()}} title={'Confirmation'}/>  
                        <Grid item xs={12} style={{display:'flex',marginTop:10}}>
                            <Typography id="modal-modal-title" variant="subtitle2" component="h2" align="left" style={{marginLeft:20}}>Are you sure to combine  all the services from selected ticket (TID - # {this.state.ticketToCombine.ticket_code}) to this ticket (TID - # {this.props.data.ticketDetail.ticket_code}) ? </Typography>
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