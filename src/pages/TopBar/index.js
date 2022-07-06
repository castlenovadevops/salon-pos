// material
// import { Button } from '@mui/material';
import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Typography from "@material-ui/core/Typography"; 
// import Badge from '@mui/material/Badge';  

export default class AppBarContent extends React.Component 
{
    constructor(props){
        super(props);
        this.state = {
            currentTime:new Date().toLocaleTimeString('en-US')
        }
    }

    componentDidMount(){
        setInterval(() => {this.setState({currentTime: new Date().toLocaleTimeString('en-US')})}, 1000);
    } 
    render(){
        return (
            <AppBar position="static" color="primary" style={{background:'#fff', boxShadow:'none', borderBottom:'1px solid #f0f0f0'}}>
                                    <Toolbar>
                                        <Container style={{padding:0, maxWidth:'100%'}}>
                                        
                                        <Grid container spacing={3} style={{'maxWidth':'100%', 'padding':'0'}}>
                                            <Grid item xs={5} style={{display:'flex', alignItems:'center'}}>
                                                <IconButton
                                                    id="basic-button"
                                                    size="medium"
                                                    onClick={(this.props.handleClick)}
                                                
                                                >
                                                    <MenuIcon />
                                                </IconButton>
                                                    
                                                <Typography variant="h6" noWrap style={{color:'#134163'}}>
                                                        {this.props.businessdetail.name}
                                                    </Typography> 
                                            </Grid>
                                            <Grid item xs={2} style={{display:'flex',alignItems:'center', justifyContent:'center' }}>
                                                <img alt="logo" src="assets/images/title_logo.png" height="50px" />
                                            </Grid>
                                            <Grid item xs={5} style={{display:'flex',alignItems:'center', justifyContent:'flex-end' }}>
                                            <div style={{display:'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginRight: 0}}> 
                                                {/* {this.props.syncApi !== undefined && <div style={{marginRight: 10}}>
                                                    <Badge badgeContent={this.props.unsyncedCount}  color="error">
                                                        <Button style={{width: 80, background: '#134163'}} onClick={(this.props.syncApi)} fullWidth variant="contained">Sync</Button>
                                                    </Badge>
                                                
                                                </div> } */}
                                                <div style={{display:'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginRight: 0}}>
                                                
                                                    <Typography variant="body2" noWrap style={{marginLeft: '10px', marginRight: 0, color:'#000'}}>
                                                        {this.state.currentTime}
                                                    </Typography>

                                                    

                                                </div>

                                            
                                            </div>
                                            </Grid>
                                        </Grid>
                                    </Container>
                                        
                                    </Toolbar>
            </AppBar> 
        );
    }
}
