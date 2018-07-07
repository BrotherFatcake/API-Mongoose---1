//Use strict
"use strict";

//exports DATABASE_URL equals process env DATABASE_URL OR local "mongodb://databaseURL/dbName...";
exports.DATABASE_URL = process.env.DATABASE_URL || "mongodb://localhost/blog-app";

//exports TEST_DATABASE_URL equals process env TEST_DATABASE_URL  OR local "mongodb://databaseURL/test_dbName...";
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || "mongodb://localhost/blog-app";

//exports PORT equals process env PORT || <portNum>;
exports.PORT = process.env.PORT || 8080;



