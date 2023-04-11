import Cors from "cors";
import initMiddleware from "@/lib/init-middleware";

const cors = initMiddleware(
    Cors({
        methods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS'],
    })
)

export default async (req, res) => {
    await cors(req, res)

    let authHeader = req.headers.authorization

    console.log(authHeader)

    await fetch("https://api.github.com/user", {
        method: "GET",
        headers: {
            "Authorization": authHeader
        }
    }).then((response) => {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
        return response.json();
    }).then((data) => {
        console.log("data",data)
        res.json(data)
    })
    .catch((error) => {
        console.log(error)
        res.status(500).send("error fetching data from git-hub API")
    })

}
