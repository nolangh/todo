const listContainer = document.querySelector("[data-lists]");
const newListForm = document.querySelector("[data-new-list-form]");
const newListInput = document.querySelector("[data-new-list-input]");

let lists = [
	{
		id: 1,
		name: "name",
	},
	{
		id: 2,
		name: "todo",
	},
];

newListForm.addEventListener("submit", (e) => {
	e.preventDefault();
	const listName = newListInput.value;
	if (listName === null || listName === "") return;
	const list = createList(listName);
});

//render function
function renderList() {
	clearElement(listContainer);
	lists.forEach((list) => {
		const listElement = document.createElement("li");
		listElement.dataset.listId = list.id;
		listElement.classList.add("list-name");
		listElement.innerText = list.name;
		listContainer.appendChild(listElement);
	});
}

function clearElement(element) {
	while (element.firstChild) {
		element.removeChild(element.firstChild);
	}
}

//ANCHOR Calling functions but export these to a call file

renderList();
