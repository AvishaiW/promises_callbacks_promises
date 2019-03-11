/***
 * --input: file.json
 * --output: save to file 
 * given a list ethereum address, get the balance of each address and save to json 
 * input.json: 
 * {
 * addresses : ['0x715d4b5180fd31ab9abaf63646c6afdb3ce37a3c','0x42a8bef25391d7cbc476309783e90303d99cda81','0x3d1ba9be9f66b8ee101911bc36d3fb562eac2244','0x1b0e35ef869f37fc87770be23a07837fe467594d']
 * }
 * output.json:
 * {
 * balances : {
 *  'addr1' : balance, 
 *  'addr2' : balance2, 
 * .... 
 * }
 * }
 */
const fs = require('fs')
const commandLineArgs = require('command-line-args')
const request = require('request')
const parallel = require('async/parallel') 

const optionDefinitions = [
    { name: 'input', alias: 'i', type: String },
    { name: 'output', alias: 'o', type: String }
]
const options = commandLineArgs(optionDefinitions)
let token = "MHQKPD3U77SMY59RF3Z7KSSA4UHDQBPXU9"

const toEth = (wei)=>{
    return parseInt(wei) / 1e18
}
function ex2_no_promise(){

fs.readFile(options.input, 'utf-8', (err, input) => {
    let addresses = JSON.parse(input)["addresses"]

    result = {
        balances: {}
    }
    const getBalance = (addr, callback) => {
        const balanceAddr = `https://api.etherscan.io/api?module=account&action=balance&address=${addr}&tag=latest&apikey=${token}`
        request(balanceAddr, (err, res, body) => {
            callback(null, toEth(JSON.parse(body).result))
        })
    }
    jobs = {}
    addresses.forEach((addr) => {
        jobs[addr] = (callback) => {
            getBalance(addr,callback)
        }
    })

    parallel(jobs,(err,results)=>{
        console.log("error ? " + err )
        result.balances = results
        fs.writeFile(options.output, JSON.stringify(result, null, 2),console.log)
    })
})
}

// pure promise 

// const getBalancePromise = (addr) => {
//     const balanceAddr = `https://api.etherscan.io/api?module=account&action=balance&address=${addr}&tag=latest&apikey=${token}`
//     return new Promise((resolve,reject)=>{
//         request(balanceAddr, (err, res, body) => {
//             if(err){
//                 return reject(err)
//             }
//             resolve(toEth(JSON.parse(body).result))
//         })
//     })
// }

// const util = require('util')
// const readFile = util.promisify(fs.readFile)

// async function ex2_promises(){
//     let input = await readFile(options.input);
//     let addresses = JSON.parse(input)["addresses"]
//     let balances = []
//     for(let i=0;i<addresses.length;++i){
//         let balance = await getBalancePromise(addresses[i]);
//         balances.push(balance)
//     }
//     console.log(balances)
//     return balances 
// }


// ex2_promises()