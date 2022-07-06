import PropTypes from 'prop-types';
import React from 'react';
// material
import { Dialog, DialogContent} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

export default class LoaderContent extends React.Component {
    render() {
        return (
            <Dialog
                open={this.props.show}
                style={{width: '100%',height: '100%',top: '50%',left: '50%',transform: 'translate(-50%, -50%)',}}
                title= 'Loading'
                disablePortal={false}
                PaperProps={{
                    style: {
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                    },
                }}
            >
                <DialogContent style={{background: '#ffffff00'}}>
                    <CircularProgress
                    style= {{display: 'inline-block',color: '#134163'}}
                    size={50} ></CircularProgress>
                </DialogContent>
            </Dialog>
        )
    }
}
LoaderContent.propTypes = {
    show: PropTypes.bool,
}