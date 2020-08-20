import * as _ from 'lodash';

export class Tool {

  public static formatDate(date, fmt = 'YYYY-MM-DD HH:mm:ss') {
    let ret;
    const opt = {
      'Y+': date.getFullYear().toString(),        // 年
      'M+': (date.getMonth() + 1).toString(),     // 月
      'D+': date.getDate().toString(),            // 日
      'H+': date.getHours().toString(),           // 时
      'm+': date.getMinutes().toString(),         // 分
      's+': date.getSeconds().toString()          // 秒
    };
    for (const k in opt) {
      if (k) {
        ret = new RegExp('(' + k + ')').exec(fmt);
        if (ret) {
          fmt = fmt.replace(ret[1], (ret[1].length === 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, '0')));
        }
      }
    }

    return fmt;
  }

  public static setRangDateFrom(date) {
    const formatedDate = _.cloneDeep(date);
    formatedDate.setHours(0, 0, 0);
    return formatedDate;
  }

  public static setRangDateTo(date) {
    const formatedDate = _.cloneDeep(date);
    formatedDate.setHours(23, 59, 59);
    return formatedDate;
  }
}
