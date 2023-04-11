import Cors from "cors";
import initMiddleware from "@/lib/init-middleware";

const CLIENT_ID = "ae594a90cd12119c8821";
const CLIENT_SECRET = "2cc3a03eb03d857f94c7a24180bfaaf59189cb6a";

const cors = initMiddleware(
  Cors({
    methods: ["GET", "POST", "DELETE", "PUT", "OPTIONS"],
  })
);

export default async (req, res) => {
  await cors(req, res);

  const params =
    "?client_id=" +
    CLIENT_ID +
    "&client_secret=" +
    CLIENT_SECRET +
    "&code=" +
    req.query.code;

  await fetch("https://github.com/login/oauth/access_token" + params, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("data from API call:", data);
      if (data.error) {
        console.log("API Error:", data.error_description);
        res.status(400).send("Bad Request");
      } else {
        res.json(data);
      }
    })
    .catch((error) => {
      console.log("Error fetching data from Github API:", error);
      res.status(500).send("Internal Server Error");
    });
};

