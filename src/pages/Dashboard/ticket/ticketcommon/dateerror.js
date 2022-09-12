import React from 'react';
import { Typography, Button, Card, CardContent} from '@material-ui/core/'; 


export default class DateErrorComponent extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            
        }
    }

    loadData(){
        this.props.reloadView()
    }
    render(){
        return <Card style={{height:'100%', display:'flex' , alignItems:'center', justifyContent:'center'}}>
        <CardContent style={{paddingBottom:'0', paddingLeft:0, paddingRight:0}}>
       <div style={{width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column'}}>
                                    <Typography variant="h4" style={{color:"#999"}}>There's an issue with your system clock.</Typography>
                                    <Typography variant="subtitle2" style={{color:"#999", marginBottom:'1rem'}}>We recommend that you check your system settings, adjust date and time and then try again.  </Typography>
                                    <Button variant="contained" onClick={()=>{
                                        this.loadData()
                                    }}>Reload</Button>
                                </div>
                                </CardContent>
                                </Card>
    }
}