var fs = require("fs");
var archiver = require("archiver");

fs.copyFile(
  "appspec.yml",
  "dist/bitbucket-codedeploy-application/appspec.yml",
  err => {
    if (err) throw err;
    console.log("File was copied to destination");
  }
);

fs.copyFile(
  "before-install.bat",
  "dist/bitbucket-codedeploy-application/before-install.bat",
  err => {
    if (err) throw err;
    console.log("File was copied to destination");
  }
);

// create a file to stream archive data to.
var output = fs.createWriteStream(__dirname + "/deploybundle.zip");
var archive = archiver("zip", {
  zlib: { level: 9 } // Sets the compression level.
});

// listen for all archive data to be written
output.on("close", function() {
  console.log(archive.pointer() + " total bytes");
  console.log(
    "archiver has been finalized and the output file descriptor has closed."
  );
});

// good practice to catch warnings (ie stat failures and other non-blocking errors)
archive.on("warning", function(err) {
  if (err.code === "ENOENT") {
    // log warning
  } else {
    // throw error
    throw err;
  }
});

// good practice to catch this error explicitly
archive.on("error", function(err) {
  throw err;
});

// pipe archive data to the file
archive.pipe(output);

archive.directory("dist/bitbucket-codedeploy-application/", false);

archive.finalize();
