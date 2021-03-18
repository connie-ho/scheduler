import {useEffect, useState} from 'react';
import axios from "axios";
import { getAppointmentsForDay } from "../helpers/selectors";

export default function useApplicationdata(){

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  })
  
  // get API Data
  useEffect(()=>{
    Promise.all([
      axios.get("api/days"),
      axios.get("api/appointments"),
      axios.get("api/interviewers")
    ]).then((all) => {
      setState(prev => ({
        ...prev, 
        days: [...all[0].data], 
        appointments: {...all[1].data},
        interviewers: {...all[2].data}
      }))
    })
  }, []); 
  
  const setDay = day => setState({...state, day});

  const calcSpots = function(prev){

    const dailyAppointments = getAppointmentsForDay(prev, prev.day);
    // console.log(dailyAppointments)
    let count = 5;

    for(const appointment of dailyAppointments) {
      if(appointment.interview){
        count -= 1
      }
    }

    const filteredDayIndex = prev.days.filter(prevDay => prevDay.name === prev.day)[0].id - 1
    
    const day = {
      ...prev.days[filteredDayIndex],
      spots: count
    };

    const days = [...prev.days];
    days[filteredDayIndex] = day;

    console.log(count)
    console.log(day)
    return days
  }


  const bookInterview = function(id, interview) {
    
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios.put(`/api/appointments/${id}`, appointment)
      .then(res => {
        setState({
          ...state,
          appointments
        });
        return res;
      })
      .then(res => {
        setState(prev => ({...prev, days: calcSpots(prev)}))
      })
      .catch(err => console.log(err.message))
  }

  const cancelInterview = function(id) {

    const appointment = {
      ...state.appointments[id],
      interview: null
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios.delete(`/api/appointments/${id}`)
      .then(res => {
        setState(prev => ({
          ...prev, 
          appointments
        }))
        return res;
      })
      .then(res => {
        setState(prev => ({...prev, days: calcSpots(prev)}))
      })
      .catch(err => console.log(err.message))
  }

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview,
  }


}