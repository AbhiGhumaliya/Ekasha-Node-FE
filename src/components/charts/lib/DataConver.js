/* eslint-disable no-shadow */
/* eslint-disable no-plusplus */
/* eslint-disable no-empty */
/* eslint-disable no-restricted-syntax */
export const convertData = (tmp) => {
  const ele = Array.isArray(tmp[0].value);
  if (ele === false) {
    return { tmp, single: true };
  }
  const allKeys = [];
  const parseArray = (ar) => {
    ar.forEach((e) => {
      if (e.value && e.value instanceof Array) {
        parseArray(e.value);
      } else if (allKeys.indexOf(e.key) === -1) {
        allKeys.push(e.key);
      }
    });
  };
  parseArray(tmp);
  const collectData = (clct) => {
    clct.forEach((e) => {
      if (e.value && e.value instanceof Array) {
        e.value = collectData(e.value);
      } else {
        allKeys.forEach((e) => {
          const i = clct.findIndex((t) => t.key === e);
          if (i === -1) {
            clct.push({ key: e, value: 0 });
          }
        });
      }
    });
    return clct;
  };

  collectData(tmp);
  return { finalData: tmp, allKeys, single: false };
};
const dayConverter = (data) => {
  data[1].typeOfTime = 'day';
  data[0].quarterData.forEach((element, i) => {
    if (element.keyForVal === 'minute') {
      data[0].quarterData[i].value = parseInt(element.value) / 1440;
    } else if (element.keyForVal === 'hour') {
      data[0].quarterData[i].value = parseInt(element.value) / 24;
    }
    return data;
  });
};
const hourConverter = (data) => {
  data[1].typeOfTime = 'hour';
  data[0].quarterData.forEach((element, i) => {
    if (element.keyForVal === 'minute') {
      data[0].quarterData[i].value = parseInt(element.value) / 60;
    }
    return data;
  });
};

export const convertTimeData = (data, type) => {
  if (type === 'kpi') {
    if (data[0].quarterData.length > 0) {
      const dayData = data[0].quarterData.filter((d) => d.keyForVal === 'day');
      if (dayData.length > 0) {
        dayConverter(data);
      } else {
        const hourData = data[0].quarterData.filter((d) => d.keyForVal === 'hour');
        if (hourData.length > 0) {
          hourConverter(data);
        } else {
          data[1].typeOfTime = 'minute';
          return data;
        }
      }
    }
  }
  return data;
};
export const Converter = (temp) => {
  const conData = [];
  temp.forEach((d) => {
    let ab = '{';
    d.value.forEach((el) => {
      ab += `"${[el.key]}":${el.value},}`;
      ab = ab.substring(0, ab.length - 1);
    });
    ab = `${ab.substring(0, ab.lastIndexOf(','))}}`;
    const ordered = {};
    Object.keys(JSON.parse(ab))
      .sort()
      .forEach((key) => {
        ordered[key] = JSON.parse(ab)[key];
      });
    const tx = [];
    Object.keys(ordered).forEach((key) => {
      tx.push({ name: key, value: ordered[key], key: d.key });
    });
    conData.push(tx);
  });
  return conData;
};
export const TableDataConverter = (data) => {
  const allhdkeys = [];
  data.forEach((dl) => {
    for (const key in dl) {
      if (allhdkeys.indexOf(key) === -1) {
        allhdkeys.push(key);
      }
    }
  });
  const values = []; const
    allhd = [];
  data.forEach((dl) => {
    const x = [];
    for (const [key, value] of Object.entries(dl)) {
      if (allhd.indexOf(key) === -1) {
        allhd.push(key);
      }
      x.push(value);
    }
    values.push(x);
  });
  return { allhd, values };
};
