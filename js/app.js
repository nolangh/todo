const listsContainer = document.querySelector("[data-lists]");
const newListForm = document.querySelector("[data-new-list-form]");
const newListInput = document.querySelector("[data-new-list-input]");
const deleteListButton = document.querySelector("[data-delete-list-button]");
const listDisplayContainer = document.querySelector(
	"[data-list-display-container]"
);
const listTitle = document.querySelector("[data-list-title]");
const listCountElement = document.querySelector("[data-list-count]");
const tasksContainer = document.querySelector("[data-tasks]");
const taskTemplate = document.getElementById("task-template");
const newTaskForm = document.querySelector("[data-new-task-form]");
const newTaskInput = document.querySelector("[data-new-task-input]");
const clearCompleteTaskButton = document.querySelector(
	"[data-clear-complete-tasks-button]"
);

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

newTaskForm.addEventListener("submit", (e) => {
	e.preventDefault();
	const taskName = newTaskInput.value;
	if (taskName === null || taskName === "") return;
	const task = createTask(taskName);
	//Clear value of input after submit
	newTaskInput.value = null;
	const selectedList = lists.find((list) => list.id === selectedListId);
	selectedList.tasks.push(task);
	renderSaved();
});

listsContainer.addEventListener("click", (e) => {
	if (e.target.tagName.toLowerCase() === "li") {
		selectedListId = e.target.dataset.listId;
		renderSaved();
	}
});

tasksContainer.addEventListener("click", (e) => {
	if (e.target.tagName.toLowerCase() === "input") {
		const selectedList = lists.find((list) => list.id === selectedListId);
		const selectedTask = selectedList.tasks.find(
			(task) => task.id === e.target.id
		);
		selectedTask.complete = e.target.checked;
		save();
		renderTaskCount(selectedList);
	}
});

clearCompleteTaskButton.addEventListener("click", (e) => {
	const selectedList = lists.find((list) => list.id === selectedListId);
	selectedList.tasks = selectedList.tasks.filter((task) => !task.complete);
	renderSaved();
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

function createTask(name) {
	return {
		id: Date.now().toString(),
		name: name,
		complete: false,
	};
}

//ANCHOR This function saves and renders
function renderSaved() {
	save();
	render();
}

//ANCHOR Saves to local storage
function save() {
	localStorage.setItem(local_Storage_List_Key, JSON.stringify(lists));
	localStorage.setItem(local_Storage_Selected_List_Id_Key, selectedListId); //ANCHOR this is possibly an issue, @ 17:23
}

//ANCHOR render function
function render() {
	clearElement(listsContainer);
	renderLists();
	const selectedList = lists.find((list) => list.id === selectedListId);

	if (selectedListId == null) {
		listDisplayContainer.style.display = "none";
	} else {
		listDisplayContainer.style.display = "";
		listTitle.innerText = selectedList.name;
		renderTaskCount(selectedList);
		clearElement(tasksContainer); // @27:15
		renderTasks(selectedList);
	}
}

function renderTasks(selectedList) {
	selectedList.tasks.forEach((task) => {
		const taskElement = document.importNode(taskTemplate.content, true);
		const checkbox = taskElement.querySelector("input");
		checkbox.id = task.id;
		checkbox.checked = task.complete;
		const lable = taskElement.querySelector("label");
		lable.htmlFor = task.id;
		lable.append(task.name);
		tasksContainer.appendChild(taskElement);
	});
}

//ANCHOR renders task counter by filtering for all tasks that are completed
function renderTaskCount(selectedList) {
	const incompleteTaskCount = selectedList.tasks.filter(
		(task) => !task.complete
	).length;
	const taskString = incompleteTaskCount === 1 ? "task" : "tasks";
	listCountElement.innerText = `${incompleteTaskCount} ${taskString} remaining`;
}

function renderLists() {
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

render();
