import React from "react";

export class Home extends React.Component {
	constructor() {
		super();

		this.state = {
			notas: [
				{ done: false, title: "Make the bed", id: Math.random() * 10 },
				{
					done: false,
					title: "Wash my hands",
					id: Math.random() * 10
				},
				{ done: false, title: "Eat", id: Math.random() * 10 },
				{
					done: false,
					title: "Walk the dog",
					id: Math.random() * 10
				}
			],
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

	formSubmit(e) {
		e.preventDefault();
		this.setState({
			notas: this.state.notas.concat([
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
			notas: this.state.notas.filter(task => task.id != taskId)
		});
	}

	render() {
		let tasksToRender = this.state.notas.map(task => {
			return (
				<li key={task.id}>
					<span>
						<button
							className="destroy"
							onClick={() => this.deleteTask(task.id)}>
							<i className="fa fa-minus-square" />
						</button>
					</span>

					<label>{task.title}</label>
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
