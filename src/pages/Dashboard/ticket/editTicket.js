import React from 'react'; 
import Dialog from '@material-ui/core/Dialog';
import CreateTicket from './createTicket'; 

export default function EditTicketModal(
    {
    
        
        open,
        onClose,
        handleCloseDialog,
        ticketowner,
        selectedTicket,
        afterFinished,
        saveTicket
}) 

{
  return ( 
    <Dialog fullScreen open={open}  onClose={onClose} > 
        <CreateTicket owner={ticketowner} saveTicket={(data, ticketid)=>{saveTicket(data, ticketid)}} afterFinished={(msg)=>{ handleCloseDialog(msg);afterFinished(msg)}} ticketSelected={selectedTicket}/> 
    </Dialog> 
  );
}
