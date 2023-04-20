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

    const CLIENT_ID = "ae3847c28c95132317561b90682b2f430f8ad90ba921.api.hackerearth.com"
    const CLIENT_SECRET = "ad1622501ea58b5424cb328ae4cc02082dd2b822"
    const TEST_ID = 5841
    const EMAIL = "msawadh06@gmail.com"

    const payload = {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        test_id: TEST_ID,
        email: EMAIL
    }

    try {
        await fetch("https://api.hackerearth.com/partner/hackerearth/events/candidates/report/", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        }).then((response) => {
            return response.json()
        }).then((data) => {
            res.json(data)
        })
    }catch (error) {
        console.log(error)
        res.status(500).send("error fetching data from Hacker Earth API")
    }

}
