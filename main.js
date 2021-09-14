function parseTime(time, format = '{y}-{m}-{d} {h}:{i}:{s}') {
  if (arguments.length === 0) {
    return ''
  }
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const timeStr = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return timeStr
}
const today = parseTime(new Date(), '{y}-{m}-{d}')
$('#date').datepicker({
  format: 'yyyy-mm-dd',
  startDate: '2020-12-21',
  endDate: today,
  autoclose: true,
  language: 'zh-CN'
})

$('#btn').click(() => {
  var time = $('#date').val()
  if (!time) {
    return
  }
  new App(time)
  return false
})

class App {
  constructor(date) {
    $('#day').html(date)
    this.getWeiboHotSearchData(date)
    this.getZhihuHotTopicData(date)
  }

  getWeiboHotSearchData(date) {
    fetch(`./weibo-hot-search/${date}.json`)
      .then(res => res.json())
      .then(data => {
        this.render(data, 'weibo_hot_search')
      })
  }

  getZhihuHotTopicData(date) {
    fetch(`./zhihu-hot-topic/${date}.json`)
      .then(res => res.json())
      .then(data => {
        this.render(data, 'zhihu_hot_topic')
      })
  }

  render(list, domId) {
    let str = ''
    list.forEach((i, index) => {
      str += `
        <li>
          <a href="${i.url}" target="_blank">
            <div class="li_item">
              <div class="li_no">${index + 1}</div>
              <p>${i.title}</p>
            </div>
          </a>
        </li>
      `
    })
    document.getElementById(domId).innerHTML = str
  }
}
const data = new App(today)