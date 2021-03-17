import React from 'react';
import useVisualMode from '../..//hooks/useVisualMode';

import Header from './Header';
import Show from './Show';
import Empty from './Empty';
import Form from './Form';
import Status from './Status';
import Confirm from './Confirm';

import './styles.scss';

export default function Appointment(props) {

  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const DELETING = "DELETING";
  const CONFIRM = "CONFIRM";

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  const save = function(name, interviewer) {
    transition(SAVING) //shows saving component on click before call is made

    const interview = {
      student: name,
      interviewer
    };

    props.bookInterview(props.id, interview)
    .then(res => transition(SHOW))

    return;
  }

  const confirmDelete = function(){
    transition(CONFIRM);
  }

  const cancel = function() {

    transition(DELETING)
    props.cancelInterview(props.id)
     .then(res => transition(EMPTY))
      
    return;
  }

  return (
    <>
      <article className="appointment">
        <Header time={props.time}/>
        {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
        {mode === SHOW && (
          <Show
            student={props.interview.student}
            interviewer={props.interview.interviewer}
            onDelete={confirmDelete}
          />
        )}
        {mode === CREATE && (
          <Form 
            interviewer
            interviewers={props.interviewers} 
            onCancel={back}
            onSave={save}
          />
        )}
        {mode === SAVING && (<Status message="Saving"/>)}
        {mode === DELETING && (<Status message="Deleting"/>)}
        {mode === CONFIRM && (
          <Confirm 
            message="Are you sure you want to delete?"
            onCancel={back}
            onConfirm={cancel}
          />
        )}
      </article>
    </>
  );
}