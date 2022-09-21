import React from 'react';   
import {Grid,  Typography, Button } from '@material-ui/core/'; 
import PaymentController from '../../../../controller/paymentController';
import CreditCard from '@mui/icons-material/CreditCard';
import Currency from '@mui/icons-material/LocalAtm';
import ModalTitleBar from '../../../../components/Modal/Titlebar';
import TextareaAutosizeContent from '../../../../components/formComponents/TextAreaAutosize';

import './tab.css'; 

export default class TicketFullPayment extends React.Component  {
    paymentController = new PaymentController();

    constructor(props){
        super(props);
        this.state={
            notesPopup: false,
            description: '', 
            card_type:''
        }
        this.handlechangeDesc = this.handlechangeDesc.bind(this)
    }


    handlechangeDesc(e){
        this.setState({description: e.target.value})
    }
    componentDidMount(){ 
    }

    renderNotes(){
        return  <div className="modalbox">
            <div className='modal_backdrop'>
            </div>
            <div className='modal_container' style={{height:'400px', width:'600px'}}> 
                <ModalTitleBar onClose={()=> this.setState({notesPopup: false}) } title="Notes"/>  
                <Grid item xs={12} style={{display:'flex',margin :10}}>
                        <TextareaAutosizeContent 
                            fullWidth
                            label="Notes"
                            name="Notes"
                            id="Notes"
                            rows={3} 
                            multiline
                            value={this.state.description}
                            onChange={this.handlechangeDesc} 
                        />
                </Grid>
                <Grid item xs={12} style={{display:'flex',marginTop:10}}>
                    <Grid item xs={4}></Grid>
                    <Grid item xs={4} style={{display: 'flex', justifyContent:'center', alignItems:'center'}}> 
                        <Button style={{marginRight: 10}} onClick={()=>{
                            this.paymentController.savePayment(this.props.data.topayamount, this.props.data.ticketDetail, 'card', this.state.card_type, this.state.description).then(r=>{
                                this.setState({notesPopup: false}, ()=>{
                                    this.props.data.completePayment();
                                })
                            })
                        }} color="secondary" variant="contained">Save</Button> 
                    </Grid>
                    <Grid item xs={4}></Grid>
                </Grid>
            </div>
        </div>
    }

    renderCardMethods(){
        return <div style={{display:'flex', width:'100%', flexDirection:'column'}}>
            <div style={{display:'flex', width:'100%', flexDirection:'row'}}>
                <CreditCard/>&nbsp;
                <Typography  id="modal-modal-title" variant="subtitle"  style={{"color":'#000', fontWeight:'700'}} align="left">Card</Typography>
            </div>
            <div style={{display:'flex', width:'100%', flexDirection:'row', flexDirection:'row',borderBottom:'1px solid #f0f0f0', paddingBottom:'2rem'}}>
                <Typography  id="modal-modal-title" variant="subtitle"  style={{display:'flex', alignItems:'center', justifyContent:'center',"color":'#000', fontWeight:'700', width:'200px', height:'70px', border:'1px solid #134163',borderRadius:10, margin:10, cursor:'pointer'}} align="left" 
                onClick={()=>{
                    this.setState({card_type:'credit', notesPopup: true})
                }}>
                    Credit Card
                </Typography>
                <Typography  id="modal-modal-title" variant="subtitle"  style={{display:'flex', alignItems:'center', justifyContent:'center',"color":'#000', fontWeight:'700', width:'200px', height:'70px', border:'1px solid #134163', borderRadius:10,margin:10, cursor:'pointer'}} align="left"
                onClick={()=>{
                    this.setState({card_type:'debit', notesPopup: true})
                }}>
                    Debit Card
                </Typography>
            </div>  



            <div style={{display:'flex', width:'100%', flexDirection:'row', marginTop:'1rem'}}>
                <Currency/>&nbsp;
                <Typography  id="modal-modal-title" variant="subtitle"  style={{"color":'#000', fontWeight:'700'}} align="left">Cash</Typography>
            </div>
            <div style={{display:'flex', width:'100%', flexDirection:'row'}}>
                <Grid container spacing={2} >
                    <Grid item xs={3} style={{display:'flex'}}> 
                        <Typography  id="modal-modal-title" variant="subtitle"  style={{display:'flex', alignItems:'center', justifyContent:'center',"color":'#000', fontWeight:'700', width:'200px', height:'70px', border:'1px solid #134163', margin:10,borderRadius:10, cursor:'pointer'}} align="left">{Number(this.props.data.topayamount).toFixed(2)}</Typography>
                    </Grid> 

                    {Math.ceil(Number(this.props.data.topayamount)).toFixed(2) !==  Number(this.props.data.topayamount).toFixed(2) && <Grid item xs={3} style={{display:'flex'}}> 
                         <Typography  id="modal-modal-title" variant="subtitle"  style={{display:'flex', alignItems:'center', justifyContent:'center',"color":'#000', fontWeight:'700', width:'200px', height:'70px', border:'1px solid #134163', margin:10,borderRadius:10, cursor:'pointer'}} align="left">{Math.ceil(Number(this.props.data.topayamount)).toFixed(2)}</Typography> 
                    </Grid>}
                    
                
                    {this.paymentController.getPaymentValues(Math.ceil(Number(this.props.data.topayamount))).map(t=>{
                        return <Grid item xs={3} style={{display:'flex'}}>
                                    <Typography  id="modal-modal-title" variant="subtitle"  style={{display:'flex', alignItems:'center', justifyContent:'center',"color":'#000', fontWeight:'700', width:'200px', height:'70px', border:'1px solid #134163', margin:10,borderRadius:10, cursor:'pointer'}} align="left">{Number(t).toFixed(2)}</Typography>
                                </Grid>
                    })} 
                </Grid>
            </div> 
            <div style={{display:'flex', flexDirection:'row',borderBottom:'1px solid #f0f0f0', paddingBottom:'2rem'}}>
                <Grid container spacing={2} >
                    <Grid item xs={3} style={{display:'flex'}}> 
                        <Typography  id="modal-modal-title" variant="subtitle"  style={{display:'flex', alignItems:'center', justifyContent:'center',"color":'#000', fontWeight:'700', width:'100%', height:'70px', border:'1px solid #134163', margin:10,borderRadius:10, cursor:'pointer'}} align="left">Custom</Typography>
                    </Grid>
                    <Grid item xs={9} style={{display:'flex'}}> 
                        <Typography  id="modal-modal-title" variant="subtitle"  style={{display:'flex', alignItems:'center', justifyContent:'center',"color":'#000', fontWeight:'700', width:'100%', height:'70px', border:'1px solid #134163', margin:10,borderRadius:10, cursor:'pointer'}} align="left">Pay Cash</Typography>
                    </Grid>
                </Grid>
            </div>
        </div>
    }

    render(){
        return <div style={{display:'flex', width:'100%', flexDirection:'column'}}>
            {this.renderCardMethods()}

            {this.state.notesPopup && this.renderNotes()}
        </div>
    }
}