import moment from 'moment';

export const dayCalculator = (seconds) => {
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  let m = Math.floor((seconds % (3600)) / (60));

  m += 1;

  const dDisplay = d > 0 ? d : '';
  const hDisplay = h > 0 ? h : '';
  const mDisplay = m > 0 ? m : '';
  if (seconds > 1) {
    if (dDisplay > 0) {
      return `${dDisplay} Day(s) ${hDisplay} Hour(s) ${mDisplay} Minute(s) Remaining`;
    }

    if (hDisplay > 0) {
      return `${hDisplay} Hour(s) ${mDisplay} Minute(s) Remaining`;
    }

    if (mDisplay > 0) {
      return `${mDisplay} Minute(s) Remaining`;
    }
  } else {
    return '0 Minute(s) Remaining';
  }
  return null;
};

export const calculateSla = (createdTime, slaTime, closed) => {
  const createdTimeDate = moment(new Date(createdTime));
  const slaTimeDate = moment(new Date(slaTime));
  let currentTimeDate = moment(new Date());

  if (closed) {
    currentTimeDate = moment(new Date(closed));
  }

  const totalTimeDate = slaTimeDate.diff(createdTimeDate);
  const completedTimeDate = currentTimeDate.diff(createdTimeDate);

  if (totalTimeDate > completedTimeDate) {
    const a = (totalTimeDate - completedTimeDate) / (1000);

    const data = dayCalculator(a);
    return {
      per: (100 * completedTimeDate) / totalTimeDate,
      remaining: data,
    };
  }
  const y = (totalTimeDate - completedTimeDate) / (1000);
  const data2 = dayCalculator(y);
  return {
    per: 100,
    remaining: data2,
  };
};
