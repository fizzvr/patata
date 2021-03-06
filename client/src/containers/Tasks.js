import React, {Component} from 'react';
import TaskForm from '../components/TaskForm';
import TasksList from '../components/TasksList';
import { Route, NavLink } from 'react-router-dom';

class Tasks extends Component {
	render() {
		return(
		 <div className="Tasks">
		 	<div className="tasks-nav">
		 		<NavLink to='/patata/task/list' activeClassName='selected-tasks-nav'><button>Task List</button></NavLink>
				<NavLink to='/patata/task/new' activeClassName='selected-tasks-nav'><button>New Task</button></NavLink>
			</div>

			<Route path='/patata/task/list' component={TasksList} />
			<Route path='/patata/task/new' component={TaskForm} />
		 </div>
		)
	}
}

export default Tasks;