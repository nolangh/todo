const listsContainer = document.querySelector("[data-lists]");
const newListForm = document.querySelector("[data-new-list-form]");
const newListInput = document.querySelector("[data-new-list-input]");
const deleteListButton = document.querySelector("[data-delete-list-button]");

//ANCHOR Keys
const local_Storage_List_Key = "task.lists";
const local_Storage_Selected_List_Id_Key = "task.selectedListId";

let lists = JSON.parse(localStorage.getItem(local_Storage_List_Key)) || [];
let selectedListId = localStorage.getItem(local_Storage_Selected_List_Id_Key);

//ANCHOR eventListners
newListForm.addEventListener("submit", (e) => {
	e.preventDefault();
	const listName = newListInput.value;
	if (listName === null || listName === "") return;
	const list = createList(listName);
	//Clear value of input after submit
	newListInput.value = null;
	lists.push(list);
	renderSaved();
});

listsContainer.addEventListener("click", (e) => {
	if (e.target.tagName.toLowerCase() === "li") {
		selectedListId = e.target.dataset.listId;
		renderSaved();
	}
});

deleteListButton.addEventListener("click", (e) => {
	lists = lists.filter((list) => list.id !== selectedListId);
	selectedListId = null;
	renderSaved();
});

//ANCHOR creates list and gives it and ID/Name
function createList(name) {
	return {
		id: Date.now().toString(),
		name: name,
		tasks: [],
	};
}

//ANCHOR This function saves and renders
function renderSaved() {
	save();
	renderList();
}

//ANCHOR Saves to local storage
function save() {
	localStorage.setItem(local_Storage_List_Key, JSON.stringify(lists));
	localStorage.setItem(local_Storage_Selected_List_Id_Key, selectedListId); //ANCHOR this is possibly an issue, @ 17:23
}

//ANCHOR render function
function renderList() {
	clearElement(listsContainer);
	lists.forEach((list) => {
		const listElement = document.createElement("li");
		listElement.dataset.listId = list.id;
		listElement.classList.add("list-name");
		listElement.innerText = list.name;
		if (list.id === selectedListId) {
			listElement.classList.add("active-list");
		}
		listsContainer.appendChild(listElement);
	});
}

//ANCHOR This removes any li elements that shouldn't be there
function clearElement(element) {
	while (element.firstChild) {
		element.removeChild(element.firstChild);
	}
}

//ANCHOR Calling functions but export these to a call file

renderList();
