const fs = require('fs');
const http = require('http');
const url = require('url'); //for routing
const replaceTemplate = require('./modules/replaceTemplate');

const slug = require('slugify')

// Building Server => create then start

// turn this into a module and export it when we need it
// const replaceTemplate = (temp, product) => {
//     let output = temp.replace(/{%PRODUCTNAME%}/g,product.productName); // replace all occurences of {%PRODUCTNAME%} with product.productName
//     output = output.replace(/{%IMAGE%}/g,product.image);
//     output = output.replace(/{%PRICE%}/g,product.price);
//     output = output.replace(/{%FROM%}/g,product.from);
//     output = output.replace(/{%NUTRIENTS%}/g,product.nutrients);
//     output = output.replace(/{%QUANTITY%}/g,product.quantity);
//     output = output.replace(/{%DESCRIPTION%}/g,product.description);
//     output = output.replace(/{%ID%}/g,product.id);
    
//     if(!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g,'not-organic');
//     return output;
// }

// make sure only runs once
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');

// read templates
const overview = fs.readFileSync(`${__dirname}/templates/overview.html`, 'utf-8');
const products = fs.readFileSync(`${__dirname}/templates/product.html`, 'utf-8');
const card = fs.readFileSync(`${__dirname}/templates/card.html`, 'utf-8');

const dataObj = JSON.parse(data)

// slugify
const slugs = dataObj.map(el => slug(el.productName, { lower: true }));
console.log(slugs);

const server = http.createServer((req, res) => {
    console.log(req.url);
    console.log(url.parse(req.url, true));
    const { query, pathname } = url.parse(req.url, true); // query is the query string (id mawjoudeh b2alba), pathname is the path

    // Overview page
    if (pathname === '/' || pathname === '/overview') {
        // load template overview.html
        res.writeHead(200, { 'Content-type': 'text/html' });
        // map each element in dataObj to a string
        const cardsHtml = dataObj.map(el => replaceTemplate(card, el)).join(''); // join all elements in array to a string
        // ka2an 3emlin no3 DOM aw shi cx if you console.log out it 7a ybayen 2el div ou 2el h2 ou 2el p....
        const output = overview.replace('{%PRODUCT_CARDS%}', cardsHtml);
        res.end(output);

        // Product page
    } else if (pathname === '/product') {
        console.log(query);
        const product = dataObj[query.idd];//na3ref ay product lezem ybayen
        res.writeHead(200, { 'Content-type': 'text/html' });
        const output = replaceTemplate(products, product);
        res.end(output);
        // API
    } else if (pathname === '/api') {
        // making simple API
        // fs.readFile(`${__dirname}/dev-data/data.json`,'utf-8',(err,data)=>{
        //     const productData = JSON.parse(data);
        //     res.writeHead(200,{'Content-type':'application/json'}); //content-type is the type of data we are sending, in this case json data
        //     res.end(data);
        //     //have to make sure only read once and not multiple times 
        // }); // __dirname is the current directory
        res.writeHead(200, { 'Content-type': 'application/json' });
        res.end('data');
    }

    // Not found
    else {
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'hello-world'
        })
        res.end('Page not found')
    }
    // res.end('Hello from the server!');
});

server.listen(8000, '127.0.0.1', () => {
    console.log('Listening to requests on port 8000');
});

