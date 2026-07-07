import React from "react";
import styles from "./StatusUsuarioFeedback.module.css";

const StatusUsuarioFeedback = ({ message }) => {
  if (!message) {
    return null;
  }

  return <div className={styles.erro}>{message}</div>;
};

export default StatusUsuarioFeedback;