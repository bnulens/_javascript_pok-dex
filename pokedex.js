
        /*==================================================================================================
        ======================================== Magic Happens Here! =======================================
        ==================================================================================================*/
        //Variables are declared.
        let base_url = "https://pokeapi.co/api/v2/";
        let poke_search = document.getElementById("pokesearch");
        let search = document.getElementById("search");
        let previous = document.getElementById("previous");
        let next = document.getElementById("next");
        let list = document.getElementById("list");
        let pokemon_name;
        let pokemon_id;
        let pokemon_moves;
        let pokemon_abilities;
        let pokemon_image;
        let pokemon_weight;
        //EventListeners are added to HTML elements.
        search.addEventListener("click", function() {
            LoadPokemon(poke_search.value);
        });
        poke_search.addEventListener("keyup", function(event) {
            if (event.key === "Enter") {
                LoadPokemon(poke_search.value);
            }
        })
        previous.addEventListener("click", function() {
            if (pokemon_id === undefined) {
                pokemon_id = 2;
            }
            LoadPokemon(--pokemon_id);
        });
        next.addEventListener("click", function() {
            if (pokemon_id === undefined) {
                pokemon_id = 0;
            }
            LoadPokemon(++pokemon_id);
        })
        //Function that looks up the data for a pokemon when it's given the pokemon's name or id number.
        function LoadPokemon(pokemon){
            let request = new XMLHttpRequest();
            let dots = 1;
            request.onreadystatechange = function() {
                if (this.readyState === 4 && this.status == 200 && pokemon !== "") {
                    SetVariables(JSON.parse(this.responseText));
                }
                else {
                    SetVariables(dots++);
                }
            }
            request.open("GET", base_url + "pokemon/" + pokemon.toString().toLowerCase(), true);
            request.send();
        }
        //This function changes the variables with the most recent pokemon's information.
        function SetVariables(data){
            if(typeof data === "number") {
                console.log("Searching for data" + ".".repeat(data))
            }
            else {
                console.log("Data found!", data)
                pokemon_name = data.name;
                pokemon_id = data.id;
                pokemon_moves = data.moves.map(x => x.move.name);
                pokemon_abilities = data.abilities.map(x => x.ability.name);
                pokemon_image = data.sprites.front_default;
                pokemon_weight = data.weight;
                DoThingsWithTheDom();
                LogPokeData();
            }
        }
        //This function loads all of the pokemons and stores them in a list in your HTML.
        //Clicking one of the list items will then look up data for that specific pokemon!
        function LoadPokemonList() {
            let request = new XMLHttpRequest();
            list.innerHTML = "";
            request.onreadystatechange = function() {
                if (this.readyState === 4 && this.status == 200) {
                    let pokemon_list = JSON.parse(this.responseText).results.map(x => x.name);
                    for (pokemon of pokemon_list) {
                        let li = document.createElement("li");
                        li.innerHTML = pokemon;
                        li.addEventListener("click", function() {
                            LoadPokemon(this.innerHTML);
                        })
                        list.append(li);
                    }
                }
            }
            request.open("GET", base_url + "pokemon?offset=0&limit=807", true);
            request.send();
        }
        //Function that you can call to see the current pokemon's information
        function LogPokeData() {
            console.log("Name: " + pokemon_name
            + "\n" + "ID: " + pokemon_id
            + "\n" + "Moves:", pokemon_moves
            , "\n" + "Abilities:", pokemon_abilities
            , "\n" + "Image URL: " + pokemon_image
            + "\n" + "Weight: " + pokemon_weight);
        }
        /*==================================================================================================
        ======================================== Magic Ends Here! ==========================================
        ==================================================================================================*/
           /*
            Write your code here!
            The following variables contain data for you to use. Be careful with the data types (some are numbers, some are strings and some are arrays)! 
                pokemon_name
                pokemon_id
                pokemon_moves
                pokemon_abilities
                pokemon_image
                pokemon_weight
            The goal of the exercise is for you to display this information in your HTML.
            You can do this by placing empty tags in your HTML, and the assigning their content with JS.
            But you can also generate the HTML with document.createElement().
            */
        
        function DoThingsWithTheDom() {
            if (list.childNodes.length > 0) {
                list.removeChild(list.childNodes[0]);
            }

            var listItem = document.createElement("LI");
            var image = getPokemonImage();
            var info = getPokemonInfo();

            listItem.appendChild(image);
            listItem.appendChild(info);
            list.insertBefore(listItem, list.childNodes[0]);
        }

        function getPokemonImage() {
            var image = document.createElement("IMG");
            image.setAttribute("src", pokemon_image);
            image.setAttribute("width", "100");
            image.setAttribute("height", "100");
            image.setAttribute("alt", pokemon_name);

            return image;
        }

        function getPokemonInfo() {
            // create the elements we want to add
            var div = document.createElement("div");
            var header = document.createElement("h2");
            var weightParagraph = document.createElement("P");
            var movesParagraph = document.createElement("P");
            var abilityParagraph = document.createElement("p");

            // add classes for styling
            div.setAttribute("class", "pokemon-info");
            weightParagraph.setAttribute("class", "weight");
            movesParagraph.setAttribute("class", "moves");
            abilityParagraph.setAttribute("class", "abilities");
            
            // capitalize pokemon name
            var capitalizedName = pokemon_name.charAt(0).toUpperCase() + pokemon_name.slice(1);

            // collect the info we want to display
            var pokemonName = document.createTextNode(capitalizedName);
            var pokemonWeight = document.createTextNode(`${capitalizedName}'s weight: ${pokemon_weight} kg.`);
            var pokemonMoves = document.createTextNode(`Some of ${capitalizedName}'s killer moves: ${getFivePokemonMoves()}.`);
            var pokemonAbilities = document.createTextNode(`Quality features are: ${getPokemonAbilities()}.`);

            // append to the elements
            header.appendChild(pokemonName);
            weightParagraph.appendChild(pokemonWeight);
            movesParagraph.appendChild(pokemonMoves);
            abilityParagraph.appendChild(pokemonAbilities);

            // append to our div
            div.appendChild(header);
            div.appendChild(weightParagraph);
            div.appendChild(movesParagraph);
            div.appendChild(abilityParagraph);

            return div;
        }

        function getFivePokemonMoves(){
            var firstFiveMoves = pokemon_moves.splice(0, 5);
            return firstFiveMoves;
        }

        function getPokemonAbilities() {
            var pokemonAbilities = pokemon_abilities.join(' & ');
            return pokemonAbilities;
        }

    