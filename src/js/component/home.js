import React from "react";

export class Home extends React.Component {
	constructor() {
		super();

		this.state = {
			todos: [
				{ done: false, title: "Hacer la cama", id: Math.random() * 10 },
				{
					done: false,
					title: "Lavar mis manos",
					id: Math.random() * 10
				},
				{ done: false, title: "Comer", id: Math.random() * 10 },
				{
					done: false,
					title: "Pasear con el perro",
					id: Math.random() * 10
				}
			],
			taskInput: ""
		};
	}

	formSubmit(e) {
		e.preventDefault();
		this.setState({
			todos: this.state.todos.concat([
				{
					title: this.state.taskInput,
					done: false,
					id: Math.random() * 10
				}
			]),
			taskInput: ""
		});
		return false;
	}

	deleteTask(taskId) {
		this.setState({
			todos: this.state.todos.filter(task => task.id != taskId)
		});
	}

	render() {
		let tasksToRender = this.state.todos.map(task => {
			return (
				<li key={task.id}>
					<span>
						<button
							className="destroy"
							onClick={() => this.deleteTask(task.id)}>
							<i className="fa fa-trash" />
						</button>
					</span>
					<label>{task.title}</label>
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
						placeholder="Que necesitas hacer?"
						value={this.state.taskInput}
						onChange={evt =>
							this.setState({ taskInput: evt.target.value })
						}
					/>
				</form>
				<ul className="todo-list">{tasksToRender}</ul>
			</div>
		);
	}
}
