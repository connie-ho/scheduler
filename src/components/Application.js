import React, { useState, useEffect } from "react";
import axios from "axios";

import DayList from "./DayList";
import Appointment from "./Appointment";

import { getAppointmentsForDay, getInterview, getInterviewersForDay } from "../helpers/selectors";
import useApplicationData from "../hooks/useApplicationData"

import "components/Application.scss";

export default function Application(props) {
  
  const {
    state,
    setDay,
    bookInterview,
    cancelInterview
  } = useApplicationData();

  const dailyAppointments = getAppointmentsForDay(state, state.day);
  console.log(dailyAppointments)
  const interviewers = getInterviewersForDay(state, state.day);

  const schedule = dailyAppointments.map(appointment => {
    const interview = getInterview(state, appointment.interview);
    
    return (
    <Appointment
       key={appointment.id} 
       id={Number(appointment.id)}
       time={appointment.time}
       interview={interview}
       interviewers={interviewers}
       bookInterview={bookInterview}
       cancelInterview={cancelInterview}
    />
    )
  });

  return (
    <main className="layout">
      <section className="sidebar">
      <img
        className="sidebar--centered"
        src="images/logo.png"
        alt="Interview Scheduler"
      />
      <hr className="sidebar__separator sidebar--centered" />
      <nav className="sidebar__menu">
        <DayList
          days={state.days}
          day={state.day}
          setDay={setDay}
        />
      </nav>
      <img
        className="sidebar__lhl sidebar--centered"
        src="images/lhl.png"
        alt="Lighthouse Labs"
      />
      </section>
      <section className="schedule">
        {schedule}
        {<Appointment key="last" time="5pm" />}
      </section>
    </main>
  );
}
