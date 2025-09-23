import {readConfig, setUser} from "./config.js";

function main() {
    setUser('theworldjar');
    console.log(readConfig());
}

main();