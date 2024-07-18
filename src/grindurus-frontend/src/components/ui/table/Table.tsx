import React from 'react'
import styles from './Table.module.scss'

type TableCellContent = string | number | React.ReactNode

type TableProps = {
  headers?: TableCellContent[]
  data: TableCellContent[][]
  className?: string
}

export const Table: React.FC<TableProps> = ({ headers, data, className }) => {
  return (
    <table className={`${styles["table"]} ${className ?? ''}`}>
      {headers && (
        <thead className={styles["thead"]}>
          <tr className={styles["tr"]}>
            {headers.map((header, idx) => (
              <th key={idx} className={styles["th"]}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
      )}
      <tbody className={styles["tbody"]}>
        {data.map((row, rowIdx) => (
          <tr key={rowIdx} className={styles["tr"]}>
            {row.map((cell, cellIdx) => (
              <td key={cellIdx} className={styles["td"]}>
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}