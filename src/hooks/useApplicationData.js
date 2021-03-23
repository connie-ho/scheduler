import {useEffect,  useReducer} from 'react';
import axios from "axios";
import reducer, {
  SET_DAY,
  SET_APPLICATION_DATA,
  SET_INTERVIEW,
  SET_SPOTS,
} from "reducers/application";


export default function useApplicationData() {

  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });
  
  // get API Data
  useEffect(()=>{
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers")
    ]).then((all) => {
      const days = [...all[0].data];
      const appointments = {...all[1].data};
      const interviewers =  {...all[2].data};
      dispatch({type: SET_APPLICATION_DATA, days, appointments, interviewers});
    });
  }, []);

  
  // set webSocket connection
  useEffect(() => {
    const webSocket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

    webSocket.onopen = function(e) {
      webSocket.send("ping");
    };
    
    //listen to data from the websocket server
    webSocket.onmessage = function(e) {
      
      const res = JSON.parse(e.data);
      if (res.type === SET_INTERVIEW) {

        const id = res.id;
        const interview = res.interview;

        const appointment = {
          ...state.appointments[id],
          interview: interview ? { ...interview } : null
        };
        const appointments = {
          ...state.appointments,
          [id]: appointment
        };

        dispatch({type: SET_INTERVIEW, appointments});
        dispatch({type: SET_SPOTS, id});
      }
    };

    return ()=>{
      webSocket.close();
    }; //cleanup function
  },[state.appointments]);
  
  const setDay = day => dispatch({type: SET_DAY, day});

  function bookInterview(id, interview) {
    
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
        dispatch({type: SET_SPOTS, id});
      });
  }

  function cancelInterview(id) {

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
        dispatch({type: SET_SPOTS, id});
      });
  }

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview,
  };


}