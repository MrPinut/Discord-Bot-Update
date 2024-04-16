import './App.css';
import React from "react"
import Web3 from 'web3';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "@fontsource/poppins"
import constants from "./constants.json"
import ConnectWallet from './components/ConnectWallet';
import ConnectWalletButton from './components/ConnectWalletButton';


export default class App extends React.Component {
    constructor(props) {
        super(props)
        this.connectWallet = null;
        this.state = {
            provider: null,
            isMobileMode: false,
            readProvider: new Web3.providers.WebsocketProvider(constants.provider),
            isConnected: false,
            account: "",
        }

        this.setConnectWallet = element => {
            this.connectWallet = element;
            console.log(element)
        }

    }

    setProvider = (provider) => {
        this.setState({ provider });
    }



    render() {

        const connectWalletHandler = () => {
            this.connectWallet.connectWalletHandler();
        }

        const setConnected = async (etat) => {
            var account = "";
            if (etat) {
                const web3User = new Web3(this.state.provider);

                account = (await web3User.eth.getAccounts())[0]

            }

            this.setState({ isConnected: etat, account: account })
        }




        return (
            <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>

                <Router>
                    <Routes>
                        <Route path="/:code" element={
                            <div class="titleApp">
                                <h1 style={{color: '#1B254B'}}>Welcome on crypto Project</h1>
                                <h2 style={{color: '#1B254B'}}>Link your wallet adress to your discord account by clicking on the button bellow</h2>
                                <ConnectWalletButton provider={this.state.provider} account={this.state.account} isConnected={this.state.isConnected} connectWalletHandler={connectWalletHandler} class="connectButtonHeader"></ConnectWalletButton>
                                <ConnectWallet setConnected={setConnected.bind(this)} ref={this.setConnectWallet} setProvider={this.setProvider}></ConnectWallet>
                            </div>
                        }>

                        </Route>
                        <Route path="/" element={
                            <div class="titleApp">
                                <h1 style={{color: '#1B254B'}}>Overview</h1>
                                <h2 style={{color: '#1B254B'}}>Code is missing</h2>
                            </div>
                        }>
                        </Route>
                    </Routes>
                </Router>





            </div>
        )
    }
}