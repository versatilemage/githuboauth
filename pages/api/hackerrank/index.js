import Cors from "cors";
import axios from 'axios';
import initMiddleware from "@/lib/init-middleware";

const cors = initMiddleware(
    Cors({
        methods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS'],
    })
)

export default async (req, res) => {
    await cors(req, res)

    const HACKERRANK_API_KEY = "ae3847c28c95132317561b90682b2f430f8ad90ba921.api.hackerearth.com";

    const BASE_URL = 'https://www.hackerrank.com/rest';

    const {username} = req.body;

    await fetch(`${BASE_URL}/users/${username}`, {
        method: "GET",
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${HACKERRANK_API_KEY}`
        }
    }).then((response) => {
        return response.json()
    }).then((data) => {
        res.json(data)
    })
    .catch((error) => {
        res.status(500).send("error fetching data from hackerrankAPI")
    })

}
