const { default: axios } = require("axios");
const { response } = require("express");
const Cats = require("../models/Cats");

let searches = 0;
let newSearches = 0;

const verifyBreedInDB = async (existeCat, res = response) => {
    const breed = await Cats.findOne({ id: existeCat.id });
    return (breed) ? true : false;
}

const searchBreed = async (req, res = response) => {
    const breed = req.query.q;


    const breeds = await axios.get(`https://api.thecatapi.com/v1/breeds/`, {
        headers: {
            "x-api-key": process.env.API_KEY
        }
    })

    const result = breeds.data.map(breed => breed.name);

    if (!result.includes(breed)) {
        return res.send({ error: "ingresa una de las razas sugeridas" })
    }

    try {
        const resp = await axios.get(`https://api.thecatapi.com/v1/breeds/search/?q=${breed}`, {
            headers: {
                "x-api-key": process.env.API_KEY
            }
        });

        const existeCat = await verifyBreedInDB(resp.data[0], res);

        if (existeCat) {
            const catSearches = await Cats.findOne({ id: resp.data[0].id });
            searches = catSearches.searches;
            console.log(catSearches.searches);

            const totalSearches = catSearches.searches += 1;

            const cat = await Cats.findOneAndUpdate({ id: catSearches.id }, { searches: totalSearches }, { new: true });
            searches = 0;
            return res.json({
                ok: true,
                cat
            })
        } else {
            newSearches += 1;
            const definitiveResp = resp.data.map((breed, i) => {
                return {
                    ...breed,
                    searches: newSearches
                }
            })

            const cat = await Cats.create(definitiveResp);
            newSearches = 0;
            return res.json({
                cat
            })
        }

    } catch (error) {
        console.log(error);
        return res.send('No se encontro una raza con ese nombre')
    }
}

const getMorePhotos = async (req, res = response) => {
    const { breed } = req.params;
    try {
        const resp = await axios.get(`https://api.thecatapi.com/v1/images/search/?breed_id=${breed}&limit=9&size=small`, {
            headers: {
                "x-api-key": process.env.API_KEY
            }
        });

        res.send(resp.data)
    } catch (error) {
        console.log(error);
    }

}

const topBreeds = async (req, res = response) => {
    const { limit = 10 } = req.params;
    try {
        const topCats = await Cats.find().sort({ searches: -1 }).limit(limit);
        res.send(topCats)
    } catch (error) {
        console.log(error);
    }
}

const getBreeds = async (req, res = response) => {
    const { term } = req.params;

    const breeds = await axios.get(`https://api.thecatapi.com/v1/breeds/`, {
        headers: {
            "x-api-key": process.env.API_KEY
        }
    })

    const breedsNames = breeds.data.map(breed => breed.name);
    const regex = new RegExp(term, 'i');

    const results = breedsNames.filter(breed => regex.test(breed));

    res.send(results);

}

const getAllBreeds = async (req, res = response) => {
    const breeds = await axios.get(`https://api.thecatapi.com/v1/breeds/`, {
        headers: {
            "x-api-key": process.env.API_KEY
        }
    })

    const result = breeds.data.map(breed => breed.name);

    res.send(result)
}



module.exports = {
    searchBreed,
    getMorePhotos,
    topBreeds,
    getBreeds,
    getAllBreeds,
}