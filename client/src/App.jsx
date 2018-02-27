import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import './App.css';
import Tasks from './containers/Tasks';
import Timers from './containers/Timers';
import Header from './components/Header';
import Home from './components/Home';
import Agenda from './components/Agenda';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      response: '',
      timer: 2,
      timerDefault: 1500,
      timerString: '',
      mode: '',
      selectedTask: ''
    };
  }

  componentDidMount() {
    this.convertTimerString(this.state.timer);
    // this.testApi()
    //   .then((res)=> console.log(res.test))
    //   .catch((err)=> console.error(err));

  }

  componentWillUnmount() {
    clearInterval(this.timeInterval);
  }

  // async testApi() {
  //   const response = await fetch('/api/test');
  //   const body = await response.json();
  //   if (response.status !== 200) { throw Error(body.message) }
  //   return body;
  // };

  convertTimerString(timer) {
    let newString = '';
    let minutes, seconds, hours;
    timer >= 3600 ? hours = Math.floor(timer / 3600) : hours = 0;
    timer >= 60 ? minutes = Math.floor(timer / 60) % 60 : minutes = 0;
    seconds = timer % 60;
    if(seconds < 10) { seconds = '0' + seconds }
    if(minutes < 10) { minutes = '0' + minutes }
    if(hours && hours < 10) { hours = '0' + hours }
    hours? newString = `${hours}h ${minutes}m ${seconds}s` : newString = `${minutes}m ${seconds}s`;
    document.querySelector('title').innerHTML = newString;
    this.updateTimerString(newString);
    if(this.state.timer<=0) { this.endTimer() }
  }

  endTimer() {
    document.querySelector('title').innerHTML = 'Patata';
    this.updateStartButton('start');
    clearInterval(this.timeInterval);
    this.timeInterval = null;
    if(this.state.timer===0) { 
      this.updateTimer(this.state.timerDefault);
      this.updateTimerString(this.state.timerString);
    }
    if(this.state.selectedTask) {
      document.getElementById(this.state.selectedTask).dataset.timercount++;
      console.log(document.getElementById(this.state.selectedTask).dataset.timercount);
    }
    /*TODO 
      display timer end
      prompt break selection (short, long, skip, notes)
      start a pause timer when stopped with time left?  
      track interruptions?
    */
  }

  updateTimer(timer) {
    this.setState({ timer });
  }
  updateTimerString(timerString) {
    this.setState({ timerString });
  }
  updateMode(mode) {
    this.setState({ mode });
  }

  updateSelectedTask = (selectedTask)=> {
    this.setState({ selectedTask });
    let differentTask = document.getElementById('different-task')||null;
    if(differentTask) { differentTask.style.display = 'inline' }

    let taskListItems = document.querySelectorAll('li');
    console.log(taskListItems)
    for(let i = 0; i < taskListItems.length; i++) {
      if(selectedTask===null) {
        window.location.replace("/timer");
      } else if(taskListItems[i].id!==selectedTask) { 
        taskListItems[i].style.display = 'none';
      } else {
        let selectedTaskDetails = document.createElement('ul');
        // Recreate selected task, using same display as task list
        selectedTaskDetails.innerHTML = `<b>${taskListItems[i].title}</b>`;
        if(taskListItems[i].dataset.description) { selectedTaskDetails.innerHTML += `<div><li>&nbsp;<i>Description:</i></li><li>&nbsp;-${taskListItems[i].dataset.description}</li></div>` }
        selectedTaskDetails.innerHTML += `<li>&nbsp;<i>Time:</i></li>`;
        selectedTaskDetails.innerHTML += `<li>&nbsp;&nbsp;-Estimate: ${taskListItems[i].dataset.timerestimate} x ${taskListItems[i].dataset.timerdefault} = ${taskListItems[i].dataset.timerestimate*taskListItems[i].dataset.timerdefault}min</li>`;
        selectedTaskDetails.innerHTML += `<li>&nbsp;&nbsp;-Actual: &nbsp;&nbsp;&nbsp;&nbsp;${taskListItems[i].dataset.timercount} x ${taskListItems[i].dataset.timerdefault} = ${taskListItems[i].dataset.timercount*taskListItems[i].dataset.timerdefault}min</li>`;
        taskListItems[i].appendChild(selectedTaskDetails);
        document.getElementById(selectedTask + 'b').style.display = 'none';
      }
    }
    this.updateMode('Selected');
    document.getElementById('task-mode').innerHTML = 'Task Selected';
  }

  updateStartButton(str) {
    let startButton = document.getElementById('start-button')||null;
    if((str === 'stop') && (startButton)) {
      startButton.innerHTML = 'Stop';
      startButton.style.backgroundColor = '#FF4136';
    } else if((str === 'start') && (startButton)) {
      startButton.innerHTML = 'Start';
      startButton.style.backgroundColor = '#0EBC10';
    }
  }

  startTimer = ()=> {
    if(!this.timeInterval) {
      let counter = 0;
      this.updateStartButton('stop');
      this.timeInterval = setInterval(()=> {
        if(counter!==9) {
          counter++;
        } else if(counter===9) {
          this.updateTimer(this.state.timer - 1);
          this.convertTimerString(this.state.timer);
          counter = 0;
        }
        this.updateStartButton('stop');
      }, 100);
    } else {
      this.endTimer();
    }
  }

  // Separate app components, display based on mode or timerString?
  // Make nav bar using Router
  render() {
    return (
      <div className="App">
        <Header />
        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/patata' component={Home} />
          <Route path='/patata/timer' render={ (props)=> <Timers updateSelectedTask={this.updateSelectedTask} timeInterval={this.timeInterval} startTimer={this.startTimer} updateMode={this.updateMode} {...this.state} /> } />
          <Route path='/patata/task' component={Tasks} />
          <Route path='/patata/agenda' component={Agenda} />
        </Switch>
      </div>
    );
  }
}

export default App;