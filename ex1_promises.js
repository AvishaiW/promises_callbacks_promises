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
const commandLineArgs = require('command-line-args')
const fs = require('fs')
const request = require('request')

const optionDefinitions = [
    { name: 'address', alias: 'a', type: String },
    { name: 'file', alias: 'f', type: String }
]
const options = commandLineArgs(optionDefinitions)
let token = "MHQKPD3U77SMY59RF3Z7KSSA4UHDQBPXU9"

const toEth = (wei)=>{
    return parseInt(wei) / 1e18
}

let result = {
    totalEtherSupply : 0,
    lastPrice: 0 ,
    balance: 0,
    txList : {
    internal : [],
    normal : [],
    }
}
const totalAddr = `https://api.etherscan.io/api?module=stats&action=ethsupply&apikey=${token}` 
const lastAddr = `https://api.etherscan.io/api?module=stats&action=ethprice&apikey=${token}`
const balanceAddr = `https://api.etherscan.io/api?module=account&action=balance&address=${options.address}&tag=latest&apikey=${token}`
const normalAddr = `http://api.etherscan.io/api?module=account&action=txlist&address=${options.address}&startblock=0&endblock=99999999&sort=asc&apikey=${token}`
const internalAddr = `http://api.etherscan.io/api?module=account&action=txlist&address=${options.address}&startblock=0&endblock=99999999&sort=asc&apikey=${token}`
function getData(url) {
    return new Promise( (resolve, reject) => {
        request(url,(err,response,body) =>{
            if (err) {
                reject(err)
            } else {
                resolve(body)
            }
        })
    })
}

let errHandler = function(err) {
    console.log(err);
}

const totalSup = getData(totalAddr).then(JSON.parse, errHandler).then((body) => {
    result.totalEtherSupply = toEth(body.result)
    console.log(result)
    return result 
})
const lastPr = getData(lastAddr).then(JSON.parse, errHandler).then((body) => {
    result.lastPrice = JSON.parse(body.result.ethusd)
    return result 
})
const balanceA = getData(balanceAddr).then(JSON.parse, errHandler).then((body) => {
    result.balance = toEth(body.result)
    console.log(result)
    return result 
})
const normals = getData(normalAddr).then(JSON.parse, errHandler).then((body) => {
    result.txList.normal = body.result
    return result 
})
const internals = getData(internalAddr).then(JSON.parse, errHandler).then((body) => {
    result.txList.internal = body.result
    return result 
})
Promise.all([totalSup, lastPr, balanceA, normals, internals]).then((results) => {fs.writeFile(options.file, JSON.stringify(result),console.log)})