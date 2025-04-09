const userTab=document.querySelector("[data-userWeather]")
const searchTab=document.querySelector("[data-searchWeather]")
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

// initally declared variable

let oldTab = userTab;
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
oldTab.classList.add("current-tab");
getfromSessionStorage();

//code to switch tabs 

function switchTab(newTab){
    //checks ki jo tab click kra wo different h na abhi waale se
    if(newTab!=oldTab){
        //this bus transfers css properties from old to new tab
        oldTab.classList.remove("current-tab");
        oldTab=newTab;
        oldTab.classList.add("current-tab");

        //checks ki search wala active nhi h na mtlb agar aisa h toh isi pe jane ko h 
        //toh grant acess aur user info sb hta do aur bs search wala dikhao

        if(!searchForm.classList.contains("active")){
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }

        //agar aisa nhi hai toh then ki humko useeer tab pe jana h from search tab toh search tab ke saare hta do aur user tab ke liye
        //ek function call krdo 

        else{
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");

            //is function se apna current coordinate jo local storage me rhta hai wo fetch hota hai
            getfromSessionStorage();

        }

    }
}

userTab.addEventListener("click",()=>{
    //agar user tab pe click hua h toh function cll kro switch wala using this as argument
    switchTab(userTab);
});

searchTab.addEventListener("click",()=>{
    switchTab(searchTab);
});


//check if user coordinate is present in session storage or not

function getfromSessionStorage(){
    const localCoordinates=sessionStorage.getItem("user-coordinates");

    if(!localCoordinates){
        //agar local coordinates present na ho toh

        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates=JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

//user info using coordinate maane latitude and longitudes 

async function fetchUserWeatherInfo(coordinates){
    const {lat,lon}=coordinates;
    //make grant container invisible
    grantAccessContainer.classList.remove("active");
    //loading screen ko active kro jab tak load ho rha
    loadingScreen.classList.add("active");

    //API CALL

    try{
        const response=await fetch( `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data= await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);

    }
    catch(err){

    }





}

//render function

function renderWeatherInfo(weatherInfo){
    //firstly we have to fetch the elements
    const cityName=document.querySelector('[data-cityName]');
    const countryIcon=document.querySelector('[data-countryIcon]');
    const weatherDesc=document.querySelector('[data-weatherDesc]');
    const weatherIcon=document.querySelector('[data-weatherIcon]');
    const temperature=document.querySelector('[data-temp]');

    //card wala data fetch'

    const windSpeed=document.querySelector('[data-windSpeed]');
    const humidity=document.querySelector('[data-humidity]');
    const clouds=document.querySelector('[data-clouds]');


    //fetch the data from info to the UI

    cityName.innerText=weatherInfo?.name;
    countryIcon.src=`https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    weatherDesc.innerText=weatherInfo?.weather?.[0]?.description;
    weatherIcon.src=`http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temperature.innerText=`${weatherInfo?.main?.temp} °C`;
    windSpeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    clouds.innerText = `${weatherInfo?.clouds?.all}%`;

}

//geolocation api wala function

function getLocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        alert("NOT supported");
    }
}

function showPosition(position) {

    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);

}



//grant location waale button pe ek listner lagana hoga

const grantAccessButton=document.querySelector('[data-grantAccess]');

grantAccessButton.addEventListener("click",getLocation);

//search form wala function
const searchInput=document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    if(searchInput==="") return;

    fetchSearchWeatherInfo(searchInput.value);
});

    async function fetchSearchWeatherInfo(city) {
        loadingScreen.classList.add("active");
        userInfoContainer.classList.remove("active");
        grantAccessContainer.classList.remove("active");
    
        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
              );
            const data = await response.json();
            loadingScreen.classList.remove("active");
            userInfoContainer.classList.add("active");
            renderWeatherInfo(data);
        }
        catch(err) {
            //hW
        }
}
    




























userTab.addEventListener("click", () => {
    //pass clicked tab as input paramter
    switchTab(userTab);
});

searchTab.addEventListener("click", () => {
    //pass clicked tab as input paramter
    switchTab(searchTab);
});



















// const API_KEY="da161a8153ad076333412a480c9c0df8";






// async function showWeather(){
//     try{
//         let city_name="patna";
//         const lat=25.6;
//         const long=81.9;

//         const response=await fetch('https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current=temperature_2m,rain&hourly=temperature_2m&daily=temperature_2m_max,temperature_2m_min&timezone=GMT');
    
//         const data=await response.json();
    
//         console.log("Weather data:-->",data);
    
//         let newpara=document.createElement('p');
//         newpara.textContent=`${data?.current?.temperature_2m.toFixed(2)} C`
    
//         document.body.appendChild(newpara);

//         renderWeatherInfo(data);

//     }
//     catch(err){

//     }

//     // try{
//     //     async function FetchApi(){
//     //         const response=await fetch()
//     //     }
//     // }
   
// }

// ------------------- Recent Search History -------------------
function updateSearchHistory(city) {
    let history = JSON.parse(localStorage.getItem("search-history")) || [];
    history = history.filter(item => item.toLowerCase() !== city.toLowerCase());
    history.unshift(city);
    if (history.length > 5) history.pop();
    localStorage.setItem("search-history", JSON.stringify(history));
    renderSearchHistory();
}

function renderSearchHistory() {
    const history = JSON.parse(localStorage.getItem("search-history")) || [];
    let container = document.querySelector(".history-container");
    if (!container) {
        container = document.createElement("div");
        container.className = "history-container";
        document.querySelector(".wrapper").appendChild(container);
    }
    container.innerHTML = "<h3>Recent Searches</h3>" + history.map(city => `<p class="history-item">${city}</p>`).join("");
    container.querySelectorAll(".history-item").forEach(el => {
        el.addEventListener("click", () => fetchSearchWeatherInfo(el.textContent));
    });
}

// ------------------- 5-Day Forecast -------------------
async function fetchFiveDayForecast(city) {
    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
    );
    const data = await response.json();
    let forecastHTML = "<h3>5-Day Forecast</h3><div class='forecast-container'>";
    for (let i = 0; i < data.list.length; i += 8) {
        const day = data.list[i];
        forecastHTML += `
            <div class="forecast-item">
                <p>${new Date(day.dt_txt).toDateString()}</p>
                <img src="http://openweathermap.org/img/w/${day.weather[0].icon}.png" />
                <p>${day.main.temp} °C</p>
            </div>
        `;
    }
    forecastHTML += "</div>";
    let forecastContainer = document.querySelector(".forecast");
    if (!forecastContainer) {
        forecastContainer = document.createElement("div");
        forecastContainer.className = "forecast";
        document.querySelector(".wrapper").appendChild(forecastContainer);
    }
    forecastContainer.innerHTML = forecastHTML;
}

// ------------------- Theme Toggle -------------------
document.getElementById("theme-toggle").addEventListener("click", () => {
    document.body.classList.toggle("light-theme");
});

// ------------------- Refresh Button -------------------
document.getElementById("refresh-btn").addEventListener("click", () => {
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if (localCoordinates) {
        fetchUserWeatherInfo(JSON.parse(localCoordinates));
    }
});

// Inject history update and forecast after successful search
const originalFetchSearchWeatherInfo = fetchSearchWeatherInfo;
fetchSearchWeatherInfo = async function(city) {
    await originalFetchSearchWeatherInfo(city);
    updateSearchHistory(city);
    fetchFiveDayForecast(city);
};

// Initial render for search history
renderSearchHistory();
