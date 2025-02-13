系统架构分为三层

core -> common、plugins -> project

代码架构分层注意事项：

1. core 层的代码供 common 和 plugins 层使用，common 和 plugins 层代码提供给 project 层使用
2. core 层代码可以通过 common 层中转给 project 层使用，请勿在 project 层引入 core 包
3. 未在 common 层使用的代码请不要放置于 core 层，更不要通过 common 层中转至 project 层
