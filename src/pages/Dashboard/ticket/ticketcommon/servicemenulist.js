import React from 'react';
import { Grid, Typography, Button} from '@material-ui/core/';  
import TechniciansComponent from './menufunctions/technicians';
import QuantityComponent from './menufunctions/quantity';
import PriceComponent from './menufunctions/price';
import ServiceNotesComponent from './menufunctions/notes';
import { DiscountsListComponent } from './menufunctions/discounts';
import { TaxListComponent } from './menufunctions/taxes';
import TransferServiceComponent from './transferService';
import TicketServiceSplitModal from '../SplitService';
import ModalTitleBar from '../../../../components/Modal/Titlebar';
import './css/topbar.css';

export default class ServiceMenuComponent extends React.Component{

    constructor(props){
        super(props);  
        this.state = {

        }
    }   
    
    getMenuItem(index){
        var cat = this.props.menulist[index];
        var splitteddisable = [6] //[2, 3,5,7]
        if(this.props.selectedRowService.process !== 'Splitted'){
            return <Grid item xs={12} className={cat.id===this.props.selectedMenuIndex ? 'sidemenuitem active' : (index%2 === 0 ? 'sidemenuitem even' : 'sidemenuitem')}  >
                <div style={{borderBottom:(cat.id===(this.state.menu_selected_id)) ? '2px solid #bee1f7': '2px solid #f0f0f0', textTransform:'capitalize',  cursor:'pointer',   
                padding: 10,height: '100%'}}  onClick={() => {  
                        if(cat.id > 0){
                            this.props.selectMenu(cat.id)  
                        }
                        else{
                            this.props.data.selectService(-1)
                        }
                    }}>
                        <div   style={{MozUserSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none', userSelect: 'none'}}>

                        <Typography className='sidemenuitemtext' id="modal-modal-title" variant="subtitle2"  align="center">
                                {cat.label}
                        </Typography>
                        {/* <Typography noWrap id="modal-modal-title" variant="subtitle2" align="center">{cat.label}</Typography> */}
                        </div>
                    </div>
                </Grid>
        }
        else{
            return <Grid item xs={12} style={{
                'background':(cat.id===(this.state.menu_selected_id)) ? '#bee1f7' : ((index%2===0) ? 'transparent':'#F5F5F5'),
                'color':(cat.id===(this.state.menu_selected_id)) ? '#000': '#000', textTransform:'capitalize',
                height: 100
            }} >
                    <div style={{borderBottom:'2px solid #f0f0f0',   cursor:'pointer',   padding: 10,height: '100%'}}  onClick={() => {  
                        if(splitteddisable.indexOf(cat.id) === -1){
                            this.getMenuFunction(cat.id) 
                        }
                        else{
                            if(cat.id === 2){
                                this.setState({disableerror:"You cannot change the quantity of splitted service."})
                            }
                            if(cat.id === 3){
                                this.setState({disableerror:"You cannot change the price of splitted service."})
                            }
                            if(cat.id === 5){
                                this.setState({disableerror:"You cannot split the splitted service."})
                            }
                            if(cat.id === 7){
                                this.setState({disableerror:"You cannot apply discount on the splitted service."})
                            }
                        }
                    }}>
                        <div   style={{MozUserSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none', userSelect: 'none',height: '100%'}}>
                        <Typography style={{ display:'flex', alignItems:'center', justifyContent:'center',fontWeight:'500',
                                'overflow': 'hidden',
                                'white-space': 'pre-wrap',fontSize:'14px',
                                'text-overflow': 'ellipsis',textTransform:'capitalize',
                                'height': '80px'}} id="modal-modal-title" variant="subtitle2"  align="center">{cat.label}</Typography>
                        </div>
                    </div> 
                </Grid> 
        } 
    }


    render(){
        return <> 
             {this.props.menulist.length > 0 && <Grid item xs={12} style={{border:'2px solid #f0f0f0'}} > 
                    <Grid item xs={12}  style={{display:'flex', flexWrap:'wrap'}}>
                        <Grid item xs={4}>
                        <div style={{ width: '100%', height: '100%',overflow: 'hidden',borderRight:'2px solid #f0f0f0'}}>
                    

                        <div style={{width: '100%', height: window.innerHeight-160,padding: 0,overflowY:'auto', boxSizing: 'content-box'}}>
                            {this.props.menulist.map((cat, index) => (
                                <Grid item xs={12}>  
                                    {this.getMenuItem(index)}
                                </Grid>
                            ))}
                        </div>
                        </div>

                        </Grid>

                        <Grid item xs={8}> 
                            {this.props.selectedMenuIndex === 1 && <TechniciansComponent data={{
                                clockin_emp_list: this.props.data.clockin_emp_list,
                                onChangeTechnician: this.props.data.onChangeTechnician
                            }} />} 

                            {this.props.selectedMenuIndex === 2 && <TransferServiceComponent data={{
                                closeTransfer: ()=>{
                                    this.props.selectMenu(1)
                                },
                                closeCompletionTransfer:(tickettransfered)=>{
                                    console.log("TICKET TRANSFER COMPLETION")
                                    console.log(tickettransfered)
                                    this.props.data.reloadTicket(tickettransfered)
                                },
                                ticketowner: this.props.data.ticketowner,
                                ticketDetail: this.props.data.ticketDetail,
                                services_taken : this.props.data.services_taken,
                                selectedRowService: this.props.selectedRowService,
                                selectedRowServiceIndex: this.props.data.selectedRowServiceIndex
                            }}/>}

                            {this.props.selectedMenuIndex === 3 && <QuantityComponent data={{ 
                                qty: this.props.selectedRowService.qty,
                                onUpdateQuantity: this.props.data.onUpdateQuantity
                            }} />}

                            {this.props.selectedMenuIndex === 4 && <PriceComponent data={{ 
                                selectedRowService: this.props.selectedRowService,
                                perunit_cost: this.props.selectedRowService.perunit_cost, 
                                onUpdatePrice : this.props.data.onUpdatePrice
                            }} />} 
                            

                            
                            {this.props.selectedMenuIndex === 6  &&   <TicketServiceSplitModal handleCloseSplit={()=>this.props.data.onSplitClose([])} employee_list={this.props.data.clockin_emp_list}  afterSubmit={(splitted)=>{  this.props.data.onSplitClose(splitted); }} service_selected={this.props.selectedRowService} />}   

                            {this.props.selectedMenuIndex === 7  && this.props.selectedRowService.isSpecialRequest === 1 && <ServiceNotesComponent data={{ 
                                requestNotes: this.props.selectedRowService.requestNotes,
                                onUpdateRequestNotes : this.props.data.onUpdateRequestNotes,
                                onUpdateSpecialRequest: this.props.data.onUpdateSpecialRequest
                            }} />}  

                            {this.props.selectedMenuIndex === 8  && <DiscountsListComponent data={{ 
                                selectedRowService: this.props.selectedRowService,
                                discountsList: this.props.data.discountslist, 
                                selectDiscount: this.props.data.onSelectServiceDiscount
                            }} />}      

                            {this.props.selectedMenuIndex === 9  && <TaxListComponent data={{ 
                                selectedRowService: this.props.selectedRowService,
                                taxlist: this.props.data.taxlist, 
                                selectTax: this.props.data.selectTax
                            }} />}   


                        </Grid>


                    </Grid> 
                
                {this.props.selectedMenuIndex === 5 &&  
                        <div className="modalbox">
                            <div className='modal_backdrop'>
                            </div>
                            <div className='modal_container' style={{height:'180px', width:'500px'}}> 
                                <ModalTitleBar onClose={()=> this.props.selectMenu(1) } title="Confirmation"/>  
                                <Grid item xs={12} style={{display:'flex',marginTop:10}}>
                                    <Typography id="modal-modal-title" variant="subtitle2" component="h2" align="left" style={{marginLeft:20}}>Are you sure to remove this service ?</Typography>
                                </Grid>
                                <Grid item xs={12} style={{display:'flex',marginTop:10}}>
                                    <Grid item xs={8}></Grid>
                                    <Grid item xs={4} style={{display: 'flex'}}> 
                                        <Button style={{marginRight: 10}} onClick={()=>this.props.data.onVoidItem()} color="secondary" variant="contained">Yes</Button>
                                        <Button onClick={()=>this.props.selectMenu(1)} color="secondary" variant="outlined">No</Button>
                                    </Grid>
                                </Grid>
                            </div>
                        </div>
                    }

                    {this.props.selectedMenuIndex === 7  &&  this.props.selectedRowService.isSpecialRequest === 0 &&
                        <div className="modalbox">
                            <div className='modal_backdrop'>
                            </div>
                            <div className='modal_container' style={{height:'180px', width:'500px'}}> 
                                <ModalTitleBar onClose={()=> this.props.selectMenu(1) } title="Confirmation"/>  
                                <Grid item xs={12} style={{display:'flex',marginTop:10}}>
                                    <Typography id="modal-modal-title" variant="subtitle2" component="h2" align="left" style={{marginLeft:20}}>
                                            Are you sure to make this service to special request ?
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} style={{display:'flex',marginTop:10}}>
                                    <Grid item xs={8}></Grid>
                                    <Grid item xs={4} style={{display: 'flex'}}> 
                                        <Button style={{marginRight: 10}} onClick={()=>this.props.data.onUpdateSpecialRequest(1)} color="secondary" variant="contained">Yes</Button>
                                        <Button onClick={()=>this.props.selectMenu(1)} color="secondary" variant="outlined">No</Button>
                                    </Grid>
                                </Grid>
                            </div>
                        </div>
                    }


                </Grid> }
            </>
    }
}