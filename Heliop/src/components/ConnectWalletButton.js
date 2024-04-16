import React from "react"
import LoginIcon from '@mui/icons-material/Login';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { Button } from "@mui/material";
import Web3 from 'web3';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import {keccak256 } from "crypto-js"
import api from "./API"
const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });


export default class ConnectWalletButton extends React.Component
{
    constructor(props)
    {
        super(props)
        this.state = {
            snackSucces : false,
            snackError : false,
            messageError : "",
            messageSucces : "",
            code : ""
        }
    }

   
    componentDidMount()
    {
        const code = window.location.href.split('/')[3]
        console.log(code)
        this.setState({code : code})

    }

    render(){

        const handleClose = (reason) =>{
            if (reason === 'clickaway') {
                 return;
               }
           
               this.setState({snackSucces : false})
           }
           
           const handleCloseFailed = (reason) =>{
            if (reason === 'clickaway') {
                 return;
               }
           
               this.setState({snackError : false})
           }
           async function verifySignature(message, signature, address,web3)  {
            const msgHash = await web3.utils.sha3(message);
            const { v, r, s } = await web3.eth.accounts.recover(msgHash, signature);
            const recoveredAddress = await web3.eth.accounts.recover(msgHash, v, r, s);
          
            return recoveredAddress.toLowerCase() === address.toLowerCase();
          }


        const  signMessage = async (account,provider) => {
            var code = this.state.code
            var message = "VerifyWallet:"+code;

            try {
                const web3 = new Web3(provider);
              var signature = await web3.eth.sign(message,account);
              var account = await verifySignature(messageHash, signature, account,web3);
              console.log(account)
            } catch (err) {
                console.error(err.code);
              
                if (err.code == -32602)
                {
                    try
                    {
                        const web3 = new Web3(provider);
                        var code = this.state.code
                        var messageHash = web3.utils.keccak256(message); // Hacher le message
                        console.log(message,messageHash)
                        var signature = await web3.eth.sign(messageHash,account);
                        api.verifyWallet(signature,code,account).then((res) => {
                            console.log(res)
                            
                                this.setState({snackSucces : true, messageSucces : "Your account is verified"})
                        })
                        .catch((err) => {
                            console.log(err)
                            this.setState({snackError : true, messageError : "Your account is not verified, an error occured"})
                        }
                        )
                    }
                    catch (err)
                    {
                        console.log(err)
                        this.setState({snackError : true, messageError : "Your account is not verified, an error occured"})

                    }

                }
                else
                {
                    this.setState({snackError : true, messageError : err.message})

                }
            }
        }
        return(
            <div class = {this.props.class}>
              {!this.props.isConnected  && (
                <Button variant="contained" onClick = {this.props.connectWalletHandler} style = {{ color : "white"}}>Connect</Button>                
                 ) ||
                 <React.Fragment>
                 <span class = "connect white"><AccountBalanceWalletIcon style = {{verticalAlign: "middle"}}></AccountBalanceWalletIcon><span style = {{marginLeft : "5px"}}>Connected with : {this.props.account!=null &&this.props.account}</span></span>
                 <br></br>
                 <Button onClick = {() => signMessage(this.props.account,this.props.provider)} variant="contained" style = {{ color : "white"}}>Verify your account</Button>
                 </React.Fragment>
                  }




<Snackbar anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
            }}
            open={this.state.snackSucces} autoHideDuration={4000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success">
                    {this.state.messageSucces}
                </Alert>
            </Snackbar>

        <Snackbar anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
                }}
                open={this.state.snackError} autoHideDuration={4000} onClose={handleCloseFailed}>
            <Alert onClose={handleCloseFailed} severity="error">
                {this.state.messageError}
            </Alert>
        </Snackbar>




            </div>
        )
    }
}