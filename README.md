
Truffle v5.4.29 (core: 5.4.29)  
Solidity - 0.8.11 (solc-js)  
Node v16.8.0  
Web3.js v1.5.3  
  
ganache-ui 2.5.4  
  
npm 7.21.0  
  
npm list  
├── @openzeppelin/test-helpers@0.5.15  
├── chai-bignumber@3.0.0  
├── chai@4.3.4  
└── ethers@5.5.3  

# 测试种子前20个随机骰子

```js
Test.createRandomNumber(seed, 6, false, 0, 20);
[
  5, 2, 2, 1, 1, 4, 5, 2, 5, 5,
  5, 6, 3, 3, 6, 2, 6, 3, 5, 4
]
Test.createRandomNumber(seed, 6, true, 200, 212);
[
  1, 2, 3, 5, 1, 4, 2, 2, 5, 4, 1, 2
]
```

# 函数事件响应API

UInt16.MaxValue => 65535

1 00 00 -> G:游戏结束  
1 01 00 -> G:Final Activation  
1 02 00 -> G:The God’s Hand Device  
1 02 01 -> G:引擎使用3点能量
1 02 02 -> G:引擎使用全部能量
1 02 03 -> G:末日延迟1天
1 02 04 -> G:末日延迟2天
1 02 05 -> G:末日延迟达到最大值
1 03 01 -> G:生命值+1  
1 03 02 -> G:生命值-1  
1 04 AB -> G:昏迷: A->1 户外昏迷 B-> 昏迷位置 / A->2 工作室昏迷  
1 05 00 -> G:死亡  

2 00 00 -> T:消耗了一天事件  
2 01 00 -> T:Doomsday  
2 02 AB -> T:找到物品: A0,A1,A2->神器，宝物，零件 / B-> 位置  
2 03 00 -> T:找到的零件过多，被丢弃
2 04 00 -> T:完成了小区域的搜索
2 99 0B -> T:找到完美激活的神器: B-> 位置  

3 00 00 -> W:Activating Artifacts  
3 01 00 -> W:Linking  

4 00 00 -> C:Combat  
4 01 EF -> C:击中敌人:E->事件位置 F->敌人等级  
4 02 EF -> C:被击中:E->事件位置 F->敌人等级  
4 03 00 -> C:野外休息  
4 03 01 -> C:室内休息  
4 03 02 -> C:增加一点生命值  
4 03 03 -> C:生命值已达到上限  
4 03 04 -> C:良好的休息，生命值再加1  
4 03 05 -> C:良好的休息，生命值已达到上限  
4 99 99 -> C:6次双骰子未击中双方 战斗强制结束  

5 00 XX -> S:移动演员位置: XX->inMapRegionIndex  
5 01 00 -> S:Extensive search rule  
5 02 AB -> S:游戏地图事件发生: A->事件类型 B->事件位置  
5 03 0X -> S:清除区域搜索进度: X->inMapRegionIndex  
5 04 XX -> S:移动演员位置: 移动到野外 XX->inMapRegionIndex  
5 05 00 -> S:移动演员位置: 移动到工作室  
5 06 AB -> S:写入探索结果: A->区域坐标1 b->区域坐标2  
