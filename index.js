const http = require('http');
const fs = require('fs');
const requests = require('requests');
const port = process.env.PORT || 8000;
const homeFile = fs.readFileSync('index.html', 'utf-8');
const showValue = (fileValue, origValue) => {
    let replacedValue = fileValue.replace('{%tempval%}', (origValue.main.temp - 273.15).toFixed(2));
    replacedValue = replacedValue.replace('{%tempMin%}', (origValue.main.temp_min - 273.15).toFixed(2));
    replacedValue = replacedValue.replace('{%tempMax%}', (origValue.main.temp_max - 273.15).toFixed(2));
    replacedValue = replacedValue.replace('{%feelsLike%}', (origValue.main.feels_like - 273.15).toFixed(2));
    replacedValue = replacedValue.replace('{%city%}', origValue.name);
    replacedValue = replacedValue.replace('{%country%}', origValue.sys.country);
    replacedValue = replacedValue.replace('{%tempStatus%}', origValue.weather[0].main);
    return replacedValue;
}
const server = http.createServer((req, res) => {
    if (req.url == '/') {
        requests('https://api.openweathermap.org/data/2.5/weather?q=Karachi&appid=1b7c17cce68e77567c56fc34bf15e8f9')
            .on('data', (chunk) => {
                const data = [JSON.parse(chunk)];
                const realData = data.map((curVal) => {
                    return showValue(homeFile, curVal)
                }).join('');
                res.write(realData);
            })
            .on('end', (err) => {
                if (err) return console.log('connection closed due to errors', err);
                res.end();
            });
    } else {
        res.end("page not found")
    }
});

server.listen(port, '127.0.0.1')