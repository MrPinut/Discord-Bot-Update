import React from "react"
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import constants from "../constants.json"
import  Web3  from "web3"
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3Modal from "web3modal";
import "../css/ConnectWallet.css"



const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

const providerOptions = {
  walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        infuraId: "b66b4cb4f41b4d08ad225d3e311b99c3" // required
      }
    }
};

export default class ConnectWallet extends React.Component
{
    constructor(props)
    {
        super(props)
        this.state = {
            snackSucces : false,
            snackError : false,
            messageError : "",
            messageSucces : "",
            account : null,
            isConnected : false,
        }
        this.isConnected = null;
    }

   

    componentDidMount() {
      if(localStorage.getItem('connected') == "true"){
        this.connectWalletHandler()
      }
    }

    shouldComponentUpdate(nextProps, nextState)
    {
      if (this.state.isConnected!= nextState.isConnected)
      {
        this.props.setConnected(nextState.isConnected)
      }
      return true;
    }



     

    connectWalletHandler = async () => {
            
      //TODO ajouter on disconnect
    const web3Modal = new Web3Modal({
        cacheProvider: false, // optional
        providerOptions, // required
        cacheProvider: true,
        theme: "dark"
    });
    
    
    try{
        var provider = await web3Modal.connect();
        this.props.setProvider(provider);
        localStorage.setItem('connected', "true");

    } catch(err) {
      console.log(err)
      web3Modal.clearCachedProvider();
      localStorage.setItem('connected', "false");
      this.isConnected = false;
        this.setState({isConnected : false, messageError : "You are not connected to an account !",snackError : true})
        return
    }
    
 
       try
       {
           var web3 = new Web3(provider);
           const accounts = await web3.eth.getAccounts()


            
           provider.on('accountsChanged', (accounts) => {
             if (accounts.length==0)
             {
              web3Modal.clearCachedProvider();
              localStorage.setItem('connected', "false");

              this.props.setProvider(null);
              this.setState({isConnected : false, account : "",snackError : true, messageError : "You have been disconnected from the Website"})   
                  

             }
             else
             {
              this.setState({isConnected : true, account : accounts[0],snackSucces : true, messageSucces : "You switched account"}) 
              this.props.setProvider(null);
              this.props.setProvider(provider);
              this.props.setConnected(this.state.isConnected)
              this.isConnected = true;     
              
             }
           
          })

          provider.on('disconnect', (accounts) => {
            localStorage.setItem('connected', "false");
            web3Modal.clearCachedProvider();


            this.props.setProvider(null);
            this.setState({isConnected : false, account : "",snackError : true, messageError : "You have been disconnected from the Website"})         

           
          
         })

          provider.on('chainChanged', (networkId) =>{
            if (networkId!=constants.networkId)
            {
             this.setState({isGoodNetwork : false,snackError : true, messageError : "You are on the wrong Network. Please, switch on the "+constants.networkName+" network"})          

            }
            else
            {
             this.setState({isGoodNetwork : true,snackSucces : true, messageSucces : "You are now on the good network"})          
            }
            
          });
        
          //const chainId = await ethereum.request({ method: 'eth_chainId' });
            const chainId = await web3.eth.getChainId();
            if (chainId==constants.networkId)
            {
              this.setState({isGoodNetwork : true, isConnected : true, account : accounts[0],snackSucces : true, messageSucces : "You are now connected to the Website with Metamask"})    
              this.isConnected = true;
              console.log("la")

            }
            else
            {
              this.setState({isGoodNetwork: false, isConnected : true, account : accounts[0],snackError : true, messageError : "You are on the wrong Network. Please, switch on the "+constants.networkName+" network"})    
            }
            

        }
         catch(err)
         {
          localStorage.setItem('connected', "false");
          web3Modal.clearCachedProvider();

           console.log(err)
            this.setState({isConnected : false, messageError : "Can't connect to your Metamask account !",snackError : true})
         }

         this.props.setConnected(this.state.isConnected)
    

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


        

        return(
            <div class = {this.props.class}>
              <Snackbar anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
            }}
            open={this.state.snackSucces} autoHideDuration={2500} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success">
                    {this.state.messageSucces}
                </Alert>
            </Snackbar>

        <Snackbar anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
                }}
                open={this.state.snackError} autoHideDuration={2500} onClose={handleCloseFailed}>
            <Alert onClose={handleCloseFailed} severity="error">
                {this.state.messageError}
            </Alert>
        </Snackbar>
            </div>
        )
    }
}