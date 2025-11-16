# DeepResearch Agent backend

## 需求表
#### 实现最简demo，即[generate research topic -> web search -> reflection]跑通流程 
mastra似乎不支持类似langgraph的 conditional edge and loop，本质上还是因为两个框架的理念不同.
langgraph是实现图，而mastra的workflow还是更期望你以更加固定的流程去进行？
目前先把web search和reflection整合到一个节点里

TODO：
- 生成的answer优化：引用具体的web search result来源
- trace