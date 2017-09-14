# ydmap-web-portal/ydmap-ssr-portal-pages

> 此repo是ydmap-ssr-portal的模板页子模块submodule

由于Visual Studio Code团队还在讨论git submodule功能的实现计划，故此暂时不能支持在Visual Studio Code工具内直接操作git commit/pull/push等操作，但关联子项目是没有问题的。

请使用客户端工具(如[TortoiseGit](https://tortoisegit.org/))或者命令行终端进行git submodule子模块的相关操作。

## 模板开发/部署规范
1. 任何涉及接口调整的情况，先本地测试通过再同步部署到测试环境测试通过后方可同步部署到正式环境；
2. 任何涉及到已有boss配置调整会对已有接口产生数据影响的情况，先本地测试通过再同步部署到测试环境测试通过后方可同步部署到正式环境；
3. 对于新增boss配置在无接口调整的情况，可直接调整开发参数对接正式环境接口开发；
4. 对于调整旧模板无boss配置及接口调整的情况，先本地测试通过再同步部署到测试环境测试通过后方可同步部署到正式环境；
5. 所有影响页面路由及生成路径结果的文件一路使用小写及横杠(-)，理论上不使用其他符号；
