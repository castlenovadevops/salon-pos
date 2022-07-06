import React from 'react';
import { Grid } from '@material-ui/core/';
import ModalTitleBar from '../../../../components/Modal/Titlebar';
import SplitService from './split'; 
export default function TicketServiceSplitModal({
    handleCloseSplit,
    employee_list,
    afterSubmit,
    service_selected
}) 
{
return (
    <div>
    <div style={{border:'1px solid',right:0, bottom:0,top:'0',left:'0',position:'absolute'}}>
        <div style={{background:'rgba(0,0,0,0.8)',right:0, bottom:0,top:'0',left:'0',position:'absolute' }}>
        </div>
        <div style={{background:'#fff',width:'40%',height:'70%', margin:'5% auto 0', position:'relative', borderRadius: 10}}>
        {/* <Grid container spacing={2} style={{height:'100%',background: 'red'}}> */}
            <ModalTitleBar style={{height:60, background: 'red'}} title={"Split Service"} onClose={handleCloseSplit}/>
            <SplitService employee_list={employee_list} afterSubmit={afterSubmit} closeSplit={handleCloseSplit} service_selected={service_selected}  ></SplitService>
        {/* </Grid> */}

        </div>
    </div>
    </div>
)
}