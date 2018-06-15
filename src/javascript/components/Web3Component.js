import React from 'react';
import PropTypes from 'prop-types';
import Web3 from 'web3'
import { username } from '../stores/accountStore';

let web3 = window.web3;
export const contractAddress = '0xbaa593e9c1f11bbcfa4725085211d764eec26592';
export const initContract = (abi) => {
    if (web3) {
        return web3.eth.contract(abi).at(contractAddress);
    }
}

export const getWeb3 = () => {
    return web3;
}

const Web3Component = (props, context) => {
    const web3Context = context.web3;
    const { selectedAccount } = web3Context;
    console.log(selectedAccount);
    return (<div> {username} </div>);
}

export const getAddress = (props, context) => {
    const web3Context = context.web3;
    const { selectedAccount } = web3Context;
    return (selectedAccount);
}



Web3Component.contextTypes = {
    web3: PropTypes.object,
};

export default Web3Component;