/******************
 * Global variables
 ******************/

const username = "bgiobbe";
const urlBase = "https://api.github.com/users/";

// overview div in intro section
const overview = document.querySelector(".overview");
// unordered list in repos section
const repoList = document.querySelector(".repo-list");


/*
 * main()
 * Fetch user and repo info for username from GitHub
 * and use them to populate the document
 */
const main =  async function () {
	// fetch user info from github
    const url = urlBase + username;
	const response = await fetch(url);
	if (response.status != "200") {
		console.log(`getUser(): request failed with status=${response.status}.`);
	}
	const user = await response.json();
	//console.log("user", user);

	displayUserInfo(user);
	
	fetchAndDisplayRepos();
};

/*
 * displayUserInfo(user)
 * Format user info and append to overview div
 * Parameter:
 * 		user	user object
 */
const displayUserInfo = function (user) {
	const userInfo = document.createElement("div");
	userInfo.classList.add("user-info");
	userInfo.innerHTML = `
	<figure>
      <img alt="user avatar" src=${user.avatar_url} />
    </figure>
    <div>
      <p><strong>Name:</strong> ${user.name}</p>
      <p><strong>Bio:</strong> ${user.bio}</p>
      <p><strong>Location:</strong> ${user.location}</p>
      <p><strong>Number of public repos:</strong> ${user.public_repos}</p>
    </div>
	`;
	overview.appendChild(userInfo);
};

/*
 * fetchAndDisplayRepos()
 * Fetch list of repositories for username from GitHub
 * and display it
 */
const fetchAndDisplayRepos =  async function () {
    const url = urlBase + username +
		"/repos?sort=updated&direction=desc&per_page=100";
	const response = await fetch(url);
	if (response.status != "200") {
		console.log(`getReposList(): request failed with status=${response.status}.`);
	}
	const repos = await response.json();
	//console.log("repos", repos);

	displayReposList(repos);
};

/*
 * displayReposList(repos)
 * Add name of each repo to unordered repos list
 * Parameter:
 * 		repos    array of repo objects
 */
const displayReposList = function (repos) {
	for (let repo of repos) {
		const h3 = document.createElement("h3");
		h3.innerText = repo.name;
		const li = document.createElement("li");
		li.classList.add("repo");
		li.appendChild(h3);
		repoList.appendChild(li);
	}
};

main();
