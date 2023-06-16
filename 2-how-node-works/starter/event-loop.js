const fs = require('fs')
const crypto = require('crypto')

const date = Date.now()
console.log(Date.now())

process.env.UV_THREADPOOL_SIZE = 1 // default 4, 1 threadpool per core
// crypto thing takes longer to execute  
// iza men 7eta 4 all 4 passwords are encrypted at the same time, fare2 shi couple seconds

setTimeout(() => console.log('Timer 1 finished'), 0)
setImmediate(() => console.log('Immediate 1 finished'))
console.log('Hello from the top-level code')

fs.readFile('test-file.txt', () => {
    console.log('I/O finished')
    console.log('----------------')
    setTimeout(() => console.log('Timer 2 finished'), 2000)
    setTimeout(() => console.log('Timer 3 finished'), 2)
    setImmediate(() => console.log('Immediate 2 finished')) // get executed once per tick

    process.nextTick(() => console.log('Process.nextTick')) // get executed immediately

    crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
        console.log('Password encrypted' + " "+ (Date.now() - date) )
    })
    crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
        console.log('Password encrypted' + " "+ (Date.now() - date) )
    })
    crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
        console.log('Password encrypted' + " "+ (Date.now() - date) )
    })
    crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
        console.log('Password encrypted' + " "+ (Date.now() - date) )
    })
})

console.log('Hello from the top2-level code')