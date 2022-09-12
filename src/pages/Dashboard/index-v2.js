import React from "react";
import TicketDashboard from './ticket';
import Category from './inventory/category';
import Product from './inventory/products';
import Tax from '../settings/tax';
import DefaultCommission from '../settings/default_commission';
import DefaultDiscount from '../settings/default_discount';
import EmployeeSettings from '../settings/employee_settings';
import SyncData from '../SyncData';
import EmployeeSalary from '../EmpSalary';
import EmployeeReport from '../EmpReport';
import PrinterSetting from "../settings/printer";
import Discount from "../Discount";
import Employees from "../Employees";
import Customers from "../Customers";
import Transactions from "../Transactions";

export default class Dashboard extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        currentPage:'dashboard'
      };
      this.changeCurrentPage = this.changeCurrentPage.bind(this);
    }
  
    componentDidMount(){
  
    }
  
    changeCurrentPage(page){  
      this.setState({currentPage:page});
    }

    render() {
      return (<>
          {this.state.currentPage === 'dashboard' && <TicketDashboard saveTicket={(data)=>{this.props.saveTicket(data)}} onChangePage={this.changeCurrentPage} /> } 
          {this.state.currentPage === 'category' && <Category onChangePage={this.changeCurrentPage} /> } 
          {this.state.currentPage === 'product' && <Product onChangePage={this.changeCurrentPage} /> } 
          {this.state.currentPage === 'tax' && <Tax onChangePage={this.changeCurrentPage} /> } 
          {this.state.currentPage === 'commission' && <DefaultCommission onChangePage={this.changeCurrentPage} /> } 
          {this.state.currentPage === 'discount_division' && <DefaultDiscount onChangePage={this.changeCurrentPage} /> } 
          {this.state.currentPage === 'empsettings' && <EmployeeSettings onChangePage={this.changeCurrentPage} /> } 
          {this.state.currentPage === 'syncdata'  && <SyncData onChangePage={this.changeCurrentPage} onAfterSync={()=>this.setState({currentPage:'dashboard'})}/>}
          {this.state.currentPage === 'empsalary'  && <EmployeeSalary onChangePage={this.changeCurrentPage}/>}
          {this.state.currentPage === 'empreport'  && <EmployeeReport onChangePage={this.changeCurrentPage}/>}
          {this.state.currentPage === 'printer'  && <PrinterSetting onChangePage={this.changeCurrentPage}/>}
          {this.state.currentPage === 'discount'  && <Discount onChangePage={this.changeCurrentPage}/>}
          {this.state.currentPage === 'employees'  && <Employees onChangePage={this.changeCurrentPage}/>}
          {this.state.currentPage === 'customers'  && <Customers onChangePage={this.changeCurrentPage}/>}
          {this.state.currentPage === 'transactions'  && <Transactions onChangePage={this.changeCurrentPage}/>}
          
      </>)
    }
  }
  