# RMBW

## **R**e**M**en**B**er **W**ords

打开`index.html`即可。

网页版在这：[rmbw](https://xushengfeng.github.io/rmbw)
或：[rmbw](https://rmbw.vercel.app)

## 模式

点击“list”，可选列表模式。

默认是卡片模式，一个单词的所有信息集合在一个卡片里并几乎占满整个页面，适合记忆单词。

列表模式是让单词缩小并排成列表，一次可以浏览多个单词。

单词卡左边长条是进度条，可以自己设置，有三档，表示不同程度的记忆。

右端靠左是 bing 词典按钮，提供例句等。

最右端是[拼写](#拼写)按钮。

## 添加课本新词

还学不够 🤔?添加词书!

百词斩 APP 添加计划,下载课本。
复制`android/data/com.jiongji.andriod.card/files/baicizhan/roadmap/`下的文件到本项目`js/`下。

重命名为`两位数字.词表名称`,如`08.选修一`。

在`js`目录下执行`python x.py`。

这样,单词表就更新了。

如果想要更新数据库,可以复制`android/data/com.jiongji.andriod.card/files/baicizhan/lookup.db`到本项目`js/`下替换。

## 数据保存服务

使用 WebDAV 进行数据存储

## <a name="拼写">拼写</a>

选择“拼写”选项卡，你可以看见有一个输入框和中文提示。

或者，直接点击单词卡最右边按钮。

在“list”中有选项可以选择中文提示或语音提示，还有一个次数选择器。

选择你想要拼写的次数，然后根据提示在输入框中拼写。

如果你拼写错误 ❌，那他便会好心地清除输入，让你重新来过。如果你拼写正确 ✅，恭喜你，还要连续输对几次直到你设定的次数（什么？你设的是 1？那没事了）。如果你不幸地没有连续输对，那前面的输入作废，要重新反复输入。

这样，你对这个单词的记忆就应该深刻了吧。

## 音节分词

音节分词可以帮助记忆一个单词的拼写。

请在[MERRIAM-WEBSTER 开发人员中心](https://dictionaryapi.com/)注册，注册时选择“Merriam-Webster's Collegiate® Dictionary with Audio”服务，另一个服务自由选择，以此获取一个密钥，填入“list”相应框中。
