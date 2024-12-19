OpenLayer 签到机器人
说明
这个脚本用于自动化与 OpenLayer 扩展的签到交互。

特性
每日自动签到
多账户支持
代理支持
先决条件
Node.js (版本 12 或更高)
安装
将该仓库克隆到本地机器：

bash
复制代码

git clone https://github.com/Alocem/openlayer-checkin-bot.git

进入项目目录：

bash
复制代码

cd openlayer-checkin-bot

安装必要的依赖：

bash
复制代码
npm install
使用方法
首先注册 OpenLayer 扩展账户，如果没有账户，可以下载扩展并注册（连接钱包、Twitter 并完成任务）。可以在这里完成：

设置并修改 config.js 文件。以下是如何设置该文件的步骤。将您的 _open_layer_token_ 放入该文件。如何获取它：

获取您的 Token：
打开 OpenLayer 扩展并登录您的账户，扩展会显示在浏览器侧边栏。
右键点击扩展，选择检查元素（Inspect）或按 Ctrl+Shift+I 打开开发者工具。
![image](https://github.com/user-attachments/assets/19da45bc-0d3a-475d-9a2b-b37980e5bbb5)

转到 Application 标签，查找 Local Storage，然后点击 chrome-extension://bcakokeeafaehcajfkajcpbdkfnoahlh，你将看到 _open_layer_token_。
或者，你可以转到 Console 标签并粘贴下面的代码：
javascript
复制代码
localStorage.getItem('_open_layer_token_')
![image](https://github.com/user-attachments/assets/fbb8fd30-bac9-44be-8775-f3a4898db3a8)

配置代理：
如果您想使用代理，可以在配置文件中为每个 token 添加代理。

在 config.js 文件中设置您的数据：
javascript
复制代码
// config.js
module.exports = [
  { token: 'token1', proxy: 'proxy1' },
  { token: 'token2', proxy: 'proxy2' },
  // 根据需要添加更多 token-代理 配对
];
运行脚本：
运行以下命令来启动脚本：

bash
复制代码
node index.js
许可
本项目根据 MIT 许可证开源，更多细节请查看 LICENSE 文件。

注意
此脚本仅供测试用途，使用该脚本可能会违反服务条款，并可能导致您的账户被永久封禁。

我的推荐码 8WYWUM
