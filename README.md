# ERC20 Snapshot Query Using An Indexed Subgraph

The process of generating balance snapshots is relatively straightforward. It entails extracting the balance of each holder at a given block height. The majority of snapshots determine the balance over a block range that commences with the contract's deployment block and culminates at the desired block height of the snapshot. This process can be swift if the block range is small, but it can be quite time-consuming for contracts with many users, particularly those with hundreds of thousands or even millions of users spread across an extensive block range.

Employing The Graph allows users to create a subgraph that is consistently indexed, slashing the snapshot time from potentially hours to mere seconds. Subgraph Studio, a free service offered by The Graph, restricts the query to 1000 entities, which refers to the holders of the ERC20 token. Thus, one needs to iterate through these entities in batches of 1000. While this process is rate-limited, a 3-second interval between queries proves to be effective. The resulting query loop returns a JSON object that contains all the holders and their corresponding balances, written to balances.json in this example.

By leveraging GraphQL, these queries can be quite small and return only the data you need.

#Installation

```shell
npm install
```

#Usage

Create a subgrpah using Subgraph Studio using one of the sample ERC20 subgraphs, or create your own schema accordingly 

Wait for indexing - the time this takes depends on total entities and the number of blocks since the deployment of the contract

Replace the uri comment with the uri of the studio subgraph you just created

```shell
node index.mjs
```

If the JSON is all you need, that's all. You can also convert the JSON output to CSV format if needed by modifying the script, or by utilizing online tools.

If you'd like to contribute send a PR 👍
