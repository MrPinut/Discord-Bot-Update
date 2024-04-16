const axios = require('axios')
const URLDEV = "http://localhost:5001/"
const URLPROD = "http://discord.subsprotocol.com/"

const URL = URLPROD

function verifyWallet(signature,code,address)
{
    return new Promise((resolve,reject) =>{
        axios.post(URL + "verifyWallet", {
            signature : signature,
            code : code,
            address : address
            })
        .then(function (response) {
          resolve(response.data)
        })
      .catch(function (error) {
          reject(error.response)
      });
})

}


module.exports = {
    verifyWallet
}