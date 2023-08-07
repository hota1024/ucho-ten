import React from "react";
import styles from "./styles.module.css";
import { PropsWithChildren } from "react";

export function CodeView(props: PropsWithChildren) {
  const { children } = props;

  return (
    <pre className={styles.pre}>
      <code className={styles.code}>{children}</code>
    </pre>
  );
}
