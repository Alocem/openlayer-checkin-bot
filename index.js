require('colors');
const readlineSync = require('readline-sync');
const axios = require('axios');
const moment = require('moment');
const configuration = require('./config');
const { HttpsProxyAgent } = require('https-proxy-agent');

const apiurl = 'https://us-central1-openoracle-de73b.cloudfunctions.net';

async function displayHeader() {
    const width = process.stdout.columns;
    const lines = [
        " ============================================",
        "|          OpenLayer 签到机器人              |",
        "|         github.com/Alocem          |",
        " ============================================"
    ];

    console.log("");
    lines.forEach(line => {
        const padding = Math.max(0, Math.floor((width - line.length) / 2));
        console.log(" ".repeat(padding) + line.bold.yellow);
    });
    console.log("");
}

async function retrieveUserInfo(token) {
  const { data } = await axios({
    url: `${apiurl}/backend_apis/api/service/userInfo`,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data.data;
}

async function showUserData(token, proxyAddress) {
  try {
    const userData = await retrieveUserInfo(token);

    // 先检查 xUsername 是否存在
    const username = userData.xUsername ? userData.xUsername : '未知用户名';
    const eggInfo = userData.eggInfo && userData.eggInfo.eggInfo 
      ? `${userData.eggInfo.eggInfo.name} ${userData.eggInfo.eggInfo.type} ${userData.eggInfo.eggInfo.info}`
      : '未知蛋信息';

    // 使用三元表达式进行安全输出
    console.log(`用户名: ${username.bold.yellow} | ${eggInfo.white}`);
    console.log(`倍数: ${userData.point.multiplier.toString().bold.yellow}x | 总签到次数: ${userData.point.consecutiveCheckinCount.toString().bold.yellow} `.white);
    console.log(`积分: ${userData.point.currentPoints.toString().bold.green}`);
    if (proxyAddress) {
      console.log(`使用代理: `.white + proxyAddress.cyan);
    }
    console.log();
  } catch (error) {
    logError(error);
  }
}

async function authenticateUser(token, proxyAddress = null) {
  const requestConfig = {
    url: `${apiurl}/backend_apis/api/service/checkIn`,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {},
  };

  if (proxyAddress) {
    requestConfig.httpsAgent = new HttpsProxyAgent(proxyAddress);
  }

  const { data } = await axios(requestConfig);
  return data;
}

async function initiateCheckIn(proxyEnabled) {
  for (let i = 0; i < configuration.length; i++) {
    try {
      console.log(`========================== 账户 ${i + 1} ==========================`.bold.cyan);

      const token = configuration[i].token;
      const proxyAddress = proxyEnabled ? configuration[i].proxy : null;
      const response = await authenticateUser(token, proxyAddress);

      await showUserData(token, proxyAddress);

      if (response.msg.includes('already checked in')) {
        logCheckInStatus('签到失败: 已经签到过了。', 'red');
      } else {
        logCheckInStatus('签到成功完成。', 'green');
      }

      console.log();
    } catch (error) {
      logError(error);
      continue;
    }
  }
}

function logCheckInStatus(message, color) {
  console.log(`[${moment().format('HH:mm:ss')}] ${message}`[color]);
}

function logError(error) {
  console.log(`[${moment().format('HH:mm:ss')}] 错误: ${error.message}`.red);
}

(async () => {
  await displayHeader();

  const proxyChoice = readlineSync.question('您是否要使用代理？ (y/n): '.bold.cyan);
  const proxyEnabled = proxyChoice.toLowerCase() === 'y';

  const proxyStatus = proxyEnabled ? '使用代理'.yellow : '不使用代理'.bold.yellow;
  console.log(`开始进行初次签到 ${proxyStatus}...`.bold.yellow);
  await initiateCheckIn(proxyEnabled);

  const checkInInterval = 12 * 60 * 60 * 1000; // 12 hours
  const hoursInterval = checkInInterval / (60 * 60 * 1000);

  setInterval(() => {
    console.log(
      `\n正在处理签到，时间: ${new Date().toLocaleString()}\n`.green
    );
    initiateCheckIn(proxyEnabled);
  }, checkInInterval);

  console.log(`每 ${hoursInterval} 小时重新启动签到过程...`.green);
})();
