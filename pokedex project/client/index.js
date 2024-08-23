let pokemonUrl
//if the user has been on the site recently it will load to the last saved url, otherwise page will load to the first set of data
try
{
    pokemonUrl = localStorage.getItem('backUrl')
}   
catch
{
    pokemonUrl = "https://pokeapi.co/api/v2/pokemon"
}
let pokemon = []

//handles initial page load
async function handleOnLoad()
{
    await getData()
    displayTable()
}

//retrieves data from api
async function getData()
{
    let response = await fetch(pokemonUrl)
    let data = await response.json()
    pokemon = data.results
    console.log(data)
}

//displays first set of data in a table 
function displayTable()
{
    let html = 
    `<table class="infotable">`


    pokemon.forEach((poke) => //utilized substring to make the first letter of the pokemon name capitalized
    {
        html+=
        `<tr>
            <td>${poke.name.substring(0, 1).toUpperCase()+poke.name.substring(1)}</td> 
            <td><button class="infobtn" onclick ="handleInfoClick('${poke.url}')"><img src = ./smpkball.png></button></td>
        </tr>`
    })
    html += '</table>'
    document.getElementById('app').innerHTML = html
}

//handles info button click
function handleInfoClick(url)
{
    console.log(url)
    localStorage.setItem('url', url) //stores the specified pokemon url
    console.log(pokemonUrl)
    localStorage.setItem('backUrl', pokemonUrl) //stores the url of the api page the user is currently seeing
    window.location.href = 'info.html'
}

//handles second html load
async function handleInfoLoad()
{
    let pokemonData = await getPokemonData()
    populateInfoTable(pokemonData)
}

//retrieves info of the specified pokemon and puts it into a table
function populateInfoTable(pokemonData)
{
    let html =
    `<img class="normal-form" src = "${pokemonData.sprites.front_default}">`

    html+=
    `<img class="shiny-form" src = "${pokemonData.sprites.front_shiny}">`

    html +=
    `<table class="pkmtable">
    <tr>
    <td><b>${pokemonData.name.substring(0, 1).toUpperCase()+pokemonData.name.substring(1)}</b></td>
    </tr>`
    html+= `<tr><td><b>Abilities:</b>`
    for(let i = 0; i < pokemonData.abilities.length; i++)
    {
        let ability = pokemonData.abilities[i].ability.name
        let f = ability.substring(0, 1).toUpperCase()
        let l = ability.substring(1)
        let abName = f + l
        html += ` ${abName}`
        if(i != pokemonData.abilities.length - 1) //used to put commas for easier readability
        {
            html+= ',';
        }
    }
    html+=`</td></tr>`;
    for(let i = 0; i < pokemonData.stats.length; i++) //adds all 6 stat types and their values to the table for specified pokemon
    {
        html+= `<tr><td><b>${pokemonData.stats[i].stat.name.toUpperCase()}:</b> ${pokemonData.stats[i].base_stat}</td></tr>`;
    }

    html+= `<tr><td><b>Shiny Form</b></td></tr>`
    html+= `</table>`

    html+= `<button class="back" onclick="handleBackClick()">⇦</button>`

    document.getElementById('info').innerHTML = html
}

//handles click to return the user to the page they were at before clicking info button, instead of just going back to the home page
function handleBackClick()
{
    window.location.href = 'index.html'
    pokemonUrl = localStorage.getItem('backUrl')
    handleOnLoad()
}

//retrieves data for the specified pokemon
async function getPokemonData()
{
    var url = localStorage.getItem('url')
    let response = await fetch(url)
    let data = await response.json()
    console.log(data)
    return data
}

//sets the url for onLoad if the next button is pressed
function setNextUrl(nextUrl)
{
    if(nextUrl != null)
    {
        pokemonUrl = nextUrl
    }
    else //once the nextUrl is null it routes the user back to the first page
    {
        pokemonUrl = "https://pokeapi.co/api/v2/pokemon"
    }
}

//sets the url for onLoad if the previous button is pressed
function setPreviousUrl(previousUrl)
{
    if(previousUrl != null)
    {
        pokemonUrl = previousUrl
    }
    else //if the user presses previous on the first page this will bring the user to the last page
    {
        pokemonUrl = "https://pokeapi.co/api/v2/pokemon?offset=1300&limit=20"
    }
}

//handles the click to change pages 
async function handlePageClick(page)
{
    let response = await fetch(pokemonUrl)
    let data = await response.json()
    if(page === 'next')
    {
        setNextUrl(data.next)
    }
    else
    {
        setPreviousUrl(data.previous)
    }
    handleOnLoad()
}

//returns the user to the first page no matter what html they are in
function handleHomeClick()
{
    pokemonUrl = "https://pokeapi.co/api/v2/pokemon"
    localStorage.setItem('backUrl', pokemonUrl)
    window.location.href = 'index.html'
    handleOnLoad()
}



