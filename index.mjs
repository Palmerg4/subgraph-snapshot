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
  uri: 'https://api.studio.thegraph.com/query/34276/bondly/v0.1' // BONDLY
  //uri: 'https://api.studio.thegraph.com/query/34276/crust/v0.1' // CRUST
  //uri: 'https://api.studio.thegraph.com/query/34276/darwinia/v0.1' // DARWINIA
  //uri: 'https://api.studio.thegraph.com/query/34276/kylin/v0.1' // KYLIN
  //uri: 'https://api.studio.thegraph.com/query/34276/bounce/v0.1' // BOUNCE
  //uri: 'https://api.studio.thegraph.com/query/34276/mantradao/v0.1' // MantraDAO
  //uri: 'https://api.studio.thegraph.com/query/34276/phala/v0.1' // PHALA
  //uri: 'https://api.studio.thegraph.com/query/34276/ankr/v0.1' // ANKR
  //uri: 'https://api.studio.thegraph.com/query/34276/usdc/v0.1' // USDC
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
      .then(() => appendFileSync('balances.json', JSON.stringify(userData, null, 2)))
      .then(() => lastTimestamp = userData[999].createdAtTimestamp)
      .catch(() => {
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

