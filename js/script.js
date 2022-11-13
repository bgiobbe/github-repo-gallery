/******************
 * Global variables
 ******************/

const username = "bgiobbe";

// overview div in intro section
const overview = document.querySelector(".overview");


/*
 * getUser()
 * Fetch user info for username from GitHub API
 * Return: user object
 */
const fetchAndDisplayUserInfo =  async function () {
    const url = `https://api.github.com/users/${username}`;
	const response = await fetch(url);
	if (response.status != "200") {
		console.log(`getUser(): request failed with status=${response.status}.`);
	}
	const user = await response.json();
	console.log("user", user);

	fillOverview(user);
};

/*
 * fillOverview(user)
 * Format user info and append to overview div
 * Parameter:
 * 		user	user object
 */
const fillOverview = function (user) {
	const div = document.createElement("div");
	div.classList.add("user-info");
	div.innerHTML = `
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
	overview.appendChild(div);
};

fetchAndDisplayUserInfo(); 

