import React from 'react';
import { Grid, Typography} from '@material-ui/core/';   
import { QueryFunctions } from './functions';
import CallSplit from '@mui/icons-material/CallSplit';
export default class SelectedServicesComponent extends React.Component{
    queryManager = new QueryFunctions(); 

    componentDidMount(){  

    }    

    

getEmployeeName(id){
    // ////////console.log"getEmployeeName---", this.state.employee_list)
    var empname = '';
    var emp = this.props.data.employeeList.filter(item=>item.id === id);
    var obj = {firstName:"", lastName:""}
    if(emp.length > 0){
        obj = emp[0];
    }
    empname = obj['firstName']+" "+obj['lastName']; 
    return empname;
}

    render(){
        return <div style={{ width: '100%', height: '100%',overflow: 'hidden'}}>

                 <Grid container spacing={1}  xs={12} style={{ marginLeft:'0', background: '#F5F5F5',   marginRight: '0px',paddingTop: 10,paddingBottom: 10, height:'50px' }}>
                    
                    <Grid item xs={12} container justify="flex-start" style={{ paddingLeft: 20}}>

                    <Grid item xs={3} container  justify="flex-start" direction='column'>
                        <Typography style={{MozUserSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none', userSelect: 'none', fontWeight: 'bold',maxWidth: 200}}  variant="subtitle2" align="left" noWrap >Service Name</Typography>
                    </Grid>

                    <Grid item xs={2} container justify="flex-start">
                        <Typography style={{MozUserSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none', userSelect: 'none', fontWeight: 'bold'}}  variant="subtitle2" align="left">Qty </Typography>
                    </Grid>

                    <Grid item xs={4} container justify="flex-start"> 
                        <Typography style={{MozUserSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none', userSelect: 'none', fontWeight: 'bold'}}  variant="subtitle2" align="left">Technician</Typography>
                    </Grid>

                    <Grid item xs={3} container justify="flex-start">
                        <Typography style={{MozUserSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none', userSelect: 'none', fontWeight: 'bold'}}  variant="subtitle2" align="left"><span style={{padding:'0 10px', visibility:'hidden'}}>(+)</span>Price</Typography>
                    </Grid> 
                    </Grid>

                </Grid>
                <div style={{ width: '100%', height: '100%',overflow: 'hidden'}}>
                    <div style={{width: '100%', height: window.innerHeight-400,paddingLeft: 0,paddingTop: 10,paddingBottom: 10,overflowY:'auto', overflowX:'hidden', boxSizing: 'content-box'}}>

                        {this.props.data.services_taken.map((ser, index) =>{
                        return <> <Grid container xs={12} justify="flex-start" style={{borderBottom:'2px solid #f0f0f0',position:'relative', cursor: 'pointer',
                                paddingTop: 10, paddingBottom:10, paddingLeft: 0,
                            background:(this.props.data.selectedRowServiceindex === index) ? '#2E83BB' :  (index%2 === 0) ? '#ffffff' : '#F5F5F5',
                            color: (this.props.data.selectedRowServiceindex === index) ? 'white' :'black',
                            
                            }} 
                        
                            color={(this.props.data.selectedRowServiceindex === index) ? 'white' :'balck'}
                            onClick={(e)=>{
                                if(!this.props.data.isDisabled) {
                                    e.preventDefault();
                                    e.stopPropagation(); 
                                    this.props.data.selectService(index,e)}
                                }
                                
                            } >

                                    <Grid item xs={3} spacing={10}  justify="flex-start" direction='column' style={{padding:'10px 0 10px 10px', height:'auto', position:'relative',}}>
                                        <Typography id="modal-modal-title" variant="subtitle2" noWrap style={{width:'100%', paddingBottom: 10,wordBreak:'break-word', display:'flex', alignItems:'center',}}>
                                            {ser.process  === 'Splitted' &&  <CallSplit style={{height:'16px'}}/>} {ser.servicedetail.name}</Typography>
                                                        
                                        <Typography variant="subtitle2" style={{maxWidth: 200, marginTop: 20 , textAlign:'left'}}>
                                            {ser.isSpecialRequest === 1 ?( ser.requestNotes !== '' && ser.requestNotes !== undefined && ser.requestNotes !== null ? ser.requestNotes.substring(0,200) :'(Special Request)'):''}</Typography>                
                                    </Grid>

                                    <Grid item xs={2} container justify="flex-start"  style={{padding:'10px 0 10px 10px'}}>
                                        <Typography id="modal-modal-title" variant="subtitle2"  style={{height:'auto'}} align="center">{ser.qty} </Typography>
                                    </Grid>
                                    
                                    <Grid item xs={4} container justify="flex-start"  style={{padding:'10px 0 10px 10px', display:'flex', flexDirection:'row'}}> 
                                    <Typography id="modal-modal-title" variant="div" align="center" style={{display:'flex', width:'100%', flex:'1', justifyContent:'space-between'}}> 
                                            <span style={{fontSize:'14px'}}> {this.getEmployeeName(ser.employee_id)}  </span>
                                            <span style={{fontSize:'14px'}}>{ser.servicedetail.producttype==='product' ? '(R)' :''}</span>
                                            </Typography>   
                                            {ser.discount.discount_id !== undefined && ser.discount.discount_id !== 0 &&  
                                                <Grid item xs={12} style={{ padding:'5px 0'}}>
                                                        <Typography id="modal-modal-title" variant="subtitle2" align="left" >{ser.discount.discount_name} ({ser.discount.discount_type === 'percentage'? '%' : '$' }{ser.discount.discount_value}) </Typography>
                                                </Grid>
                                            } 
                                            {ser.taxes.map( (tax) => 
                                                <Grid item xs={12} style={{ padding:'5px 0' }}> 
                                                                <Typography id="modal-modal-title" variant="subtitle2" align="left" style={{MozUserSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none', userSelect: 'none'}}>{tax.tax_name} 
                                                                ({tax.tax_type === 'percentage'? tax.tax_value+'%' : '$'+tax.tax_value })</Typography>  
                                                </Grid>
                                            
                                            )}

                                    </Grid>
                                    
                                    <Grid item xs={3} container justify="flex-start"  style={{padding:'10px 0 10px 10px', display:'flex', flexDirection:'row'}}>
                                        
                                        <Typography id="modal-modal-title" variant="subtitle2" align="center"><span style={{padding:'0 10px', visibility:'hidden'}}>(+)</span>${ Number(Number(ser.perunit_cost) * Number(ser.qty)).toFixed(2) }</Typography> 
                                            
                                        {ser.discount.discount_id !== undefined && ser.discount.discount_id !== 0 &&  
                                            <Grid item xs={12} style={{padding:'5px 0'}}>
                                                    <Typography id="modal-modal-title" variant="subtitle2" align="left" style={{MozUserSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none', userSelect: 'none',}} ><span style={{padding:'0 10px'}}>(-)</span>${Number(ser.discountamount).toFixed(2) } </Typography>
                                            </Grid>
                                        }    
                                        {ser.taxes.map( (tax) => 
                                            <Grid item xs={12} style={{  padding:'5px 0' }}> 
                                                    <Typography id="modal-modal-title" variant="subtitle2" align="left" style={{MozUserSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none', userSelect: 'none',}}><span style={{padding:'0 10px'}}>(+)</span>${ Number(tax.tax_calculated).toFixed(2)}</Typography> 
                                            </Grid> 
                                        )}
                                    </Grid>


                            </Grid>
                            </>
                        })
                        }
                    </div>
                </div>
            </div>
    }
}