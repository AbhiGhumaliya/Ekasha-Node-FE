import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { TopbarTimeFilterWrapper } from './TopBarWrapper';
import { panelDrawerClose } from '../../../../apis/panel/panel.action';
import ZsInput from '../../../forms/input';
import { history } from '../../../../configurations/redux/Store';
import ZsSelect from '../../../forms/select';
import Icons from '../../../icons';
import ZsButton from '../../../forms/button';
import ZsTabs from '../../../tabs';
import ZsDateTimePicker from '../../../datetimepicker';

const TopbarTimeFilter = React.memo((props) => {
  const { updateTimeFilter, setTimeFilData } = props;
  const dispatch = useDispatch();

  const [toggleDrop, setToggleDrop] = useState(false);
  const [fromDateTime, setFromDateTime] = useState(`${moment(new Date()).format('YYYY-MM-DD')} @ 00:00:00`);
  const [toDateTime, setToDateTime] = useState(`${moment(new Date()).format('YYYY-MM-DD')} @ 00:00:00`);
  const [fromInput, setFromInput] = useState(`${moment(new Date()).format('MMM DD, YYYY')} @ 00:00:00`);
  const [toInput, setToInput] = useState(`${moment(new Date()).format('MMM DD, YYYY')} @ 00:00:00`);
  const [relativeFrom, setRelativeFrom] = useState('');
  const [relativeTo, setRelativeTo] = useState('');
  const [disableTime, setDisableTime] = useState(false);

  // active type and tab
  const [fromTo, setFromTo] = useState('from');
  const [activeTypeFrom, setActiveTypeFrom] = useState('absolute');
  const [activeTypeTo, setActiveTypeTo] = useState('absolute');

  // absolute state props
  const amTime = [
    { time: '00:00', value: '00:00' },
    { time: '00:30', value: '00:30' },
    { time: '01:00', value: '01:00' },
    { time: '01:30', value: '01:30' },
    { time: '02:00', value: '02:00' },
    { time: '02:30', value: '02:30' },
    { time: '03:00', value: '03:00' },
    { time: '03:30', value: '03:30' },
    { time: '04:00', value: '04:00' },
    { time: '04:30', value: '04:30' },
    { time: '05:00', value: '05:00' },
    { time: '05:30', value: '05:30' },
    { time: '06:00', value: '06:00' },
    { time: '06:30', value: '06:30' },
    { time: '07:00', value: '07:00' },
    { time: '07:30', value: '07:30' },
    { time: '08:00', value: '08:00' },
    { time: '08:30', value: '08:30' },
    { time: '09:00', value: '09:00' },
    { time: '09:30', value: '09:30' },
    { time: '10:00', value: '10:00' },
    { time: '10:30', value: '10:30' },
    { time: '11:00', value: '11:00' },
    { time: '11:30', value: '11:30' },
    { time: '12:00', value: '12:00' },
    { time: '12:30', value: '12:30' },
    { time: '13:00', value: '13:00' },
    { time: '13:30', value: '13:30' },
    { time: '14:00', value: '14:00' },
    { time: '14:30', value: '14:30' },
    { time: '15:00', value: '15:00' },
    { time: '15:30', value: '15:30' },
    { time: '16:00', value: '16:00' },
    { time: '16:30', value: '16:30' },
    { time: '17:00', value: '17:00' },
    { time: '17:30', value: '17:30' },
    { time: '18:00', value: '18:00' },
    { time: '18:30', value: '18:30' },
    { time: '19:00', value: '19:00' },
    { time: '19:30', value: '19:30' },
    { time: '20:00', value: '20:00' },
    { time: '20:30', value: '20:30' },
    { time: '21:00', value: '21:00' },
    { time: '21:30', value: '21:30' },
    { time: '22:00', value: '22:00' },
    { time: '22:30', value: '22:30' },
    { time: '23:00', value: '23:00' },
    { time: '23:30', value: '23:30' },
  ];
  const [absoluteTimefrom, setAbsoluteTimefrom] = useState('');
  const [absoluteTimeto, setAbsoluteTimeto] = useState('');
  const [invalidAbsoluteTo, setInvalidAbsoluteTo] = useState(false);
  const [invalidAbsoluteFrom, setInvalidAbsoluteFrom] = useState(false);

  // relative state props
  const [relativeNumber, setRelativeNumber] = useState(0);
  const [relativeTime, setRelativeTime] = useState('seconds ago');

  // quick props
  const [quickFromTo, setQuickFromTo] = useState('last');
  const [quickNumber, setQuickNumber] = useState(1);
  const [quickTime, setQuickTime] = useState('seconds');
  const [quickString, setQuickString] = useState('Last 0 Seconds');
  const [commonString, setCommonString] = useState('Today');

  const isToTimeBeforeFromTime = () => {
    const fromTime = moment(fromDateTime.replace(' @ ', ' '));
    const toTime = moment(toDateTime.replace(' @ ', ' '));
    return toTime.isBefore(fromTime);
  };

  const setRelativeTimeDataIF = (x, fromDateTimePass) => {
    const time = moment(new Date(`${fromDateTimePass.split(' @ ')[0]} ${fromDateTimePass.split(' @ ')[1]}`));
    const duration = moment.duration(moment().diff(time));
    if (x.includes('second')) {
      const secs = duration.asSeconds();
      setFromInput(x);
      setRelativeNumber(parseInt(secs));
      setRelativeTime('seconds ago');
    } else if (x.includes('minutes')) {
      const mins = duration.asMinutes();
      setFromInput(x);
      setRelativeNumber(parseInt(mins));
      setRelativeTime('minutes ago');
    } else if (x.includes('hours')) {
      const hours = duration.asHours();
      setFromInput(x);
      setRelativeNumber(parseInt(hours));
      setRelativeTime('hours ago');
      const years = duration.asYears();
      setFromInput(x);
      setRelativeNumber(parseInt(years));
      setRelativeTime('years ago');
    } else if (x.includes('days')) {
      const days = duration.asDays();
      setFromInput(x);
      setRelativeNumber(parseInt(days));
      setRelativeTime('days ago');
    } else if (x.includes('weeks')) {
      const weeks = duration.asWeeks();
      setFromInput(x);
      setRelativeNumber(parseInt(weeks));
      setRelativeTime('weeks ago');
    } else if (x.includes('months')) {
      const months = duration.asMonths();
      setFromInput(x);
      setRelativeNumber(parseInt(months));
      setRelativeTime('months ago');
    }
  };

  const setRelativeTimeDataElse = (x, fromDateTimePass) => {
    const time = moment(new Date(`${fromDateTimePass.split(' @ ')[0]} ${fromDateTimePass.split(' @ ')[1]}`));
    const duration = moment.duration(moment(time).diff());
    if (x.includes('second')) {
      const secs = duration.asSeconds();
      setFromInput(x);
      setRelativeNumber(parseInt(secs));
      setRelativeTime('seconds from now');
    } else if (x.includes('minutes')) {
      const mins = duration.asMinutes();
      setFromInput(x);
      setRelativeNumber(parseInt(mins));
      setRelativeTime('minutes from now');
    } else if (x.includes('hours')) {
      const hours = duration.asHours();
      setFromInput(x);
      setRelativeNumber(parseInt(hours));
      setRelativeTime('hours from now');
      const years = duration.asYears();
      setFromInput(x);
      setRelativeNumber(parseInt(years));
      setRelativeTime('years from now');
    } else if (x.includes('days')) {
      const days = duration.asDays();
      setFromInput(x);
      setRelativeNumber(parseInt(days));
      setRelativeTime('days from now');
    } else if (x.includes('weeks')) {
      const weeks = duration.asWeeks();
      setFromInput(x);
      setRelativeNumber(parseInt(weeks));
      setRelativeTime('weeks from now');
    } else if (x.includes('months')) {
      const months = duration.asMonths();
      setFromInput(x);
      setRelativeNumber(parseInt(months));
      setRelativeTime('months from now');
    }
  };

  const setAbsoluteTimeDataIF = (x, toDateTimePass) => {
    const time = moment(new Date(`${toDateTimePass.split(' @ ')[0]} ${toDateTimePass.split(' @ ')[1]}`));
    const duration = moment.duration(moment().diff(time));
    if (x.includes('second')) {
      const secs = duration.asSeconds();
      setToInput(x);
      setRelativeNumber(parseInt(secs));
      setRelativeTime('seconds ago');
    } else if (x.includes('minutes')) {
      const mins = duration.asMinutes();
      setToInput(x);
      setRelativeNumber(parseInt(mins));
      setRelativeTime('minutes ago');
    } else if (x.includes('hours')) {
      const hours = duration.asHours();
      setToInput(x);
      setRelativeNumber(parseInt(hours));
      setRelativeTime('hours ago');
      const years = duration.asYears();
      setToInput(x);
      setRelativeNumber(parseInt(years));
      setRelativeTime('years ago');
    } else if (x.includes('days')) {
      const days = duration.asDays();
      setToInput(x);
      setRelativeNumber(parseInt(days));
      setRelativeTime('days ago');
    } else if (x.includes('weeks')) {
      const weeks = duration.asWeeks();
      setToInput(x);
      setRelativeNumber(parseInt(weeks));
      setRelativeTime('weeks ago');
    } else if (x.includes('months')) {
      const months = duration.asMonths();
      setToInput(x);
      setRelativeNumber(parseInt(months));
      setRelativeTime('months ago');
    }
  };

  const setAbsoluteTimeDataElse = (x, toDateTimePass) => {
    const time = moment(new Date(`${toDateTimePass.split(' @ ')[0]} ${toDateTimePass.split(' @ ')[1]}`));
    const duration = moment.duration(moment(time).diff());
    if (x.includes('second')) {
      const secs = duration.asSeconds();
      setToInput(x);
      setRelativeNumber(parseInt(secs));
      setRelativeTime('seconds from now');
    } else if (x.includes('minutes')) {
      const mins = duration.asMinutes();
      setToInput(x);
      setRelativeNumber(parseInt(mins));
      setRelativeTime('minutes from now');
    } else if (x.includes('hours')) {
      const hours = duration.asHours();
      setToInput(x);
      setRelativeNumber(parseInt(hours));
      setRelativeTime('hours from now');
      const years = duration.asYears();
      setToInput(x);
      setRelativeNumber(parseInt(years));
      setRelativeTime('years from now');
    } else if (x.includes('days')) {
      const days = duration.asDays();
      setToInput(x);
      setRelativeNumber(parseInt(days));
      setRelativeTime('days from now');
    } else if (x.includes('weeks')) {
      const weeks = duration.asWeeks();
      setToInput(x);
      setRelativeNumber(parseInt(weeks));
      setRelativeTime('weeks from now');
    } else if (x.includes('months')) {
      const months = duration.asMonths();
      setToInput(x);
      setRelativeNumber(parseInt(months));
      setRelativeTime('months from now');
    }
  };

  const setFromTimeData = useCallback((type, fromDateTimePass) => {
    if (type === 'absolute') {
      setFromInput(fromDateTimePass);
    } else if (type === 'relative') {
      const x = moment(new Date(`${fromDateTimePass.split(' @ ')[0]} ${fromDateTimePass.split(' @ ')[1]}`)).fromNow();
      if (x.includes('ago')) {
        setRelativeTimeDataIF(x, fromDateTimePass);
      } else {
        setRelativeTimeDataElse(x, fromDateTimePass);
      }
    } else if (type === 'now') {
      setFromInput(moment(new Date()).format('MMM DD, YYYY @ HH:mm:ss'));
      setFromDateTime(moment(new Date()).format('YYYY-MM-DD @ HH:mm:ss'));
    }
  }, []);

  const setActiveType = useCallback((fromToPass, type, fromDateTimePass, toDateTimePass) => {
    if (fromToPass === 'from') {
      setFromTimeData(type, fromDateTimePass);
      setActiveTypeFrom(type);
      setRelativeFrom(fromDateTimePass);
    } else {
      if (type === 'absolute') {
        setToInput(toDateTimePass);
      } else if (type === 'relative') {
        const x = moment(new Date(`${toDateTimePass.split(' @ ')[0]} ${toDateTimePass.split(' @ ')[1]}`)).fromNow();
        if (x.includes('ago')) {
          setAbsoluteTimeDataIF(x, toDateTimePass);
        } else {
          setAbsoluteTimeDataElse(x, toDateTimePass);
        }
      } else if (type === 'now') {
        setToInput(moment(new Date()).format('MMM DD, YYYY @ HH:mm:ss'));
        setToDateTime(moment(new Date()).format('YYYY-MM-DD @ HH:mm:ss'));
      }
      setActiveTypeTo(type);
      setRelativeTo(toDateTimePass);
    }
  }, []);
  const activeTypeFromAndTo = useCallback((x) => {
    if (localStorage.getItem('activeTypeFrom')) {
      setActiveType('from', localStorage.getItem('activeTypeFrom'), `${moment(x.from).format('MMM DD,YYYY')} @ ${x.from.split('T')[1].split(':')[0]}:${x.from.split('T')[1].split(':')[1]}`, `${moment(x.to).format('MMM DD,YYYY')} @ ${x.to.split('T')[1].split(':')[0]}:${x.to.split('T')[1].split(':')[1]}`);
    }
    if (localStorage.getItem('activeTypeTo')) {
      setActiveType('to', localStorage.getItem('activeTypeTo'), `${moment(x.from).format('MMM DD,YYYY')} @ ${x.from.split('T')[1].split(':')[0]}:${x.from.split('T')[1].split(':')[1]}`, `${moment(x.to).format('MMM DD,YYYY')} @ ${x.to.split('T')[1].split(':')[0]}:${x.to.split('T')[1].split(':')[1]}`);
    }
  }, []);
  const quickFromToPassFun = useCallback((quickFromToPass, quickNumberPass, quickTimePass) => {
    const time = moment(new Date(), 'YYYY-MM-DD HH:mm:ss');
    if (quickFromToPass === 'last') {
      time.subtract(parseInt(quickNumberPass), parseInt(quickNumberPass) === 1
        ? quickTimePass.substr(0, quickTimePass.length - 1) : quickTimePass);
      localStorage.setItem('timeFilter',
        JSON.stringify({
          from: moment(time).format(),
          to: moment(new Date()).format(),
        }));
      updateTimeFilter();
    } else {
      time.add(parseInt(quickNumberPass), parseInt(quickNumberPass) === 1
        ? quickTimePass.substr(0, quickTimePass.length - 1) : quickTimePass);
      localStorage.setItem('timeFilter',
        JSON.stringify({
          from: moment().format(),
          to: moment(new Date(time)).format(),
        }));
      updateTimeFilter();
    }
  }, []);
  const quickFromToPassFun1 = useCallback((quickFromToPass, quickNumberPass, quickTimePass) => {
    const time = moment(new Date(), 'YYYY-MM-DD HH:mm:ss');
    if (quickFromToPass === 'last') {
      time.subtract(parseInt(quickNumberPass), parseInt(quickNumberPass) === 1
        ? quickTimePass.substr(0, quickTimePass.length - 1) : quickTimePass);
      updateTimeFilter();
    } else {
      time.add(parseInt(quickNumberPass), parseInt(quickNumberPass) === 1
        ? quickTimePass.substr(0, quickTimePass.length - 1) : quickTimePass);
      updateTimeFilter();
    }
  }, []);

  const toggleDropdown = useCallback(() => {
    dispatch(panelDrawerClose());
    setToggleDrop(!toggleDrop);
  }, [toggleDrop]);

  const changeControl = useCallback((type) => {
    setFromTo(type);
  }, []);

  const applyQuickTime = useCallback(
    (quickFromToPass, quickNumberPass, quickTimePass, type, strings) => {
      if (history.location.pathname.split('/')[3] !== 'attribute') {
        if (type === 'common') {
          localStorage.setItem('fromTo', 'common');
          localStorage.setItem('commonString', strings);
          setCommonString(strings);
          setFromTo('common');
          quickFromToPassFun(quickFromToPass, quickNumberPass, quickTimePass);
        } else {
          const time = moment(new Date(), 'YYYY-MM-DD HH:mm:ss');
          if (quickFromToPass === 'last') {
            time.subtract(parseInt(quickNumberPass), parseInt(quickNumberPass) === 1
              ? quickTimePass.substr(0, quickTimePass.length - 1) : quickTimePass);
            localStorage.setItem('fromTo', 'quick');
            localStorage.setItem('timeFilter',
              JSON.stringify({
                from: moment(time).format(),
                to: moment(new Date()).format(),
              }));
            localStorage.setItem('quickString', `Last ${quickNumberPass} ${quickTimePass}`);
            setQuickString(`Last ${quickNumberPass} ${quickTimePass}`);
            updateTimeFilter();
          } else {
            time.add(parseInt(quickNumberPass), parseInt(quickNumberPass) === 1
              ? quickTimePass.substr(0, quickTimePass.length - 1) : quickTimePass);
            localStorage.setItem('fromTo', 'quick');
            localStorage.setItem('timeFilter',
              JSON.stringify({
                from: moment().format(),
                to: moment(new Date(time)).format(),
              }));
            localStorage.setItem('quickString', `${quickNumberPass} ${quickTimePass} from now`);
            setQuickString(`${quickNumberPass} ${quickTimePass} from now`);
          }
        }
        updateTimeFilter();
        toggleDropdown();
      } else {
        if (type === 'common') {
          setTimeFilData([{
            activeTypeFrom,
            activeTypeTo,
            fromTo: 'common',
            quickString: `Last ${quickNumberPass} ${quickTimePass}`,
            commonString: strings,
            timeFilter: JSON.stringify({
              from: moment(new Date(fromDateTime.replace(' @ ', ' '))).format(),
              to: moment(new Date(toDateTime.replace(' @ ', ' '))).format(),
            }),
          }]);
          setCommonString(strings);
          setFromTo('common');
          quickFromToPassFun1(quickFromToPass, quickNumberPass, quickTimePass);
        } else {
          setFromTo('quick');
          const time = moment(new Date(), 'YYYY-MM-DD HH:mm:ss');
          if (quickFromToPass === 'last') {
            time.subtract(parseInt(quickNumberPass), parseInt(quickNumberPass) === 1
              ? quickTimePass.substr(0, quickTimePass.length - 1) : quickTimePass);
            setQuickString(`Last ${quickNumberPass} ${quickTimePass}`);
            updateTimeFilter();
          } else {
            time.add(parseInt(quickNumberPass), parseInt(quickNumberPass) === 1
              ? quickTimePass.substr(0, quickTimePass.length - 1) : quickTimePass);
            setQuickString(`${quickNumberPass} ${quickTimePass} from now`);
          }
          setTimeFilData([{
            activeTypeFrom,
            activeTypeTo,
            fromTo: 'quick',
            quickString: `Last ${quickNumberPass} ${quickTimePass}`,
            commonString: strings,
            timeFilter: JSON.stringify({
              from: moment(new Date(fromDateTime.replace(' @ ', ' '))).format(),
              to: moment(new Date(toDateTime.replace(' @ ', ' '))).format(),
            }),
          }]);
        }
        updateTimeFilter();
        toggleDropdown();
      }
    }, [activeTypeFrom, activeTypeTo, fromDateTime, toDateTime, fromTo, quickString],
  );

  const checkValueTimeFileter = useCallback((e, a, temp) => {
    if (/[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9]:[0-5][0-9]/.test(e.target.value) && a && moment(new Date(temp)).format('YYYY-MM-DD HH:mm:ss') <= moment(new Date()).format('YYYY-MM-DD HH:mm:ss')) {
      if (fromTo === 'from') {
        setInvalidAbsoluteFrom(false);
      } else {
        setInvalidAbsoluteTo(false);
      }
    } else if (fromTo === 'from') {
      setInvalidAbsoluteFrom(true);
    } else {
      setInvalidAbsoluteTo(true);
    }
  }, [fromTo, invalidAbsoluteFrom, invalidAbsoluteTo]);

  const setAbsoluteDateTime = useCallback((e) => {
    if (e.target.value.length > 19) {
      return;
    }
    const a = moment(e.target.value);
    // eslint-disable-next-line no-underscore-dangle
    if (a._isValid === false) {
      return;
    }
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (moment(e.target.value).format('YYYY-MM-DD') >= moment(tomorrow).format('YYYY-MM-DD')) {
      setDisableTime(true);
    } else {
      setDisableTime(false);
    }
    const temp = e.target.value.split(' ');
    if (e.target.value.includes(' ')) {
      checkValueTimeFileter(e, a, temp);
      const tempVal = e.target.value.split(' ');
      if (fromTo === 'from') {
        if (tempVal[0].split(' ')[0] === 'Invalid') {
          setFromDateTime(`${tempVal[0]} @ time`);
          setFromInput(`${moment(new Date(tempVal[0])).format('MMM DD, YYYY')} @ time`);
        } else {
          setFromDateTime(`${tempVal[0]} @ ${tempVal[1]}`);
          setFromInput(`${moment(new Date(tempVal[0])).format('MMM DD, YYYY')} @ ${tempVal[1]}`);
        }
      } else if (tempVal[0].split(' ')[0] === 'Invalid') {
        setToDateTime(`${tempVal[0]} @ time`);
        setToInput(`${moment(new Date(tempVal[0])).format('MMM DD, YYYY')} @ time`);
      } else {
        setToDateTime(`${tempVal[0]} @ ${tempVal[1]}`);
        setToInput(`${moment(new Date(tempVal[0])).format('MMM DD, YYYY')} @ ${tempVal[1]}`);
      }
    } else if (fromTo === 'from') {
      setInvalidAbsoluteFrom(true);
    } else {
      setInvalidAbsoluteTo(false);
    }
  }, [fromTo, invalidAbsoluteFrom, invalidAbsoluteTo]);

  const setAbsoluteDate = useCallback((dateValue) => {
    const fullDate = moment(new Date(dateValue)).format('MMM DD, YYYY');
    const date = fromTo === 'from' ? fromDateTime : toDateTime;
    const temp = date.split(' @ ');
    const temp1 = date.split(' @ ');
    temp[0] = moment(new Date(fullDate)).format('YYYY-MM-DD');
    temp1[0] = fullDate;
    temp[1] = '00:00:00';
    temp1[1] = '00:00:00';
    const timeMerge = temp[1].split(':');
    timeMerge[0] = fromTo === 'from' ? ((absoluteTimefrom || '00:00').split(':')[0]) : ((absoluteTimeto || '00:00').split(':')[0]);
    timeMerge[1] = fromTo === 'from' ? ((absoluteTimefrom || '00:00').split(':')[1]) : ((absoluteTimeto || '00:00').split(':')[1]);
    temp[1] = timeMerge.join(':');
    temp1[1] = timeMerge.join(':');
    if (fromTo === 'from') {
      setFromDateTime(temp.join(' @ '));
      setFromInput(temp1.join(' @ '));
      setInvalidAbsoluteFrom(false);
    } else {
      setToDateTime(temp.join(' @ '));
      setToInput(temp1.join(' @ '));
      setInvalidAbsoluteTo(false);
    }
  }, [fromTo, invalidAbsoluteFrom, invalidAbsoluteTo]);
  const saveAbsolutimeFun = useCallback((time, oldTime) => {
    const date = toDateTime;
    const temp = date.split(' @ ');
    if (`${moment(new Date(temp[0])).format('YYYY-MM-DD')} ${time}` <= moment(new Date()).format('YYYY-MM-DD HH:mm')) {
      if (date.includes('@')) {
        const timeMerge = temp[1].split(':');
        const oldTime0 = oldTime[0];
        const oldTime1 = oldTime[1];
        timeMerge[0] = oldTime0;
        timeMerge[1] = oldTime1;
        temp[1] = timeMerge.join(':');
        setAbsoluteTimeto(time);
        setToDateTime(temp.join(' @ '));
        setToInput(`${moment(new Date(temp[0])).format('MMM DD, YYYY')} @ ${temp[1]}`);
      } else {
        setAbsoluteTimeto(time);
        setToDateTime(`${moment(new Date()).format('MMM DD, YYYY')} @ ${oldTime.join(':')}`);
        setToInput(`${moment(new Date()).format('MMM DD, YYYY')} @ ${oldTime.join(':')}`);
      }
    }
  }, [fromTo, invalidAbsoluteFrom, invalidAbsoluteTo]);
  const saveAbsoluteTime = useCallback((time) => {
    const splitted0 = time.split(':')[0];
    const splitted1 = time.split(':')[1];
    let oldTime;

    if (fromTo === 'from') {
      oldTime = absoluteTimefrom ? absoluteTimefrom.split(':') : '00:00'.split(':');
    } else {
      oldTime = absoluteTimeto ? absoluteTimeto.split(':') : '00:00'.split(':');
    }

    oldTime[0] = splitted0;
    oldTime[1] = splitted1;
    if (fromTo === 'from') {
      const date = fromDateTime;
      const temp = date.split(' @ ');
      if (`${moment(new Date(temp[0])).format('YYYY-MM-DD')} ${time}` <= moment(new Date()).format('YYYY-MM-DD HH:mm')) {
        if (date.includes('@')) {
          const timeMerge = temp[1].split(':');
          const oldTime0 = oldTime[0];
          const oldTime1 = oldTime[1];
          timeMerge[0] = oldTime0;
          timeMerge[1] = oldTime1;
          temp[1] = timeMerge.join(':');
          setAbsoluteTimefrom(time);
          setFromDateTime(temp.join(' @ '));
          setFromInput(`${moment(new Date(temp[0])).format('MMM DD, YYYY')}@ ${temp[1]}`);
        } else {
          setAbsoluteTimefrom(time);
          setFromDateTime(`${moment(new Date()).format('MMM DD, YYYY')} @ ${oldTime.join(':')}`);
          setFromInput(`${moment(new Date()).format('MMM DD, YYYY')} @ ${oldTime.join(':')}`);
        }
      }
    } else {
      saveAbsolutimeFun(time, oldTime);
    }
  }, [fromTo, invalidAbsoluteFrom, invalidAbsoluteTo]);

  // relative time
  const changeRelativeNumber = (e, type) => {
    if (fromTo === 'from') {
      const time = moment(new Date(), 'YYYY-MM-DD HH:mm:ss');
      if (type === 'number') {
        if (relativeTime.includes('ago')) {
          if (relativeTime.includes('second')) {
            time.subtract(e, e > 1 ? 'seconds' : 'second');
          } else if (relativeTime.includes('minute')) {
            time.subtract(e, e > 1 ? 'minutes' : 'minute');
          } else if (relativeTime.includes('hour')) {
            time.subtract(e, e > 1 ? 'hours' : 'hour');
          } else if (relativeTime.includes('day')) {
            time.subtract(e, e > 1 ? 'days' : 'day');
          } else if (relativeTime.includes('week')) {
            time.subtract(e, e > 1 ? 'weeks' : 'week');
          } else if (relativeTime.includes('months')) {
            time.subtract(e, e > 1 ? 'months' : 'month');
          } else if (relativeTime.includes('year')) {
            time.subtract(e, e > 1 ? 'years' : 'year');
          }
          setRelativeNumber(e);
          setFromInput(time.fromNow());
          setFromDateTime(moment(time).format('YYYY-MM-DD @ HH:mm:ss'));
          setRelativeFrom(moment(time).format('MMM DD,YYYY @ HH:mm:ss'));
        } else {
          if (relativeTime.includes('second')) {
            time.add(e, e > 1 ? 'seconds' : 'second');
          } else if (relativeTime.includes('minute')) {
            time.add(e, e > 1 ? 'minutes' : 'minute');
          } else if (relativeTime.includes('hour')) {
            time.add(e, e > 1 ? 'hours' : 'hour');
          } else if (relativeTime.includes('day')) {
            time.add(e, e > 1 ? 'days' : 'day');
          } else if (relativeTime.includes('week')) {
            time.add(e, e > 1 ? 'weeks' : 'week');
          } else if (relativeTime.includes('months')) {
            time.add(e, e > 1 ? 'months' : 'month');
          } else if (relativeTime.includes('year')) {
            time.add(e, e > 1 ? 'years' : 'year');
          }
          setRelativeNumber(e);
          setFromInput(time.fromNow());
          setFromDateTime(moment(time).format('YYYY-MM-DD @ HH:mm:ss'));
          setRelativeFrom(moment(time).format('MMM DD,YYYY @ HH:mm:ss'));
        }
      } else if (e.includes('ago')) {
        if (e.includes('second')) {
          time.subtract(relativeNumber, relativeNumber > 1 ? 'seconds' : 'second');
        } else if (e.includes('minute')) {
          time.subtract(relativeNumber, relativeNumber > 1 ? 'minutes' : 'minute');
        } else if (e.includes('hour')) {
          time.subtract(relativeNumber, relativeNumber > 1 ? 'hours' : 'hour');
        } else if (e.includes('day')) {
          time.subtract(relativeNumber, relativeNumber > 1 ? 'days' : 'day');
        } else if (e.includes('week')) {
          time.subtract(relativeNumber, relativeNumber > 1 ? 'weeks' : 'week');
        } else if (e.includes('months')) {
          time.subtract(relativeNumber, relativeNumber > 1 ? 'months' : 'month');
        } else if (e.includes('year')) {
          time.subtract(relativeNumber, relativeNumber > 1 ? 'years' : 'year');
        }
        setRelativeTime(e);
        setFromInput(time.fromNow());
        setFromDateTime(moment(time).format('YYYY-MM-DD @ HH:mm:ss'));
        setRelativeFrom(moment(time).format('MMM DD,YYYY @ HH:mm:ss'));
      } else {
        if (e.includes('second')) {
          time.add(relativeNumber, relativeNumber > 1 ? 'seconds' : 'second');
        } else if (e.includes('minute')) {
          time.add(relativeNumber, relativeNumber > 1 ? 'minutes' : 'minute');
        } else if (e.includes('hour')) {
          time.add(relativeNumber, relativeNumber > 1 ? 'hours' : 'hour');
        } else if (e.includes('day')) {
          time.add(relativeNumber, relativeNumber > 1 ? 'days' : 'day');
        } else if (e.includes('week')) {
          time.add(relativeNumber, relativeNumber > 1 ? 'weeks' : 'week');
        } else if (e.includes('months')) {
          time.add(relativeNumber, relativeNumber > 1 ? 'months' : 'month');
        } else if (e.includes('year')) {
          time.add(relativeNumber, relativeNumber > 1 ? 'years' : 'year');
        }
        setRelativeTime(e);
        setFromInput(time.fromNow());
        setFromDateTime(moment(time).format('YYYY-MM-DD @ HH:mm:ss'));
        setRelativeFrom(moment(time).format('MMM DD,YYYY @ HH:mm:ss'));
      }
    } else {
      const time = moment(new Date(), 'YYYY-MM-DD HH:mm:ss');
      if (type === 'number') {
        if (relativeTime.includes('ago')) {
          if (relativeTime.includes('second')) {
            time.subtract(e, e > 1 ? 'seconds' : 'second');
          } else if (relativeTime.includes('minute')) {
            time.subtract(e, e > 1 ? 'minutes' : 'minute');
          } else if (relativeTime.includes('hour')) {
            time.subtract(e, e > 1 ? 'hours' : 'hour');
          } else if (relativeTime.includes('day')) {
            time.subtract(e, e > 1 ? 'days' : 'day');
          } else if (relativeTime.includes('week')) {
            time.subtract(e, e > 1 ? 'weeks' : 'week');
          } else if (relativeTime.includes('months')) {
            time.subtract(e, e > 1 ? 'months' : 'month');
          } else if (relativeTime.includes('year')) {
            time.subtract(e, e > 1 ? 'years' : 'year');
          }
          setRelativeNumber(e);
          setToInput(time.fromNow());
          setToDateTime(moment(time).format('YYYY-MM-DD @ HH:mm:ss'));
          setRelativeTo(moment(time).format('MMM DD,YYYY @ HH:mm:ss'));
        } else {
          if (relativeTime.includes('second')) {
            time.add(e, e > 1 ? 'seconds' : 'second');
          } else if (relativeTime.includes('minute')) {
            time.add(e, e > 1 ? 'minutes' : 'minute');
          } else if (relativeTime.includes('hour')) {
            time.add(e, e > 1 ? 'hours' : 'hour');
          } else if (relativeTime.includes('day')) {
            time.add(e, e > 1 ? 'days' : 'day');
          } else if (relativeTime.includes('week')) {
            time.add(e, e > 1 ? 'weeks' : 'week');
          } else if (relativeTime.includes('months')) {
            time.add(e, e > 1 ? 'months' : 'month');
          } else if (relativeTime.includes('year')) {
            time.add(e, e > 1 ? 'years' : 'year');
          }
          setRelativeNumber(e);
          setToInput(time.fromNow());
          setToDateTime(moment(time).format('YYYY-MM-DD @ HH:mm:ss'));
          setRelativeTo(moment(time).format('MMM DD,YYYY @ HH:mm:ss'));
        }
      } else if (e.includes('ago')) {
        if (e.includes('second')) {
          time.subtract(relativeNumber, relativeNumber > 1 ? 'seconds' : 'second');
        } else if (e.includes('minute')) {
          time.subtract(relativeNumber, relativeNumber > 1 ? 'minutes' : 'minute');
        } else if (e.includes('hour')) {
          time.subtract(relativeNumber, relativeNumber > 1 ? 'hours' : 'hour');
        } else if (e.includes('day')) {
          time.subtract(relativeNumber, relativeNumber > 1 ? 'days' : 'day');
        } else if (e.includes('week')) {
          time.subtract(relativeNumber, relativeNumber > 1 ? 'weeks' : 'week');
        } else if (e.includes('months')) {
          time.subtract(relativeNumber, relativeNumber > 1 ? 'months' : 'month');
        } else if (e.includes('year')) {
          time.subtract(relativeNumber, relativeNumber > 1 ? 'years' : 'year');
        }
        setRelativeTime(e);
        setToInput(time.fromNow());
        setToDateTime(moment(time).format('YYYY-MM-DD @ HH:mm:ss'));
        setRelativeTo(moment(time).format('MMM DD,YYYY @ HH:mm:ss'));
      } else {
        if (e.includes('second')) {
          time.add(relativeNumber, relativeNumber > 1 ? 'seconds' : 'second');
        } else if (e.includes('minute')) {
          time.add(relativeNumber, relativeNumber > 1 ? 'minutes' : 'minute');
        } else if (e.includes('hour')) {
          time.add(relativeNumber, relativeNumber > 1 ? 'hours' : 'hour');
        } else if (e.includes('day')) {
          time.add(relativeNumber, relativeNumber > 1 ? 'days' : 'day');
        } else if (e.includes('week')) {
          time.add(relativeNumber, relativeNumber > 1 ? 'weeks' : 'week');
        } else if (e.includes('months')) {
          time.add(relativeNumber, relativeNumber > 1 ? 'months' : 'month');
        } else if (e.includes('year')) {
          time.add(relativeNumber, relativeNumber > 1 ? 'years' : 'year');
        }
        setRelativeTime(e);
        setToInput(time.fromNow());
        setToDateTime(moment(time).format('YYYY-MM-DD @ HH:mm:ss'));
        setRelativeTo(moment(time).format('MMM DD,YYYY @ HH:mm:ss'));
      }
    }
  };

  // set to now
  const setToNow = useCallback(() => {
    const now = `${moment(new Date()).format('YYYY-MM-DD')} @ 00:00:00:000`;
    if (fromTo === 'from') {
      setFromDateTime(now);
      setFromInput('now');
    } else {
      setToDateTime(now);
      setToInput('now');
    }
  }, [fromTo]);

  // save in localStorage
  const saveFilterTime = useCallback(() => {
    if (history.location.pathname.split('/')[3] !== 'attribute') {
      localStorage.setItem('activeTypeFrom', activeTypeFrom);
      localStorage.setItem('activeTypeTo', activeTypeTo);
      localStorage.setItem('fromTo', fromTo);
      localStorage.setItem('quickString', quickString);
      localStorage.setItem('commonString', commonString);
      localStorage.setItem('timeFilter',
        JSON.stringify({
          from: moment(new Date(fromDateTime.replace(' @ ', ' '))).format(),
          to: moment(new Date(toDateTime.replace(' @ ', ' '))).format(),
        }));
      setFromTo(fromTo);
      updateTimeFilter();
      toggleDropdown();
    } else {
      setActiveTypeFrom(activeTypeFrom);
      setActiveTypeTo(activeTypeTo);
      setFromTo(fromTo);
      setQuickString(quickString);
      setCommonString(commonString);
      setTimeFilData([{
        activeTypeFrom,
        activeTypeTo,
        fromTo,
        quickString,
        commonString,
        timeFilter: JSON.stringify({
          from: moment(new Date(fromDateTime.replace(' @ ', ' '))).format(),
          to: moment(new Date(toDateTime.replace(' @ ', ' '))).format(),
        }),
      }]);
      updateTimeFilter();
      toggleDropdown();
    }
  }, [fromTo, activeTypeFrom, activeTypeTo, quickString, commonString, fromDateTime, toDateTime]);

  useEffect(() => {
    window.addEventListener('click', (e) => {
      if (document.getElementsByClassName('vis-timeline').length > 0) {
        if (document.getElementsByClassName('vis-timeline')[0].contains(e.target)) {
          setToggleDrop(false);
        }
      }
    });

    return () => {
      window.addEventListener('click', null);
    };
  }, []);
  // dropdown show and hide
  useEffect(() => {
    window.addEventListener('mousedown', (e) => {
      if (toggleDrop) {
        if (document.getElementById('tfFilterMenu')) {
          if (!document.getElementById('tfFilterMenu').contains(e.target)) {
            setToggleDrop(false);
            const x = JSON.parse(localStorage.getItem('timeFilter'));
            setFromDateTime(`${moment(x.from).format('YYYY-MM-DD')} @ ${x.from.split('T')[1].split(':')[0]}:${x.from.split('T')[1].split(':')[1]}:${x.from.split('T')[1].split(':')[2].split('+')[0]}`);
            setFromInput(`${moment(x.from).format('MMM DD,YYYY')} @ ${x.from.split('T')[1].split(':')[0]}:${x.from.split('T')[1].split(':')[1]}:${x.from.split('T')[1].split(':')[2].split('+')[0]}`);
            setToDateTime(`${moment(x.to).format('YYYY-MM-DD')} @ ${x.to.split('T')[1].split(':')[0]}:${x.to.split('T')[1].split(':')[1]}:${x.from.split('T')[1].split(':')[2].split('+')[0]}`);
            setToInput(`${moment(x.to).format('MMM DD,YYYY')} @ ${x.to.split('T')[1].split(':')[0]}:${x.to.split('T')[1].split(':')[1]}:${x.from.split('T')[1].split(':')[2].split('+')[0]}`);
            setInvalidAbsoluteFrom(false);
            setInvalidAbsoluteTo(false);
          }
        }
      }
    });
  }, [toggleDrop]);

  useEffect(() => {
    if (localStorage.getItem('timeFilter')) {
      const x = JSON.parse(localStorage.getItem('timeFilter'));
      setFromDateTime(`${moment(x.from).format('YYYY-MM-DD')} @ ${x.from.split('T')[1].split(':')[0]}:${x.from.split('T')[1].split(':')[1]}:${x.from.split('T')[1].split(':')[2].split('+')[0]}`);
      setFromInput(`${moment(x.from).format('MMM DD,YYYY')} @ ${x.from.split('T')[1].split(':')[0]}:${x.from.split('T')[1].split(':')[1]}`);
      setToDateTime(`${moment(x.to).format('YYYY-MM-DD')} @ ${x.to.split('T')[1].split(':')[0]}:${x.to.split('T')[1].split(':')[1]}:${x.from.split('T')[1].split(':')[2].split('+')[0]}`);
      setToInput(`${moment(x.to).format('MMM DD,YYYY')} @ ${x.to.split('T')[1].split(':')[0]}:${x.to.split('T')[1].split(':')[1]}`);
      activeTypeFromAndTo(x);
      if (localStorage.getItem('fromTo')) {
        if (localStorage.getItem('fromTo') === 'quick') {
          const y = localStorage.getItem('quickString').split(' ');
          if (localStorage.getItem('quickString').includes('from now')) {
            setFromTo('quick');
            setQuickFromTo('next');
            setQuickNumber(parseInt(y[0]));
            setQuickTime(y[1]);
            setQuickString(localStorage.getItem('quickString'));
          } else {
            setFromTo('quick');
            setQuickFromTo('last');
            setQuickNumber(parseInt(y[1]));
            setQuickTime(y[2]);
            setQuickString(localStorage.getItem('quickString'));
          }
        } else if (localStorage.getItem('fromTo') === 'common') {
          setFromTo('common');
          setCommonString(localStorage.getItem('commonString'));
        }
      }
    }
  }, []);

  return (
    <TopbarTimeFilterWrapper id="topbarTimeFilter" style={{ display: 'flex' }}>
      {history.location.pathname.split('/')[3] !== 'attribute'
        ? (
          <>
            {localStorage.getItem('fromTo') && localStorage.getItem('fromTo') === 'quick' ? <div className="tfString">{quickString}</div> : null}
            {localStorage.getItem('fromTo') && localStorage.getItem('fromTo') === 'common' ? <div className="tfString">{commonString}</div> : null}

            {localStorage.getItem('fromTo') && (localStorage.getItem('fromTo') === 'from' || localStorage.getItem('fromTo') === 'to')
              ? (
                <div className="tfString">
                  {localStorage.getItem('activeTypeFrom') && localStorage.getItem('activeTypeFrom') === 'absolute' ? fromInput : null}
                  {localStorage.getItem('activeTypeFrom') && localStorage.getItem('activeTypeFrom') === 'relative' ? fromInput : null}
                  {localStorage.getItem('activeTypeFrom') && localStorage.getItem('activeTypeFrom') === 'now' ? 'From now' : null}
                  <Icons type="lineArrowRight" icontype="globle" style={{ margin: '0 10px' }} />
                  {localStorage.getItem('activeTypeTo') && localStorage.getItem('activeTypeTo') === 'absolute' ? toInput : null}
                  {localStorage.getItem('activeTypeTo') && localStorage.getItem('activeTypeTo') === 'relative' ? toInput : null}
                  {localStorage.getItem('activeTypeTo') && localStorage.getItem('activeTypeTo') === 'now' ? 'Now' : null}
                </div>
              )
              : null}
          </>
        ) : (
          <>
            {fromTo && fromTo === 'quick' ? <div className="tfString">{quickString}</div> : null}
            {fromTo && fromTo === 'common' ? <div className="tfString">{commonString}</div> : null}

            {fromTo && (fromTo === 'from' || fromTo === 'to')
              ? (
                <div className="tfString">
                  {activeTypeFrom && activeTypeFrom === 'absolute' ? fromInput : null}
                  {activeTypeFrom && activeTypeFrom === 'relative' ? fromInput : null}
                  {activeTypeFrom && activeTypeFrom === 'now' ? 'From now' : null}
                  <Icons type="lineArrowRight" icontype="globle" style={{ margin: '0 10px' }} />
                  {activeTypeTo && activeTypeTo === 'absolute' ? toInput : null}
                  {activeTypeTo && activeTypeTo === 'relative' ? toInput : null}
                  {activeTypeTo && activeTypeTo === 'now' ? 'Now' : null}
                </div>
              )
              : null}
          </>
        )}
      <div className="timeFDrop">
        <div className="timeFDropToggler">
          <Icons className="timeFDrop" id="TimeFdroptoggler" icontype="common" type="timeFilter" onClick={() => toggleDropdown()} />
        </div>
        <div id="tfFilterMenu" className={toggleDrop ? 'tfBox tfBoxShow' : 'tfBox'}>
          <div className="topTime">
            <div
              id="TimeFchangeQuick"
              className="quickIcon"
              style={fromTo === 'quick' || fromTo === 'common' ? { backgroundColor: '#26443f', cursor: 'pointer', color: '#fff' } : { cursor: 'pointer' }}
              onClick={() => changeControl('quick')}
            >
              <Icons className="arrowBetwn" icontype="common" type="calendar" />
            </div>
            <div style={{ margin: '0 5px', width: '50%' }} className={fromTo === 'from' ? 'selectInputFrom' : 'normal'}>
              <ZsInput
                placeholdertext="From"
                style={{ textAlign: 'left', cursor: 'pointer', padding: '0px 5px' }}
                id="quickIconFrom"
                maxLength="normal"
                value={fromInput ? moment(fromInput).format('Do MMMM YYYY, HH:mm:ss') === 'Invalid date' ? fromInput : moment(fromInput).format('Do MMMM YYYY, HH:mm:ss') : ''}
                onClick={() => changeControl('from')}
                readOnly
                inputtype="normal"
              />
            </div>
            <Icons type="lineArrowRight" icontype="globle" />
            <div style={{ marginLeft: '5px', width: '50%' }} className={fromTo === 'to' ? 'selectInputTo' : 'normal'}>
              <ZsInput
                placeholdertext="To"
                inputtype="normal"
                maxLength="normal"
                style={{ textAlign: 'left', cursor: 'pointer', padding: '0px 5px' }}
                id="quickIconTo"
                value={toInput ? moment(toInput).format('Do MMMM YYYY, HH:mm:ss') === 'Invalid date' ? toInput : moment(toInput).format('Do MMMM YYYY, HH:mm:ss') : ''}
                onClick={() => changeControl('to')}
                readOnly
              />
            </div>
          </div>
          {
          fromTo === 'quick' || fromTo === 'common' ? (
            <div>
              <div className="quickBlock">
                <div style={{ marginTop: '7px', color: '#fff', fontSize: '12px' }}>
                  Last
                </div>
                <div style={{ width: '38%' }}>
                  <ZsInput
                    placeholdertext="From"
                    inputtype="numeric"
                    maxLength="fifteen"
                    id="quickNumber"
                    className="quickNumber"
                    value={quickNumber}
                    onChange={(e) => {
                      if (e !== null && e > 0) {
                        setQuickNumber(e);
                      }
                    }}
                  />
                </div>
                <div style={{ marginLeft: '5px', width: '38%' }}>
                  <ZsSelect
                    value={quickTime || ''}
                    selecttype="normal"
                    id="quickTime"
                    onChange={(e) => setQuickTime(e)}
                    data={[
                      { name: 'Seconds', value: 'seconds' },
                      { name: 'Minutes', value: 'minutes' },
                      { name: 'Hours', value: 'hours' },
                      { name: 'Days', value: 'days' },
                      { name: 'Weeks', value: 'weeks' },
                      { name: 'Months', value: 'Months' },
                      { name: 'Years', value: 'years' },
                    ]}
                  />
                </div>

                <div className="quickApply">
                  <ZsButton
                    id="timeFilter_apply"
                    type="primary"
                    style={{
                      minWidth: '20px', height: '35px', lineHeight: '28px', paddingTop: '0px',
                    }}
                    title="Apply"
                    onClick={() => applyQuickTime(quickFromTo, quickNumber, quickTime)}
                  />
                </div>
              </div>
              <div className="commonBlock">
                <div className="commonBlockTitle">Quick Access</div>
                <div className="commonBlockWrap">
                  <div className="quickPanel">
                    <div id="TimeFToday" onClick={() => applyQuickTime('last', 1, 'days', 'common', 'Today')}><span>Today</span></div>
                    <div id="TimeFLastWeek" onClick={() => applyQuickTime('last', 1, 'weeks', 'common', 'Last week')}><span>Last week</span></div>
                  </div>
                  <div className="quickPanel">
                    <div id="TimeFlastMonth" onClick={() => applyQuickTime('last', 1, 'months', 'common', 'Last month')}><span>Last month</span></div>
                    <div id="TimeFLastYear" onClick={() => applyQuickTime('last', 1, 'years', 'common', 'Last year')}><span>Last year</span></div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <ZsTabs
                id="timeFilterTab"
                className="timeFilterTab"
                scrollbtn
                tabType="box"
                data-test="time_filter"
                defaultSetActiveTab={fromTo === 'from' ? activeTypeFrom : activeTypeTo}
                onTabClick={(e) => setActiveType(fromTo, e, fromDateTime, toDateTime)}
                data={[{ module: 'absolute' }, { module: 'relative' }, { module: 'now' }]}
              />
              {
                fromTo === 'from' && activeTypeFrom === 'absolute'
                && (
                  <>
                    <div className="flexDates">
                      <ZsDateTimePicker
                        timeFormat={false}
                        open
                        inputProps={{
                          id: 'flexDates_from',
                        }}
                        id="flexDates_from"
                        input={false}
                        value={fromDateTime ? moment(fromDateTime, 'YYYY-MM-DD') : ''}
                        timefilter
                        onChange={(e) => setAbsoluteDate(e)}
                      />
                      <div className="timeRangeAb">
                        {amTime.map((d, i) => (
                          <div
                            id={`TimeFabsoluteTime_${i}`}
                            key={i}
                            onClick={() => saveAbsoluteTime(d.value)}
                            className={fromTo === 'from' ? (absoluteTimefrom === d.value ? disableTime ? 'disableTime active' : 'active' : '') : (absoluteTimeto === d.value ? 'active' : '')}
                          >
                            <span>{d.time}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div style={{ marginTop: '10px' }}>
                        <ZsInput
                          placeholdertext="Enter date"
                          inputtype="normal"
                          id="absoluteDateTimeFrom"
                          maxLength="normal"
                          value={fromTo === 'from' ? `${fromDateTime.split(' @ ')[0]} ${fromDateTime.split(' @ ')[1]}` : `${toDateTime.split(' @ ')[0]} ${toDateTime.split(' @ ')[1]}`}
                          onChange={(e) => {
                            setAbsoluteDateTime(e);
                          }}
                          error={(invalidAbsoluteFrom && fromTo === 'from') || (invalidAbsoluteTo && fromTo !== 'from')}
                          errormsg="Expected format 'YYYY-MM-DD HH:mm:ss.'"
                        />
                      </div>
                    </div>
                  </>
                )
              }
              {
                fromTo === 'to' && activeTypeTo === 'absolute'
                && (
                  <>
                    <div className="flexDates">
                      <ZsDateTimePicker
                        timeFormat={false}
                        open
                        input={false}
                        inputProps={{
                          id: 'flexDates_to',
                        }}
                        id="flexDates_to"
                        value={toDateTime ? moment(toDateTime, 'YYYY-MM-DD') : ''}
                        timefilter
                        onChange={(e) => setAbsoluteDate(e)}
                      />
                      <div className="timeRangeAb">
                        {amTime.map((d, i) => (
                          <div
                            id={`TimeFabsoluteTimeActive_${i}`}
                            key={i}
                            onClick={() => saveAbsoluteTime(d.value)}
                            className={fromTo === 'from' ? (absoluteTimefrom === d.value ? 'active' : '') : (absoluteTimeto === d.value ? 'active' : '')}
                          >
                            <span>{d.time}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div style={{ marginTop: '10px' }}>
                        <ZsInput
                          placeholdertext="Enter date"
                          inputtype="normal"
                          id="absoluteDateTimeTo"
                          maxLength="normal"
                          value={fromTo === 'from' ? `${fromDateTime.split(' @ ')[0]} ${fromDateTime.split(' @ ')[1]}` : `${toDateTime.split(' @ ')[0]} ${toDateTime.split(' @ ')[1]}`}
                          onChange={(e) => {
                            setAbsoluteDateTime(e);
                          }}
                          error={(invalidAbsoluteFrom && fromTo === 'from') || (invalidAbsoluteTo && fromTo !== 'from')}
                          errormsg="Expected format 'YYYY-MM-DD HH:mm:ss.'"
                        />
                      </div>
                    </div>
                  </>
                )
              }
              {(fromTo === 'from' ? activeTypeFrom : activeTypeTo) === 'relative'
                && (
                  <>
                    <div className="flexRDates">
                      <div style={{ marginRight: '5px', width: '50%' }}>
                        <ZsInput
                          placeholdertext="From"
                          inputtype="numeric"
                          id="relativeNumber"
                          maxLength="fifteen"
                          value={relativeNumber}
                          onChange={(e) => {
                            if (e !== null && e >= 0) {
                              changeRelativeNumber(e, 'number');
                            }
                          }}
                        />
                      </div>

                      <div style={{ marginLeft: '5px', width: '50%' }}>
                        <ZsSelect
                          value={relativeTime}
                          selecttype="normal"
                          id="relativeTime"
                          onChange={(e) => changeRelativeNumber(e, 'time')}
                          data={[
                            { name: 'Seconds ago', value: 'seconds ago' },
                            { name: 'Minutes ago', value: 'minutes ago' },
                            { name: 'Hours ago', value: 'hours ago' },
                            { name: 'Days ago', value: 'days ago' },
                            { name: 'Weeks ago', value: 'weeks ago' },
                            { name: 'Months ago', value: 'months ago' },
                            { name: 'Years ago', value: 'years ago' },
                            { name: 'Seconds from now', value: 'seconds from now' },
                            { name: 'Minutes from now', value: 'minutes from now' },
                            { name: 'Hours from now', value: 'hours from now' },
                            { name: 'Days from now', value: 'days from now' },
                            { name: 'Weeks from now', value: 'weeks from now' },
                            { name: 'Months from now', value: 'months from now' },
                            { name: 'Years from now', value: 'years from now' },
                          ]}
                        />
                      </div>
                    </div>
                    <div style={{ marginTop: '55px' }}>
                      <ZsInput
                        maxLength="normal"
                        inputtype="normal"
                        id="relativeInput"
                        value={fromTo === 'from' ? relativeFrom : relativeTo}
                        readOnly
                      />
                    </div>
                  </>
                )}
              {
                (fromTo === 'from' ? activeTypeFrom : activeTypeTo) === 'now'
                && (
                  <>
                    <div className="nowDesc">
                      Setting the time to
                      {'\'now\''}
                      {' '}
                      means that on every refresh
                      this time will be set to the time of the refresh.
                    </div>
                    <ZsButton
                      id="timeFilter_apply1"
                      onClick={() => setToNow()}
                      type="primary"
                      title="Set date and time to now"
                      style={{
                        width: '100%', height: '31px', lineHeight: '25px', letterSpacing: 'normal', fontWeight: 'bold', margin: '10px 0',
                      }}
                    />
                  </>
                )
              }
            </>
          )
        }
          {fromTo === 'quick' || fromTo === 'common' ? null : (
            <div className="bottomApply">
              <ZsButton
                id="timeFilter_apply2"
                type="primary"
                title="Apply"
                disabled={invalidAbsoluteFrom || invalidAbsoluteTo || isToTimeBeforeFromTime()}
                style={{ lineHeight: '28px' }}
                onClick={saveFilterTime}
              />
            </div>
          )}
        </div>
      </div>
    </TopbarTimeFilterWrapper>
  );
});
TopbarTimeFilter.propTypes = {
  updateTimeFilter: PropTypes.func,
  setTimeFilData: PropTypes.func,
};

TopbarTimeFilter.defaultProps = {
  updateTimeFilter: null,
  setTimeFilData: null,
};
export default TopbarTimeFilter;
