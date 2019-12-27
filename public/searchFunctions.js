var timer = null;

function matchesSearchTerm(x) {
    var searchTerm = document.getElementById("search").value;
    if (x.Question.toLowerCase().includes(searchTerm)) {
        return true;
    }
}

function updatesearchPoll() {
    pollsWithSearch = [];

    for (var i = 0; i < polls.length; i++) {
        if (matchesSearchTerm(polls[i])) {
            pollsWithSearch.push(polls[i]);
        }
    }

    createPollButtons(pollsWithSearch);
}

function createPollButtons(polls) {
    document.getElementById("pollButtons").innerHTML = "";
    var a = document.getElementById("pollButtons");
    for (var i = 0; i < polls.length; i++) {
        a.insertAdjacentHTML("beforeend", "<div class='pollButton' id='" + polls[i].pollID + "'><p id='pollName'>" + polls[i].Question + "</p><p>Votes: " + polls[i].totalVotes + "</p><p id='author'>Author: " + polls[i].PollCreator + "</p></div>");
    }

    document.querySelectorAll('.pollButton').forEach(function (el) {
        el.addEventListener("click", function () {
            console.log(localStorage.getItem("user"));
            socket.emit("pollButtonClicked", { id: this.id, user: localStorage.getItem("user") });
        })
    })
}
