# Mix → Explore

把 HTML 页面及相关资源放在这个文件夹，然后提交到 GitHub。
独立 Explore 页面 会自动发现 HTML/HTM 文件，读取页面标题并生成可点击链接。
支持子文件夹、中文名、空格和搜索；不需要手工修改首页。
请给每个页面设置 `<title>`，没有标题时使用文件名。
不要放入不希望公开的内容：此仓库与页面是公开的。

本地预览：在项目根目录运行：

```sh
python3 scripts/build_explore.py
python3 -m http.server 8000
```

打开 http://localhost:8000/explore.html 。本地增加或删除页面后，重新运行索引脚本并刷新。
在线 GitHub Pages 自动发现已提交文件，无需运行脚本。GitHub API 暂时不可用时会回退到 pages.json。
