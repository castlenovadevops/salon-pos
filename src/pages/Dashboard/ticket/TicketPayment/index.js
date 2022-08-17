import React from 'react'; 
import TicketPayment from './payment';
import {  Modal, Grid} from '@material-ui/core/'; 
export default function PaymentModal(
    {
        open,
        onClose,
        handleClosePayment,
        ticketDetail

}) 

{
  return (
    
    // <Modal
    //     open={open}
    //     style={{outline:'none'}}
    //     onClose={onClose}
    //     aria-labelledby="modal-modal-title"
    //     aria-describedby="modal-modal-description"
    // >
    //     <TicketPayment afterSubmit={handleClosePayment} ticketDetail={ticketDetail}></TicketPayment>
    // </Modal>



    <div>
    <div style={{border:'1px solid',right:0, bottom:0,top:'0',left:'0',position:'absolute'}}>
        <div style={{background:'rgba(0,0,0,0.8)',right:0, bottom:0,top:'0',left:'0',position:'absolute' }}>
        </div>
        <div style={{background:'#fff',  width:'70%', margin:'10% auto 0', position:'relative', borderRadius: 10}}>
        <Grid container spacing={2}>
            {/* <ModalTitleBar  title="Discounts" onClose={onClose}/> */}
            <TicketPayment afterSubmit={handleClosePayment} ticketDetail={ticketDetail}></TicketPayment>
        </Grid>

        </div>
    </div>
    </div>




  );
}
