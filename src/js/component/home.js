import React from "react";

const URL_USER = "https://assets.breatheco.de/apis/fake/todos/user/Brandchal";

export class Home extends React.Component {
	constructor() {
		super();

		this.state = {
			notas: [],
			isLoading: false,
			error: null,
			taskInput: ""
		};
	}

	countList() {
		if (this.state.notas.length == 0) {
			return "empty list";
		} else {
			return this.state.notas.length + " item left";
		}
	}

	componentDidMount() {
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
					throw new Error("Something went wrong ...");
				}
			})
			.then(
				data =>
					data.map(todo => {
						this.setState({
							notas: this.state.notas.concat([
								{
									label: todo.label,
									done: todo.done,
									id: todo.id
								}
							])
						});
					}),
				this.setState({ isLoading: false })
			)
			.catch(error => this.setState({ error, isLoading: false }));
	}

	formSubmit(e) {
		e.preventDefault();
		let newTodo = {
			label: this.state.taskInput,
			done: false,
			id: Math.random() * 10
		};

		this.setState({
			notas: this.state.notas.concat([
				{
					label: newTodo.label,
					done: newTodo.done,
					id: newTodo.id
				}
			]),
			taskInput: ""
		});

		let notas = this.state.notas.concat([newTodo]);

		if (notas.length == 1) {
			fetch(URL_USER, {
				method: "POST",
				body: JSON.stringify(notas),
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
				body: JSON.stringify(notas),
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

	deleteTask(taskId) {
		this.setState({
			notas: this.state.notas.filter(task => task.id != taskId)
		});

		let notas = this.state.notas.filter(task => task.id != taskId);

		if (notas.length >= 1) {
			fetch(URL_USER, {
				method: "PUT",
				body: JSON.stringify(notas),
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
		const { notas, isLoading, error } = this.state;
		if (error) {
			return <p>{error.message}</p>;
		}

		if (isLoading) {
			return <p>Loading ...</p>;
		}

		let tasksToRender = notas.map(task => {
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
				<h1 className="todo-header">To do List</h1>
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
