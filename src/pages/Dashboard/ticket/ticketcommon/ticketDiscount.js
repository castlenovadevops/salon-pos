import React from 'react';    
import './css/topbar.css'; 
import DiscountTicketModal from '../TicketDiscount';

export default class TicketDiscount extends React.Component{

    constructor(props){
        super(props);  
        this.state = {

        }
    }    

    componentDidMount(){
        console.log("DISCOUNT COMPONENT")
        console.log(this.props)
    }

    render(){
        return  <DiscountTicketModal handleCloseAddDiscounts={()=>this.props.data.handleCloseDiscount()} discount_list={this.props.data.discountsList} ticket_discount_selected={this.props.data.price.ticketDiscount} ticket_grandTotal={this.props.data.price.grandTotal}  afterSubmitDiscount={(msg,disInput, opt)=>{this.props.data.discountUpdated(msg,disInput, opt); }}/>
    }
}