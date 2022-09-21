import React from 'react';
import Drawer from '@material-ui/core/Drawer'; 
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import Collapse from '@mui/material/Collapse'; 
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import {Tag, Home, Receipt,People, DynamicFeed, Label, AttachMoney, MoneyOff, Tune, Sync, Group, Loyalty,  ExitToApp, Dashboard, Assessment, Settings, Print, Payment  } from '@mui/icons-material';
import { ListItemIcon, Typography } from '@mui/material';
import DataManager from '../../controller/datacontroller';

export default function DrawerContent(
{ 
        anchor,
        open,
        expand_menu_show,
        setting_menu_show,
        onClose, 
        onhandleClickInvent, 
        onlogout, 
        onhandlePageevent
}) 
{

    var datacontroller = new DataManager();
    
  return (
    

    <Drawer
    anchor={anchor}
    open={open}
    onClose={onClose}
    style={{width: '300px !important'}}
>
    <List>
        <ListItem button onClick={()=>onhandlePageevent('dashboard')}> 
                    <ListItemIcon><Home /></ListItemIcon> <ListItemText primary="Home" /></ListItem>
        <ListItem button> 
                    <ListItemIcon><Receipt /></ListItemIcon> <ListItemText onClick={()=>onhandlePageevent('transactions')} primary="Transaction" /></ListItem>
        <ListItem button> 
                    <ListItemIcon><Payment /></ListItemIcon> <ListItemText onClick={()=>onhandlePageevent('batch')} primary="Batch Reports" /></ListItem>
        <ListItem button onClick={()=>onhandlePageevent('employees')}>
                    <ListItemIcon><People /></ListItemIcon> <ListItemText primary="Employees" onClick={()=>onhandlePageevent('employees')}/></ListItem>
        {/* <ListItem button> <ListItemText primary="Inventory" /></ListItem>
         */}
         <ListItem button onClick={()=>onhandleClickInvent('inventory')}>  

         <ListItemIcon><DynamicFeed /></ListItemIcon>
            <ListItemText primary="Inventory" />
            {expand_menu_show ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={expand_menu_show} timeout="auto" unmountOnExit>
            <List>
                <ListItem button sx={{ pl: 4 }}  style= {{marginLeft: 10}}  onClick={()=>onhandlePageevent('category')}> 
                    <ListItemIcon><Label /></ListItemIcon><ListItemText primary="Category" />
                </ListItem>
                <ListItem button sx={{ pl: 4 }}  style= {{marginLeft: 10}}  onClick={()=>onhandlePageevent('product')}> 
                    <ListItemIcon><Dashboard /></ListItemIcon><ListItemText primary="Product & Services" />
                </ListItem>
            </List>
        </Collapse>
        {/* <ListItem button> <ListItemText primary="Tips" /></ListItem> */}
        <ListItem button  onClick={()=>onhandleClickInvent('settings')}>  
        <ListItemIcon><Settings /></ListItemIcon><ListItemText primary="Settings" />
            {setting_menu_show ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={setting_menu_show} timeout="auto" unmountOnExit>
            <List >
                <ListItem button sx={{ pl: 4 }}  style= {{marginLeft: 10}} > <ListItemIcon><MoneyOff /></ListItemIcon><ListItemText primary="Discount" onClick={()=>onhandlePageevent('discount')}/></ListItem>
                <ListItem button sx={{ pl: 4 }}  style= {{marginLeft: 10}}  onClick={()=>onhandlePageevent('tax')}>
                    <ListItemIcon><AttachMoney /></ListItemIcon>
                    <ListItemText primary="Taxes & Fees" />
                </ListItem>
                <ListItem button sx={{ pl: 4 }}  style= {{marginLeft: 10}}   onClick={()=>onhandlePageevent('commission')}> 
                    <ListItemIcon><Tag /></ListItemIcon> <ListItemText primary="Commission Payment" />
                </ListItem>
                <ListItem button sx={{ pl: 4 }}  style= {{marginLeft: 10}}  onClick={()=>onhandlePageevent('discount_division')}> 
                    <ListItemIcon><MoneyOff /></ListItemIcon><ListItemText primary="Discount Division" />
                </ListItem>
                <ListItem button sx={{ pl: 4 }}  style= {{marginLeft: 10}}  onClick={()=>onhandlePageevent('empsettings')}> 
                    <ListItemIcon><Tune /></ListItemIcon><ListItemText primary="Employee Setting" />
                </ListItem>
                <ListItem button sx={{ pl: 4 }}  style= {{marginLeft: 10}}  onClick={()=>onhandlePageevent('printer')}> 
                    <ListItemIcon><Print /></ListItemIcon> <ListItemText primary="Printers" /></ListItem>
                    
                {/* <ListItem button sx={{ pl: 4 }}  style= {{marginLeft: 10}}  onClick={()=>onhandlePageevent('printer')}> 
                    <ListItemIcon><Settings /></ListItemIcon> <ListItemText primary="Shop Settings" /></ListItem> */}

            </List>
        </Collapse>
        <ListItem button onClick={()=>onhandlePageevent('customers')} > 
                    <ListItemIcon><Group /></ListItemIcon> <ListItemText primary="Customers" /></ListItem>
        <ListItem button onClick={()=>onhandlePageevent('empsalary')}> 
                    <ListItemIcon><Loyalty /></ListItemIcon> <ListItemText primary="Payout" /></ListItem>
        <ListItem button  onClick={()=>onhandlePageevent('empreport')}>
                    <ListItemIcon><Assessment /></ListItemIcon> <ListItemText primary="Report" /></ListItem>
        
        {/* <ListItem button sx={{ pl: 4 }} onClick={()=>onhandlePageevent('syncdata')}> 
            <ListItemIcon><Sync /></ListItemIcon> <ListItemText primary="Sync" />
        </ListItem> */}
         <ListItem button onClick={onlogout}>
                    <ListItemIcon><ExitToApp /></ListItemIcon> <ListItemText primary="Logout" /></ListItem>
    </List>

    <Typography component="div" style={{ position:'absolute', bottom:0, left:0, right:0, display:'flex', alignItems:'center', color:'#999', fontSize:'12px', justifyContent:'center'}}>{datacontroller.getAppVersion()}</Typography>
</Drawer>

  );
}
