import styles from './ResultsInfo.module.css';

interface ResultsInfoProps {
  currentCount: number
  totalCount: number
  itemName?: string
}

export const ResultsInfo: React.FC<ResultsInfoProps> = ({
  currentCount,
  totalCount,
  itemName = 'projects'
}) => {
  return (
    <div className={styles['resultsInfo']}>
      <p>
        Showing {currentCount} of {totalCount} {itemName}
      </p>
    </div>
  )
}
