import React, {useState, useEffect} from "react";
import GitHubAuth from "@/components/Authentication/github";

import SEO from "@/components/SEO";

const index = () => {
  return (<>
    <SEO title={"Git-Hub Login"} description={"Login to the application using Git-Hub"}/>
    <GitHubAuth/>
  </>)
}

export default index;
