import { BigInt } from "@graphprotocol/graph-ts"
import { Transfer } from "../generated/Bondly/Bondly"
import { Holder } from "../generated/schema"

const ZERO = BigInt.fromI32(0);
const ONE = BigInt.fromI32(1);

export function handleTransfer(event: Transfer): void {

  let to = Holder.load(event.params.to.toHexString());
  let from = Holder.load(event.params.from.toHexString());

  if(!to){
    to = new Holder(event.params.to.toHexString());
    to.createdAtTimestamp = event.block.timestamp;
    to.createdAtBlockNumber = event.block.number;
    to.address = event.params.to;
    to.amount = ZERO;
  } 
  if(!from){
    from = new Holder(event.params.from.toHexString());
    from.createdAtTimestamp = event.block.timestamp;
    from.createdAtBlockNumber = event.block.number;
    from.address = event.params.from;
    from.amount = ZERO;
  } 

  to.amount = to.amount.plus(event.params.value);
  from.amount = from.amount.minus(event.params.value);

  to.save();
  from.save();
}
