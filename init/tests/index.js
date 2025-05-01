require("../main");

const test1 = require("./test_1");
const test2 = require("./test_2");
const test3 = require("./test_3");
const test4 = require("./test_4");

test1()
    .finally(test2)
    .finally(test3)
    .finally(test4);
