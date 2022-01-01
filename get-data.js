const gdoctableapp = require('gdoctableapp');

const resource = {
    auth: "554330033247-hu3kl1npaflacoi53jpv9kfdaqnpj2lo.apps.googleusercontent.com",
    documentId: "1n7dSYgtH8LAuvOdFNJ-SeukYXWn0Gy_F",
    //showAPIResponse: true // When showAPIResponse is true, the responses from Docs API can be seen.
  };
  gdoctableapp.GetTables(resource, function(err, res) {
    if (err) {
      console.log(err);
      return;
    }
    console.log(JSON.stringify(res.tables));
  });
