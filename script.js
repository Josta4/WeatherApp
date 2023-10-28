const API_KEY = "2e0a8235b315b6e33d5603e5f5e10e03";
const API_URL = "https://api.openweathermap.org/data/2.5/weather?units=metric&lang=en&q=";

var i = 0;

async function checkWeather(city) {
    
    const response = await fetch(API_URL + city + `&appid=${API_KEY}`); 
    var data = await response.json();
    console.log(data);
    
    if(data.cod == 404) {
        
        console.log("error, something went wrong!");
        document.querySelector(".error").style.display="block";
        document.querySelector(".weather").style.display="none";
        document.querySelector(".underButton").style.display ="none";
        document.querySelector(".interactiveMap").style.display="none"
        
    } else {
        
        const response5Days = await fetch(`https://api.openweathermap.org/data/2.5/forecast?&daily=weathercode&units=metric&lat=${data.coord.lat}&lon=${data.coord.lon}&cnt=25&appid=${API_KEY}`);
        var data5Days = await response5Days.json();
        document.getElementById("map").src=`https://openweathermap.org/weathermap?basemap=map&cities=true&layer=radar&lat=${data.coord.lat}&lon=${data.coord.lon}&zoom=12`;
        console.log("fetch singola: " + response);
        console.log("fetch 5 giorni: " + response5Days);
        
        function getDate() {
            
            if (i == 0) {
                
                const utcSeconds = parseInt(data.dt, 10) + parseInt(data.timezone, 10);
                const utcMilliseconds = utcSeconds * 1000;
                const localDate = new Date(utcMilliseconds).toUTCString();
                return (document.querySelector(".time").innerHTML = localDate);
                
            } else {
                
                const utcSeconds = parseInt(data5Days.list[i].dt, 10) + parseInt(data5Days.city.timezone, 10);
                const utcMilliseconds = utcSeconds * 1000;
                const nextDate = new Date(utcMilliseconds);
                const nextDateCard =nextDate.getDate()+'/'+(nextDate.getMonth()+1)+'/'+nextDate.getFullYear();
                return (document.querySelector(".time").innerHTML = nextDateCard);
            }
        }
        
        function getMeteo() {
            
            document.querySelector(".city").innerHTML = data5Days.city.name;
            document.querySelector(".temp").innerHTML = Math.round(data5Days.list[i].main.temp) + "°C";
            document.querySelector(".humidity").innerHTML = data5Days.list[i].main.humidity +"%";
            document.querySelector(".wind").innerHTML = data5Days.list[i].wind.speed + " km/h";
            document.querySelector(".meteo").innerHTML = data5Days.list[i].weather[0].description;
            
            const moon = data.dt  >= data.sys.sunset || data.dt <= data.sys.sunrise;
            
            if(data5Days.list[i].weather[0].main == "Clouds") {
                
                moon? (weatherIcon.src = "images/clouds_moon.png",
                document.querySelector(".card").style.background="linear-gradient(145deg, rgb(72, 80, 98), rgb(232, 224, 145, 0.9))")
                : (weatherIcon.src = "images/clouds.png",
                document.querySelector(".card").style.background="linear-gradient(145deg, rgb(202, 202, 126), rgb(232, 224, 145, 0.9))");
                
            } else if (data5Days.list[i].weather[0].main == "Clear") {
                
                moon? (weatherIcon.src = "images/clear_moon.png",
                document.querySelector(".card").style.background="linear-gradient(135deg, rgb(232, 221, 100),rgb(54, 78, 115, 0.9))") 
                : (weatherIcon.src = "images/clear.png",
                document.querySelector(".card").style.background="linear-gradient(135deg, rgb(232, 221, 100),rgb(94, 160, 191, 0.9))");
                
            } else if (data5Days.list[i].weather[0].main == "Rain") {
                
                moon? (weatherIcon.src = "images/rain_moon.png",
                document.querySelector(".card").style.background="linear-gradient(135deg, rgb(24, 28, 50),rgb(3, 46, 86, 0.9))") 
                : (weatherIcon.src = "images/rain.png",
                document.querySelector(".card").style.background="linear-gradient(135deg, rgb(100, 190, 232),rgb(3, 46, 86, 0.9))");
                
            } else if (data5Days.list[i].weather[0].main == "Mist") {
                
                moon? (weatherIcon.src = "images/mist_moon.png",
                document.querySelector(".card").style.background="linear-gradient(135deg, rgb(123, 141, 155),rgb(73, 94, 102, 0.9))") 
                : (weatherIcon.src = "images/mist.png",
                document.querySelector(".card").style.background="linear-gradient(135deg, rgb(158, 196, 213),rgb(73, 94, 102, 0.9))");
                
            } else if (data5Days.list[i].weather[0].main == "Thunderstorm") {
                
                moon? (weatherIcon.src = "images/storm_moon.png",
                document.querySelector(".card").style.background="linear-gradient(135deg, rgb(19, 18, 44),rgb(26, 32, 76, 0.9))")
                : (weatherIcon.src = "images/storm.png",
                document.querySelector(".card").style.background="linear-gradient(135deg, rgb(43, 48, 68),rgb(26, 32, 76, 0.9))");
                
            } else if (data5Days.list[i].weather[0].main == "Drizzle") {
                
                weatherIcon.src = "images/drizzle.png"
                document.querySelector(".card").style.background="linear-gradient(135deg, rgb(100, 190, 232),rgb(142, 184, 201, 0.9))";
                
            } else if (data5Days.list[i].weather[0].main == "Snow") {
                
                weatherIcon.src = "images/snow.png"
                document.querySelector(".card").style.background="linear-gradient( 135deg, rgb(152, 182, 194),rgb(69, 143, 136, 0.9))";
            }
            
            if (i < 8) {
                
                document.querySelector(".prev").innerHTML = "Today";
                document.querySelector(".next").innerHTML = "Tomorrow";  
                document.querySelector(".prev").disabled= true;
                
            } else if (i >= 24) {
                
                document.querySelector(".next").disabled= true;
                document.querySelector(".next").innerHTML = "3 days limit reached";
                document.querySelector(".prev").innerHTML = "Previous day";
                
            } else {           
                
                document.querySelector(".prev").disabled= false;
                document.querySelector(".next").disabled= false;
                document.querySelector(".next").innerHTML = "Next day";
                document.querySelector(".prev").innerHTML = "Previous day";
            }
            
            getDate();
            document.querySelector(".error").style.display="none";
            document.querySelector(".underButton").style.display = "block";
            document.querySelector(".weather").style.display="block";
            document.querySelector(".interactiveMap").style.display="block";
        }
    }
    getMeteo();
}

