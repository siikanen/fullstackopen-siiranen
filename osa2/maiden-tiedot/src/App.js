import React, {useState, useEffect} from 'react';
import './App.css';
import axios from 'axios'

const Filter = ({setFilterFunction}) => {
  const handleFilterChange = (event) => {
    const filter = event.target.value
    filter === "" 
      ? setFilterFunction(null) 
      : setFilterFunction(filter)
  }
  return (
    <>
    <p>Filter countries with</p>
    <input
      onChange={handleFilterChange}
    />
    </>
  )
}

const Country = ({countryData}) => {
  const loadingWeathedata = {
    current: {
      temperature: "Loading...",
      weather_descriptions: "Loading...",
      weather_icons: ["/logo192.png"],
      wind_speed: "Loading...",
      wind_dir: "Loading..."
    }
  }
  const [ weatherData, setWeather ] = useState(loadingWeathedata)
  const api_key = process.env.REACT_APP_API_KEY

  useEffect(() => {
    axios
      .get(`http://api.weatherstack.com/current?access_key=${api_key}&query=${countryData.name}`)
      .then(
        response => {
          setWeather(response.data)
        }
      )
      .catch(err => console.log("Could not fetch weatherdata", err))
  }, [countryData.name, api_key])
  return (
    <div>
      <h2>{countryData.name}</h2>
      <p>capital {countryData.capital}</p>
      <p>population {countryData.population}</p>
      <h3>Languages</h3>
      <ul>
        {countryData.languages.map(
          lang => <li key={lang.name}>{lang.name}</li>
        )}
      </ul>
      <img
        src={countryData.flag}
        height="150px"
        alt={`${countryData.name} flag`}
      />
      <h3>Weather in {countryData.capital}</h3>
        <p><b>temperature:</b> {weatherData.current.temperature}</p>
        <img 
          src={weatherData.current.weather_icons[0]} 
          alt={weatherData.current.weather_descriptions} 
          height="50px"
          width="50px"
        />
        <p><b>wind:</b> {weatherData.current.wind_speed} mph 
          direction {weatherData.current.wind_dir}
        </p>
    </div>
  )
}

const CountryView = ({countries,setFilterFunction}) => {
  if ( countries.length > 10 ) {
    return <p>Too many matches, specify another</p>
  }
  else if ( countries.length === 0 ) {
    return <p>No matches</p>
  } 
  else if ( countries.length === 1 ) {
    return <Country countryData={countries[0]}/>
  }
  else {
    return (
    <>
      {countries.map(
          country => 
            <div key={country.name}>
              <p>{country.name}</p> 
              <button
                onClick={() => 
                  setFilterFunction(country.name)}
                >
              Show
              </button>
            </div>
      )}
    </>
    )
  }
}

const App = () => {
  const [ countries, setCountries ] = useState([])
  const [ filter, setFilter] = useState(null)

  useEffect(() => {
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => {
        setCountries(response.data)
      })
      .catch(err => console.log("Could not fetch countrydata", err))
  }, [])

  const countriesToShow = countries.filter(
    country => {
      if ( filter == null )
        return true
      else
        return country.name.toLowerCase().includes(
            filter.toLowerCase()) ? true : false
    }

  )

  return (
    <>
      <Filter setFilterFunction={setFilter} />
      <CountryView 
        countries={countriesToShow} 
        setFilterFunction={setFilter} 
      />
    </>
  )
}

export default App;
