import React from 'react';
import { Grid,Typography} from '@material-ui/core/';   

export class TaxListComponent extends React.Component{

    constructor(props){
        super(props);
        this.state={

        }
    }

    componentDidMount(){
        console.log(this.props)
    }

    isTaxCheck(id){ 
        var servicetaxes = this.props.data.selectedRowService.taxes.map(t=>t.id.toString());
        if(servicetaxes.indexOf(id.toString()) !== -1 ){
            return true
        }

        return false;
    }

    render(){
        return <Grid item xs={12} style={{display:'flex', flexWrap:'wrap',padding: 0}}>  
            {this.props.data.taxlist.map ((tax,index)=>(
                <Grid item xs={6}   alignItems='center'
                justify="center" justifyContent="center" onClick={(e) => this.props.data.selectTax(tax)}  
                style={{border:'2px solid #f0f0f0',display:'flex',maxHeight:'70px', padding: '10px',margin: '10px',maxWidth: '40%',height: '70px', background: this.isTaxCheck(tax.id) ? '#bee1f7':'transparent',
                alignItems:'center', justifyContent:'center',cursor:'pointer'}}>
                
                <Grid item  style={{background: 'transparent'}}>
                    <Typography id="modal-modal-title" variant="subtitle2"  
                    style={{maxHeight:'60px', overflow:'hidden', textOverflow:'ellipsis', MozUserSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none', userSelect: 'none'}}
                    align="center"> 
                    {tax.tax_name} 
                    </Typography>

                    <Typography id="modal-modal-title" variant="subtitle2"  
                    style={{maxHeight:'60px', overflow:'hidden', textOverflow:'ellipsis', MozUserSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none', userSelect: 'none'}}
                    align="center"> 
                    {(tax.tax_type==="percentage")?tax.tax_value+"%":"$"+tax.tax_value} 
                    </Typography>
                    </Grid>

                </Grid>  
            ))}
        </Grid> 
    }
}