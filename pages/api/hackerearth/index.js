import axios from "axios";
import Cors from "cors";
import initMiddleware from "@/lib/init-middleware";

const cors = initMiddleware(
    Cors({
        methods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS'],
    })
)

export default async (req, res) => {
    await cors(req, res)
    const apiKey = "ae3847c28c95132317561b90682b2f430f8ad90ba921.api.hackerearth.com";
    const username = "mohammed3004";
    const clientSecret = "ad1622501ea58b5424cb328ae4cc02082dd2b822";
    const url = `https://api.hackerearth.com/v3/users/${username}/?client_secret=${clientSecret}&api_key=${apiKey}`;
    
    try {
        const response = await axios.get(url, {
            headers: {
                'Content-Type': 'application/json',
                "client-secret": clientSecret
            }
        });
        res.json(response.data);
    } catch (error) {
        console.log(error)
        res.status(error.response.status).send(error.message);
    }
}

