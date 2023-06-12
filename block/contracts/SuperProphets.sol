// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

//import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

interface AggregatorV3Interface {
  function decimals() external view returns (uint8);

  function description() external view returns (string memory);

  function version() external view returns (uint256);

  function getRoundData(
    uint80 _roundId
  ) external view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound);

  function latestRoundData()
    external
    view
    returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound);
}


contract SuperProphets {

    event StepEvent(bool up);

// Record
    struct Rec { 
        uint step;
        int price;
        bool up;
        uint timestamp;
    }

// Prediction
    struct Pred { 
    //    uint stepBefore;
        uint stepAfter;
        int priceBefore;
        int priceAfter;
        bool up;
        uint timestamp;
        address trader;
        bool done;
        bool exact;
    }

     struct Trader { 
        address ad;
        string name;
        string bio;
    }

    AggregatorV3Interface internal dataFeed;

    //uint public timeStart;
   // uint public stepTime = 4 minutes;

    Rec[] public recs;
    Pred[] public preds;
    Trader[] public traders;

    uint public recsNum = 0;
    uint public predsNum = 0;
    uint public tradersNum = 0;

    constructor() {
        dataFeed = AggregatorV3Interface(
            0xeE5F16F7eD4c74721Fc45ddF2c7d231336A78Aa1
        );
    }

// internal private ?
    function getLatestData() public view returns (int) {
        (
            /* uint80 roundID */,
            int answer,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = dataFeed.latestRoundData();
        return answer;
    }

// internal ? 
     function makeRec() public {
        int price = getLatestData();
        int lastPrice = 0;
        if (recs.length != 0){
            lastPrice = recs[recs.length-1].price;
        }
        bool up;
        if (price > lastPrice) {
            up = true; 
        } else {
            up = false;
        }
        recs.push(Rec(recs.length, price, up, block.timestamp));
        recsNum++;
    }

    // internal 
    function checkPred() public {
        int newPrice = getLatestData();
 
        Rec memory r = recs[recs.length-1];

        for (uint i=0; i<preds.length; i++){
            Pred memory p = preds[i];
            if (p.stepAfter != r.step) continue;
            // or check with timestamp
            p.priceAfter = newPrice;
           // if (p.up == r.up) p.exact = true;
            // only if one step up 
       
            if (p.up) { 
                if (r.price > p.priceBefore){
                    p.exact = true;
                }else {
                    p.exact = false;
                }
            }
            if (!p.up) {
                if (r.price < p.priceBefore){
                    p.exact = true;
                }else {
                    p.exact = false;
                }
            }
        
            p.done = true;
            preds[i] = p;
            // move to other array but looping desc ? 
        }
    }

    function makeStep() public {
        // require msg.sender is Upkeep address
        makeRec();
        checkPred();
    }

    function makePred(uint _stepAfter, bool _up) public {
        bool ok = true;
        for (uint i=0; i<predsNum; i++){
            if (preds[i].trader == msg.sender && !preds[i].done) ok = false;
        }
        require(ok, "Prediction pending for this user");

        require(_stepAfter > recs.length+1, "Need more steps");
        
        int priceBefore = getLatestData(); 
        //uint stepAfter = recs.length+1;
        preds.push(Pred(_stepAfter, priceBefore, 0, _up, block.timestamp, msg.sender, false, false));
        predsNum++;
    }

    function createProfile(string memory _name, string memory _bio) public {
       bool exist = false;
        for (uint i=0; i<traders.length; i++){
            if (traders[i].ad == msg.sender){
                exist = true;
                traders[i] = Trader(msg.sender, _name, _bio);
            }
        }
        if (!exist){
            traders.push(Trader(msg.sender, _name, _bio));
            tradersNum++;
        }

    }

}