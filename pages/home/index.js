import React, { useState, useEffect } from "react";
import baseUrl from "@/utils/baseUrl";
import axios from "axios";

const Home = () => {

    const [reRender, setReRender] = useState(false);
    const [userData, setUserData] = useState({});

    const [stars, setStars] = useState(0);
    const [issues, setIssues] = useState(0);
    const [commits, setCommits] = useState(0);
    const [pulls, setPulls] = useState(0);

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

    const pullReqUrl = async(url) => {
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

                        {/* <div className="github_stats_card_container">
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
                        </div> */}

<div className="github_stats_card_container">
                            <div className="github_stats_card">
                                <div className="stats_header_text">
                                    <h2>GitHub Stats</h2>
                                </div>
                                <div className="stats_card_content">
                                    <div className="stats_card_content-left">
                                        
                                    </div>
                                    <div className="stats_card_content-right">
                                        <div className="stats_content-box">
                                            <label>
                                                <svg className="star_structure-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M287.9 0c9.2 0 17.6 5.2 21.6 13.5l68.6 141.3 153.2 22.6c9 1.3 16.5 7.6 19.3 16.3s.5 18.1-5.9 24.5L433.6 328.4l26.2 155.6c1.5 9-2.2 18.1-9.6 23.5s-17.3 6-25.3 1.7l-137-73.2L151 509.1c-8.1 4.3-17.9 3.7-25.3-1.7s-11.2-14.5-9.7-23.5l26.2-155.6L31.1 218.2c-6.5-6.4-8.7-15.9-5.9-24.5s10.3-14.9 19.3-16.3l153.2-22.6L266.3 13.5C270.4 5.2 278.7 0 287.9 0zm0 79L235.4 187.2c-3.5 7.1-10.2 12.1-18.1 13.3L99 217.9 184.9 303c5.5 5.5 8.1 13.3 6.8 21L171.4 443.7l105.2-56.2c7.1-3.8 15.6-3.8 22.6 0l105.2 56.2L384.2 324.1c-1.3-7.7 1.2-15.5 6.8-21l85.9-85.1L358.6 200.5c-7.8-1.2-14.6-6.1-18.1-13.3L287.9 79z"/></svg>
                                                Stars Earned
                                            </label>
                                            <p>{stars}</p>
                                        </div>
                                        <div className="stats_content-box">
                                            <label>
                                            <svg className="pull_structure-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M320 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160zm156.8-48C462 361 397.4 416 320 416s-142-55-156.8-128H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H163.2C178 151 242.6 96 320 96s142 55 156.8 128H608c17.7 0 32 14.3 32 32s-14.3 32-32 32H476.8z"/></svg>
                                                Commits
                                            </label>
                                            <p>{commits}</p>
                                        </div>
                                        <div className="stats_content-box">
                                            <label>
                                            <svg className="star_structure-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M305.8 2.1C314.4 5.9 320 14.5 320 24V64h16c70.7 0 128 57.3 128 128V358.7c28.3 12.3 48 40.5 48 73.3c0 44.2-35.8 80-80 80s-80-35.8-80-80c0-32.8 19.7-61 48-73.3V192c0-35.3-28.7-64-64-64H320v40c0 9.5-5.6 18.1-14.2 21.9s-18.8 2.3-25.8-4.1l-80-72c-5.1-4.6-7.9-11-7.9-17.8s2.9-13.3 7.9-17.8l80-72c7-6.3 17.2-7.9 25.8-4.1zM104 80A24 24 0 1 0 56 80a24 24 0 1 0 48 0zm8 73.3V358.7c28.3 12.3 48 40.5 48 73.3c0 44.2-35.8 80-80 80s-80-35.8-80-80c0-32.8 19.7-61 48-73.3V153.3C19.7 141 0 112.8 0 80C0 35.8 35.8 0 80 0s80 35.8 80 80c0 32.8-19.7 61-48 73.3zM104 432a24 24 0 1 0 -48 0 24 24 0 1 0 48 0zm328 24a24 24 0 1 0 0-48 24 24 0 1 0 0 48z"/></svg>
                                                PR' s
                                            </label>
                                            <p>{pulls}</p>
                                        </div>
                                        <div className="stats_content-box">
                                            <label>
                                            <svg className="star_structure-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>
                                                Issues
                                            </label>
                                            <p>{issues}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="github_stats_card">
                            {/* className="stats_header_text" */}
                                <div >
                                    {/* <h2>GitHub Stats</h2> */}
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
