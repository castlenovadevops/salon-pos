import React from 'react'; 
import './App.css';  
// const { ipcMain } = require('electron'); // electron
import { isBusinessSynced, isUserLogged } from './utils/protector'; 
import Login from './pages/Login';
import SyncBusiness from './pages/BusinessCode'; 
import DashboardApp from './pages/Dashboard'; 
import SyncData from './pages/SyncData'; 
// import IdleTimer from 'react-idle-timer';

import TicketManager from './controller/TicketManager'; 
import DataManager from './controller/datacontroller'
import NetworkManager from './utils/networkmanager'; 
import { DialogContentText, Dialog, DialogTitle, DialogContent, DialogActions} from '@material-ui/core/';  
// theme
import ThemeConfig from './theme';
import GlobalStyles from './theme/globalStyles';
import IdleTimer from 'react-idle-timer';
import ButtonContent from './components/formComponents/Button';
import LoadingModal from './components/Modal/loadingmodal'; 
import TicketController from './controller/TicketController';

import TicketServiceController from './controller/TicketServiceController';

// const { ipcRenderer, remote } = require('electron');

export default class App extends React.Component {
  ticketServiceController = new TicketServiceController();
  idleTimer;
  ticketController = new TicketController();

  constructor(props) {
    super(props);
    this.state = {
      isLoaded:false,
      isSyncing: false,
      createTicketDataManager: new TicketManager(),
      timeDelay:60*1000*15,
      lkupTimeDelay:60*1000*15,
      idleTimeDelay:60*1000*30,
      // idleTimeDelay:60*1000*1,
      networkAvailable: true,
      netmanager : new NetworkManager(),
      showPopup: false,
      close: '',
      perAlert_Open: false,
      alert_msg: '',
      isLoading: false,
      dataManager: new DataManager(), 
      isAutoSyncing: false, 
    };
    this.onAfterSubmit = this.onAfterSubmit.bind(this); 
    this.dataManager = new DataManager();     
    this.handleOnAction = this.handleOnAction.bind(this)
    this.handleOnActive = this.handleOnActive.bind(this)
    this.handleOnIdle = this.handleOnIdle.bind(this)    
  } 

  handleOnAction (event) {
    // //////console.log('user did something', event)
  }

  handleOnActive (event) {
    // //////console.log('user is active', event)
    // //////console.log('time remaining', this.idleTimer.getRemainingTime())
  }

  handleOnIdle (event) {
    let udetail = window.localStorage.getItem('employeedetail') || '';
    if(udetail !== undefined && udetail !== ''){
      console.log('user is idle', event) 
      window.localStorage.removeItem("employeedetail") 
      setTimeout(()=>{
          console.log("Reload in logout idle")
          window.location.reload();
      })
    }
  } 

  componentDidMount(){  
    window.localStorage.removeItem('isSyncing') 
    document.title = "Astro POS (Development)"   
    this.syncData();
  }   

  syncData(){
    setTimeout(() => {
      console.log("Auto syncing")
      var businessdetail = window.localStorage.getItem('businessdetail');
      var employeedetail = window.localStorage.getItem('employeedetail');
      if(businessdetail !== undefined && businessdetail !== '' &&  employeedetail !== undefined && employeedetail !== '' && this.state.isSyncing === false){
        console.log("syncing")
        // 
        // this.setState({isAutoSyncing: true})
      }
      else{
        console.log("already runnning")
      }
        this.syncData();
    }, this.state.timeDelay);
  }
  
  logout() {
    window.localStorage.removeItem("isSynced")
    window.localStorage.removeItem("employeedetail")
    setTimeout(()=>{
      this.setState({isSyncing: false}, function() { 
        window.location.reload();
      })
    },100) 
  }
  

  saveTicket(data){ 
    var ticketdata = Object.assign({}, data);
    ticketdata.ticketref_id = data.ticketDetail.sync_id;
    this.ticketServiceController.saveTicketServices(ticketdata); 
  }

  onAfterSubmit(){ 
    this.setState({isLoaded:true, isAutoSyncing: false})
  } 

  render() { 
    return (
      <ThemeConfig> 
        <GlobalStyles />
        
        <IdleTimer
          ref={ref => { this.idleTimer = ref }}
          timeout={this.state.idleTimeDelay}
          onActive={this.handleOnActive}
          onIdle={this.handleOnIdle}
          onAction={this.handleOnAction}
          debounce={250}
        /> 
      {!isUserLogged() &&  !isBusinessSynced() && !this.state.isSyncing && <SyncBusiness onSyncedBusiness={()=>this.setState({isSyncing:true},()=>{this.onAfterSubmit()})}/>}          
      {!isUserLogged() && isBusinessSynced()  && !this.state.isSyncing && <Login onLoggedIn={()=>this.onAfterSubmit()}/>}  
      {!isUserLogged() && isBusinessSynced()  &&  this.state.isSyncing && <SyncData onAfterSync={()=>this.setState({isSyncing:false},()=>{this.onAfterSubmit()})}/>}

      {this.state.isAutoSyncing && <div style={{display:'none'}}><SyncData onAfterSync={()=>this.setState({isSyncing:false},()=>{this.onAfterSubmit()})}/></div>}

      {isUserLogged()  && !this.state.isSyncing && <DashboardApp saveTicket ={(data, ticketid)=>{console.log("app initial dashboard app component", data);
        this.saveTicket(data, ticketid)}} />} 
      

    <Dialog
        open={this.state.perAlert_Open}
        onClose={this.handleCloseAlert}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
    >
        <DialogTitle id="alert-dialog-title">
        {"Alert !"}
        </DialogTitle>
        <DialogContent>
        <DialogContentText id="alert-dialog-description">
            {this.state.alert_msg}
        </DialogContentText>
        </DialogContent>
        <DialogActions>
            <ButtonContent  size="large" variant="outlined" label="OK" onClick={()=>this.handleCloseAlert()}/>
        </DialogActions>
    </Dialog>
                
    {this.state.isLoading &&  <LoadingModal show={this.state.isLoading}></LoadingModal>}
 
      </ThemeConfig>

    )
  }
}
