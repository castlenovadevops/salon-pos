import React from 'react';
import { Grid,Typography} from '@material-ui/core/';   

export class DiscountsListComponent extends React.Component{

    constructor(props){
        super(props);
        this.state={

        }
    }

    componentDidMount(){
        console.log(this.props)
    }

    render(){
        return <Grid item xs={12} style={{display:'flex', flexWrap:'wrap'}}> 
        {this.props.data.discountsList.map((dis) => (   
                <Grid item xs={6} onClick={(e) => this.props.data.selectDiscount(dis)}  
                style={{ display:'flex',maxHeight:'70px', padding: '10px',margin: '10px',maxWidth: '40%',height: '70px', 
                alignItems:'center', justifyContent:'center',cursor:'pointer', border:this.props.data.selectedRowService.discount.discount_id === dis.id ? '2px solid #bee1f7': '2px solid #f0f0f0',background: this.props.data.selectedRowService.discount.discount_id === dis.id ? '#bee1f7':'transparent'}}>

                        <Typography id="modal-modal-title" variant="subtitle2"  style={{maxHeight:'60px', overflow:'hidden',  
                        textOverflow:'ellipsis', MozUserSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none', userSelect: 'none'}}
                        align="center"> 
                            {dis.name}<br/>
                            {dis.discount_type === 'percentage' ? dis.discount_value+"%" : "$"+dis.discount_value}
                        </Typography>
                 </Grid>  
                 
        ))} 
    </Grid>  
    }
}