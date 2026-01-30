// Logs:
// SUCCESS: CREATE TODO not working
// SUCCESS: Have a function that changes the UI when toggled (for completed tasks)
// SUCCESS: delete functionality

// TO Complete:
// TODO: local storage fucntionality
// TODO: edit functionality

// ****************************************************************************************************************************************************************

const apiUrl = 'https://jsonplaceholder.typicode.com/todos';

// TO 'DISPLAY' TODOS ALREADY IN BACKEND-DATABASE
const getTodos = () => {
	fetch(apiUrl + '?_limit=5')
		.then((res) => res.json())
		.then((data) => {
			data.forEach((task) => {
				addTodo(task);
				locallyStoringTodo(task);
			});
		});
};

// ADD TODO TO DOM i.e. UI
const addTodo = (task) => {
	/* 
	why? adds a Todo to UI or DOM

	@params[task] The JSON format of todos.({"userId": 1, "id": 1,
	"title": "delectus aut autem","completed": false})
	@return Displays the todos TITLE in the UI
	*/

	const div = document.createElement('div');
	div.classList.add('todoDesigns');
	div.setAttribute('data-id', task.id); //This gives a unique Attribute to identify each of the todo titles (used during DELETE,UPDATE operations)
	div.appendChild(document.createTextNode(task.title));

	if (task.completed) {
		div.classList.add('completedTask');
	}

	document.getElementById('todoInputArea').appendChild(div);
};

// UPDATE TODO only in Database
// TODO: Get the specific Todo(as Input params) and to update in the Backend database
const updateTodo = () => {
	fetch('${apiUrl}/${}', {
		method: 'PUT',
		body: JSON.stringify(), //Here, input the Todo which is being updated
		headers: {
			'content-type': 'application/json',
		},
	})
		.then((res) => res.json())
		.then((data) => console.log(data));
};

// TOGGLE THE COMPLETED TODO (BY SINGLE-CLICK)
const completedTodo = (e) => {
	e.preventDefault();

	// 1. 'IDENTIFY' THE SPECIFIC TODO TITLE WHICH IS CLICKED
	const clickedTodoIdentified = e.target.dataset.id;

	//'UPDATE' BOTH THE STATE & UI (JSON data & backgroundColor of that Todo)
	//TODO: 2. UPDATE THE JSON DATA (through updateTodo)

	// 3. UPDATE THE BACKGROUNDCOLOR OF THAT TODO
	if (clickedTodoIdentified) {
		e.target.classList.toggle('completedTask');
	}
};

// ============================================================================
// ============================================================================
/* ===========================CRUD Operations with=========================== 
 =============================Context naming Also============================*/
// ============================================================================
// ============================================================================

// CREATE TODO
const createTodo = (e) => {
	e.preventDefault();

	// 1. TO 'SELECTOR' THE DATA FROM UI
	const todoInput = document.getElementById('todoInput');
	const todoName = todoInput.value;

	// 2. TO 'FORMAT' THE DATA (JS Object format)
	const newTodo = {
		title: todoName,
		completed: false,
	};

	// 3. TO 'POST' THE DATA TO BACKEND & ALSO UPDATE THE UI
	fetch(apiUrl, {
		method: 'POST',
		body: JSON.stringify(newTodo),
		headers: {
			'content-type': 'application/json',
		},
	})
		.then((res) => res.json())
		.then((newTask) => {
			addTodo(newTask);
			locallyStoringTodo(newTask);
		});

	//To empty the text field after CREATE action
	todoInput.value = '';
};

// DELETE TODO
const deleteTodo = (e) => {
	e.preventDefault();

	// 1. 'IDENTIFY' THE SPECIFIC TODO TITLE WHICH IS DOUBLE-CLICKED
	const dblClickedTodoIdentified = e.target;
	const id = e.target.dataset.id;

	//'DELETE' BOTH THE STATE & UI (Delete JSON data & Deleting that Todo from display also)
	//2. DELETE THE JSON DATA
	fetch('${apiUrl}/${id}', {
		method: 'DELETE',
	})
		.then((res) => res.json())
		.then(() => {
			dblClickedTodoIdentified.remove();
		});

	// TODO: deleting from Local storgae also (Using locallyDeletingTodo fun.)

	// 3. DELETION OF THAT TODO FROM DISPLAY
	if (e.target.dataset.id) {
		e.target.remove();
	}
};

// ============================================================================
// ============================================================================
//  ===========================LOCAL STORAGE===========================
// ============================================================================
// ============================================================================

// LOCAL STORAGE
// SUCCESS: ? How to store an OBJECT in localStorage

// LOCALLY 'STORING' THE TODO
const locallyStoringTodo = (task) => {
	taskString = JSON.stringify(task);

	let key = task.id;

	// To handle the Newly created Todo tasks which dont have its own ID
	if (key === 201) {
		key = 202 + Math.floor(Math.random() * 10000);
	}
	localStorage.setItem(key, taskString);
};

// LOCALLY 'DELETING' THE TODO
const locallyDeletingTodo = (task) => {
	taskString = JSON.stringify(task);

	let key = task.id;
	localStorage.removeItem(key);
};

// ============================================================================
// ============================================================================
// ============================================================================
// =============Initializing the funcitons=====================================
// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================

const init = () => {
	document.addEventListener('DOMContentLoaded', getTodos);
	document
		.querySelector('#todoInputArea')
		.addEventListener('click', completedTodo);

	// ###################THE CRUD OPERATIONS EVENT###########################
	document.getElementById('workarea').addEventListener('submit', createTodo);
	document
		.querySelector('#todoInputArea')
		.addEventListener('dblclick', deleteTodo);
};

init();
