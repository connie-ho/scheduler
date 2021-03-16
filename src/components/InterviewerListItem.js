import React from 'react';
import classnames from 'classnames';
import './InterviewerListItem.scss';

export default function InterviewerListItem(props) {

  const InterviewerListItemClass = classnames("interviewers__item", {
    "interviewers__item--selected": props.selected
  });


  return(
    <li 
    key={props.id} 
    className={InterviewerListItemClass}
    onClick={props.setInterviewer}
    >
      <img
        className="interviewers__item-image"
        src={props.avatar}
        alt={props.name}
      />
      {props.selected && props.name}
    </li>

  );

}