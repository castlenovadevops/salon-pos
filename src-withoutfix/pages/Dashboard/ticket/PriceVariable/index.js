import React from 'react';
import { Grid } from '@material-ui/core/';
import ModalTitleBar from '../../../../components/Modal/Titlebar';
import VariablePrice from './variablePrice'; 

export default function VariablePriceModal({
    handleClose,
    service,
    afterSubmitVariablePrice
   
}) 
{
return (
    <div>
    <div style={{border:'1px solid',right:0, bottom:0,top:'0',left:'0',position:'absolute'}}>
        <div style={{background:'rgba(0,0,0,0.8)',right:0, bottom:0,top:'0',left:'0',position:'absolute' }}>
        </div>
        <div style={{background:'#fff',width:'30%', margin:'10% auto 0', position:'relative', borderRadius: 10}}>
        <Grid container spacing={2}>
            <ModalTitleBar  title="Variable Price" onClose={handleClose}/>
            <VariablePrice service={service} handleClose = {handleClose} afterSubmitVariablePrice={afterSubmitVariablePrice}></VariablePrice>
        </Grid>

        </div>
    </div>
    </div>
)
}