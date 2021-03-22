import {useEffect,  useReducer} from 'react';
import axios from "axios";
import { getAppointmentsForDay } from "../helpers/selectors";

export default function useApplicationdata(){

  const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_INTERVIEW = "SET_INTERVIEW";
  const SET_SPOTS = "SET_SPOTS";

  function reducer(state, action) {
    switch (action.type) {
      case SET_DAY:
        return {...state, day: action.day};
      case SET_APPLICATION_DATA:
        return {
          ...state, 
          days: action.days, 
          appointments: action.appointments,
          interviewers: action.interviewers
        }
      case SET_INTERVIEW: 
        return {...state, appointments: action.appointments};
      case SET_SPOTS:
        return {...state, days: updateSpots(action.id, state)}
      default:
        throw new Error(
          `Tried to reduce with unsupported action type: ${action.type}`
        );
    }
  }

  const [state, dispatch] = useReducer(reducer, {
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
      const days = [...all[0].data];
      const appointments = {...all[1].data};
      const interviewers =  {...all[2].data};
      dispatch({type: SET_APPLICATION_DATA, days, appointments, interviewers})
    })
  }, []); 

  
  // set webSocket connection
  useEffect(() => {
    const webSocket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

    webSocket.onopen = function(e) {
      webSocket.send("ping")
    }
    
    //listen to data from the websocket server
    webSocket.onmessage = function (e) {
      
      const res = JSON.parse(e.data);
      if(res.type === SET_INTERVIEW) {

        const id = res.id;
        const interview = res.interview;

        const appointment = {
          ...state.appointments[id],
          interview: interview? { ...interview } : null
        };
        const appointments = {
          ...state.appointments,
          [id]: appointment
        };

        dispatch({type: SET_INTERVIEW, appointments})
        dispatch({type: SET_SPOTS, id})
      }  
    }

    return ()=>{webSocket.close()}; //cleanup function
  },[state.appointments]);
  
  const setDay = day => dispatch({type: SET_DAY, day})

  function updateSpots(id, state){ 
    // pass in prev state and appointment id to update that day's spots
    // pass in prev state as old state wouldn't have updated with the current appointments data yet

    let dayIndex = 0;
    for (let i = 0; i < state.days.length; i++) {
      if (state.days[i].appointments.find(elem => elem === id)) {
        dayIndex = i;
      }
    }

    const dailyAppointments = getAppointmentsForDay(state, state.days[dayIndex].name);

    let count = dailyAppointments.length;

    for(const appointment of dailyAppointments) {
      if(appointment.interview){
        count -= 1
      }
    }

    const day = {
      ...state.days[dayIndex],
      spots: count
    };

    const days = [...state.days];
    days[dayIndex] = day;

    return days
  }


  function bookInterview (id, interview) {
    
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
        dispatch({type: SET_INTERVIEW, appointments});
      })
      .then(prev => {
        dispatch({type: SET_SPOTS, id})
      })
  }

  function cancelInterview (id) {

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
        dispatch({type: SET_INTERVIEW, appointments});
      })
      .then(res => {
        dispatch({type: SET_SPOTS, id})
      })
  }

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview,
  }


}