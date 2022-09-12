import React from 'react';
import { Grid, Typography} from '@material-ui/core/';   

export default class TechniciansComponent extends React.Component{

    constructor(props){
        super(props);  
        this.state = {

        }
    }    

    render(){
        return <>  
            <Grid item xs={12} style={{display:'flex', flexWrap:'wrap', height:'100px'}}>
                {this.props.data.clockin_emp_list.map((emp, index) => ( 
                        <>{ emp.staff_role !== 'SA' && <Grid item xs={6} 
                        onClick={(e) => this.props.data.onChangeTechnician(emp.id)} 
                        style={{border:'2px solid #f0f0f0',display:'flex',maxHeight:'70px', padding: '10px',margin: '10px',maxWidth: '40%',height: '70px', alignItems:'center', justifyContent:'center',cursor:'pointer'}}>
                        
                            <Typography  style={{ display:'flex', alignItems:'center', justifyContent:'center',fontWeight:'500',
                                'overflow': 'hidden', textTransform:'capitalize',
                                'white-space': 'pre-wrap',
                                'text-overflow': 'ellipsis',fontSize:'14px',
                                }}  id="modal-modal-title" variant="subtitle2" align="center" >
                            {emp.firstName+" "+emp.lastName} </Typography></Grid> }
                </>))}
            </Grid>
        </>
    }
}