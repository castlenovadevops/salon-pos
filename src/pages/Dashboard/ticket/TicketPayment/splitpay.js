import React from 'react';   
import {Grid,  Typography, Button } from '@material-ui/core/'; 
import PaymentController from '../../../../controller/paymentController';
import CreditCard from '@mui/icons-material/CreditCard';
import Currency from '@mui/icons-material/LocalAtm';
import ModalTitleBar from '../../../../components/Modal/Titlebar';
import TextareaAutosizeContent from '../../../../components/formComponents/TextAreaAutosize';

import './tab.css'; 

export default class TicketSplitPayment extends React.Component  {
    paymentController = new PaymentController();

    constructor(props){
        super(props);
        this.state={
            payamount:'',
            noofsplits:1
        } 
    }

    splitAmount(n){
        this.props.data.onselectedWays(Number(this.props.data.ticketDetail.ticketPendingAmount)/n);

    }

    render(){
        return <div style={{width:'100%', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column'}}>
                <Grid item xs={12} style={{display:'flex',marginTop:10, width:'80%'}}>
                    <Grid item xs={4}></Grid>
                    <Grid item xs={4} style={{display: 'flex', justifyContent:'center', alignItems:'center', flexDirection:'column'}}>  
                        <Typography  id="modal-modal-title" variant="subtitle"  style={{"color":'#000', fontWeight:'700'}} align="left">Full Amount</Typography>
                        <Typography  id="modal-modal-title" variant="h5"  style={{"color":'#000', fontWeight:'700'}} align="left">${Number(this.props.data.ticketDetail.ticketPendingAmount).toFixed(2)}</Typography>
                    </Grid>
                    <Grid item xs={4}></Grid>
                </Grid>

                
                <Grid item xs={12} style={{display:'flex',marginTop:10, width:'80%'}}>
                    <Grid item xs={4}>
                        <Typography  onClick={()=>{
                            this.splitAmount(1);
                        }}  id="modal-modal-title" variant="subtitle"  style={{display:'flex', alignItems:'center', justifyContent:'center',"color":'#fff', fontWeight:'700', width:'200px', height:'70px', background:'#134163', margin:10,borderRadius:10, cursor:'pointer'}} align="left">
                            Full Amount
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>  
                        <Typography onClick={()=>{
                            this.splitAmount(2);
                        }} id="modal-modal-title" variant="subtitle"  style={{display:'flex', alignItems:'center', justifyContent:'center',"color":'#000', fontWeight:'700', width:'200px', height:'70px', border:'1px solid #134163', margin:10,borderRadius:10, cursor:'pointer'}} align="left">
                            2 Ways
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography onClick={()=>{
                            this.splitAmount(3);
                        }}  id="modal-modal-title" variant="subtitle"  style={{display:'flex', alignItems:'center', justifyContent:'center',"color":'#000', fontWeight:'700', width:'200px', height:'70px', border:'1px solid #134163', margin:10,borderRadius:10, cursor:'pointer'}} align="left">
                           3 Ways
                        </Typography>
                    </Grid>
                </Grid>
                <Grid item xs={12} style={{display:'flex',marginTop:10, width:'80%'}}>
                    <Grid item xs={4}>
                        <Typography  onClick={()=>{
                            this.splitAmount(4);
                        }} id="modal-modal-title" variant="subtitle"  style={{display:'flex', alignItems:'center', justifyContent:'center',"color":'#000', fontWeight:'700', width:'200px', height:'70px', border:'1px solid #134163', margin:10,borderRadius:10, cursor:'pointer'}} align="left">
                            4 Ways
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>  
                        <Typography  onClick={()=>{
                            this.splitAmount(5);
                        }}  id="modal-modal-title" variant="subtitle"  style={{display:'flex', alignItems:'center', justifyContent:'center',"color":'#000', fontWeight:'700', width:'200px', height:'70px', border:'1px solid #134163', margin:10,borderRadius:10, cursor:'pointer'}} align="left">
                            5 Ways
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography  onClick={()=>{
                            this.splitAmount(6);
                        }}  id="modal-modal-title" variant="subtitle"  style={{display:'flex', alignItems:'center', justifyContent:'center',"color":'#000', fontWeight:'700', width:'200px', height:'70px', border:'1px solid #134163', margin:10,borderRadius:10, cursor:'pointer'}} align="left">
                           6 Ways
                        </Typography>
                    </Grid>
                </Grid>
                <Grid item xs={12} style={{display:'flex',marginTop:10, width:'80%'}}>
                        <Typography  id="modal-modal-title" variant="subtitle"  style={{display:'flex', alignItems:'center', justifyContent:'center',"color":'#000', fontWeight:'700', width:'100%', height:'70px', border:'1px solid #134163', margin:10,borderRadius:10, cursor:'pointer'}} align="left">
                           Custom
                        </Typography>
                </Grid>

        </div>
    }
}