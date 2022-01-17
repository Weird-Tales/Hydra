
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


# 函数事件响应API

UInt16.MaxValue => 65535

1 00 00 -> G:Ending the Game  
1 01 00 -> G:Final Activation
1 02 00 -> G:The God’s Hand Device

2 00 00 -> T:UsedOneDay
2 01 00 -> T:Doomsday

3 00 00 -> W:Activating Artifacts
3 01 00 -> W:Linking

4 00 00 -> C:Combat

5 00 XX -> S:移动演员位置: XX->inMapRegionIndex
5 01 00 -> S:Extensive search rule
5 02 AB -> S:游戏地图事件发生: A->时间类型 B->事件位置
5 03 XX -> S:清除区域搜索进度: XX->inMapRegionIndex
5 04 XX -> S:移动演员位置: 移动到野外 XX->inMapRegionIndex
5 05 00 -> S:移动演员位置: 移动到工作室
