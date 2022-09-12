import React from 'react';
import { Grid, Typography} from '@material-ui/core/';  
import SearchBar from "material-ui-search-bar";
import ModalTitleBar from '../../../../components/Modal/Titlebar';
import VariablePrice from './variablePrice';
import './css/topbar.css';
import { QueryFunctions } from './functions';

export default class ServiceListComponent extends React.Component{
    queryManager = new QueryFunctions();
    constructor(props){
        super(props);  
        this.state = {
            searched:'',
            priceVariablePopup:false,
            selectedservice: {}
        }

        this.requestSearch = this.requestSearch.bind(this);
        this.cancelSearch = this.cancelSearch.bind(this)
    }  


    componentDidMount(){ 
        if(this.props.data.searchValue !== undefined){
            this.setState({searched: this.props.data.searchValue});
        }
    } 

    static getDerivedStateFromProps(nextProps, prevState){
        if(nextProps.data.searchValue!==prevState.searched ){
            return { searched: nextProps.data.searchValue};
        } 
        else return null;
    } 


    requestSearch(searchVal){
        this.props.data.onSearchText(searchVal);
    }

    cancelSearch(){
        this.props.data.onSearchText("");
    }


    addServices(service){ 
        var obj = {
            servicedetail : Object.assign({}, this.state.selectedservice),
            serviceid: this.state.selectedservice.id,
            qty:1,
            perunit_cost : service.price,
            subtotal: service.price,
            employee_id: this.props.data.employeeId,
            discount:{},
            taxes:[], 
            taxamount:0,
            discountamount:0, 
            isSpecialRequest:  0,
            process: '',
            requestNotes: '',
            tips_amount: 0,
        } 

        if(this.state.selectedservice.tax_type === 'default'){ 
            this.queryManager.getDefaultTaxes().then(results=>{
                obj["taxes"] = results; 
                this.calculateTax(0, obj);
            })
        }
        else{
            this.queryManager.getServiceTaxes(this.state.selectedservice.id).then(results=>{
                obj["taxes"] = results; 
                this.calculateTax(0, obj);
            })
        }  
    }


    calculateTax(idx, obj){
        if(idx< obj.taxes.length){
            var taxes = Object.assign([], obj.taxes);
            var t = obj.taxes[idx]; 
            var per_amt = 0;
            var taxamount = obj.taxamount;
            if(t.tax_type === 'percentage'){
                per_amt = (t.tax_value/100)*  Number(obj.perunit_cost);
                t.tax_calculated = per_amt.toFixed(2); 
                taxamount+=Number(t.tax_calculated);
            }
            else{
                if(t.tax_value !== undefined || t.tax_value !== undefined){ 
                    t.tax_calculated = t.tax_value.toFixed(2);  
                    taxamount+=Number(t.tax_calculated);
                } 
            } 
            taxes[idx] = t;
            obj.taxes = taxes; 
            obj.taxamount = taxamount;
            this.calculateTax(idx+1, obj);
        }
        else{ 
            console.log(obj)
            this.props.data.addServiceToTicket(obj);
            if(this.state.priceVariablePopup){
                this.setState({priceVariablePopup: false})
            }
        }
    }

    render(){
        return <>  
                <Grid item xs={12} style={{border:'2px solid #f0f0f0', height:  window.innerHeight-95}} >
                    <Grid item xs={12} style={{border:'0px solid #f0f0f0',borderBottom:'1px solid #f0f0f0',padding: 10}}> 
                        <SearchBar 
                            style={{background: 'transparent', boxShadow: 'none' }}
                            value={this.state.searched}
                            onChange={(searchVal) => this.requestSearch(searchVal)}
                            onCancelSearch={() => this.cancelSearch()} 
                            />

                    </Grid> 
                    <Grid item xs={12}  style={{display:'flex', flexWrap:'wrap', height:'calc(100% - 70px)'}}>
                        
                        <Grid item xs={4} style={{height:'100%',overflow:'auto'}}>
                        <div style={{ width: '100%', height: '100%',overflow: 'hidden',borderRight:'5px solid #f0f0f0', }}>
                        <div style={{width: '100%', height: window.innerHeight-170,padding: 0,overflowY:'scroll',
                        boxSizing: 'content-box',borderRight:'2px solid #f0f0f0', overflow: 'auto', scrollbarWidth: 'none'}}>

                            {this.props.data.categoryList.length=== 0 && <div style={{padding:'10px', display:'flex', alignItems:'center', width:'100%'}}>
                                        <p style={{fontSize:'12px', textAlign:'center'}}>No categories found.</p>
                            </div>}

                            {this.props.data.categoryList.map((category,index) => (
                                <>
                                    <Grid item xs={12} style={{'height':'100px', 'background':(this.props.data.selectedCategory===category.id ? '#bee1f7':(index%2===0) ? 'transparent':'#F5F5F5'), textTransform:'capitalize','color':(this.props.data.selectedCategory===category.id ? '#000':'#000')}} >
                                        <div style={{borderBottom:'2px solid #f0f0f0', borderRight:'0',   cursor:'pointer',  display:'flex', alignItems:'center', justifyContent:'center', height:'100%'}} 
                                        onClick={() => {
                                            if(!this.props.data.isDisabled) { 
                                                this.props.data.getServices(category.id)}
                                            }
                                        }>
                                            <div   style={{MozUserSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none', display:'flex', alignItems:'center', justifyContent:'center', userSelect: 'none'}}>
                                                <Typography style={{ display:'flex', alignItems:'center', justifyContent:'center',fontWeight:'500',
                                                        'overflow': 'hidden',
                                                        'white-space': 'pre-wrap',fontSize:'14px',
                                                        'text-overflow': 'ellipsis',textTransform:'capitalize',
                                                        'height': '80px'}} id="modal-modal-title" variant="subtitle2"  align="center">
                                                            {category.name}
                                                </Typography>
                                            </div>
                                        </div>
                                    </Grid> 
                                     
                                </>
                            ))} 

                            </div>
                            </div>

                        </Grid>
                 
                        <Grid item xs={8} style={{height:'100%',overflow:'auto'}}>
                            <Grid item xs={12} style={{display:'flex', flexWrap:'wrap' }}>
                            {this.props.data.serviceList.length=== 0 && <div style={{padding:'10px', display:'flex', alignItems:'center', width:'100%'}}><p style={{fontSize:'12px', textAlign:'center'}}>No services found.</p></div>}
                            
                                {this.props.data.serviceList.map(service => ( 
                                    <>
                                        <Grid item xs={6} onClick={() => {
                                            if(!this.props.data.isDisabled) {
                                                // //console.log("service--onclick",service.pricetype)
                                                if(service.pricetype==="variable") {
                                                    this.setState({priceVariablePopup: true,selectedservice: service })
                                                }
                                                else {
                                                    console.log(service)
                                                    this.setState({selectedservice: service },()=>{
                                                        this.addServices(service)
                                                    })
                                                }
                                                
                                            }
                                            }} 
                                            style={{border:'2px solid #f0f0f0',padding: '10px',margin: '10px',maxWidth: '40%',height: '70px',cursor:'pointer'}}
                                            // style={{border:'2px solid #f0f0f0', borderLeft:0,borderTop:0, height:'100px', cursor:'pointer',padding:'20px'}}
                                            > 
                                            <div style={{ userSelect: 'none', display:'flex', alignItems:'center', justifyContent:'center',height:'100%' }}>
                                                <Typography  style={{ display:'flex', alignItems:'center', justifyContent:'center',fontWeight:'500',
                                                    'overflow': 'hidden', textTransform:'capitalize',
                                                    'white-space': 'pre-wrap',
                                                    'text-overflow': 'ellipsis',fontSize:'14px',
                                                    'height': '80px'}}  id="modal-modal-title" variant="subtitle2" align="center" >
                                                        {service.name}{service.producttype==='product' ? '(R)' :''}
                                                    </Typography>
                                            </div>
                                        </Grid> 
                                    </>
                                ))}
                            </Grid>
                        </Grid>
                    
                    </Grid>
                

                </Grid> 

                {this.state.priceVariablePopup && 
                        <div className="modalbox">
                            <div className='modal_backdrop'>
                            </div>
                            <div className='modal_container md_modal'> 
                                <ModalTitleBar onClose={()=>{this.setState({priceVariablePopup: false, selectedservice:{}})}} title={this.state.selectedservice.name}/>  

                                <VariablePrice service={this.state.selectedservice} handleClose = {()=>{this.setState({priceVariablePopup: false, selectedservice:{}})}} afterSubmitVariablePrice={(cost)=>{
                                    if(Number(cost) > 0){
                                        var obj = {
                                            ...Object.assign({}, this.state.selectedservice), 
                                        }
                                        obj["price"] = cost;
                                        this.addServices(obj);
                                    }
                                    else{
                                        this.setState({priceVariablePopup: false})
                                    }
                                }}></VariablePrice>
                            </div>
                        </div>
                }

            </>
    }
}