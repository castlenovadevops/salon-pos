import React from 'react';  
import Modal from '@material-ui/core/Modal'; 
import CreateTicket from './createTicket'; 

export default function ClockInOutModal(
{ 
    open, 
    handleCloseDialog,
    ticketowner,
    afterFinished,
    saveTicket
}) 

{
  return (
    <Modal fullScreen open={open} onClose={handleCloseDialog}>  
        <CreateTicket owner={ticketowner} saveTicket={(data, ticketid)=>{saveTicket(data, ticketid)}} afterFinished={(msg)=>{afterFinished(msg)}} /> 
    </Modal> 
  );
}
