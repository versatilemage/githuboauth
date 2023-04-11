import React, {useState, useEffect} from "react";

const GitHubAuth = () => {

    const CLIENT_ID = "ae594a90cd12119c8821";

    function loginWithGitHub () {
        window.location.assign("https://github.com/login/oauth/authorize?client_id=" + CLIENT_ID)
    }

    return (
        <>
            <div className="github_button-container">
                <h2>Sign in</h2>
                <button onClick={loginWithGitHub}/>
            </div>
        </>
    )
}

export default GitHubAuth;
