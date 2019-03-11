// write a program that: 
// cli input: 
// --address <ethereum address> - input address 
// --db <filename> - save to filename 
// output: 
/**
 * {
 * totalEtherSupply: 
 * lastPrice: 
 * balance: 
 * txList : {
 * internal : [],
 * normal : [],
 * }
 * 
 */

 
const toEth = (wei)=>{
    return parseInt(wei) / 1e18
}
const optionDefinitions = [
    { name: 'address', alias: 'a', type: String },
    { name: 'file', alias: 'f', type: String }
]
const commandLineArgs = require('command-line-args')
const fs = require('fs')

const options = commandLineArgs(optionDefinitions)
const request = require('request')
let token = "MHQKPD3U77SMY59RF3Z7KSSA4UHDQBPXU9"
ex1()
function ex1(){
    const balanceAddr = `https://api.etherscan.io/api?module=account&action=balance&address=${options.address}&tag=latest&apikey=${token}`
    request(balanceAddr,(err,response,body) =>{
        let result = {
                totalEtherSupply : 0,
                lastPrice: 0 ,
                balance: 0,
                txList : {
                internal : [],
                normal : [],
            }
        }
        result.balance = toEth(JSON.parse(body).result)
    
        const totalAddr = `https://api.etherscan.io/api?module=stats&action=ethsupply&apikey=${token}`   
        request(totalAddr, (err, res, body) => {
            result.totalEtherSupply = toEth(JSON.parse(body).result)
            const lastAddr = `https://api.etherscan.io/api?module=stats&action=ethprice&apikey=${token}`
            request(lastAddr, (err, res, body) => {
                result.lastPrice = toEth(JSON.parse(body).result.ethusd)
                const normalAddr = `http://api.etherscan.io/api?module=account&action=txlist&address=${options.address}&startblock=0&endblock=99999999&sort=asc&apikey=${token}`
                request(normalAddr, (err, res, body) => {
                    result.txList.normal = JSON.parse(body).result
                    const internalAddr = `http://api.etherscan.io/api?module=account&action=txlist&address=${options.address}&startblock=0&endblock=99999999&sort=asc&apikey=${token}`
                    request(internalAddr, (err, res, body) => {
                        result.txList.internal = JSON.parse(body).result
                        fs.writeFile(options.file, JSON.stringify(result),console.log)
                    })
                })
            })
        })    
    })
}