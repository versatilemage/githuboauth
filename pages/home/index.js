import React, { useState, useEffect } from "react";
import baseUrl from "@/utils/baseUrl";
import axios from "axios";

const Home = () => {

    const [reRender, setReRender] = useState(false);
    const [userData, setUserData] = useState({});

    const [stars, setStars] = useState(0);
    const [issues, setIssues] = useState(0);
    const [commits, setCommits] = useState(0);

    const [ApiData, setApiData] = useState([]);
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const codeParam = urlParams.get("code")

        if (codeParam && (localStorage.getItem("accessToken") === null)) {
            async function getAccessToken() {
                await fetch(`${baseUrl}/api/getAccessToken?code=${codeParam}`, {
                    method: "POST"
                }).then((response) => {
                    return response.json()
                }).then((data) => {
                    if (data.access_token) {
                        console.log(data.access_token)
                        localStorage.setItem("accessToken", data.access_token)
                        setReRender(!reRender)
                    }
                })
            }
            getAccessToken();
        }

    }, []);

    async function getUserData() {
        await fetch(`${baseUrl}/api/getUserData`, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("accessToken")
            }
        }).then((response) => {
            return response.json();
        }).then((data) => {
            setUserData(data);
        })
    }

    useEffect(() => {
        if (localStorage.getItem("accessToken")) {
            getUserData()
        }
    }, [reRender])

    const CommitsUrl = async (url) => {
        //for finding number of commits
        const response = await axios.get(url)
        return response.data.length
    }

    const gettingReposUrl = async (repoURL) => {
        const response = await axios.get(repoURL)

        //response from repo url
        setApiData(response.data)

        //create an array of promises to get tghe number of commits for each repository
        const commitsPromises = response.data.map((i) => (CommitsUrl(i.commits_url.split("{/sha}")[0])))
        
        //wait for all promises to resolve and get the length of all the responses
        const commitsLengths = await Promise.all(commitsPromises)
        const totalCommits = commitsLengths.reduce((sum, count) => sum + count, 0)
        setCommits(totalCommits)

        // for finding stars completed
        const stars = response.data.reduce((sum, obj) => sum + obj.stargazers_count, 0)
        setStars(stars)

        // for finding issues count completed
        const issues = response.data.reduce((sum, obj) => sum + obj.open_issues_count, 0)
        setIssues(issues)

        return response.data
    }

    useEffect(() => {
        if (userData.repos_url) {
            gettingReposUrl(userData.repos_url)
        }
    }, [userData])

    const redirectToRepo = (link) => {
        window.location.assign(link)
    }

    const viewAllButton = () => {
        if (showAll === true) {
            setShowAll(false)
        } else {
            setShowAll(true)
        }
    }

    return (
        <>
            {Object.values(userData).length > 0
                ?
                <div className="github_main_container">
                    <div className="github_profile-container">
                        <div className="github_profile-card">
                            <img className="github_profile-img" src={userData.avatar_url} />
                            <div className="github_profile-common-data">
                                <h1>{userData.name}</h1>
                                <h3>{userData.bio}</h3>
                                <h3>{userData.location}</h3>
                            </div>

                        </div>

                        <div className="github_stats_card_container">
                            <div className="github_stats_card">
                                <div className="stats_header_text">
                                    <h2>GitHub Stats</h2>
                                </div>
                                <div>
                                    <p>{stars}</p>
                                    <p>{issues}</p>
                                    <p>{commits}</p>
                                </div>
                            </div>
                            <div className="github_stats_card">
                                <div className="stats_header_text">
                                    <h2>GitHub Stats</h2>
                                </div>
                                <div>
                                </div>
                            </div>
                        </div>

                        <div className="user_Activity-heat-map_container">
                            <div className="user_Activity-heat-map">
                                <div className="stats_header_text">
                                    <h2>User Activity Heat Map</h2>
                                </div>
                                <div>

                                </div>
                                <div className="bottom_user_Activity-heat-map">

                                </div>
                            </div>
                        </div>

                        <div className="github_graph-container">
                            <div className="stats_header_text">
                                <h2>GitHub Overview</h2>
                            </div>
                            <div className="repo_file-container">
                                <div className="repo_left-file-folder">
                                    <div className="repo_files">
                                        {(showAll === true ? ApiData : ApiData.slice(0, 4)).map((i, index) => {
                                            return (
                                                <label className="repo_name-redirect" key={i.id} onClick={() => (redirectToRepo(i.html_url))}>
                                                    <svg className="folder_structure-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M0 96C0 60.7 28.7 32 64 32H196.1c19.1 0 37.4 7.6 50.9 21.1L289.9 96H448c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM64 80c-8.8 0-16 7.2-16 16V416c0 8.8 7.2 16 16 16H448c8.8 0 16-7.2 16-16V160c0-8.8-7.2-16-16-16H286.6c-10.6 0-20.8-4.2-28.3-11.7L213.1 87c-4.5-4.5-10.6-7-17-7H64z"/></svg>
                                                    {`${i.name}`}
                                                </label>
                                            )
                                        })}
                                    </div>
                                    <span className="view_all_button" onClick={viewAllButton}>View All</span>
                                </div>
                                <div className="repo_right-file-folder"></div>
                            </div>
                        </div>
                    </div>
                </div>
                :
                <>

                </>
            }
        </>
    )
}

export default Home;
