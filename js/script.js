/******************
 * Global variables
 ******************/

// set EXCLUDE_PRE_SKILLCRUSH to true to exclude repos created before cutoff
const EXCLUDE_PRE_SKILLCRUSH = false;
const cutoff = new Date("2022-08-01");

const username = "bgiobbe";
const urlBase = "https://api.github.com";
// /users/{username}
const userEndpoint = `${urlBase}/users/${username}`;
// /users/{username}/repos
const reposEndpoint = `${urlBase}/users/${username}/repos`;
// /repos/{owner}/ -- add {repo} when known
const repoUrlBase = `${urlBase}/repos/${username}/`;

// overview div in intro section
const overview = document.querySelector(".overview");
// repos section
const reposSection = document.querySelector("section.repos");
// search-by-name input
const filterInput = document.querySelector("input.filter-repos");
// unordered list in repos section
const repoList = document.querySelector("ul.repo-list");
// repo-data section
const repoDataSection = document.querySelector("section.repo-data");
// back-to-repo-gallery button
const backButton = document.querySelector("button.view-repos");

/*
 * main()
 * Fetch user and repo info for username from GitHub
 * and use them to populate the document
 */
const main =  async function () {
	// fetch user info from github
	const response = await fetch(userEndpoint);
	if (response.status != "200") {
		console.log(`fetch user: request failed with status=${response.status}.`);
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
    const url = reposEndpoint + "?sort=updated&direction=desc&per_page=100";
	const response = await fetch(url);
	if (response.status != "200") {
		console.log(`fetch repos list: request failed with status=${response.status}.`);
	}
	const repos = await response.json();
	//console.log("repos", repos);

	displayReposList(repos);
};

/*
 * displayReposList(repos)
 * Add name of each repo to unordered repos list;
 * Optionally, limit to repos made since starting Skillcrush program
 * Parameter:
 * 		repos    array of repo objects
 */
const displayReposList = function (repos) {
	//console.log("repos list", repos);
	
	// clear the search box
	filterInput.value = "";
	
	for (let repo of repos) {
		if (!EXCLUDE_PRE_SKILLCRUSH) {
			addRepoToList(repo);
		} else {
			const createdAt = new Date(repo.created_at);
			if (createdAt > cutoff) {
				addRepoToList(repo);
			}
		}
	}
};

/*
 * Add one repo to the unordered repos list
 */
const addRepoToList = function (repo) {
	const h3 = document.createElement("h3");
	h3.innerText = repo.name;
	const li = document.createElement("li");
	li.classList.add("repo");
	li.appendChild(h3);
	repoList.appendChild(li);
};

/*
 * Repo list click event listener
 */
repoList.addEventListener("click", function (e) {
	// could get h3 or ul; only want the h3's
	if (e.target.matches("h3")) {
		const repoName = e.target.innerText;
		fetchAndDisplay1Repo(repoName);
	}
});

/*
 * fetchAndDisplay1Repo()
 * Fetch a single repository by name from GitHub
 * and display it
 * Parameter:
 *     nameOfRepo  - name of the repository to fetch
 */
const fetchAndDisplay1Repo =  async function (nameOfRepo) {
	// /repos/{owner}/{repo}
    const url = repoUrlBase + nameOfRepo;
	const response = await fetch(url);
	if (response.status != "200") {
		console.log(`fetch ${nameOfRepo} repo: request failed with status=${response.status}.`);
	}
	const repoInfo = await response.json();
	//console.log(`${nameOfRepo} repo`, repoInfo);

	const fetchLanguages = await fetch(repoInfo.languages_url);
	const languageData = await fetchLanguages.json();
	languages = [];
	for (let lang in languageData) {
		languages.push(lang);
	}

	displayRepo(repoInfo, languages);
};

/*
 * displayRepo(repoObj, languageArr)
 * Display selected information about a repository instead of the
 * array of repository names
 * Parameters:
 * 		repo         repository information object
 *      languages    array of language strings
 */
const displayRepo = function (repo, languages) {
	//console.log("displayRepo():", repo, languages);
	repoDataSection.innerHTML = "";
	div = document.createElement("div");
	div.innerHTML = `
		<h3>Name: ${repo.name}</h3>
    	<p>Description: ${repo.description}</p>
    	<p>Default Branch: ${repo.default_branch}</p>
    	<p>Languages: ${languages.join(", ")}</p>
    	<a class="visit" href="${repo.html_url}" target="_blank" rel="noreferrer noopener">View Repo on GitHub!</a>
	`;
	repoDataSection.appendChild(div);
	repoDataSection.classList.remove("hide");
	backButton.classList.remove("hide");
	// hide the repos section
	reposSection.classList.add("hide");
};

/*
 * Back button click event listener
 */
backButton.addEventListener("click", function (e) {
	// hide repo data and back buttton
	repoDataSection.classList.add("hide");
	backButton.classList.add("hide");
	// show repos list section
	reposSection.classList.remove("hide");
});

/*
 * Search box input event listener
 */
filterInput.addEventListener("input", function (e) {
	const searchStr = filterInput.value.toLowerCase();
	//console.log("search box:", searchStr);
	const repos = repoList.querySelectorAll(".repo");
	for (let repo of repos) {
		const lcName = repo.innerText.toLowerCase();
		if (lcName.includes(searchStr)) {
			repo.classList.remove("hide");
		} else {
			repo.classList.add("hide");
		}
	}
});


// run it!
main();
