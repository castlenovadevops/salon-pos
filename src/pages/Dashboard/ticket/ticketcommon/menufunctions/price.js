import React from 'react';
import { Grid,Typography} from '@material-ui/core/';   
import TextFieldContent from '../../../../../components/formComponents/TextField';
export default class PriceComponent extends React.Component{

    constructor(props){
        super(props);  
        this.state = {
            perunit_cost: 1
        }
        this.handlekeypress= this.handlekeypress.bind(this);
    }     

    componentDidMount(){
        if(this.props.data.perunit_cost !== undefined){
            this.setState({perunit_cost: this.props.data.perunit_cost})
        }
    }

    

    static getDerivedStateFromProps(nextProps, prevState){
        if(nextProps.data.perunit_cost !==prevState.perunit_cost){
            return { perunit_cost: nextProps.data.perunit_cost};
        } 
        else return null;
     }

     handlekeypress(e){
        if(e.key === 'e'  || e.key === "+" || e.key === "-" || !RegExp("[0-9]+([.][0-9]+)?").test(e.target.value)){
            e.preventDefault();
        }
        if(e.key === "."  && (e.target.value==="" || e.target.value.length===0) ) {
            e.preventDefault(); 
        }
    }
    render(){
       return  <Grid item xs={12} style={{ flexWrap:'wrap',padding: 20}}>
                    <Grid item xs={12}>
                        <Typography id="modal-modal-title" variant="subtitle2" align="left" style={{maxHeight:'70px', overflow:'hidden', textOverflow:'ellipsis', MozUserSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none', userSelect: 'none'}}>
                        <b>Original Price: &nbsp; {this.props.data.selectedRowService.servicedetail.price}</b> 
                            <br/><br/>
                        </Typography>
                    </Grid>
                    <Grid item xs={12} >
                        <TextFieldContent id="service_price" 
                        required 
                        type="number"
                        name="service_price"  
                        label="Service Price" 
                        value={this.state.perunit_cost} 
                        onChange={(e)=>{
                            this.props.data.onUpdatePrice(e.target.value);
                        }}
                        onKeyDown={(e)=>{
                            this.handlekeypress(e)
                        }}
                        fullWidth 
                        style={{color:  '#134163'}} 
                        />
                    </Grid> 
                </Grid>
    }

}