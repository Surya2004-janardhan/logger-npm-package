import { log } from "smartlog";

const name = "Alice";
const age = 30;
log(); // gets transformed into console.log({ name, age });
