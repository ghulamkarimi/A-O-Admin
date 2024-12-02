import React from 'react';
import { format } from 'date-fns';

interface FormattedDateProps {
  date: string | Date;
  formatString?: string;
}

const FormattedDate: React.FC<FormattedDateProps> = ({ date, formatString = 'dd.MM.yyyy' }) => {
  const parsedDate = typeof date === 'string' ? new Date(date) : date;

  
  if (isNaN(parsedDate.getTime())) {
    return <span>Ungültiges Datum</span>;
  }

  const formattedDate = format(parsedDate, formatString);

  return <span>{formattedDate}</span>;
};

export default FormattedDate;
