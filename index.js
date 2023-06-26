const http = require("http") ;

const fs = require("fs") ;

var requests = require("requests") ;

const homeFile = fs.readFileSync("home.html" , "utf-8") ;

const replaceVal = (tempVal , orgVal) => {

  let valInCelcius = orgVal.main.temp - 273.15 ; valInCelcius = valInCelcius.toFixed(2) ;
  let temperature = tempVal.replace("{%tempval%}" , valInCelcius) ;
  
  let minvalInCelcius = orgVal.main.temp_min - 273.15 ; minvalInCelcius = minvalInCelcius.toFixed(2) ;
  temperature = temperature.replace("{%tempmin%}", minvalInCelcius);
  
  let maxvalInCelcius = orgVal.main.temp_min - 273.15 ; maxvalInCelcius = maxvalInCelcius.toFixed(2) ;
  temperature = temperature.replace("{%tempmax%}", maxvalInCelcius);

  temperature = temperature.replace("{%location%}", orgVal.name);
  temperature = temperature.replace("{%country%}", orgVal.sys.country);
  temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);
   
  return temperature ;           
}

const server = http.createServer((req , res) => {
    if(req.url == "/"){
        let city = "Mumbai" ;
        requests(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=a4d8aae5e75b6840f3a4a1551ac95051`)
        .on('data', (chunk) => {
           const objdata = JSON.parse(chunk) ;
           const arrData = [objdata] ;
            
            const realTimeData = arrData.map((val) => replaceVal(homeFile , val)).join("") ;
            
            res.write(realTimeData) ;
        })
        .on('end', (err) => {

        if (err) {
            console.log("hello") ;
            return console.log(err); 
        }
        res.end() ;  

        });
    }
}) ;

server.listen(process.env.PORT || 8000) ;  