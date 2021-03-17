import React from "react";

const URL_USER = "https://assets.breatheco.de/apis/fake/todos/user/Brandchal";

export class Home extends React.Component {
	constructor() {
		super();

		this.state = {
			notes: [],
			isLoading: false,
			error: null,
			taskInput: ""
		};
	}

	countList() {
		if (this.state.notes.length == 0) {
			return "empty list";
		} else {
			return this.state.notes.length + " item left";
		}
	}

	componentDidMount() {
		/*  método que se llama cuando se crea una instancia de un componente y se inserta en el DOM*/
		this.setState({ isLoading: true });
		fetch(URL_USER, {
			method: "GET",
			headers: {
				"Content-Type": "application/json"
			}
		})
			.then(response => {
				if (response.ok) {
					return response.json();
				} else {
					throw new Error("Error, la lista esta indefinida");
				}
			})
			.then(
				data =>
					data.map(todo => {
						console.log(data);
						this.setState({
							notes: this.state.notes.concat([
								{
									label: todo.label,
									done: todo.done
								}
							])
						});
					}),
				this.setState({ isLoading: false })
			)
			.catch(error => this.setState({ error, isLoading: false }));
	}
	/******************************************************************/
	formSubmit(e) {
		e.preventDefault();
		let newTodo = {
			label: this.state.taskInput,
			done: false,
			id: Math.random() * 10
		};

		this.setState({
			notes: this.state.notes.concat([
				{
					label: newTodo.label,
					done: newTodo.done,
					id: newTodo.id
				}
			]),
			taskInput: ""
		});

		let notes = this.state.notes.concat([newTodo]);

		if (notes.length == 1) {
			fetch(URL_USER, {
				method: "POST",
				body: JSON.stringify(notes),
				headers: {
					"Content-Type": "application/json"
				}
			})
				.then(response => response.json())
				.catch(error => console.error("Error:", error))
				.then(response => console.log("Success:", response));
		} else {
			fetch(URL_USER, {
				method: "PUT",
				body: JSON.stringify(notes),
				headers: {
					"Content-Type": "application/json"
				}
			})
				.then(response => response.json())
				.catch(error => console.error("Error:", error))
				.then(response => console.log("Success:", response));
		}

		return false;
	}
	/******************************************************************/
	deleteTask(taskId) {
		this.setState({
			notes: this.state.notes.filter(task => task.id != taskId)
		});

		let notes = this.state.notes.filter(task => task.id != taskId);

		if (notes.map >= 1) {
			fetch(URL_USER, {
				method: "PUT",
				body: JSON.stringify(notes),
				headers: {
					"Content-Type": "application/json"
				}
			})
				.then(response => response.json())
				.catch(error => console.error("Error:", error))
				.then(response => console.log("Success:", response));
		} else {
			fetch(URL_USER, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json"
				}
			})
				.then(response => response.json())
				.catch(error => console.error("Error:", error))
				.then(response => console.log("Success:", response));
		}
	}

	render() {
		const { notes, isLoading, error } = this.state;
		if (error) {
			return <p>{error.message}</p>;
		}

		if (isLoading) {
			return <p>Loading...</p>;
		}

		let tasksToRender = notes.map(task => {
			return (
				<li key={task.id}>
					<span>
						<button
							className="destroy"
							onClick={() => this.deleteTask(task.id)}>
							<i className="fa fa-minus-square" />
						</button>
					</span>
					<label>{task.label}</label>
				</li>
			);
		});

		return (
			<div id="container">
				<h1 className="header">To do List</h1>
				<form onSubmit={this.formSubmit.bind(this)}>
					<input
						autoFocus={true}
						className="addToDo"
						placeholder="What needs to be done?"
						value={this.state.taskInput}
						onChange={evt =>
							this.setState({ taskInput: evt.target.value })
						}
					/>
				</form>

				<ul className="todo-list">{tasksToRender}</ul>
				<p className="footer">{this.countList()}</p>
			</div>
		);
	}
}
