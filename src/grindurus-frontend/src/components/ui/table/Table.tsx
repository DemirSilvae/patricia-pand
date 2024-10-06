import React from 'react'
import styles from './Table.module.scss'

type TableCellContent = string | number | React.ReactNode

type TableProps = {
  headers?: TableCellContent[]
  data: TableCellContent[][]
  className?: string
  isLoading?: boolean
}

export const Table: React.FC<TableProps> = ({ headers, data, className, isLoading }) => {
  return (
    <table className={`${styles["table"]} ${className ?? ""}`}>
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
      <tbody className={isLoading ? `${styles["tbody"]} ${styles["loading"]}` : styles["tbody"]}>
        {isLoading ? (
          <tr className={styles["tr"]}>
            <td className={styles["td"]} colSpan={headers?.length ?? 1}>
              Loading...
            </td>
          </tr>
        ) : (
          data.map((row, rowIdx) => (
            <tr key={rowIdx} className={styles["tr"]}>
              {row.map((cell, cellIdx) => (
                <td key={cellIdx} className={styles["td"]}>
                  {cell}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  )
}
