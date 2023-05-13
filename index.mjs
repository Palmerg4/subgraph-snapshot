import apolloClient from 'apollo-client';
const { ApolloClient } = apolloClient;
import nodeFetch from 'node-fetch';
global.fetch = nodeFetch;
import apolloHttpLink from 'apollo-link-http';
const { HttpLink } = apolloHttpLink;
import apolloInMemoryCache from 'apollo-cache-inmemory';
const { InMemoryCache } = apolloInMemoryCache;
import gql from 'graphql-tag';
import { appendFileSync } from 'node:fs';

//
//  Change 'uri' to desired subgraph endpoint
//

const httpLink = new HttpLink({
  //uri: 'Replace With Your Subgraph Endpoint - Can Use Subgraph Studio Endpoint'
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
})

//
// QueryRuns needs to be higher value than total entities/1000; Query loop will stop after all entities are retrieved from a query
//
let queryRuns = 100000;
let i = 0;
let lastTimestamp = 0;
let userData;
let e = false;
let finalBalances = [];

function queryLoop() {
  setTimeout(() => {
    
    if (i < queryRuns && e == false) {

      i++;

      console.log(i * 1000 + " Entities Queried...");
      //
      // Query is consistent with all subgraphs deployed - no need to modify unless specific time travel query is needed
      //
      const tokensQuery = `
      query Holder {
        holders(
          first: 1000
          orderBy: createdAtTimestamp
          orderDirection: asc
          where: {
            createdAtTimestamp_gt: ${lastTimestamp}
          }) {
          id
          createdAtTimestamp
        }
      }
    `

      queryLoop()

      client
      .query({
        query: gql(tokensQuery)
      })
      .then((data) => userData = data.data.holders)
      .then(() => finalBalances = finalBalances.concat(userData))
      //.then(() => appendFileSync('balances.json', JSON.stringify(userData, null, 2)))
      .then(() => lastTimestamp = userData[999].createdAtTimestamp)
      .catch(() => {
          appendFileSync('balances.json', JSON.stringify(finalBalances, null, 2))
          console.log('Snapshot Completed!')
          e = true;
      })
    }
    //
    // Timing set to 3 sec intervals - Produces duplicates on rare occasion at faster intervals 
    //
  }, 3000)

}

queryLoop();
