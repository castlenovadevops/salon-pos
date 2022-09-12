import React from 'react';
import { Grid, Button} from '@material-ui/core/';  
import VoidModal from '../voidticket';
import './css/topbar.css'; 
import TicketDataController from '../../../../controller/TicketDataController';
import TicketTipsModal from '../TicketTips';
import PaymentModal from '../TicketPayment';
import NotesModal from '../notes';

export default class TicketFooterComponent extends React.Component{
    ticketDataController = new TicketDataController();
    constructor(props){
        super(props);  
        this.state = {
            voidalertOpen: false,
            addTips_popup: false,
            addNotes_popup : false,
            notes:'',
            notesupdate: false
        }

        this.voidTicket = this.voidTicket.bind(this);
        this.handleCloseVoidAlert = this.handleCloseVoidAlert.bind(this);
        this.addTips = this.addTips.bind(this)
        this.handleCloseAddTips = this.handleCloseAddTips.bind(this);
        this.handleCloseTips = this.handleCloseTips.bind(this);
        this.handleTicketPayment = this.handleTicketPayment.bind(this);
        this.addNotes = this.addNotes.bind(this);
        this.handleCloseAddNotes = this.handleCloseAddNotes.bind(this);
        this.saveNotes= this.saveNotes.bind(this);
    }    

    componentDidMount(){
        if(this.props.data.ticketDetail !== undefined){
            this.setState({notes: this.props.data.ticketDetail.notes, notesupdate: false})
        }
    }

    

    static getDerivedStateFromProps(nextProps, prevState){ 
        if(nextProps.data.ticketDetail.notes!==prevState.notes && !prevState.notesupdate ){
            return { notes: nextProps.data.ticketDetail.notes};
        }
        else return null;
     }
 

    handlechangeNotes(e){
        ////////console.log"handlechangeNotes",e)
        this.setState( {notes: e, notesupdate: true})
    }

    saveNotes() {
        this.props.data.saveNotes(this.state.notes);
        this.handleCloseAddNotes();
    }

    addNotes(){
        this.setState( {addNotes_popup: true})
    }
    handleCloseAddNotes(){
        this.setState( {addNotes_popup: false})
    }

    addTips(){
        this.setState( {addTips_popup: true})
    }
    handleCloseAddTips(){
        this.setState( {addTips_popup: false})
    }
    
    voidTicket(){
        this.setState({voidalertOpen : true})
    }
    handleCloseVoidAlert(){
        this.setState({voidalertOpen : false})
    }
    updateVoidTicket(){
        if(this.props.data.isTicketEdit){
            var update_input = { 
                isDelete: 1,
                updated_at:  this.ticketDataController.getDate(),
                updated_by: this.ticketDataController.getUserId(),
                sync_id:this.props.data.ticketDetail.sync_id
            }
             
                this.ticketDataController.updateTicketData({table_name:'ticket', data: update_input, query_field:"sync_id", query_value:this.props.data.ticketDetail.sync_id}).then(res=>{
                ////////console.log"delete")
                this.handleCloseVoidAlert();
                ////console.log("2.afterFinished")
                this.props.data.closeTicket();
            })
           
        } 
        else {
            this.props.data.closeTicket();
        }
    }

    handleCloseTips(msg, tipsInput){ 
        this.props.data.handleCloseTips(msg, tipsInput)

        this.setState({addTips_popup: false});
    }

    handleTicketPayment(){ 
        this.props.data.setLoader(true);
       if(this.props.data.isTicketEdit){
           var detail = Object.assign({}, this.props.data.ticketDetail);
           detail["ticketref_id"] = detail.sync_id;
           this.props.data.saveTicket()  
                this.setState({openPayment:true,ticketDetail:detail})
                this.props.data.setLoader(false);
             
       }
       else{
            this.props.data.saveTicket()  
            this.setState({openPayment:true,ticketDetail:detail})
            this.props.data.setLoader(false); 
       }
    }


    handleClosePayment(msg){
        if(msg !== ''){
            this.props.data.closeTicket();
        }
        else{
            this.setState({openPayment: false})
        }
    }

    render(){
        return <> 
            <div style={{ marginLeft: 0}}>
                {!this.props.data.isTicketEdit && <div>
                    <Grid item xs={12} style={{display:'flex'}}>
                        <Grid item xs={5} className="footerbtn">
                            <Grid item xs={12} style={{display:'flex'}}  className='nobottomborder'>
                                <Grid xs={3}>
                                    <Button disabled={this.props.data.isDisabled || this.props.data.services_taken.length === 0} fullWidth  onClick={()=>this.voidTicket()} variant="outlined">Void</Button> 
                                </Grid>
                                <Grid xs={5}>
                                    <Button disabled={this.props.data.isDisabled || this.props.data.services_taken.length === 0} onClick={()=>{ 
                                    this.getOpenTicketsCombine() 
                                    }} fullWidth variant="outlined">
                                        Combine
                                    </Button> 
                                </Grid>
                                <Grid xs={4}>
                                    <Button style={{borderRadius: 0}} onClick={()=>this.addTips()} fullWidth variant="outlined" disabled={this.props.data.isDisabled || this.props.data.services_taken.length === 0}>
                                        Tips
                                    </Button> 
                                </Grid>
                            </Grid>
                            <Grid item xs={12} style={{display:'flex'}}>
                                <Grid xs={3}>
                                    <Button onClick={()=>{
                                        if(this.props.data.ticketDetail.paid_status === 'paid')
                                        {this.props.data.showCloseTicketPrint();} 
                                        else{this.props.data.printTicket('bill')}
                                        }}  disabled={  this.props.data.services_taken.length === 0} fullWidth variant="outlined">
                                        Print
                                    </Button> 
                                </Grid>
                                <Grid xs={5}>
                                    <Button onClick={()=>this.addDiscounts()} fullWidth variant="outlined"  disabled={this.props.data.isDisabled || this.props.data.services_taken.length === 0}>
                                        Discount
                                    </Button> 
                                </Grid> 
                                <Grid xs={4}>
                                    <Button disabled={this.props.data.isDisabled || this.props.data.services_taken.length === 0} onClick={()=>this.addNotes()} fullWidth variant="outlined" >
                                        Notes
                                    </Button> 
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={7}>
                            
                            <Grid item xs={12} style={{display:'flex',height:'100%'}}> 
                                <Grid xs={6}>
                                    <Button style={{background:'#134163'}} className="ticketfooterbtn" onClick={()=>this.props.data.saveTicket('close')} disabled={this.props.data.isDisabled || this.props.data.services_taken.length === 0} color="secondary" fullWidth variant="contained"> 
                                        {this.props.data.isTicketEditEdit ? 'Update' : 'Save' } 
                                    </Button>
                                </Grid>
                                <Grid xs={6}>
                                    <Button className='ticketfooterbtn' onClick={()=>this.handleTicketPayment()} disabled={this.props.data.isDisabled || this.props.data.services_taken.length === 0} fullWidth variant="outlined">
                                        Pay
                                    </Button> 
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </div>}

                {this.props.data.isTicketEdit && <div>
                        <Grid item xs={12} style={{display:'flex'}}>
                            <Grid item xs={5} className="footerbtn" >
                                <Grid item xs={12} style={{display:'flex'}} className='nobottomborder'>
                                    <Grid xs={3}><Button fullWidth onClick={()=>this.voidTicket()} variant="outlined" disabled={this.props.data.isDisabled}>Void</Button> </Grid>
                                    <Grid xs={5}><Button fullWidth disabled={this.props.data.isDisabled || this.props.data.services_taken.length === 0}  onClick={()=>{ 
                                            this.getOpenTicketsCombine()  
                                    }} variant="outlined">Combine</Button> </Grid>
                                    <Grid xs={4}><Button disabled={this.props.data.isDisabled || this.props.data.services_taken.length === 0} fullWidth variant="outlined" onClick={()=>this.handleTicketPayment()} >Close</Button> </Grid>
                                </Grid>
                                <Grid item xs={12} style={{display:'flex'}}>
                                    <Grid xs={3}><Button onClick={()=>{
                                        if(this.props.data.ticketDetail.paid_status === 'paid')
                                        {this.props.data.showCloseTicketPrint();} 
                                        else{this.props.data.printTicket('bill')}
                                        }} disabled={  this.props.data.services_taken.length === 0} fullWidth variant="outlined">Print</Button> </Grid>
                                    <Grid xs={5}><Button onClick={()=>this.addDiscounts()} fullWidth variant="outlined" disabled={this.props.data.isDisabled  || this.props.data.services_taken.length === 0 ? true: (this.state.tipsdiscountEnabled) ? true: false}
                                    >Discount</Button> </Grid>
                                    <Grid xs={4}><Button onClick={()=>this.addNotes()} fullWidth variant="outlined" disabled={this.props.data.isDisabled  || this.props.data.services_taken.length === 0}>Notes</Button> </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={7} style={{border:'2px solid #f0f0f0'}}>
                                <Grid item xs={12} style={{display:'flex',height:'100%'}}>
                                    <Grid xs={4}>
                                        <Button style={{height:'100%', borderRadius:0}} disabled={this.props.data.isDisabled? false: (this.state.tipsdiscountEnabled) ? true: false || this.props.data.services_taken.length === 0} onClick={()=>this.addTips()} fullWidth variant="outlined">Tips</Button> 
                                    </Grid>
                                
                                    <Grid xs={4}>
                                        <Button style={{height:'100%', borderRadius:0}} onClick={()=>this.props.data.saveTicket('close')} disabled={this.props.data.isDisabled || this.props.data.services_taken.length === 0} color="secondary" fullWidth variant="contained"> Save </Button>
                                    </Grid>
                                    <Grid xs={4}>
                                        <Button style={{height:'100%', borderRadius:0}} onClick={()=>this.handleTicketPayment()} disabled={this.props.data.isDisabled  || this.props.data.services_taken.length === 0} fullWidth variant="outlined">Pay</Button> 
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>

                    </div>}
            </div> 
            
            {this.state.voidalertOpen && <VoidModal handleCloseVoidAlert={() => this.handleCloseVoidAlert()} updateVoidTicket={()=>this.updateVoidTicket()} 
            title="Alert" msg="Are You Sure To Void This Ticket ?"/> }  
            
            
            {/* Tips popup */}
            {this.state.addTips_popup &&
                <TicketTipsModal handleCloseAddTips={()=>this.handleCloseAddTips()} 
                employee_list={this.props.data.employee_list} afterSubmitTips={(msg,tipsInput)=>{this.handleCloseTips(msg,tipsInput); }} 
                service_selected={this.props.data.services_taken} total_tips={this.props.data.ticketDetail.tips_totalamt || 0} tips_percent={this.props.data.ticketDetail.tips_percent || 0} tips_type={this.props.data.ticketDetail.tips_type || 'equal'}/>
            }


            {/* Payment Popup */}
            {this.state.openPayment && <PaymentModal  
                handleClosePayment={(msg)=>this.handleClosePayment(msg)} ticketDetail={this.props.data.ticketDetail}>
                    
                </PaymentModal>}

            {/* Notes popup */}
            {this.state.addNotes_popup &&
                <NotesModal handleCloseAddNotes={()=>this.handleCloseAddNotes()} notes={this.state.notes} handlechangeNotes={(e)=>this.handlechangeNotes(e)} saveNotes={()=>this.saveNotes()}/>
            }

        </>
    }
}