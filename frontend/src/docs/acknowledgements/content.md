# $$$START$$$

![The requested url was not found on this server.](./res/apibanner.jpg "link")

<br>

### Explorer APIs

<br>

#####   [[1] ](https://blockchain.info/rawaddr/${address}  "1. link")
 With address we get the txs of this address and account balance.  

##### [[2]](https://stacks-node-api.mainnet.stacks.co/extended/v1/block "2.link") 
We get the latest block which are added to blockchain. 

##### [[3]](https://api.coingecko.com/api/v3/coins/${coin}/market_chart?vs_currency=${vsCurrencies}&days=1 "3.link")
We get the changes on price, market caps and total volume of 
coin(bitcoin, ethereium) based on vs_coins(use,eur)


##### [[4]](https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=${vsCurrencies}&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true "4. link")
We get the general market data of coin(bitcoin etc.) based on vs_currency(usd, our etc.)


##### [[5]](https://blockchain.info/block-height/${height}?format=json&cors=true "5. link")
We get single block detail and its transactions with the block’s height.


##### [[6]](https://blockchain.info/rawtx/${transactionHash}?format=json&cors=true "6.link")
We get single transaction detail with the transaction’s hash.


##### [[7]](https://blockchain.info/unconfirmed-transactions?format=json&cors=true "7.link")
We get latest unconfirmed transaction list. 


# $$$END$$$
